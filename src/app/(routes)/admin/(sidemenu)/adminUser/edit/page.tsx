'use client';

import { AdminUserData } from '@/app/_types/adminUser-Types/adminShow';

import RootEdit from './RootEdit';
import { useState, useEffect } from 'react';

const AdminUserEdit = ({setIsSheetOpens,DataId,setRefetch }: any) => {
  const [editData, setEditData] = useState <AdminUserData | null>(null);  
  useEffect(() => {
    
    const getData = async () => {
      const url = `/api/adminUser/adminUserShow/${DataId}`;
      try {
        const res = await fetch(url, {
          method: 'GET',
        });

        const data = await res.json();
        setEditData(data.data);
      } catch (error) {}
    };
    getData();

  }, []);
 

  return  <RootEdit editData={editData} setRefetch={setRefetch} setIsSheetOpens={setIsSheetOpens} /> ;
};

export default AdminUserEdit;
