import IApiStatusService from 'api/IApiStatusService';
import { WS_URL } from 'api/client';
import {
  AppUpdateMessage,
  ConnectionInfo,
  Event,
  SequenceMetaMessage,
  Task,
  UserHubIncomingMessages,
  UserHubOutgoingMessages,
  WSTicketResponse,
} from 'api/definition';
import { WSClient } from 'api/ws';
import { AxiosInstance } from 'axios';

type EventListener = (event: Event) => void;

export default class UserHubWS extends WSClient<UserHubIncomingMessages, UserHubOutgoingMessages> {
  private readonly _client: AxiosInstance;

  private readonly _statusService: IApiStatusService;

  private readonly _applicationEventSubcriptions: Record<string, EventListener[]> = {};

  constructor(client: AxiosInstance, statusService: IApiStatusService) {
    super({
      path: `${WS_URL}user-api/ws`,
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

  addAppEventsListener(appID: string, listener: EventListener) {
    const listeners = this._applicationEventSubcriptions[appID];
    if (listeners) {
      if (!listeners.includes(listener)) listeners.push(listener);
    } else {
      this._applicationEventSubcriptions[appID] = [listener];
      this.subscribeToApplicationEvents(appID);
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
        this.unsubscribeFromApplicationEvents(appID);
      }
    }
  }

  subscribeToApplicationEvents(...appIDs: string[]) {
    this.send({ msg_type: 'sub_to_app_events', data: appIDs }, true);
  }

  unsubscribeFromApplicationEvents(...appIDs: string[]) {
    this.send({ msg_type: 'unsub_from_app_events', data: appIDs });
  }

  protected _onOpen(): void {
    super._onOpen();
    for (const appID of Object.keys(this._applicationEventSubcriptions))
      this.subscribeToApplicationEvents(appID);
  }

  private _onEvent(event: Event) {
    logging.debug('new_event: ', event);
    const listeners = this._applicationEventSubcriptions[event.app_id];
    if (listeners) for (const listener of listeners) listener(event);
  }

  private _onTask(task: Task) {}

  private _onApp(app: AppUpdateMessage) {}

  private _onSequenceMeta(message: SequenceMetaMessage) {}

  private _onConnection(connection: ConnectionInfo) {}
}
