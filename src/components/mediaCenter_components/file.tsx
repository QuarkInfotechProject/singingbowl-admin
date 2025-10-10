"use client";

import { FileResponse } from '@/app/_types/media_Types/file_Types/fileTypes';
import React from 'react'
import { useState, useEffect } from 'react';
import FileMedia from './fileMedia';
import Loading from './loading';
import { Skeleton } from '../ui/skeleton';


const File = ({fileShowCategory,setFileShowCategory,onLogoClick,setSelectedUrl,setSelectedId,setSelectedImagePreview,
 
  setIsEditDialogOpen, setSelectedFileId ,isEditDialogOpen,selectedFileId}:{fileShowCategory: FileResponse | null;
  onLogoClick:(data:any)=>void; handleInsert:any; isEditDialogOpen:any; selectedFileId:any;
  setIsEditDialogOpen:any ;setSelectedFileId:(data:any)=>void; setSelectedUrl:any,setSelectedId:any; setSelectedImagePreview:any; setFileShowCategory:React.Dispatch<React.SetStateAction<FileResponse | null>>; }) => {
 
   
    const [refetch, setRefetch] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
     
    
        const fetchData = async () => {
          try {
            setIsLoading(true);
            const res = await fetch(`/api/media`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({}),
            });
            const data = await res.json();
            setFileShowCategory(data);
          } catch (error) {
            console.error('Error fetching media:', error);
          } finally {
            setIsLoading(false);
          }
        }
       fetchData();

    }, [refetch]);
   
  return (
    <div>
       {isLoading ? (
       <div className="flex flex-row gap-2">
       {Array(6)
         .fill(0)
         .map((_, index) => (
           <Skeleton
             key={index}
             className="h-[100px] w-[100px] mx-auto border rounded-sm bg-gray-300"
           />
         ))}
     </div>
      ) : (
        <div>
<FileMedia 
fileShowCategory={fileShowCategory}
isEditDialogOpen={isEditDialogOpen} selectedFileId={selectedFileId}
setIsEditDialogOpen={setIsEditDialogOpen} setSelectedFileId ={setSelectedFileId}
  setRefetch={setRefetch} 
  refetch={refetch}
  setSelectedImagePreview={setSelectedImagePreview}
  
  setSelectedUrl={setSelectedUrl}
  setSelectedId={setSelectedId}
      
   onLogoClick={onLogoClick} />
   </div>
      )}
    </div>
  )
}

export default File