export interface Permission {
    id: number;
    name: string;
    section: string;
    description: string;
}

export interface ApiResponse {
    code: number;
    message: string;
    data: Permission[];
}
