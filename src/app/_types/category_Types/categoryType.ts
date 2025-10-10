export interface CategoryT {
    id: number;
    name: string;
    sortOrder: number;
    parentId: number;
    children?: CategoryT[];
  }
  
  export interface ApiResponse {
    code: number;
    message: string;
    data: CategoryT[];
  }