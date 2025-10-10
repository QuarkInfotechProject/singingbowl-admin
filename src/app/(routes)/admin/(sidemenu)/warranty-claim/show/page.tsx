"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import {
  User,
  Mail,
  Hash,
  PhoneCall,
  ShoppingBag,
  Calendar,
  Package,
  FileText,
  Image,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SkeletonItem = () => (
  <div className="flex items-center space-x-2 mb-2">
    <Skeleton className="h-5 w-5" />
    <Skeleton className="h-4 w-48" />
  </div>
);

const WarrantyClaimShow = ({ IdData ,setIsSheetOpen}: { IdData: string }) => {
  const [showData, setShowData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch(`/api/warranty-claim/show/${IdData}`);
        const data = await res.json();
        setShowData(data.data);
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [IdData]);

  const formatDate = (date: string) => date?.split("@")[0]?.trim();

  const DataItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number | undefined;
  }) => (
    <div className="flex w-[600px] items-center space-x-2 mb-2">
      {loading ? (
        <Skeleton className="h-5 w-5" />
      ) : (
        <Icon className="w-5 h-5 text-gray-500" />
      )}
      <span className="font-bold text-gray-700">{label}:</span>
      {loading ? (
        <Skeleton className="h-4 w-24" />
      ) : (
        <span className="text-gray-900">{value}</span>
      )}
    </div>
  );

  return (
    <Card className="h-full bg-white mx-auto">
      <CardHeader className="text-start">
        <CardTitle className="text-xl font-bold text-primary">
          Warranty Claim Details
        </CardTitle>
      </CardHeader>

      <CardContent className="">
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-1 gap-2 items-start justify-between md:grid-cols-2 p-2">
            {/* First Column */}
            <div className="flex flex-col items-start gap-1">
              <DataItem icon={User} label="Name" value={showData?.name} />
              <DataItem icon={Mail} label="Email" value={showData?.email} />
              <DataItem
                icon={Hash}
                label="Quantity"
                value={showData?.quantity}
              />
              <DataItem
                icon={PhoneCall}
                label="Phone"
                value={showData?.phone}
              />
            </div>
            {/* Second Column */}
            <div className="flex flex-col items-start gap-1">
              <DataItem
                icon={ShoppingBag}
                label="Purchase From"
                value={showData?.purchasedFrom}
              />
              <DataItem
                icon={Calendar}
                label="Submitted At"
                value={formatDate(showData?.submittedAt)}
              />
              <DataItem
                icon={Package}
                label="Product"
                value={showData?.product}
              />
            </div>
          </div>

          {/* Address Section */}
          <div className="border px-2">
            <p className="text-gray-700 font-bold">Address:</p>
            <div className="grid grid-cols-1 gap-1 items-start justify-between md:grid-cols-2 space-x-6 p-2">
              <div className="flex flex-col items-start gap-0">
                <DataItem
                  icon={Package}
                  label="Address"
                  value={showData?.address}
                />
                <DataItem
                  icon={Package}
                  label="Zone"
                  value={showData?.zoneName}
                />
                <DataItem
                  icon={Package}
                  label="City"
                  value={showData?.cityName}
                />
              </div>
              <div className="flex flex-col items-start gap-0">
                <DataItem
                  icon={Package}
                  label="Province"
                  value={showData?.provinceName}
                />
                <DataItem
                  icon={Package}
                  label="Country"
                  value={showData?.countryName}
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="flex flex-row items-center mb-1">
            {loading ? (
              <Skeleton className="h-5 w-5 mr-1" />
            ) : (
              <Image className="w-5 h-5 text-gray-500 mr-1" />
            )}
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <span className="text-gray-700 font-bold">Images</span>
            )}
          </div>

          <div>
            <div className="flex gap-4 space-x-2 mt-1 flex-wrap">
              {loading ? (
                <>
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <Skeleton className="w-20 h-20 rounded-md" />
                  <Skeleton className="w-20 h-20 rounded-md" />
                </>
              ) : (
                showData?.images?.map((image: string, index: number) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Claim image ${index + 1}`}
                    className="w-20 h-20 p-1 object-cover border rounded-md"
                  />
                ))
              )}
            </div>
          </div>

          {/* Problem Statement */}
          <div className="flex flex-row">
            <DataItem icon={FileText} label="Problem statement" value="" />
          </div>
          <div className="grid grid-cols-1 rounded-sm gap-4 h-28 overflow-y-auto border p-4 md:col-span-3">
            {loading ? (
              <Skeleton className="h-full w-full" />
            ) : (
              showData?.description && <p>{showData.description}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarrantyClaimShow;
