"use client";
import React, { useState, useEffect } from "react";
import MediaCenter from "./mediaCenter";
import { ApiResponse } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";

const MediaPage = ({
  onLogoClick,
  setIsSheetOpen,
  onClickTab,
}: {
  onLogoClick: (data: any) => void;
  setIsSheetOpen: boolean;
  onClickTab: (data: any) => void;
}) => {
  const [fileCategory, setFileCategory] = useState<ApiResponse | null>(null);
  const [refetch, setRefetch] = useState(false);

  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await fetch(`/api/mediaCategory`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await res.json();
        setFileCategory(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getCategory();
    setRefetch(false);
  }, [refetch]);

  return (
    <div className="h-screen ">
      <div className="h-96  w-fit">
        <MediaCenter
          fileCategory={fileCategory}
          onClickTab={onClickTab}
          setRefetch={setRefetch}
          setIsSheetOpen={setIsSheetOpen}
          refetch={refetch}
          onLogoClick={onLogoClick}
        />
      </div>
    </div>
  );
};

export default MediaPage;
