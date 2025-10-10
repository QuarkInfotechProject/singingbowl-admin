export interface CorporateOrderShow {
    code: number;
    message: string;
    data: CorporateOrderDataShow;
  }
  
  export interface CorporateOrderDataShow {
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
    quantity: number;
    requirement: string;
  }