"use client";
import React, { useEffect, useState } from "react";
import RootEdit from "./RootEdit";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";

const page = ({ setIsSheetOpen, IdData,setQuickEdits }: any) => {
  const [loadding, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [defaultValue, setDefaultValue] = useState();
  const { toast } = useToast();
  useEffect(() => {
    const getProduct = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await clientSideFetch({
          url: `/products/show/${IdData}`,
          method: "get",
          debug: true,
          toast:"skip"
        });

        if (!response || !response.data || !response.data.data) {
          throw new Error("Product data not found");
        }

        setDefaultValue(response.data.data);

        setIsLoading(false);
      } catch (err) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load product data. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (IdData) {
      getProduct();
    }

    // Cleanup function
    return () => {
      setError(null);
    };
  }, [IdData]);

  return (
    <div>
      {loadding ? (
        <>
          <div className="space-y-4">
            {/* Skeleton for Input fields */}
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            {/* Repeat for other fields */}
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            {/* Add more skeletons for other form sections */}
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
            <div className="animate-pulse space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 rounded"></div>
            </div>
          </div>
        </>
      ) : (
        <RootEdit setQuickEdits={setQuickEdits} IdData={IdData} setIsSheetOpen={setIsSheetOpen} defaultValue={defaultValue} />
      )}
    </div>
  );
};

export default page;
