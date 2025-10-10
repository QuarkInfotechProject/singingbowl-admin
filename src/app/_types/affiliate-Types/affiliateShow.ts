
export interface File {
    id: number;
    desktopLogoUrl: string;
    mobileLogoUrl: string;
  }
  
  export interface AffiliateContent {
    title: string;
    description: string;
    files: {
      desktopLogo: File;
      mobileLogo: File;
    };
  }
  
  export interface ApiResponse {
    code: number;
    message: string;
    data: AffiliateContent;
  }
  