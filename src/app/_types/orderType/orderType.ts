// Define the type for each order in the data array
export interface Order {
    id: number;
    customerName: string;
    date: string;
    status: string;
    total: string;
    paymentMethod: string;
    coupons: any[]; // If coupons have more structure, replace `any` with the appropriate type
  }
  
  // Define the type for the pagination links
  export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
  }
  
  // Define the type for the entire response structure
  export interface OrderResponse {
    current_page: number;
    data: Order[]; // This is the array of orders
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[]; // Array of pagination links
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
  }
  