import { useApi } from '.';
import usePagination from './usePagination';
import { Event, EventsOrderBy, GetEventsParams } from 'api/definition';

export function useEventPagination(params?: GetEventsParams) {
  const { events } = useApi();
  return usePagination<Event, EventsOrderBy>(
    (props) => events.getAll({ ...props, ...(params ?? {}) }),
    {}
  );
}
