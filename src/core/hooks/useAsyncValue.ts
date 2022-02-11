import { useEffect, useState } from "react";

export interface AsyncValue<T> {
  isLoading: boolean;
  error: any;
  value: T | undefined;
  refresh(): void;
}

export default function useAsyncValue<T>(
  getter: () => Promise<T>,
  deps?: any[],
  prefetch: boolean = true,
): AsyncValue<T> {
  const [state, setState] = useState({
    value: undefined as T | undefined,
    isLoading: prefetch,
    error: undefined,
  });
  const retry = () => {
    setState({ ...state, isLoading: true });
    getter()
      .then((value) => setState({ isLoading: false, error: undefined, value }))
      .catch((error) => setState({ isLoading: false, error, value: state.value }));
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
    ...state,
    refresh: retry,
  };
}
