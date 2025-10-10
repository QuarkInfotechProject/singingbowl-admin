export interface File {
    zone: string;
    imageUrl: string;
  }
  
 
 export  interface LaunchData {
    id: number;
    link: string | null;
    isActive: number;
    isBanner: number;
    files: File[];
  }
  
  
 export  interface Link {
    url: string | null;
    label: string;
    active: boolean;
  }
  

  export interface ApiResponse {
    code: number;
    message: string;
    data: DataResponse;
  }
  export interface DataResponse {
      current_page: number;
      data: LaunchData[];
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
    };
  