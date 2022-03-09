import IApiStatusService from 'api/IApiStatusService';
import { WS_URL } from 'api/client';
import {
  AppUpdateMessage,
  CG,
  ConnectionInfo,
  LogsMessage,
  SequenceMetaMessage,
  Task,
  Event as TelephonistEvent,
  UserHubIncomingMessages,
  UserHubOutgoingMessages,
  WSTicketResponse,
} from 'api/definition';
import { WSClient } from 'api/ws';
import { AxiosInstance } from 'axios';
import { VoidCallback } from 'core/utils/types';

type EventListener = (event: TelephonistEvent) => void;
type LogListener = (log: LogsMessage) => void;

export default class UserHubWS extends WSClient<UserHubIncomingMessages, UserHubOutgoingMessages> {
  private readonly _client: AxiosInstance;

  private readonly _statusService: IApiStatusService;

  private readonly _subscribtions: Record<string, number> = {};

  private readonly _applicationEventSubcriptions: Record<string, EventListener[]> = {};

  private readonly _logListeners: Record<string, LogListener[]> = {};

  constructor(client: AxiosInstance, statusService: IApiStatusService) {
    super({
      path: `${WS_URL}_ws/user-api/main`,
      wsTicketFactory: () => this.issueWSTicket(),
    });
    this._client = client;
    this._statusService = statusService;
    this.addMessageListener('new_event', this._onEvent.bind(this));
    this.addMessageListener('app', this._onApp.bind(this));
    this.addMessageListener('sequence_meta', this._onSequenceMeta.bind(this));
    this.addMessageListener('task', this._onTask.bind(this));
    this.addMessageListener('connection', this._onConnection.bind(this));
  }

  private issueWSTicket(): Promise<string> {
    return this._statusService
      .apiCall(this._client.get<WSTicketResponse>('user-api/ws/issue-ws-ticket'))
      .then((data) => data.ticket);
  }

  private bookTopic(...topics: string[]): VoidCallback {
    for (const t of topics) {
      if (typeof this._subscribtions[t] === 'number') {
        this._subscribtions[t] += 1;
      } else {
        this._subscribtions[t] = 1;
        this.subscribeToTopic(t);
      }
    }

    return this.cancelTopic.bind(this, ...topics);
  }

  private cancelTopic(...topics: string[]) {
    for (const t of topics) {
      if (typeof this._subscribtions[t] === 'number') {
        if (this._subscribtions[t] === 1) {
          delete this._subscribtions[t];
          this.unsubscibeFromTopic(t);
        } else {
          this._subscribtions[t] -= 1;
        }
      }
    }
  }

  private subscribeToTopic(topic: string | string[]) {
    this.send({ msg_type: 'sub', data: topic });
  }

  private unsubscibeFromTopic(topic: string | string[]) {
    this.send({ msg_type: 'sub', data: topic });
  }

  addAppEventsListener(appID: string, listener: EventListener) {
    const listeners = this._applicationEventSubcriptions[appID];
    if (listeners) {
      if (!listeners.includes(listener)) listeners.push(listener);
    } else {
      this._applicationEventSubcriptions[appID] = [listener];
      this.subscribeToTopic(CG.appEvents(appID));
    }
  }

  removeAppEventsListener(appID: string, listener: EventListener) {
    const listeners = this._applicationEventSubcriptions[appID];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index === -1) return;
      listeners.splice(index, 1);
      if (listeners.length === 0) {
        delete this._applicationEventSubcriptions[appID];
        this.unsubscibeFromTopic(CG.appEvents(appID));
      }
    }
  }

  private addLogsListener(topic: string, listener: LogListener) {
    const listeners = this._logListeners[topic];
    if (listeners) {
      listeners.push(listener);
    } else {
      this._logListeners[topic] = [listener];
      this.subscribeToTopic(topic);
    }
  }

  private removeLogsListener(topic: string, listener: LogListener) {
    const listeners = this._logListeners[topic];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          delete this._logListeners[topic];
          this.unsubscibeFromTopic(topic);
        }
      }
    }
  }

  removeSequenceEventsListener(sequenceID: string, listener: LogListener) {
    const key = `sequenceLogs/${sequenceID}`;
    const listeners = this._logListeners[key];
    if (listeners) {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
        if (listeners.length === 0) {
          delete this._logListeners[key];
          this.unsubscibeFromTopic(key);
        }
      }
    }
  }

  protected _onOpen(event: Event): void {
    super._onOpen(event);
    for (const appID of Object.keys(this._subscribtions)) this.subscribeToTopic(appID);
  }

  private _onEvent(event: TelephonistEvent) {
    logging.debug('new_event: ', event);
    const listeners = this._applicationEventSubcriptions[event.app_id];
    if (listeners) for (const listener of listeners) listener(event);
  }

  private _onTask(task: Task) {}

  private _onApp(app: AppUpdateMessage) {}

  private _onSequenceMeta(message: SequenceMetaMessage) {}

  private _onConnection(connection: ConnectionInfo) {}
}
