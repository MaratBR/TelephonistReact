import {
  Event,
  EventsOrderBy,
  GetEventsParams,
  GetSequencesParams,
  Pagination,
  SequenceStandalone,
  SequencesPagination,
} from 'api/definition';

export interface IEventsApi {
  getAll(params: GetEventsParams): Promise<Pagination<Event, EventsOrderBy>>;
  get(id: string): Promise<Event>;
  getSequence(sequenceID: string): Promise<SequenceStandalone>;
  getSequences(params: GetSequencesParams): Promise<SequencesPagination>;
}
