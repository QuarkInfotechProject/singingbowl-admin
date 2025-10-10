export interface ServerError {
  error: string;
  status: number;
}

export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface PaginatedResponse<T> {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: T[];
    first_page_url: string;
    last_page_url: string;
    prev_page_url: string | null;
    next_page_url: string | null;
    last_page: number;
    per_page: number;
    total: number;
  };
}
