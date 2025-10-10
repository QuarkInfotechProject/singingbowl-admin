export interface File {
    zone: string;
    imageUrl: string;
}

export interface Affiliate {
    id: number;
    title: string;
    description: string;
    isPartner: boolean;
    isActive: boolean;
    files: File[];
}

export interface ApiResponse {
    code: number;
    message: string;
    data: DataTypes;
}

export interface DataTypes{
        current_page: number;
        data: Affiliate[];
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

