export interface CorporateData {
   
    id: number;
    firstName: string;
    lastName: string;
    status: string;
    email: string;
    phone: number;
    submittedAt:string;
    
  }
  
  export interface ApiResponse {
    data: CorporateData[];
  }