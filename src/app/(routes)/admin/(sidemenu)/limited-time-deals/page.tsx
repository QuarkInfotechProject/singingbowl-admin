import { serverSideFetch } from "@/app/_utils/serverSideFetch";
import RootLimitedTime from "./RootLimitedTime";
export interface LimitedTimeRootResponse {
  code: number;
  message: string;
  data: LimitedRootData;
}

export interface LimitedRootData {
  data: LimitedRootDataData[];
}

export interface LimitedRootDataData {
  id: number;
  product_uuid: string;
  product_name: string;
  status: boolean;
  image: string;
}
export default async function name() {
  const response: LimitedTimeRootResponse = await serverSideFetch({
    url: "/limitedtimedeal",
    method: "get",
  });
  const limitedData = response?.data?.data || [];
  return (
    <>
      <RootLimitedTime limitedData={limitedData} />
    </>
  );
}
