export interface File {
  id: number;
  filename: string;
  width: number;
  height: number;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface FileShowResponse {
  id?: number;
  file: string;
  filename: string;
  fileCategoryId: string | null;
  fileCategoryName: string;
  alternativeText: string;
  title: string;
  caption: string;
  description: string;
  size: string;
  width: number;
  height: number;
  url: string;
  thumbnailUrl: string;
  createdAt: string;
}

export interface FileResponse {
  code: number;
  message: string;
  data: {
    current_page: number;
    data: File[];
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
}