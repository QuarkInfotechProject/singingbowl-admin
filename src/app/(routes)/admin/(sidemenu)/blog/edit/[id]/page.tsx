'use client';
import { EmailEditResponseT } from '@/app/_types/email-Types/emailTypesEdit';
import RootEdit from './RootEdit';
import { PostData } from '@/app/_types/blog_Types/blogShowType';
import { useState, useEffect } from 'react';

const BlogEdit = ({ params }: { params: { id: string } }) => {
  const [editData, setEditData] = useState<PostData | undefined>(
    undefined
  );
  useEffect(() => {
    const getData = async (id:string) => {
      const url = `/api/Blog/show/${id}`;
      try {
        const res = await fetch(url, {
          method: 'GET',
        });
        const data = await res.json();
        setEditData(data);
      } catch (error) {}
    };
    getData(params.id);
  }, [params.id]);


  return editData ? <RootEdit editData={editData} id={params.id} /> : null;
};

export default BlogEdit;
