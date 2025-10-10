"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { WarrantyRegistration } from "@/app/_types/warranty-registrations/warrantyShow";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ClipboardList,
  Calendar,
  Package,
  Phone,
  Mail,
  User,
  Hash,
} from "lucide-react";

const WarrantyRegistrationShow = ({
  setIsSheetOpen,
  setRefetch,
  IdData,
}: any) => {
  const [showData, setShowData] = useState<WarrantyRegistration | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/warranty-registrations/show/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        setShowData(data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData(IdData);
  }, [IdData]);

  const toggleCreateDialogs = () => {
    setIsSheetOpen(false);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "N/A";
    const datePart = dateString.split("@")[0];
    return datePart.trim();
  };

  const InfoItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: string | number | undefined;
  }) => (
    <div className="flex items-center space-x-2 mb-2">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="font-medium text-gray-700">{label}:</span>
      <span className="text-gray-900">
        {loading || value === undefined ? (
          <Skeleton className="w-24 h-4 inline-block" />
        ) : (
          value
        )}
      </span>
    </div>
  );

  return (
    <Card className="w-full  mx-auto">
      <CardHeader className="text-start ">
        <CardTitle className="text-2xl font-bold text-primary">
          Warranty Registration Details
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoItem icon={User} label="Name" value={showData?.name} />
          <InfoItem icon={Mail} label="Email" value={showData?.email} />
          <InfoItem icon={Package} label="Product" value={showData?.product} />
          <InfoItem icon={Phone} label="Phone" value={showData?.phone} />
          <InfoItem icon={Hash} label="Quantity" value={showData?.quantity} />
          <InfoItem
            icon={Calendar}
            label="Registered At"
            value={formatDate(showData?.submittedAt || "")}
          />
          <InfoItem
            icon={Calendar}
            label="Purchase Date"
            value={showData?.dateOfPurchase}
          />
          <InfoItem
            icon={Hash}
            label="purchasedFrom"
            value={showData?.purchasedFrom}
          />
        </div>
        <div className="border px-5 mt-8 p-2 rounded-md">
          <p className=" text-gray-700  font-bold">Address : </p>
          <div className="grid grid-cols-1 gap-1 items-start justify-between md:grid-cols-2 space-x-6 p-2 ">
            {/* First Row - 3 items */}

            <div className="flex flex-col items-start gap-0">
              <InfoItem
                icon={Package}
                label="Address "
                value={showData?.address}
              />
              <InfoItem
                icon={Package}
                label="Zone "
                value={showData?.zoneName}
              />
              <InfoItem
                icon={Package}
                label="City "
                value={showData?.cityName}
              />
              <InfoItem
                icon={Package}
                label="Province "
                value={showData?.provinceName}
              />
              <InfoItem
                icon={Package}
                label="Country "
                value={showData?.countryName}
              />
            </div>
            {/* Second Row - 2 items */}
            <div className="flex flex-col items-start gap-0"></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WarrantyRegistrationShow;
