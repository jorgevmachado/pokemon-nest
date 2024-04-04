export interface IPaginate<T> {
  skip: number | null;
  data: Array<T>;
  next: number | null;
  prev: number | null;
  total: number;
  pages: number;
  perPage: number;
  currentPage: number;
  message?: string;
}
