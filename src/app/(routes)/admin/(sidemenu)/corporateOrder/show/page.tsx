"use client";
import { CorporateOrderDataShow } from "@/app/_types/corporate-types/corporateShow";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const CorporateOrderShow = ({ setIsSheetOpen, setRefetch, IdData }: any) => {
  const [showData, setShowData] = useState<CorporateOrderDataShow | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/corporateOrder/show/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        setShowData(data.data);
        setIsLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getData(IdData);
  }, [IdData]);

  const toggleCreateDialogs = () => {
    setIsSheetOpen(false);
  };
  return (
    <div className="flex flex-col gap-y-6 select-none">
      <h1 className="font-bold text-2xl text-center border-b w-[350px] pb-4">
        View Corporate Order
      </h1>

      <div className="flex gap-28">
        <h1 className="capitalize font-semibold">Name:</h1>
        {isLoading ? (
          <Skeleton className="w-40 h-6" />
        ) : (
          <p>
            {showData?.firstName} {showData?.lastName}
          </p>
        )}
      </div>

      <div className="flex gap-28">
        <h1 className="capitalize font-semibold">Email:</h1>
        {isLoading ? (
          <Skeleton className="w-40 h-6" />
        ) : (
          <p>{showData?.email}</p>
        )}
      </div>

      <div className="flex gap-9">
        <h1 className="capitalize font-semibold">Company Name:</h1>
        {isLoading ? (
          <Skeleton className="w-40 h-6" />
        ) : (
          <p>{showData?.companyName}</p>
        )}
      </div>

      <div className="flex gap-10">
        <h1 className="capitalize font-semibold">Phone Number:</h1>
        {isLoading ? (
          <Skeleton className="w-40 h-6" />
        ) : (
          <p>{showData?.phone}</p>
        )}
      </div>

      <div className="flex gap-[83px]">
        <h1 className="capitalize font-semibold">Quantity:</h1>
        {isLoading ? (
          <Skeleton className="w-40 h-6" />
        ) : (
          <p>{showData?.quantity}</p>
        )}
      </div>

      {showData?.requirement?.length > 0 && (
        <div className="flex gap-14">
          <h1 className="capitalize font-semibold">Requirement:</h1>
          {isLoading ? (
            <Skeleton className="w-40 h-6" />
          ) : (
            <p>{showData?.requirement}</p>
          )}
        </div>
      )}
      {/* <div className='justify-end mx-60'>
        <Button className='bg-red-500 hover:bg-red-600 w-[100px]' onClick={toggleCreateDialogs}>Close</Button>
      </div> */}
    </div>
  );
};

export default CorporateOrderShow;
