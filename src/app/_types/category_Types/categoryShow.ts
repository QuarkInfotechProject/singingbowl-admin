export interface CategoriesData{
    id: number;
    name: string;
    searchable: number;
    active: number;
    isDisplayed: number;
    slug: string;
    parentId: number;
    filterPriceMin?: number;
    filterPriceMax?: number;
    files: {
      logo: {
        id: number | null;
        url: string | null;
      };
      banner: {
        id: number | null;
        url: string | null;
      };
    };
  }
  
  export interface CategoryApiResponse {
    code: number;
    message: string;
    data: CategoriesData;
  }
  