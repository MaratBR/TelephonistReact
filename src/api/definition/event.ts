import { ConnectionInfo } from './connection';
import { PaginationParams } from './pagination';

export interface Event {
  event_key: string;
  sequence_id: string | null;
  app_id: string;
  event_type: string;
  task_name: string | null;
  task_id: string | null;
  data: any | null;
  publisher_ip: string | null;
  created_at: string;
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
  frozen: boolean;
  error: string | null;
  connection_id: string | null;
}

export interface SequenceStandalone extends Omit<Sequence, 'connection_id' | 'app_id' | 'task_id'> {
  app: {
    _id: string;
    name: string;
    display_name: string;
    deleted_at: string | null;
  };
  connection: ConnectionInfo;
  logs: {
    t: string;
    severity: number;
    body: string;
    _id: string;
  }[];
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
