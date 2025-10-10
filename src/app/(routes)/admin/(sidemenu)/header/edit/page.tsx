'use client';

// import RootEdit from './RootEdit';

import { useState, useEffect } from 'react';
import { ApiResponse } from '@/app/_types/inThepress-Types/inThePressShow';
import RootEdit from './RootEdit';


const Rootedit = ({  setIsSheetOpens,dataId,setRefetch }: {  setIsSheetOpens:any;dataId:number;setRefetch:any; }) => {
  const [editContentData, setEditContentData] = useState<ApiResponse | null>(null);
  
  useEffect(() => {
   
    const getDatas = async () => {
      
      const urls = `/api/header/show/${dataId}`;
      try {
        const res = await fetch(urls, {
          method: 'GET',
        });
        const data = await res.json();
        console.log("data of media ",data.data)
        setEditContentData(data.data);
        
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getDatas();
  }, []);

  const fileId = dataId;
  console.log("here is ddata",editContentData)
 

  return <RootEdit editContentData={editContentData} fileId={fileId} setIsSheetOpens={setIsSheetOpens} setRefetch={setRefetch}/>;
};

export default Rootedit;
