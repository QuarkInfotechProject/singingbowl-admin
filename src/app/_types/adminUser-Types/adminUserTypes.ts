export interface AdminUserData {
    id: number;
    uuid: string;
    fullName: string;
    email: string;
    status: number;
    groupId: number;
  }
  
 export interface AdminUsersApiResponse {
    code: number;
    message: string;
    data: {
      current_page: number;
      data: AdminUserData[];
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
  