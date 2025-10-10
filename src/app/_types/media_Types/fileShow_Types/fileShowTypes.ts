export interface FileApiResponse  {
    code: number;
    message: string;
    data: {
      file: string;
      filename: string;
      fileCategoryId: number | null;
      fileCategoryName: string;
      description:string;
     caption:string;
     title:string;
     alternativeText:string,
      size: string;
      width: number;
      height: number;
      url: string;
      thumbnailUrl: string;
      createdAt: string; 
    };
  };