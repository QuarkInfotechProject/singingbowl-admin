"use client";
import { OrderApiResponse } from "@/app/_types/orderType/showType";
import React, { useEffect, useState } from "react";
import RootEdit from "./RootEdit";
import { Skeleton } from "@/components/ui/skeleton";
import axios from "axios";

const Page = ({ params }: { params: { id: string } }) => {
  const id = params.id;
  const [loading, setLoading] = useState(false);
  const [shippingData, setShippingData] = useState<any>();

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/orderDetails/showDetail/${id}`;
      setLoading(true);
      try {
        const res = await fetch(url, { method: "GET" });
        const data: OrderApiResponse = await res.json();
        setShippingData(data?.data?.addressInformation);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData(id);
  }, [id]);

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/orderDetails/showDetail/${id}`;
      setLoading(true);
      try {
        const res = await fetch(url, { method: "GET" });
        const data: OrderApiResponse = await res.json();
        setShippingData(data?.data?.addressInformation);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      } finally {
        setLoading(false);
      }
    };
    getData(id);
  }, []);

 
  return (
    <div>
      {loading ? (
        <div className="h-full w-full p-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 space-y-4">
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

          <Skeleton className="w-24 h-10 mt-6" />
        </div>
      ) : (
        <div>
          <RootEdit id={id} editData={shippingData} />
        </div>
      )}
    </div>
  );
};

export default Page;
