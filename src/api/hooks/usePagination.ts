import { useEffect, useState } from 'react';
import { Pagination, PaginationParams } from 'api/definition';
import { AsyncValue, useRefreshableAsyncValue } from 'core/hooks';

export interface PaginationValue<T, TOrderBy extends string> extends AsyncValue<Pagination<T>> {
  // eslint-disable-next-line no-unused-vars
  setProps(props: Partial<PaginationParams<TOrderBy>>): void;
}

export default function usePagination<T, TOrderBy extends string>(
  // eslint-disable-next-line no-unused-vars
  getter: (props: PaginationParams<TOrderBy>) => Promise<Pagination<T, TOrderBy>>,
  defaultProps: PaginationParams<TOrderBy>
): PaginationValue<T, TOrderBy> {
  const [props, setProps] = useState<PaginationParams<TOrderBy>>(defaultProps);
  const live = useRefreshableAsyncValue(() => getter(props), [], false);

  useEffect(() => {
    live.refresh();
  }, [props]);

  return {
    ...live,
    setProps: (update) => setProps({ ...props, ...update }),
  };
}
