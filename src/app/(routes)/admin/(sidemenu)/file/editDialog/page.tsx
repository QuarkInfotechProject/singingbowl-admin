'use client';
import RootMediaEdit from './RootMedia';
import { FileApiResponse } from '@/app/_types/media_Types/fileShow_Types/fileShowTypes';
import { useState, useEffect } from 'react';


const Fileedit = ({ setIsDailogOpen,dataId,setRefetch}: { setIsDailogOpen:any;dataId:any;setRefetch:any; }) => {
  const [editMediaData, setEditMediaData] = useState<FileApiResponse | null>(null);
  useEffect(() => {
    const getData = async () => {
      const url = `/api/media/show/${dataId}`;
      try {
        const res = await fetch(url, {
          method: 'GET',
        });
        const data = await res.json();
        setEditMediaData(data);
      } catch (error) {}
    }
    getData();
  }, []);

  const fileId = dataId;
  return <RootMediaEdit editMediaData={editMediaData} fileId={fileId} setIsDailogOpen={setIsDailogOpen} setRefetch={setRefetch}/>;
};

export default Fileedit;
