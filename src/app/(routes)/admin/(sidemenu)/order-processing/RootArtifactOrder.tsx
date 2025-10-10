import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FaDownload, FaSync } from "react-icons/fa";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

const RootArtifactOrder = () => {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const { toast } = useToast();

  const getOrder = async () => {
    try {
      setLoading(true);
      const url = `/api/orderProcess/orderArtifact`;
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      setOrderData(data.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch order artifacts.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
    setRefetch(false);
  }, [refetch]);

  const handleRefresh = () => {
    setRefetch(true);
  };

  const handleDownload = (filePath) => {
    try {
      // Create a link element
      const link = document.createElement('a');
      link.href = filePath;
      
      // Set the download attribute with the filename
      link.download = filePath.split('/').pop();
      
      // Append to the body (required for Firefox)
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Remove the link from the body
      document.body.removeChild(link);

      toast({
        title: "Success",
        description: "File download initiated.",
        variant: "default",
      });
    } catch (error) {
      console.error("Failed to initiate download:", error);
      toast({
        title: "Error",
        description: "Failed to initiate the file download.",
        variant: "destructive",
      });
    }
  };

  

  return (
    <Card className="w-full h-[380px] overflow-auto scrollbar-visible p-0 select-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0  p-2">
        <CardTitle className="text-2xl font-bold">Order Artifacts</CardTitle>
        <Button className="bg-blue-500 hover:bg-blue-600" onClick={handleRefresh} disabled={loading}>
          <FaSync className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </CardHeader>
      <CardContent className='p-0'>
        {loading ? (
         <Table>
         <TableHeader>
           <TableRow>
             <TableHead>Date</TableHead>
             <TableHead>File Name</TableHead>
             <TableHead>Order Count</TableHead>
             <TableHead>Shipping Company</TableHead>
             <TableHead>Actions</TableHead>
           </TableRow>
         </TableHeader>
         <TableBody >
           {Array.from({ length: 2 }).map((_, index) => (
             <TableRow key={index}>
               <TableCell>
                 <Skeleton className="h-10 w-full" />
               </TableCell>
               <TableCell>
                 <Skeleton className="h-10 w-full" />
               </TableCell>
               <TableCell>
                 <Skeleton className="h-10 w-full" />
               </TableCell>
               <TableCell>
                 <Skeleton className="h-10 w-full" />
               </TableCell>
               <TableCell>
                 <Skeleton className="h-10 w-full" />
               </TableCell>
             </TableRow>
           ))}
         </TableBody>
       </Table>
        ) : (
          <Table className='p-0'   >
            <TableHeader>
              <TableRow className='text-xs'>
                <TableHead>Date</TableHead>
                <TableHead>File Name</TableHead>
                <TableHead>Order Count</TableHead>
                <TableHead>Shipping Company</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderData && orderData.map((item, index) => (
                <TableRow key={index} className='text-xs items-center text-center '>
                  <TableCell className='p-2 font-medium'>{new Date(item.date).toLocaleString()}</TableCell>
                  <TableCell  className='p-1'>{item.fileName}</TableCell>
                  <TableCell className='p-1'>
                    <Badge variant="secondary">{item.OrderCount}</Badge>
                  </TableCell>
                  <TableCell className='p-1'>{item.shippingCompany || 'N/A'}</TableCell>
                  <TableCell className='p-1'>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="icon"
                            onClick={() => handleDownload(item.filePath)}
                          >
                            <FaDownload className="h-3 w-3" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Download Artifact</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RootArtifactOrder;