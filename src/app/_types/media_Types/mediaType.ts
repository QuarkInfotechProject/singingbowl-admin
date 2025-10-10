export interface FileData {
    id: number;
    fileName: string;
    width: number;
    height: number;
    url: string;
    thumbnailUrl: string;
  }
  
 export  interface MediaResponse {
    code: number;
    message: string;
    data: {
      current_page: number;
      data: FileData[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  }
  