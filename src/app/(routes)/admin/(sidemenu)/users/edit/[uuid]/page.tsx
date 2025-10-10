"use client";

import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface UserData {
  fullName: string;
  email: string;
  phoneNo: string;
  dateOfBirth: string;
  gender: string;
  offersNotification: boolean | null;
  profilePicture: string;
  status: string;
  remarks: string | null;
  billingAddress: {
    firstName: string;
    lastName: string;
    mobile: string;
    backupMobile: string | null;
    address: string;
    zoneName: string;
    cityName: string;
    provinceName: string;
    countryName: string;
  }[];
}
import RootEdit from "./RootEdit";
const page = ({ params }: { params: { uuid: string } }) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const IdData = params.uuid;

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/endUser/show/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data = await res.json();
        setUserData(data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData(IdData);
  }, [IdData]);

  const SkeletonInfoItem = ({
    icon: Icon,
    label,
  }: {
    icon: React.ElementType;
    label: string;
  }) => (
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="font-medium text-sm text-gray-700">{label}:</span>
      <Skeleton className="h-4 w-32" />
    </div>
  );
  const SkeletonInput = () => (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded-md"></div>
    </div>
  );
  return loading ? (
    <div className="h-full w-full p-4 space-y-6">
      {/* Profile Skeleton */}
      <div className="flex flex-col items-center space-y-2">
        <Skeleton className="w-14 h-14 rounded-full" />
        <Skeleton className="w-32 h-5" />
        <Skeleton className="w-16 h-4" />
      </div>
      <Separator />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
        {/* Left Section Skeleton */}
        <div>
          <Skeleton className="w-40 h-6 mb-4" />
          <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-1/2 h-10" />
          </div>
        </div>
        {/* Right Section Skeleton */}
        <div>
          <Skeleton className="w-40 h-6 mb-4" />
          <div className="space-y-4">
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-full h-10" />
            <Skeleton className="w-1/2 h-10" />
          </div>
        </div>
      </div>
      <Skeleton className="w-24 h-10" />
    </div>
  ) : (
    <RootEdit userData={userData} loading={loading} IdData={IdData} />
  );
};
export default page;
