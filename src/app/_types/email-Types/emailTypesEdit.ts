export interface EmailEditT {
    
    
    title: string;
    subject: string;
    message: string;
    description: string;
  }
  export interface EmailEditResponseT {
    code: number;
    message: string;
    data: EmailEditT;
  }