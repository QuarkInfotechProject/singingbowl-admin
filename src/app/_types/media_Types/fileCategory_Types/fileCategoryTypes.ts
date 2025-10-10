export interface MediaCategory {
    id: number;
    name: string;
    url: string;
}

export interface ApiResponse {
    code: number;
    message: string;
    data: MediaCategory[];
}
