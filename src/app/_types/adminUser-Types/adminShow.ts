export interface AdminUserData {
    id: number;
    uuid: string;
    fullName: string;
    email: string;
    status: number;
    groupId: number;
  }
  
  export interface AdminUserApiResponse {
    code: number;
    message: string;
    data: AdminUserData;
  }
  