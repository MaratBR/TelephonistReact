import api from "api";
import { WS_URL } from "api/client";
import {
  AppUpdateMessage, ConnectionInfo, Event, SequenceMetaMessage, UserHubIncomingMessages, UserHubOutgoingMessages,
} from "api/definition";
import { WSClient } from "api/ws";
import { Observable, Subject } from "rxjs";

export default class UserHubWS extends WSClient<UserHubIncomingMessages, UserHubOutgoingMessages> {
  private _eventsSubject: Subject<Event> = new Subject();

  constructor() {
    super({
      path: `${WS_URL}user/ws`,
      wsTicketFactory: () => api.issueWSTicket(),
    });
    this.on('new_event', this._onEvent.bind(this));
    this.on('app', this._onApp.bind(this));
    this.on('sequence_meta', this._onSequenceMeta.bind(this));
    this.on('task', this._onTask.bind(this));
    this.on('connection', this._onConnection.bind(this));
  }

  events(): Observable<Event> {
    return this._eventsSubject;
  }

  subscribeToApplicationEvents(...app_ids: string[]) {
    this.send({ msg_type: 'sub_to_app_events', data: app_ids });
  }

  unsubscribeFromApplicationEvents(...app_ids: string[]) {
    this.send({ msg_type: 'unsub_from_app_events', data: app_ids });
  }

  private _onEvent(event: Event) {
    logging.debug('new_event: ', event);
    this._eventsSubject.next(event);
  }

  private _onTask(task: Task) {

  }

  private _onApp(app: AppUpdateMessage) {

  }

  private _onSequenceMeta(message: SequenceMetaMessage) {

  }

  private _onConnection(connection: ConnectionInfo) {

  }
}
