export interface PostData {
    code: number;
    message: string;
    data: {
        title: string;
        slug: string;
        readTime: number;
        description: string;
        isActive: number;
        files: {
            desktop: {
              id: number;
              desktopUrl: string;
            };
            mobile: {
              id: number;
              mobileUrl: string;
            };
          };
        meta: {
            metaTitle: string;
            keywords: string[];
            metaDescription: string;
        };
    };
}
