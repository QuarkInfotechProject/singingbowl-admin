"use client";
import { Fragment } from "react";
import RootLayout from "./RootLayout";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
export interface newArrivalRoot {
  code: number;
  message: string;
  data: newArrivalRootData[];
}
export interface newArrivalRootData {
  id: number;
  name: string;
  slug: string;
  show_in_new_arrivals: boolean;
  sort_order: number;
  image: string;
}
export default function Page() {
  const { data, isLoading } = useQuery<newArrivalRoot>({
    queryKey: ["newarrival"],
    queryFn: async () => {
      const res = await clientSideFetch({
        url: "/new-arrival",
        toast: "skip",
        method: "get",
      });
      if (!res || res.status !== 200) {
        throw new Error("Failed to fetch new arrivals");
      }
      return res.data as newArrivalRoot;
    },
  });

  return (
    <Fragment>
      {isLoading ? (
        <div className="grid grid-cols-2  gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="flex flex-col space-y-3">
              <Skeleton className="h-[125px]  rounded-xl animate-pulse bg-gray-300" />
            </div>
          ))}
        </div>
      ) : (
        <RootLayout newArrival={data?.data || []} />
      )}
    </Fragment>
  );
}
