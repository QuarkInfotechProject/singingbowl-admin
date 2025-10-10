// Define TypeScript interfaces for the API response data

// Individual file item type
export interface FileItem {
    id: number;
    fileName: string;
    width: number;
    height: number;
    url: string;
    thumbnailUrl: string;
  }
  
  // API response data type
 export  interface ApiResponseData {
    current_page: number;
    data: FileItem[];
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
  }
  
  // Complete API response type including status code and message
 export  interface ApiResponse {
    code: number;
    message: string;
    data: ApiResponseData;
  }
  