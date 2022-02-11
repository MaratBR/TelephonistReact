export function asPromise<T>(fn: () => T | Promise<T>): Promise<T> {
  let value: T | Promise<T>;
  try {
    value = fn();
  } catch (exc) {
    return Promise.reject(exc);
  }

  if (value instanceof Promise) {
    return value;
  }
  return Promise.resolve(value);
}
