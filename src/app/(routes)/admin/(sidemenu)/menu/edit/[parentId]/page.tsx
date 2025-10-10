'use client';
import AddMenu from './Form';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';

interface menuData {
  id: number;
title: string;
 url: string;
  icon: string;
}

const EditPage = ({ params }: { params: { parentId: string } }) => {
  const [menuData, setMenuData] = useState<menuData | undefined>();
  const { toast } = useToast();
 
  useEffect(() => {
    const getSingleData = async (id: string) => {
      try {
        const { data } = await axios.get(`/api/menu/menu-show/${id}`);
        console.log("data of show", data)
        if (data) {
          setMenuData(data.data);
        }
        
      } catch (error) {
        toast({
          title: 'Menu detail could not be fetched',
          description: `${error}`,
          variant: 'destructive',
        });
      }
    };
    getSingleData(params.parentId);
  }, []);
  return <AddMenu parentId={params.parentId} menuData={menuData} />;
};

export default EditPage;
