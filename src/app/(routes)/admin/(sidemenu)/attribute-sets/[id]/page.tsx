'use client';

import React, {  useEffect, useState } from 'react'
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Table, TableCell, TableHead, TableRow } from '@/components/ui/table';
import Loading from '../../category/Loading';



type Tag = {
    id: number;
    name: string;
    url: string;
  };

const AttributesSetsView = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [tag, setTag] = useState<Tag | null>(null);


  useEffect(() => {
    const handleOpen = async () => {
        try {

          const res = await axios.get(`/api/attribute-sets/specific/${params.id}`);
          if (res.status === 200) {
            setTag(res.data.data);
          }
        } catch (error) {
          if (axios.isAxiosError(error)) {
            toast({
              description: error.response?.data?.message || error.message,
              variant: 'destructive',
            });
          } else {
            toast({
              title: `Unexpected Error`,
              description: `${error}`,
              variant: 'destructive',
            });
          }
        }
      }

      handleOpen();
  },[]);

  return (
    <div>
         {tag && (
        <span>Additional Details of <span className="font-bold">{tag.name}</span></span>
        )}
      {tag ? (
        <Table>
        <TableRow>
          <TableHead className="w-[220px] capitalize font-semibold">Name</TableHead>
          <TableCell>{tag.name}</TableCell>
        </TableRow>
        <TableRow>
          <TableHead className="w-[220px] capitalize font-semibold">url</TableHead>
          <TableCell>{tag.url}</TableCell>
        </TableRow>
        </Table>
      ) : (
       <Loading />
      )}
    </div>
  );
  
}

export default AttributesSetsView
