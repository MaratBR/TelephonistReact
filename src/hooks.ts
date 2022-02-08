import React, { useEffect, useRef, useState } from "react";
import { NavigateFunction, useNavigate, useParams } from "react-router-dom";

// #region validation

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

// validateAnd validates multiple Validated objects and if all
// of them were validated successfully calls onValidAction,
// if any of them failed calls onInvalidAction (if present)
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

function passwordValidation(pwd: string) {}

export function useProperPasswordState() {
  return useStateWithValidation<string>("", passwordValidation);
}

// #endregion

// #region "loading" hooks

interface LoadingBase {
  isLoading: boolean;
  error: boolean;
}

export interface SubmitLoading extends LoadingBase {
  submit<T>(promise: Promise<T>): void;
}

export function useSubmitLoading(): SubmitLoading {
  const [state, setState] = useState(() => ({
    loading: true,
    error: undefined,
  }));

  return {
    isLoading: state.loading,
    error: state.error,
    submit: (promise) => {
      setState({ loading: true, error: state.error });
      promise
        .then(() => setState({ error: undefined, loading: false }))
        .catch((err) => setState({ error: err, loading: true }));
    },
  };
}

export interface AsyncValue<T> extends LoadingBase {
  value: T | undefined;
  retry(): void;
}

export function useAsyncValue<T>(
  getter: () => Promise<T>,
  deps?: any[],
  prefetch: boolean = true
): AsyncValue<T> {
  const [state, setState] = useState({
    value: undefined,
    isLoading: prefetch,
    error: undefined,
  });
  const retry = () => {
    setState({ ...state, isLoading: true });
    getter()
      .then((value) => setState({ isLoading: false, error: undefined, value }))
      .catch((error) =>
        setState({ isLoading: false, error, value: state.value })
      );
  };

  useEffect(() => {
    if (prefetch) {
      retry();
    }
  }, deps ?? []);

  return {
    ...state,
    retry,
  };
}

// #endregion

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

export interface NextParamController {
  nextIfPresent(): void;
  isPresent(): boolean;
  nextOr(path: string): void;
  nextOrMain(): void;
  redirectWithNext(path: string): void;
  next: string;
}

class Next implements NextParamController {
  readonly next: string | undefined;
  private readonly _navigate: NavigateFunction;

  constructor(next: string | undefined, navigate: NavigateFunction) {
    this.next = next;
    this._navigate = navigate;
    this.isPresent = this.isPresent.bind(this);
    this.nextIfPresent = this.nextIfPresent.bind(this);
    this.nextOr = this.nextOr.bind(this);
    this.nextOrMain = this.nextOrMain.bind(this);
    this.redirectWithNext = this.redirectWithNext.bind(this);
  }

  isPresent(): boolean {
    return typeof this.next === "string" && this.next.trim() !== "";
  }

  nextIfPresent(): void {
    if (this.isPresent()) {
      this._navigate(this.next);
    }
  }

  nextOr(path: string): void {
    this._navigate(this.isPresent() ? this.next : path);
  }

  nextOrMain(): void {
    this.nextOr("/");
  }

  redirectWithNext(path: string): void {
    if (path.indexOf("?") === -1) {
      path += "?next=" + encodeURIComponent(this.next);
    } else {
      path += "&next=" + encodeURIComponent(this.next);
    }
    this._navigate(path);
  }
}

export function useNextParam(): NextParamController {
  const navigate = useNavigate();
  const { next } = useParams();
  return new Next(next, navigate);
}

export function useOnClickOutside(ref: React.RefObject<HTMLElement>, handler) {
  useEffect(
    () => {
      const listener = (event) => {
        // Do nothing if clicking ref's element or descendent elements
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };
      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);
      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    },
    // Add ref and handler to effect dependencies
    // It's worth noting that because passed in handler is a new ...
    // ... function on every render that will cause this effect ...
    // ... callback/cleanup to run every render. It's not a big deal ...
    // ... but to optimize you can wrap handler in useCallback before ...
    // ... passing it into this hook.
    [ref, handler]
  );
}
