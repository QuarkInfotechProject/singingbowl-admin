'use client';
import { EmailEditResponseT } from '@/app/_types/email-Types/emailTypesEdit';
import RootEdit from './RootEdit';
import { useState, useEffect } from 'react';

const Emailedit = ({ params }: { params: { emailName: string } }) => {
  const [editData, setEditData] = useState<EmailEditResponseT | undefined>(
    undefined
  );
  useEffect(() => {
    const getData = async (name:string) => {
      const url = `/api/email/view/${name}`;
      try {
        const res = await fetch(url, {
          method: 'GET',
        });
        const data = await res.json();
        setEditData(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    }
    getData(params.emailName);
  }, []);


  return editData ? <RootEdit editData={editData} name={params.emailName} /> : null;
};

export default Emailedit;
