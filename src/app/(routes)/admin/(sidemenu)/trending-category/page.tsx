import { serverSideFetch } from "@/app/_utils/serverSideFetch";
import RootLayout from "./RootLayout";
export interface RootTrendingCategoryResponse {
  code: number;
  message: string;
  data: TrendingRootData[];
}

export interface TrendingRootData {
  id: number;
  category_id: number;
  isActive: number;
  sortOrder: number;
  category: RootTrendingDataCategory;
}

export interface RootTrendingDataCategory {
  id: number;
  name: string;
  slug: string;
  files: RootDataCategoryFiles;
}

export interface RootDataCategoryFiles {
  logo: RootDataCategoryFilesLogo;
  banner: RootDataCategoryFilesBanner;
}

export interface RootDataCategoryFilesLogo {
  id: number;
  url: string;
}

export interface RootDataCategoryFilesBanner {
  id: number;
  url: string;
}
export default async function Page() {
  const response: RootTrendingCategoryResponse = await serverSideFetch({
    url: "/trending-categories",
    method: "get",
  });
  return (
    <>
      <RootLayout trendingCategory={response.data || []} />
    </>
  );
}
