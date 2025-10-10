
export interface FeaturedImage {
    id: number;
    featuredImageUrl: string;
  }
  
  export interface PressData {
    title: string;
    link: string;
    publishedDate: string;
    files: {
      featuredImage: FeaturedImage;
    };
  }
  
  export interface ApiResponse {
    code: number;
    message: string;
    data: PressData;
  }
  