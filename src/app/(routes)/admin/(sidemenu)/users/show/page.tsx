"use client";

import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Phone, Calendar, MapPin, Bell, UserCheck } from 'lucide-react';

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

const WarrantyClaimShow = ({  IdData }: any) => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/endUser/show/${id}`;
      try {
        const res = await fetch(url, { method: 'GET' });
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

  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | number | undefined | null }) => (
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-medium text-sm text-gray-700">{label}:</span>
      <span className="text-gray-900">{value || 'N/A'}</span>
    </div>
  );

  const SkeletonInfoItem = ({ icon: Icon, label }: { icon: React.ElementType, label: string }) => (
    <div className="flex items-center space-x-2 mb-1">
      <Icon className="w-5 h-5 text-gray-500" />
      <span className="font-medium text-sm text-gray-700">{label}:</span>
      <Skeleton className="h-4 w-32" />
    </div>
  );
  
  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
<Card className=" mx-auto bg-white w-full rounded-lg ">
  <CardHeader className="text-start pb-1 p-4 justify-between flex flex-row">
    <CardTitle className="text-xl font-semibold text-primary">User Profile</CardTitle>
    <Badge variant={userData?.status === 'Active' ? 'default' : 'secondary'} className="mt-1">
            {userData?.status}
          </Badge>
  </CardHeader>
  <CardContent className="px-3 py-2">
    <div className="flex flex-col items-center space-y-1">
      {loading ? (
        <>
          <Skeleton className="w-14 h-14 rounded-full" />
          <Skeleton className="h-5 w-32 mt-1" />
          <Skeleton className="h-4 w-16 mt-1" />
        </>
      ) : (
        <>
          <Avatar className="w-14 h-14">
            <AvatarImage src={userData?.profilePicture} />
            <AvatarFallback>{getInitials(userData?.fullName)}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-medium">{userData?.fullName}</h2>
          
        </>
      )}
    </div>

    <Separator className="my-2" />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 text-sm">
      <div>
        <h3 className="text-lg font-semibold mb-1">Personal Information</h3>
        {loading ? (
          <>
            <SkeletonInfoItem icon={Mail} label="Email" />
            <SkeletonInfoItem icon={Phone} label="Phone" />
            <SkeletonInfoItem icon={Calendar} label="Date of Birth" />
            <SkeletonInfoItem icon={User} label="Gender" />
            <SkeletonInfoItem icon={Bell} label="Offers Notification" />
          </>
        ) : (
          <>
            <InfoItem icon={Mail} label="Email" value={userData?.email} />
            <InfoItem icon={Phone} label="Phone" value={userData?.phoneNo} />
            <InfoItem icon={Calendar} label="Date of Birth" value={userData?.dateOfBirth} />
            <InfoItem icon={User} label="Gender" value={userData?.gender} />
            <InfoItem icon={Bell} label="Offers Notification" value={userData?.offersNotification ? 'Enabled' : 'Disabled'} />
          </>
        )}
      </div>

      <div>
        {loading ? (
          <>
            <h3 className="text-lg font-semibold mb-1">Billing Address</h3>
            <SkeletonInfoItem icon={UserCheck} label="Name" />
            <SkeletonInfoItem icon={Phone} label="Mobile" />
            <SkeletonInfoItem icon={MapPin} label="Address" />
            <SkeletonInfoItem icon={MapPin} label="City" />
            <SkeletonInfoItem icon={MapPin} label="Province" />
            <SkeletonInfoItem icon={MapPin} label="Country" />
          </>
        ) : (
          userData?.billingAddress[0] && (
            <>
              <h3 className="text-lg font-semibold mb-1">Billing Address</h3>
              <InfoItem icon={UserCheck}  label="Name" value={`${userData.billingAddress[0].firstName} ${userData.billingAddress[0].lastName}`} />
              <InfoItem icon={Phone} label="Mobile" value={userData.billingAddress[0].mobile} />
              <InfoItem icon={MapPin} label="Address" value={`${userData.billingAddress[0].address}, ${userData.billingAddress[0].zoneName}`} />
              <InfoItem icon={MapPin} label="City" value={userData.billingAddress[0].cityName} />
              <InfoItem icon={MapPin} label="Province" value={userData.billingAddress[0].provinceName} />
              <InfoItem icon={MapPin} label="Country" value={userData.billingAddress[0].countryName} />
            </>
          )
        )}
      </div>
    </div>

    {loading ? (
      <div className="mt-3">
        <h3 className="text-md font-semibold mb-1">Remarks</h3>
        <Skeleton className="h-6 w-full" />
      </div>
    ) : (
      userData?.remarks && (
        <div className="mt-3 h-auto overflow-y-auto">
          <h3 className="text-sm font-semibold mb-1">Remarks</h3>
          <p className="text-gray-700 text-sm">{userData.remarks}</p>
        </div>
      )
    )}
  </CardContent>
</Card>


  );
};

export default WarrantyClaimShow;