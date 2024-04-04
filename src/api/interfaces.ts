export interface IResponsePaginate<T> {
  next: string | null;
  count: number;
  results: Array<T>;
  previous: string | null;
}
