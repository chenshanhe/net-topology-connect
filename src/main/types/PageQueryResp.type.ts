export interface PageQueryResp<T> {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  data: T[];
}
