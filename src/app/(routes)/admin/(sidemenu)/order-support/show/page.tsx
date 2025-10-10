"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { IoIosArrowBack } from 'react-icons/io';
import { FaUser, FaPhone, FaEnvelope, FaHashtag, FaImage } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { MdOutlinePayment } from 'react-icons/md';
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
      const url = `/api/orderSupport/show/${id}`;
      try {
        setIsLoading(true);
        const res = await fetch(url, { method: 'GET' });
        const data = await res.json();
        setOrderShow(data);
      } catch (error) {
        console.error('Failed to fetch order data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    getDatas(IdData);
  }, [IdData]);

  const handleBack = () => {
    router.push('/admin/order-support');
  };

  const InfoItem = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string | null | undefined }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex items-center space-x-2 text-gray-700"
    >
      <Icon className="text-primary" />
      <span className="font-semibold">{label}:</span>
      <span>{value || 'N/A'}</span>
    </motion.div>
  );

  const SkeletonLoader = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-6 w-2/3" />
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-semibold text-gray-800">Order Support</CardTitle>
       
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <InfoItem icon={FaHashtag} label="Order ID" value={orderShow?.data?.orderId} />
              {orderShow?.data.paymentTransactionId && (
                <InfoItem icon={MdOutlinePayment} label="Payment Transaction ID" value={orderShow?.data?.paymentTransactionId} />
              )}
              <InfoItem icon={FaUser} label="Name" value={orderShow?.data?.name} />
              <InfoItem icon={FaEnvelope} label="Email" value={orderShow?.data?.email} />
              <InfoItem icon={FaPhone} label="Phone" value={orderShow?.data?.phone} />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-4"
            >
              <InfoItem icon={FaMessage} label="Message" value={orderShow?.data?.message} />
              {orderShow?.data?.image && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="space-y-2"
                >
                  <div className="flex items-center space-x-2 text-gray-700">
                    <FaImage className="text-primary" />
                    <span className="font-semibold">Attachment:</span>
                  </div>
                  <img
                    src={orderShow.data.image}
                    alt="Attachment"
                    className="mt-2 max-w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                  />
                </motion.div>
              )}
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default View;
