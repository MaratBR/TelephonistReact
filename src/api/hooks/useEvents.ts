import { useApi } from '.';
import usePagination from './usePagination';
import { Event, EventsOrderBy, GetEventsParams } from 'api/definition';

export function useEventPagination(params?: GetEventsParams) {
  const api = useApi();
  return usePagination<Event, EventsOrderBy>(
    (props) => api.getEvents({ ...props, ...(params ?? {}) }),
    {}
  );
}
