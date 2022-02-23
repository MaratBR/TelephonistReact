import React from 'react';

// eslint-disable-next-line no-unused-vars
type MutableRef<T> = ((value: T) => void) | React.MutableRefObject<T>;

export function combineRefs<T>(...refs: MutableRef<T>[]): React.Ref<T> {
  return (value: T) => {
    for (const ref of refs) {
      if (typeof ref === 'function') {
        ref(value);
      } else if (ref !== null) {
        ref.current = value;
      }
    }
  };
}

type Listener<TArgs extends any[]> = (...args: TArgs) => any;

export function combineListeners<TArgs extends any[]>(
  ...listeners: (Listener<TArgs> | undefined)[]
): Listener<TArgs> {
  const validListeners = listeners.filter(Boolean);
  return (...args) => {
    for (const listner of validListeners) listner(...args);
  };
}
