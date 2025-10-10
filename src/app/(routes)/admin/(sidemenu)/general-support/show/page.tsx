"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUser, FaPhone, FaEnvelope,FaCalendar } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
// import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const View = ({ setIsSheetOpen, setRefetch, IdData }: any) => {
  const [orderShow, setOrderShow] = useState<OrderApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const getDatas = async (id: string) => {
      const url = `/api/generalSupport/show/${id}`;
      try {
        setIsLoading(true);
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        setOrderShow(data);
      } catch (error) {
        console.error('Failed to fetch support data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getDatas(IdData);
  }, [IdData]);

  const handleBack = () => {
    router.push('/admin/general-support');
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null | undefined }) => (
    <div
      // initial={{ opacity: 0, y: 20 }}
      // animate={{ opacity: 1, y: 0 }}
      // transition={{ duration: 0.3 }}
      className="flex items-start space-x-3 text-gray-700"
    >
      <Icon className="text-primary mt-1 flex-shrink-0" />
      <div>
        <span className="font-semibold">{label}:</span>
        <p className="mt-1">{value || 'N/A'}</p>
      </div>
    </div>
  );
  const SkeletonLoader = () => (
    <div className="space-y-6">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  return (
    <Card className="w-full  max-w-4xl mx-auto">
      <CardHeader className=" flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-semibold text-gray-800">General Support Details</CardTitle>
       
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div
            // initial={{ opacity: 0 }}
            // animate={{ opacity: 1 }}
            // transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <div className="space-y-6">
              <InfoItem icon={FaUser} label="Name" value={orderShow?.data?.name} />
              <InfoItem icon={FaEnvelope} label="Email" value={orderShow?.data?.email} />
              <InfoItem icon={FaPhone} label="Phone" value={orderShow?.data?.phone} />
            </div>
            <div className="space-y-6">
              <InfoItem icon={FaMessage} label="Message" value={orderShow?.data?.message} />
              <InfoItem icon={FaCalendar} label="submittedAt" value={orderShow?.data?.submittedAt	} />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default View;