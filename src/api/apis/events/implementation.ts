import ApiBase from "api/ApiBase";
import { EventsOrderBy, GetEventsParams, Pagination, Sequence } from "api/definition";
import { injectable } from "inversify";
import { IEventsApi } from "./definition";

@injectable()
export default class EventsApi extends ApiBase implements IEventsApi {
  getEvents(params: GetEventsParams): Promise<Pagination<Event, EventsOrderBy>> {
    return this._apiCall(this._client.get('events', { params }));
  }

  getEvent(id: string): Promise<Event> {
    return this._apiCall(this._client.get(`events/${id}`));
  }

  getSequence(sequenceID: string): Promise<Sequence> {
    return this._apiCall(this._client.get(`events/sequences/${sequenceID}`));
  }
}