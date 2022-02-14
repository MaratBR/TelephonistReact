export interface Pagination<T, TOrderBy extends string = string> {
  result: T[];
  page: number;
  page_size: number;
  total: number;
  pages_total: number;
  order_by: TOrderBy;
  order: 'asc' | 'desc';
  pages_returned: number;
}

export interface PaginationParams<TOrderBy extends string = string> {
  page?: number;
  page_size?: number;
  pages_returned?: number;
  order?: 'asc' | 'desc';
  order_by?: TOrderBy;
}
