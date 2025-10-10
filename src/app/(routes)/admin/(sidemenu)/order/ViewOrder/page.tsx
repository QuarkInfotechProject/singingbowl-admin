"use client"
import { CorporateOrderResponse } from '@/app/_types/order-Types/orderShow';
import React, { useEffect, useState } from 'react';
import Loading from '../loading';



const OrderPageView = ({ dataId }: {  dataId:number}) => {
  const [orderShow, setOrderShow] = useState<CorporateOrderResponse | null>(null);



 
  useEffect(() => {
    const getData = async (id:number) => {
      const url = `/api/order/show/${id}`;
      try {
        const res = await fetch(url, { method: 'GET' });
        const data: CorporateOrderResponse = await res.json();
        setOrderShow(data);
      } catch (error) {
        console.error('Failed to fetch order data:', error);
      }
    };
    getData(dataId);
  }, [dataId]);

  if (!orderShow) return <div><Loading></Loading></div>;

  const { firstName, lastName, companyName, email, phone, quantity, requirement } = orderShow.data;

  return (
    <>
     
     <h1 className="text-left font-bold text-2xl ml-2 ">Order View</h1>
       <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-8">
        <p className="font-bold">Name:</p>
        <p>{`${firstName} ${lastName}`}</p>
      </div>
      <div className="flex flex-row gap-4">
        <p className="font-bold">Company Name:</p>
        <p>{companyName}</p>
      </div>
      <div className="flex flex-row gap-4">
        <p className="font-bold">Email:</p>
        <p>{email}</p>
      </div>
      <div className="flex flex-row gap-4">
        <p className="font-bold">Phone Number:</p>
        <p>{phone}</p>
      </div>
      <div className="flex flex-row gap-4">
        <p className="font-bold">Quantity:</p>
        <p>{quantity}</p>
      </div>
      <div className="flex flex-row gap-4">
        <p className="font-bold">Requirement:</p>
        <p>{requirement}</p>
      </div>
    </div>
    </>
   
  );
};

export default OrderPageView;
