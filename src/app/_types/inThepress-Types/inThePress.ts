

export interface PressLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  
  export interface PressItem {
    id: number;
    title: string;
    isActive: number;
    publishedDate: string;
  }
  
  export interface InThePressResponse {
    current_page: number;
    data: PressItem[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PressLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  