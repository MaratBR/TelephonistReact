import { IEventsApi } from './definition';
import ApiBase from 'api/ApiBase';
import {
  Event,
  EventsOrderBy,
  GetEventsParams,
  GetSequencesParams,
  Pagination,
  SequenceStandalone,
  SequencesPagination,
} from 'api/definition';

export default class EventsApi extends ApiBase implements IEventsApi {
  getSequences(params: GetSequencesParams): Promise<SequencesPagination> {
    return this.client.get('events/sequences', { params }).then((r) => r.data);
  }

  getAll(params: GetEventsParams): Promise<Pagination<Event, EventsOrderBy>> {
    return this.client.get('events', { params }).then((r) => r.data);
  }

  get(id: string): Promise<Event> {
    return this.client.get(`events/${id}`).then((r) => r.data);
  }

  getSequence(sequenceID: string): Promise<SequenceStandalone> {
    return this.client.get(`events/sequences/${sequenceID}`).then((r) => r.data);
  }
}
