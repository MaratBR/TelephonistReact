import { useEffect, useRef, useState } from 'react';

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

export function useStateWithError<T, TError = any>(defaultValue: T): StateWithError<T, TError> {
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
    if (ref.current === false) {
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
  return useStateWithValidation(defaultValue ?? '', (v) => {
    if (!v) throw new Error(errorMessage ?? 'Value is required');
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
    for (const v of validateables) {
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
  return useStateWithValidation<string>('', passwordValidation);
}
