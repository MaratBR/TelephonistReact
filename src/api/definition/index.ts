import { Sequence } from './event';

export * from './application';
export * from './connection';
export * from './event';
export * from './misc';
export * from './pagination';
export * from './tasks';
export * from './websocket';
export * from './auth';
export * from './log';
export * from './users';

type CollectionName = 'app_logs' | 'events' | 'event_sequences' | 'applications';
type CounterNames = 'finished_sequences' | 'sequences' | 'failed_sequences' | 'events';

interface Periods<T> {
  total: T;
  year: T;
  month: T;
  week: T;
  day: T;
}

interface Counters {
  periods: Periods<string>;
  values: Record<CounterNames, Periods<number>>;
}

interface CollectionStats {
  size: number;
  max_size: number | null;
  capped: number;
  count: number;
}

export interface TelephonistStats {
  counters: Counters;
  failed_sequences: Sequence[];
  db: {
    stats: {
      allocated: number;
      used: number;
      fs_total: number;
      fs_used: number;
    };
    collections: Record<CollectionName, CollectionStats>;
  };
}
