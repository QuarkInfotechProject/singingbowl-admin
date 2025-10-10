export interface Order {
    id: number;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
}


export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}


export interface OrderResponse {
    code: number;
    message: string;
    data: {
        current_page: number;
        data: Order[];
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
