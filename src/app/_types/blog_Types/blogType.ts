export interface Post {
    id: number;
    title: string;
    isActive: number;
  }
  
 export  interface Link {
    url: string | null;
    label: string;
    active: boolean;
  }
  
 export  interface Pagination {
    current_page: number;
    data: Post[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: Link[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  
export   interface ApiResponse {
    code: number;
    message: string;
    data: Pagination;
  }
  