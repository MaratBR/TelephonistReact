import { asPromise } from "core/utils/async";
import {
  makeObservable, observable, runInAction,
} from "mobx";
import { useLocalObservable } from "mobx-react";
import { useEffect } from "react";

export interface LiveValue<T> {
  value: T | undefined;
  error: any;
  loading: boolean;
  refresh(): void;
}

class LiveValueImpl<T> implements LiveValue<T> {
  value: T | undefined = undefined;

  error: any = undefined;

  loading: boolean;

  private readonly _getter: () => Promise<T>;

  constructor(getter: () => Promise<T>, loading: boolean = false, defaultValue: T = undefined) {
    this.loading = loading;
    this.value = defaultValue;
    this._getter = getter;
    makeObservable(this, {
      value: observable,
      error: observable,
      loading: observable,
    });
    this.update = this.update.bind(this);
    this.refresh = this.refresh.bind(this);
  }

  update(live: Partial<LiveValue<T>>) {
    if ("error" in live) this.error = live.error;
    if ("loading" in live) this.loading = live.loading;
    if ("value" in live) this.value = live.value;
  }

  refresh(): Promise<void> {
    return this._getter()
      .then((value) => this.update({ loading: false, value, error: undefined }))
      .catch((error) => this.update({ loading: false, error }));
  }
}

type NonCallable = object | null | string | number | symbol;

interface LiveValueContext<T extends NonCallable> {
  set(value: T | Function & ((oldValue: T) => T)): void;
}

type LiveRefreshFunction = () => void;

export default function useLiveValue<T extends NonCallable>(
  defaultValue: T,
  refreshValue: () => Promise<T>,
  effect: (context: LiveValueContext<T>) => () => void,
): LiveValue<T> {
  const live = useLocalObservable(
    () => new LiveValueImpl<T>(refreshValue, true),
  );

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    live.refresh().then(() => {
      unsubscribe = effect({
        set(value) {
          const newValue = typeof value === "function" ? value(live.value) : value;
          runInAction(() => {
            live.value = newValue;
          });
        },
      });
    });
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return live;
}
