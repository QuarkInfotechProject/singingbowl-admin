export interface LaunchContent {
    code: number;
    message: string;
    data: {
        link: string | null;
        isActive: number;
        isBanner: number;
        files: {
            desktopImage: ImageData;
            mobileImage: ImageData;
        };
    };
}

export interface ImageData {
    id: number;
    desktopImageUrl: string;
    mobileImageUrl: string;
}