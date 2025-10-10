'use client';

import { DeliveryCharge } from '@/app/_types/delivery-Types/deliveryCharges';
import RootDeliveryUpdate  from './RootEdit';
import { useState, useEffect } from 'react';

const DeliveryEdit = ({  setIsSheetOpens,dataId,setRefetch}: { setIsSheetOpens:any;dataId:number;setRefetch:any;}) => {
  const [deliveryData, setDeliveryData] = useState<DeliveryCharge | undefined>(
    undefined
  );
  useEffect(() => {
    const getData = async (id:number) => {
      const url = `/api/delivery-charge/show/${id}`;
      try {
        const res = await fetch(url, {
          method: 'GET',
        });
        const data = await res.json();
        setDeliveryData(data.data);
    
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    getData(dataId);
  }, []);

  return  <RootDeliveryUpdate deliveryData={deliveryData} setIsSheetOpens={setIsSheetOpens} dataId={dataId} setRefetch={setRefetch} /> ;
};

export default DeliveryEdit;
