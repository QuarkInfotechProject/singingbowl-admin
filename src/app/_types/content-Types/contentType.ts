
export interface File {
    zone: string;
    imageUrl: string;
  }
  

export  interface DataItem {
    id: number;
    link: string | null;
    isActive: number;
    type: number;
    files: File[];
  }

export   interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  

export  interface ApiResponse {
    current_page: number;
    data: DataItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  