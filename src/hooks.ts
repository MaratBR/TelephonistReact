import { useEffect, useRef, useState } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export interface StateWithError<T, TError = any> {
  readonly error: TError | undefined;
  readonly isError: boolean;
  readonly value: T;
  setValue(value: T): void;
  setError(value: TError): void;
}

export interface Validated {
  validate(): boolean;
  readonly isError: boolean;
}

export interface StateWithValidation<T, TError = any>
  extends StateWithError<T, TError>,
    Validated {}

export function useStateWithError<T, TError = any>(
  defaultValue: T
): StateWithError<T, TError> {
  const [state, set] = useState<{ value: T; error: TError | undefined }>({
    value: defaultValue,
    error: undefined,
  });

  return {
    ...state,
    setError: (error) => set((v) => ({ ...v, error })),
    setValue: (value) => set((v) => ({ ...v, value })),
    isError: !!state.error,
  };
}

export function useStateWithValidation<T>(
  defaultValue: T,
  validation: (value: T) => void
): StateWithValidation<T, any> {
  const state = {
    ...useStateWithError<T, any>(defaultValue),
    validate: () => {
      try {
        validation(state.value);
        if (state.isError) state.setError(undefined);
        return true;
      } catch (e) {
        state.setError(e);
        return false;
      }
    },
  };
  const ref = useRef(false);

  useEffect(() => {
    if (ref.current == false) {
      ref.current = true;
      return;
    }
    state.validate();
  }, [state.value]);

  return state;
}

export function useRequiredStringState(
  defaultValue?: string,
  errorMessage?: string
): StateWithValidation<string> {
  return useStateWithValidation(defaultValue ?? "", (v) => {
    if (!v) throw new Error(errorMessage ?? "Value is required");
  });
}

export function validateAnd(
  validateables: Validated[],
  onValidAction: () => any,
  onInvalidAction?: () => any
) {
  return () => {
    let valid = true;
    for (let v of validateables) {
      if (!v.validate()) {
        valid = false;
      }
    }

    if (valid) {
      onValidAction();
    } else if (onInvalidAction) {
      onInvalidAction();
    }
  };
}

export interface Loading {
  isLoading: boolean;
  submit<T>(promise: Promise<T>): void;
}

export function useLoading(): Loading {
  const [isLoading, setLoading] = useState(false);

  return {
    isLoading,
    submit: (promise) => {
      setLoading(true);
      promise.finally(() => setLoading(false));
    },
  };
}

export interface LoadingWithError extends Loading {
  readonly error: any;
}

export function useLoadingWithError(): LoadingWithError {
  const { isLoading, submit } = useLoading();
  const [error, setError] = useState<any>();

  return {
    isLoading,
    submit: (promise) => {
      promise.catch(setError);
      submit(promise);
    },
    error,
  };
}

export interface TrackedChanges<T extends Record<string, any>> {
  changes: Partial<T>;
  original: Partial<T>;
  isChanged<K extends keyof T>(key: K): boolean;
  value<K extends keyof T>(key: K): T[K];
  set(values: Partial<T>): void;
  setOriginal(value: T): void;
  reset(): void;
}

export function useTrackedChanges<T extends Record<string, any>>(
  originalValue?: T
): TrackedChanges<T> {
  const [original, setOriginal] = useState<T>(originalValue);
  const [changes, setChanges] = useState<Partial<T>>({});

  return {
    original,
    changes,
    set: (values) => {
      for (let key of Object.keys(values)) {
        const newValue = { ...changes };
        if (values[key] == original[key]) {
          delete newValue[key];
        } else {
          newValue[key as keyof T] = values[key];
        }
        setChanges(newValue);
      }
    },
    value: (key) => changes[key] ?? original[key],
    isChanged: (key) => typeof changes[key] !== "undefined",
    setOriginal: (v) => {
      setOriginal(v);
      setChanges({});
    },
    reset: () => setChanges({}),
  };
}
