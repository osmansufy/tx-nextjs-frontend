export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  totalPages: number;
  page: number;
  perPage: number;
}

export interface WpRendered {
  rendered: string;
  protected?: boolean;
}

export interface WpError {
  code: string;
  message: string;
  data?: { status: number; [k: string]: unknown };
}

export interface ApiErrorShape {
  status: number;
  code: string;
  message: string;
}
