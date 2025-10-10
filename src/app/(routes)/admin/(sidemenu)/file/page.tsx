"use client";

import { FileResponse } from '@/app/_types/media_Types/file_Types/fileTypes';
import React from 'react'
import { useState, useEffect } from 'react';
import RootMedia from './RootMedia';
import Loading from './Loading';


const Filepage = ({fileShowCategory,setFileShowCategory }:{fileShowCategory: FileResponse | null; setFileShowCategory:React.Dispatch<React.SetStateAction<FileResponse | null>>; }) => {
 

    const [refetch, setRefetch] = useState(false);
    const[isLoading,setIsLoading]=useState(false);

    useEffect(() => {
     
    
        const fetchData = async () => {
          try {
            setIsLoading(true)
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
          }finally{
            setIsLoading(false)
          }
        };
    
       fetchData()
       setRefetch(false);
   
    }, [refetch]);
   
  return (
    <>
       {/* {isLoading ? (
        <Loading></Loading>
      ) : ( */}
    <div>
<RootMedia  fileShowCategory={fileShowCategory}  setRefetch={setRefetch} refetch={refetch} />
    </div>
      {/* )} */}
    </>
  )
}

export default  Filepage