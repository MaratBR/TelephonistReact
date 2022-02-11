import { ws } from "api";
import { SubscriptionLike } from "rxjs";
import UserHubWS, { AnyEntryKey } from "./UserHubWS";

export type EntryUpdateListener<K extends AnyEntryKey> = (
  entry: ws.EntryUpdateDataTemplate<ws.EntryUpdateDataRegistry[K], K>
) => any;

export default class EntrySubscription<K extends keyof ws.EntryUpdateDataRegistry>
implements SubscriptionLike {
  private readonly _hub: UserHubWS;

  private readonly _listener: EntryUpdateListener<K>;

  private readonly _entryName: K;

  private readonly _entryID: string;

  constructor(
    hub: UserHubWS,
    entryName: K,
    id: string,
    listener: EntryUpdateListener<K>,
  ) {
    this._hub = hub;
    this._listener = listener;
    this._entryName = entryName;
    this._entryID = id;
  }

  closed: boolean = false;

  unsubscribe(): void {
    this.closed = true;
    this._hub.offEntry(this._entryName, this._entryID, this._listener);
  }
}
