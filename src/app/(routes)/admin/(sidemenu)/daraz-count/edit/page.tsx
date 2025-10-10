"use client";

import RootEdit from "./RootEdit";

import { useState, useEffect } from "react";

import { LaunchContent } from "@/app/_types/newLaunche-Types/newLaunchShow";
import { Skeleton } from "@/components/ui/skeleton";

const AttributSetsedit = ({
  setIsSheetOpens,
  dataId,
  setRefetch,
}: {
  setIsSheetOpens: any;
  dataId: any;
  setRefetch: any;
}) => {
  const [editContentData, setEditContentData] = useState<LaunchContent | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const getDatas = async () => {
      setLoading(true);
      const urls = `/api/darazCount/show/${dataId}`;
      try {
        const res = await fetch(urls, {
          method: "GET",
        });
        const data = await res.json();
        console.log("databest seller ", data.data);
        setEditContentData(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    getDatas();
  }, []);

  const fileId = dataId;

  return (
    <>
      {loading ? (
        <div className="h-full w-full p-6">
          <Skeleton className="w-1/4 h-8 mb-6" />
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="w-1/4 h-4 mb-2" /> {/* Label skeleton */}
                <Skeleton className="w-full h-10" /> {/* Input skeleton */}
              </div>
              <div>
                <Skeleton className="w-1/4 h-4 mb-2" /> {/* Label skeleton */}
                <Skeleton className="w-full h-10" /> {/* Select skeleton */}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="flex flex-row gap-2 mb-2">
                  <Skeleton className="w-1/4 h-4" /> {/* Label skeleton */}
                  <Skeleton className="w-24 h-8" />{" "}
                  {/* Upload button skeleton */}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-20 h-20" />{" "}
                  {/* Image preview skeleton */}
                  <Skeleton className="w-20 h-20" />{" "}
                  {/* Image preview skeleton */}
                </div>
              </div>
              <div>
                <div className="flex flex-row gap-2 mb-2">
                  <Skeleton className="w-1/4 h-4" /> {/* Label skeleton */}
                  <Skeleton className="w-24 h-8" />{" "}
                  {/* Upload button skeleton */}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="w-20 h-20" />{" "}
                  {/* Image preview skeleton */}
                  <Skeleton className="w-20 h-20" />{" "}
                  {/* Image preview skeleton */}
                </div>
              </div>
            </div>
            <Skeleton className="w-24 h-10" /> {/* Submit button skeleton */}
          </div>
        </div>
      ) : (
        <RootEdit
          editContentData={editContentData}
          fileId={fileId}
          setIsSheetOpens={setIsSheetOpens}
          setRefetch={setRefetch}
        />
      )}
    </>
  );
};

export default AttributSetsedit;
