'use client';
import RootMediaEdit from './RootMediaEdit';
import { FileApiResponse } from '@/app/_types/media_Types/fileShow_Types/fileShowTypes';
import { useState, useEffect } from 'react';
import Loading from './loading';
import { Skeleton } from '../ui/skeleton';

const EditFile = ({fileIds,setIsEditDialogOpen,isEditDialogopen,onClickTab}:{fileIds:any,setIsEditDialogOpen:any,isEditDialogopen:any,onClickTab:any}) => {
  console.log("fileIds",fileIds)
  const [editMediaData, setEditMediaData] = useState<FileApiResponse | null>(null);
  const [refetch, setRefetch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const getData = async (id: string) => {

      const url = `/api/media/show/${id}`;
      try {
        setIsLoading(true);
        const res = await fetch(url, {
          method: 'GET',
        });
        const data = await res.json();
        setEditMediaData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }finally {
        setIsLoading(false);
      }
    };
    getData(fileIds);
    setRefetch(false)
  }, [refetch]);

  console.log(editMediaData)
  const fileId = fileIds;
 
  return(
  <>
   {isLoading ? (
    <>
        <Skeleton className="w-28 h-28 items-center" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-10 w-[80%]" />
        <Skeleton className="h-10 w-[80%]" />
        <Skeleton className="h-10 w-[80%]" />
        <Skeleton className="h-10 w-[80%]" />
        <Skeleton className="h-10 w-[80%]" />
        </>
      ) : (
  <div>
    <RootMediaEdit editMediaData={editMediaData} setRefetch={setRefetch} fileId={fileId} onClickTab={onClickTab} setIsEditDialogOpen={setIsEditDialogOpen}/>
    </div>
      )}
    </>
)};

export default EditFile;
