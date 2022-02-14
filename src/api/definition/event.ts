import { PaginationParams } from './pagination';

export interface Event {
  event_key: string;
  sequence_id: string | null;
  app_id: string;
  event_type: string;
  related_task: string | null;
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

export interface GetEventsParams extends PaginationParams<EventsOrderBy> {
  event_type?: string;
  task_name?: string;
  event_key?: string;
  app_id?: string;
  before?: string;
  sequence_id?: string;
}
