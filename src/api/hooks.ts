import { list } from "@chakra-ui/react";
import { useLocalObservable } from "mobx-react";
import { useEffect, useState } from "react";
import state from "~src/state";
import api, { models, ws } from ".";
import wsClient, { EntryCallbackFunction } from "./ws";

export function useEntryUpdateSubscription<
  K extends keyof ws.EntryUpdateDataRegistry
>(entry: K, id: string, listener: EntryCallbackFunction<K>) {
  useEffect(
    () => state.ws.client.subscribeToEntry(entry, id, listener).unusubscribe,
    []
  );
}

type MaybePromise<T> = T | Promise<T>;

export type LiveValue<T> = {
  value: T | undefined;
  error: any;
  loading: boolean;
};

export function useLiveUpdateEntry<T, TUpdate>(
  initialGetter: () => Promise<T>,
  effect: (
    setValue: (value: T) => void,
    getValue: () => T
  ) => (() => void) | void
) {
  const liveValue = useLocalObservable<LiveValue<T>>(() => ({
    value: undefined,
    error: undefined,
    loading: true,
  }));
  useEffect(() => {
    let unsubscribeFunction = undefined;

    initialGetter()
      .then((value) => {
        liveValue.value = value;
        unsubscribeFunction = effect(
          (value) => (liveValue.value = value),
          () => liveValue.value
        );
      })
      .catch((error) => (liveValue.error = error))
      .finally(() => (liveValue.loading = false));

    return () => {
      if (unsubscribeFunction) unsubscribeFunction();
    };
  }, []);
}

export function useLiveApplication(id: string) {
  const live = useLocalObservable<LiveValue<models.ApplicationResponse>>(
    () => ({ value: undefined, error: undefined, loading: true })
  );

  const refetch = async () => {
    live.value = await api.getAppliction(id);
  };

  useEffect(() => {
    let unsubscribeFunction = undefined;

    refetch()
      .then(() => {
        unsubscribeFunction = state.ws.client.subscribeToEntry(
          "app",
          id,
          (update) => {
            live.value.app = {
              ...live.value.app,
              ...update.entry,
            };
          }
        ).unusubscribe;
      })
      .catch((error) => (live.error = error))
      .finally(() => (live.loading = false));

    return () => {
      if (unsubscribeFunction) unsubscribeFunction();
    };
  }, []);

  return [live, refetch];
}

export function useEventsSubscription(
  descriptor: ws.SubscribeEventsData,
  listener: (newEvent: models.Event) => void
) {
  useEffect(() => {
    state.ws.client.subscribeToEvents(descriptor, listener);
    return () => state.ws.client.unsubscribeFromEvents();
  }, []);
}

export function useLiveEvents(
  descriptor: ws.SubscribeEventsData,
  maxCount: number
): [LiveValue<models.Event[]>, () => void] {
  const live = useLocalObservable<LiveValue<models.Event[]>>(() => ({
    value: [],
    error: undefined,
    loading: true,
  }));
  const refetch = () => api.getEvents(descriptor).then(events => live.value = events.result)

  useEffect(() => {
    let unsubscribeFunction = undefined

    live.loading = true
    refetch()
      .then(events => {
        unsubscribeFunction = () => state.ws.client.unsubscribeFromEvents()
        state.ws.client.subscribeToEvents(descriptor, event => {
          live.value = [
            event,
            ...live.value
          ]
        })
      })
      .catch(error => live.error = error)
      .finally(() => live.loading = false)
    
    return () => {
      if (unsubscribeFunction) unsubscribeFunction()
    }
  }, []);

  return [live, refetch];
}
