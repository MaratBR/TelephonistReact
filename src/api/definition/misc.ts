export interface IdObject {
  _id: string;
}

interface _CounterValues<T> {
  year: T;
  month: T;
  week: T;
  day: T;
}

export type CounterValues = _CounterValues<number>;
export type CountersNames = _CounterValues<string>;
