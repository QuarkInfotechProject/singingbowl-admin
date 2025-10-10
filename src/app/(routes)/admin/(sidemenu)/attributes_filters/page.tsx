import { serverSideFetch } from "@/app/_utils/serverSideFetch";
import RootLayouts from "./RootLayouts";
import { ApiResponse } from "@/app/_types/category_Types/categoryType";

export default async function page() {
  const res: ApiResponse = await serverSideFetch({
    url: "/categories",
    method: "get"
  });

  return (
    <>
      <RootLayouts categories={res?.data||[]} />
    </>
  );
}
