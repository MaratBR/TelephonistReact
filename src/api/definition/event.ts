import { ConnectionInfo, ServerInfo } from './connection';
import { CounterValues } from './misc';
import { Pagination, PaginationParams } from './pagination';

export interface Event {
  event_key: string;
  sequence_id: string | null;
  app_id: string;
  event_type: string;
  task_name: string;
  task_id: string;
  data: any | null;
  publisher_ip: string | null;
  t: number;
  _id: string;
}

export type EventsOrderBy = '_id' | 'event_type' | 'task_name' | 'created_at';

export enum SequenceState {
  FAILED = 'failed',
  SUCCEEDED = 'succeeded',
  SKIPPED = 'skipped',
  IN_PROGRESS = 'in_progress',
  FROZEN = 'frozen',
}

export interface TriggeredBy {
  trigger_type: string;
  trigger_body: any;
  extra: null | Record<string, any>;
}

export interface Sequence {
  _id: string;
  name: string;
  app_id: string;
  finished_at: string | null;
  description: string | null;
  meta: null | Record<string, any>;
  state: SequenceState;
  task_name: string | null;
  task_id: string | null;
  expires_at: string | null;
  error: string | null;
  triggered_by: TriggeredBy;
  connection_id: string | null;
  created_at: string;
}

export interface SequenceStandalone extends Omit<Sequence, 'connection_id' | 'app_id'> {
  app: {
    _id: string;
    name: string;
    display_name: string;
    deleted_at: string | null;
  };
  connection: ConnectionInfo;
  host: ServerInfo;
}

function toSequenceProcess(v: any): SequenceProcess {
  if (typeof v !== 'object' || v === null) return {};
  let { progress, steps_done, steps_total, description } = v;
  if (typeof progress !== 'number' && typeof progress !== 'number') progress = undefined;
  if (typeof steps_done !== 'number' && typeof steps_done !== 'undefined') steps_done = undefined;
  if (typeof steps_total !== 'number' && typeof steps_total !== 'undefined')
    steps_total = undefined;
  if (typeof description !== 'string' && typeof description !== 'undefined')
    description = undefined;
  return {
    progress,
    steps_done,
    steps_total,
    description,
  };
}

interface SequenceProcess {
  progress?: number;
  steps_done?: number;
  steps_total?: number;
  description?: string;
}

export function toSequenceMeta(v: any): SequenceMeta {
  return toSequenceProcess(v);
}

export interface SequenceMeta extends SequenceProcess {}

export interface GetEventsParams extends PaginationParams<EventsOrderBy> {
  event_type?: string;
  task_name?: string;
  event_key?: string;
  app_id?: string;
  before?: string;
  sequence_id?: string;
}

export interface GetSequencesParams extends PaginationParams<'_id'> {
  app_id?: string;
  state?: SequenceState | SequenceState[];
}

export type SequencesPagination = Pagination<Sequence> & {
  counters: {
    failed: CounterValues;
    total: CounterValues;
    finished: CounterValues;
  };
};
