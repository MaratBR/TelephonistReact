import { models, requests } from "api";
import { AsyncValue, useAsyncValue } from "core/hooks";
import { useEffect, useState } from "react";

export interface PaginationValue<
  T,
  TOrderBy extends string,
>
extends AsyncValue<models.Pagination<T>> {
  // eslint-disable-next-line no-unused-vars
  setProps(props: Partial<requests.PaginationParams<TOrderBy>>): void;
}

export default function usePagination<
  T,
  TOrderBy extends string,
>(
  // eslint-disable-next-line no-unused-vars
  getter: (props: requests.PaginationParams<TOrderBy>) => Promise<models.Pagination<T, TOrderBy>>,
  defaultProps: requests.PaginationParams<TOrderBy>,
): PaginationValue<T, TOrderBy> {
  const [props, setProps] = useState<requests.PaginationParams<TOrderBy>>(defaultProps);
  const live = useAsyncValue(
    () => getter(props),
    [],
    false,
  );

  useEffect(() => {
    live.refresh();
  }, [props]);

  return {
    ...live,
    setProps: (update) => setProps({ ...props, ...update }),
  };
}
