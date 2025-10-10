export interface Tag {
    id: string;
    name: string;
    url: string;
    created: string; 
  }
  
 export  interface PaginationLinks {
    url: string | null;
    label: string;
    active: boolean;
  }
  
  export interface PaginationData {
    current_page: number;
    data: Tag[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLinks[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  
  export interface FetchTagsResponse {
    code: number;
    message: string;
    data: PaginationData;
  }
  