import { models, requests } from "api";
import { useApi } from ".";
import usePagination from "./usePagination";

export function useEventPagination(
  params?: requests.GetEventsParams,
) {
  const api = useApi();
  return usePagination<models.Event, requests.EventsOrderBy>(
    (props) => api.getEvents({ ...props, ...(params ?? {}) }),
    {},
  );
}

export function useLiveApplicationEvents() {

}
