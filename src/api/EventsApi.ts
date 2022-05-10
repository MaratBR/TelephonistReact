import ApiBase from './ApiBase';
import { api, pagination, rest } from './definition';

export default class EventsApi extends ApiBase implements api.IEvents {
  getSequences(params: rest.GetSequencesParams): Promise<rest.SequencesPagination> {
    return this.client.get('events/sequences', { params }).then((r) => r.data);
  }

  getAll(params: rest.GetEventsParams): Promise<pagination.Pagination<Event, rest.EventsOrderBy>> {
    return this.client.get('events', { params }).then((r) => r.data);
  }

  get(id: string): Promise<Event> {
    return this.client.get(`events/${id}`).then((r) => r.data);
  }

  getSequence(sequenceID: string): Promise<rest.SequenceStandalone> {
    return this.client.get(`events/sequences/${sequenceID}`).then((r) => r.data);
  }
}
