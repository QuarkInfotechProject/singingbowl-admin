export interface Transaction {
    orderId: number;
    transactionCode: string;
    paymentMethod: string;
    status: string;
    createdAt: string;
  }
  
 export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  
 export interface TransactionsResponse {
    code: number;
    message: string;
    data: {
      current_page: number;
      data: Transaction[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: PaginationLink[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  }
  