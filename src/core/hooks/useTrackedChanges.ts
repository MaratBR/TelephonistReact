import { useState } from "react";
import deepEqual from "deep-equal";

export interface TrackedChanges<T extends Record<string, any>> {
  changes: Partial<T>;
  original: Partial<T>;
  isChanged<K extends keyof T>(key: K): boolean;
  value<K extends keyof T>(key: K): T[K];
  set(values: Partial<T>): void;
  setOriginal(value: T): void;
  reset(): void;
}

export default function useTrackedChanges<T extends Record<string, any>>(
  originalValue?: T,
): TrackedChanges<T> {
  const [original, setOriginal] = useState<T>(originalValue);
  const [changes, setChanges] = useState<Partial<T>>({});

  return {
    original,
    changes,
    set: (values) => {
      for (const key of Object.keys(values)) {
        const newValue = { ...changes };
        if (deepEqual(values[key], original[key])) {
          delete newValue[key];
        } else {
          newValue[key as keyof T] = values[key];
        }
        setChanges(newValue);
      }
    },
    value: (key) => changes[key] ?? original[key],
    isChanged: (key) => typeof changes[key] !== 'undefined',
    setOriginal: (v) => {
      setOriginal(v);
      setChanges({});
    },
    reset: () => setChanges({}),
  };
}
