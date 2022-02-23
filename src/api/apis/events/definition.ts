import { Event, EventsOrderBy, GetEventsParams, Pagination, Sequence } from 'api/definition';

export const EVENTS_API_DI_KEY = Symbol.for('Events API');

export interface IEventsApi {
  getAll(params: GetEventsParams): Promise<Pagination<Event, EventsOrderBy>>;
  get(id: string): Promise<Event>;
  getSequence(sequenceID: string): Promise<Sequence>;
}
