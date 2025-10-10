'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loading from '../Loading';
import { useToast } from '@/components/ui/use-toast';
import { AdminUserData } from '@/app/_types/adminUser-Types/adminShow';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { Group } from '@/app/_types/group-Types/groupType';
import { Skeleton } from '@/components/ui/skeleton';


 

export default function UserDetailsPage({ setRefetch, DataId,setIsDialogOpen }: any 
 ) {
   
  const [userData, setUserData] = useState< AdminUserData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [groupData, setGroupData] = useState<{ [key: string]: string }>({});


  useEffect(() => {
  
      const fetchData = async () => {
        try {
         
          const res = await fetch(
            `/api/adminUser/adminUserShow/${DataId}`,{
              method: 'GET',
            }
          );
          const data = await res.json();
         



            setUserData(data.data);
           
        
          setLoading(false);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setLoading(false);
          
        }
      };

     
    
    const fetchGroupData = async () => {
      try {
        const res = await fetch(`/api/group`, {
          method: 'GET',
        });
        const data = await res.json();
        const groupMap: { [key: string]: string } = {};
        data.data.data.forEach((group:Group) => {
          groupMap[group.id] = group.name;
        });
        setGroupData(groupMap);
      
      } catch (error) {
        console.error('Error fetching group data:', error);
      
      }
    };

    fetchData();
    fetchGroupData();
  
  }, [DataId]);
  const renderStatus = (status: number) => (
    <span>
      {status === 1 ? (
        <p className=" text-green-500 font-normal text-sm border border-green-100  rounded-full px-1 py-1 text-center bg-green-100 bg-opacity-95  ">
        Active
      </p>
      ) : status === 2 ? (
        <p className=" text-blue-500 font-normal text-sm border border-blue-100  rounded-full px-1 py-1 text-center bg-blue-100 bg-opacity-95"> Inactive </p>
      ) : (
        <p className=" text-red-500 font-normal text-sm border border-red-100  rounded-full px-1 py-1 text-center bg-red-100 bg-opacity-95"> Deleted </p>
      )}
    </span>
  );
  return (
    <div className='select-none'>

      <h1 className="text-2xl font-bold  mt-2">Admin User Detail</h1>
   
      {loading ? (
   <div className="space-y-4 mt-4">
   {/* Name section */}
   <div className="flex items-center">
     <Skeleton className="w-[15%] h-6" /> 
     <Skeleton className="w-2/3 h-6 ml-2" /> 
   </div>

   {/* Email section */}
   <div className="flex items-center">
     <Skeleton className="w-[15%] h-6" /> 
     <Skeleton className="w-2/3 h-6 ml-2" /> 
   </div>

   {/* Group section */}
   <div className="flex items-center">
     <Skeleton className="w-[15%] h-6" /> 
     <Skeleton className="w-2/3 h-6 ml-2" /> 
   </div>

   {/* Status section */}
   <div className="flex items-center">
     <Skeleton className="w-[15%] h-6" /> 
     <Skeleton className="w-32 h-6 ml-2" /> 
   </div>
 </div>
      ) : (
      
         
         <div className="space-y-4">
   
      <div className="flex items-center">
     
      </div>
      <div className="flex items-center">
        <label className="w-[15%] font-semibold">Name : </label>
        <p className="w-2/3  px-2 py-1 rounded dark:text-white bg-transparent ">
          {userData?.fullName}
        </p>
      </div>
      <div className="flex items-center">
        <label className="w-[15%] font-semibold">Email : </label>
        <p className="w-2/3  px-2 py-1 rounded dark:text-white bg-transparent ">
          {userData?.email}
        </p>
      </div>
      <div className="flex items-center">
        <label className="w-[15%] font-semibold">Group : </label>
        <p className="w-2/3  px-2 py-1 rounded dark:text-white bg-transparent ">
        {userData?.groupId === 1 ? "Super Admin" : userData?.groupId ? groupData[userData.groupId] : "N/A"}
        {/* {userData?.groupId ? groupData[userData.groupId] : 'N/A'} */}
        </p>
      </div>
      <div className="flex items-center">
        <label className="w-[15%] font-semibold">Status : </label>
        <p className="w-20  px-1 py-1 rounded dark:text-white bg-transparent ">
       {renderStatus(userData?.status)} 
        </p>
      </div>
      
        
        </div>
      )}
    </div>
  );
}
