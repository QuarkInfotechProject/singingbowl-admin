export interface EmailT {
   
    name: string;
    title: string;
    
  }
  export interface EmailResponseT {
    code: number;
    message: string;
    data: EmailT[];
  }