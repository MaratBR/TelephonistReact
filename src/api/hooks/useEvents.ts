import { Event, EventsOrderBy, GetEventsParams } from "api/definition";
import { useApi } from ".";
import usePagination from "./usePagination";

export function useEventPagination(
  params?: GetEventsParams,
) {
  const api = useApi();
  return usePagination<Event, EventsOrderBy>(
    (props) => api.getEvents({ ...props, ...(params ?? {}) }),
    {},
  );
}
