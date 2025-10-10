

export interface Permission {
    id: number;
    name: string;
    section: string;
    description: string;
  }
  
  export interface PermissionsResponse {
    code: number;
    message: string;
    data: Permission[];
  }
  