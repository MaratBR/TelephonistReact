export interface StatefulCallback<T extends object, TReturned = void> {
  (patch: Partial<T>): TReturned | undefined;
  set(value: T): TReturned | undefined;
  value: T;
}

export function statefulCallback<T extends object, TReturned = void>(
  initialValue: T,
  innerCallback?: (T) => TReturned
): StatefulCallback<T, TReturned> {
  const callback: StatefulCallback<T, TReturned> = function StatefulCallback(patch: Partial<T>) {
    return this.set({ ...this.initialValue, ...patch });
  };

  callback.value = initialValue;
  callback.set = function set(value) {
    this.value = value;
    if (innerCallback) return innerCallback(value);
    return undefined;
  };

  return callback;
}
