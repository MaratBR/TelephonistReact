import api, { models, ws } from "api";
import { WS_URL } from "api/client";
import { WSClient } from "api/ws";
import { Observable, Subject, SubscriptionLike } from "rxjs";
import EntrySubscription, { EntryUpdateListener } from "./EntrySubscription";

function entryDescToString(d: ws.SubscribeEntryData) {
  return `${d.entry_type}/${d.id}`;
}

export type AnyEntryKey = keyof ws.EntryUpdateDataRegistry;

interface SyncEvent {
  entries: ws.SubscribeEntryData[];
  application_events: string[];
}

type UserHubSpecificInEvents = {
  sync: SyncEvent;
};
type InEvents = ws.MRNewEvents & ws.MREntryUpdates & UserHubSpecificInEvents;
type OutEvents = ws.MRUserHub;

export default class UserHubWS extends WSClient<InEvents, OutEvents> {
  // we use any here to make it relieve typings a bit
  private _entryListeners: {
    [key: string]: EntryUpdateListener<any>[];
  } = {};

  private _eventsSubject: Subject<models.Event> = new Subject();

  private _entries: string[] = [];

  constructor() {
    super({
      path: `${WS_URL}user/ws`,
      wsTicketFactory: () => api.issueWSTicket(),
    });
    this._onEntry = this._onEntry.bind(this);
    this._onEntryBundle = this._onEntryBundle.bind(this);
    this._onEvent = this._onEvent.bind(this);
    this._onSync = this._onSync.bind(this);

    this.on('entry_update', this._onEntry);
    this.on('entry_updates', this._onEntryBundle);
    this.on('new_event', this._onEvent);
    this.on('sync', this._onSync);
  }

  events(): Observable<models.Event> {
    return this._eventsSubject;
  }

  addEntryListener<K extends keyof ws.EntryUpdateDataRegistry>(
    entryName: K,
    id: string,
    listener: EntryUpdateListener<K>,
  ): SubscriptionLike {
    const key = `${entryName}/${id}`;
    if (this._entryListeners[key]) {
      if (this._entryListeners[key].indexOf(listener) === -1) {
        this._entryListeners[key].push(listener);
      }
    } else {
      this._entryListeners[key] = [listener];
    }
    return new EntrySubscription(this, entryName, id, listener);
  }

  offEntry<K extends keyof ws.EntryUpdateDataRegistry>(
    entryName: K,
    id: string,
    listener: EntryUpdateListener<K>,
  ) {
    const key = `${entryName}/${id}`;
    if (this._entryListeners[key]) {
      const index = this._entryListeners[key].indexOf(listener);
      if (index !== -1) {
        this._entryListeners[key].splice(index);
      }
    }
  }

  subscribeToApplicationEvents(...app_ids: string[]) {
    this.send({ msg_type: 'sub_to_app_events', data: app_ids });
  }

  unsubscribeFromApplicationEvents(...app_ids: string[]) {
    this.send({ msg_type: 'unsub_from_app_events', data: app_ids });
  }

  subscribeToEntry(entryType: string, entryID: string) {
    const data: ws.SubscribeEntryData = {
      entry_type: entryType,
      id: entryID,
    };
    this.send({ msg_type: 'subscribe_entry', data });
    if (!this._entries.includes(entryDescToString(data))) {
      this._entries.push(entryDescToString(data));
    }
  }

  unsubscribeFromEntry(entryType: string, entryID: string) {
    const data: ws.SubscribeEntryData = {
      entry_type: entryType,
      id: entryID,
    };
    this.send({ msg_type: 'unsubscribe_entry', data });
    const index = this._entries.indexOf(entryDescToString(data));
    if (index !== -1) this._entries.splice(index, 1);
  }

  private _onSync(event: SyncEvent) {
    logging.debug('UserHub sync');
    this._entries = event.entries.map(entryDescToString);
  }

  private _onEvent(event: models.Event) {
    logging.debug('new_event: ', event);
    this._eventsSubject.next(event);
  }

  private _onEntry<K extends AnyEntryKey>(
    data: ws.EntryUpdateDataTemplate<ws.EntryUpdateDataRegistry[K], K>,
  ) {
    const listeners = this._entryListeners[data.entry_type];
    if (listeners) {
      for (const l of listeners) l(data);
    }
  }

  private _onEntryBundle({ updates }: InEvents['entry_updates']) {
    for (const upd of updates) this._onEntry(upd);
  }
}