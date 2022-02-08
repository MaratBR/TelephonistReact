import {
  action,
  computed,
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { useLocalObservable } from "mobx-react";
import { useEffect, useState } from "react";
import { filter, Subscription } from "rxjs";
import state from "@/state";
import api, { models, UserHubWS, ws } from ".";
import { EntryUpdateListener } from "./userHub";

export function useGlobalState() {
  return state;
}

export function useHub() {
  return useGlobalState().ws.client;
}

export interface LiveValue<T> {
  value: T | undefined;
  error: any;
  loading: boolean;
}

class LiveValueImpl<T> implements LiveValue<T> {
  value: T | undefined = undefined;
  error: any = undefined;
  loading: boolean;

  constructor(loading: boolean = false, defaultValue: T = undefined) {
    this.loading = loading;
    this.value = defaultValue;
    makeObservable(this, {
      value: observable,
      error: observable,
      loading: observable,
    });
  }
}

export function useLiveApplication(
  id: string
): [LiveValue<models.ApplicationResponse>, () => void] {
  const live = useLocalObservable(
    () => new LiveValueImpl<models.ApplicationResponse>(true)
  );
  const { ws } = useGlobalState();

  const refetch = async () => {
    runInAction(() => (live.loading = true));
    try {
      const app = await api.getAppliction(id);
      runInAction(() => {
        live.value = app;
        live.error = undefined;
      });
    } catch (e) {
      runInAction(() => (live.error = e));
    } finally {
      runInAction(() => (live.loading = false));
    }
  };

  useEffect(() => {
    let unsubscribeFunction = undefined;

    refetch().then(() => {
      const sub = ws.client.addEntryListener("application", id, (update) => {
        live.value.app = {
          ...live.value.app,
          ...update.entry,
        };
      });
      unsubscribeFunction = () => sub.unsubscribe();
    });

    return () => {
      if (unsubscribeFunction) unsubscribeFunction();
    };
  }, []);

  return [live, refetch];
}

interface LiveSubscriptionClass<T, TArgs extends any[] = []> {
  new (...args: TArgs): LiveSubscription<T>;
}

export interface LiveSubscription<TItem> extends LiveValueImpl<TItem[]> {
  isSubscribed: boolean;
  stop(): void;
  start(): void;
}

abstract class LiveSubscriptionBase<TItem>
  extends LiveValueImpl<TItem[]>
  implements LiveSubscription<TItem>
{
  isSubscribed: boolean = false;

  constructor() {
    super();
    makeObservable(this, {
      isSubscribed: observable,
    });
  }

  stop(): void {
    this.isSubscribed = false;
    try {
      const value = this._stop();
      if (value instanceof Promise) {
        value.catch((e) => {
          runInAction(() => {
            this.error = e;
          });
        });
      }
    } catch (e) {
      this.error = e;
    }
  }

  start(): void {
    try {
      const value = this._start();
      if (value instanceof Promise) {
        this.loading = true;
        value
          .then(() => (this.isSubscribed = true))
          .catch((err) => (this.error = err))
          .finally(() => (this.loading = false));
      }
    } catch (e) {
      this.error = e;
    }
  }

  protected abstract _stop(): void | Promise<void>;
  protected abstract _start(): void | Promise<void>;
}

class ApplicationEventsSubscription extends LiveSubscriptionBase<models.Event> {
  private readonly _hub: UserHubWS;
  private _subscription?: Subscription;
  private readonly _maxLength: number;
  private readonly _id: string;

  constructor(client: UserHubWS, appID: string, limit: number = 100) {
    super();
    this._hub = client;
    this._id = appID;
    this._onEvent = this._onEvent.bind(this);
    this._maxLength = limit;
  }

  protected async _start(): Promise<void> {
    this._hub.subscribeToApplicationEvents(this._id);
    this._subscription = this._hub
      .events()
      .pipe(filter((e) => e.app_id == this._id))
      .subscribe(this._onEvent);
    const events = await api.getEvents({ app_id: this._id });
    this.value = events.result;
  }

  protected _stop(): void {
    this._hub.unsubscribeFromApplicationEvents(this._id);
    this._subscription.unsubscribe();
    delete this._subscription;
  }

  private _onEvent(event: models.Event) {
    this.value.unshift(event);
    if (this.value.length > this._maxLength) {
      this.value.splice(this.value.length - 1, 1);
    }
  }
}

export function useSeriestSubscription<T, TArgs extends any[] = []>(
  SubscriptionClass: LiveSubscriptionClass<T, TArgs>,
  ...args: TArgs
) {
  const subscription = useLocalObservable(() => new SubscriptionClass(...args));

  useEffect(() => {
    subscription.start();

    return () => subscription.stop();
  }, []);

  return subscription;
}

export function useApplicationEvents(appID: string, limit?: number) {
  const hub = useHub();
  return useSeriestSubscription(ApplicationEventsSubscription, hub, appID);
}

export function useEntrySubscription<
  K extends keyof ws.EntryUpdateDataRegistry
>(entryType: K, id: string, onEntry: EntryUpdateListener<K>) {
  const hub = useHub();

  useEffect(() => {
    hub.subscribeToEntry(entryType, id);
    hub.addEntryListener(entryType, id, onEntry);
    return () => {
      hub.unsubscribeFromEntry(entryType, id);
      hub.offEntry(entryType, id, onEntry);
    };
  }, [state.ws]);
}

export function useApplicationConnections(appID: string) {}
