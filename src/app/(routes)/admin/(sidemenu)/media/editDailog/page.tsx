'use client';
import { FileShowResponse } from '@/app/_types/media_Types/fileCategoryShow_Types/fileCategoryShowType';
import RootEdit from './RootEdit';

import { useState, useEffect } from 'react';

const Mediaedit = ({  setIsSheetOpens,dataUrl }: {  setIsSheetOpens:any;dataUrl:any; }) => {
  const [editMediaData, setEditMediaData] = useState<FileShowResponse | null>(null);
  useEffect(() => {
   
    const getDatas = async () => {
      
      const urls = `/api/mediaCategory/show/${dataUrl}`;
      try {
        const res = await fetch(urls, {
          method: 'GET',
        });
        const data = await res.json();
        console.log("data of media ",data.data)
        setEditMediaData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getDatas();
  }, []);

  const fileId = dataUrl;
 

  return <RootEdit editMediaData={editMediaData} fileId={fileId} setIsSheetOpens={setIsSheetOpens}/>;
};

export default Mediaedit;
