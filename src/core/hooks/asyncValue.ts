import { asPromise } from "core/utils/async";
import { useCallback, useEffect, useState } from "react";

export interface AsyncValue<T> {
  isLoading: boolean;
  error: any;
  value: T | undefined;
}

export interface MutableAsyncValue<T> extends AsyncValue<T> {
  setValue(value: T | ((oldValue: T) => T)): void;
}

export interface RefreshableAsyncValue<T> extends MutableAsyncValue<T> {
  refresh(): void;
}

export function useRefreshableAsyncValue<T>(
  getter: () => Promise<T>,
  deps?: any[],
  prefetch: boolean = true,
): RefreshableAsyncValue<T> {
  const [error, setError] = useState<any>();
  const [value, setValue] = useState<T>(undefined);
  const [isLoading, setLoading] = useState(prefetch);
  const retry = () => {
    setLoading(true);
    getter()
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (prefetch) {
      retry();
    }
  }, []);

  if (deps && deps.length > 0) {
    useEffect(retry, deps);
  }

  return {
    isLoading,
    value,
    error,
    refresh: retry,
    setValue,
  };
}

export interface SwappableAsyncValue<T> extends MutableAsyncValue<T> {
  swap(newPromise: Promise<T>): void;
}

export function useSwappableAsyncValue<T>(
  defaultValue?: T,
  defaultPromise?: Promise<T> | (() => Promise<T>),
  startLoading?: boolean,
) {
  const [isLoading, setLoading] = useState(!!defaultPromise || !!startLoading);
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState();
  const swap = useCallback((promise: Promise<T>) => {
    setLoading(true);
    promise
      .then(setValue)
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  return {
    value,
    setValue,
    error,
    isLoading,
    swap,
  };
}
