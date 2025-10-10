
export interface WarrantyClaim {
    id: number;
    name: string;
    email: string;
    phone: string;
    product: string;
    submittedAt:string;
}


export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}


export interface WarrantyClaimsResponse {
    code: number;
    message: string;
    data: {
        current_page: number;
        data: WarrantyClaim[];
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
