export interface Image {
    id: number;
    desktopImageUrl: string;
    mobileImageUrl: string;
}

export interface Files {
    desktopImage: Image;
    mobileImage: Image;
}

export interface Data {
    link: string | null;
    isActive: number;
    type: number;
    files: Files;
}

export interface ApiResponse {
    code: number;
    message: string;
    data: Data;
}
