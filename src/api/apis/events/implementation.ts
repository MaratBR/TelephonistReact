import { IEventsApi } from './definition';
import ApiBase from 'api/ApiBase';
import {
  Event,
  EventsOrderBy,
  GetEventsParams,
  Pagination,
  SequenceStandalone,
} from 'api/definition';

export default class EventsApi extends ApiBase implements IEventsApi {
  getAll(params: GetEventsParams): Promise<Pagination<Event, EventsOrderBy>> {
    return this.statusService.apiCall(this._client.get('user-api/events', { params }));
  }

  get(id: string): Promise<Event> {
    return this.statusService.apiCall(this._client.get(`user-api/events/${id}`));
  }

  getSequence(sequenceID: string): Promise<SequenceStandalone> {
    return this.statusService.apiCall(this._client.get(`user-api/events/sequences/${sequenceID}`));
  }
}
