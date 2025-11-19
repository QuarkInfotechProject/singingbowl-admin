'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import Loading from '../loading';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { DeliveryCharge } from '@/app/_types/delivery-Types/deliveryCharges';
import { ApiDeliveryResponse } from '@/app/_types/delivery-Types/deliveryCharges';
import { Skeleton } from '@/components/ui/skeleton';

const RootDeliveryUpdate = ({
    
    setIsSheetOpens,dataId,setRefetch,deliveryData
}: {
    setIsSheetOpens:any;dataId:number;setRefetch:any; deliveryData : DeliveryCharge | undefined ;
}) => {
  const router = useRouter();

  const formSchema = z.object({
    description: z
      .string().optional(),
      deliveryCharge: z
      .string().optional(),
      additionalChargePerItem:z.string().optional(),
      weightBasedCharge:z.string().optional()

  });

  

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  
  const { toast } = useToast();
//   const [deliveryData,setDeliveryData] = useState< ApiDeliveryResponse |null>(null)


//   useEffect(() => {
   
//     const getDatas = async () => {
      
//       const urls = `/api/delivery/show/${dataId}`;
//       try {
//         const res = await fetch(urls, {
//           method: 'GET',
//         });
//         const data = await res.json();
//         console.log("data of media ",data.data)
//         setDeliveryData(data);
//       } catch (error) {}
//     };
//     getDatas();
//   }, [])
  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const newData = {
        id: dataId, 
        description:data.description,
        deliveryCharge:data.deliveryCharge,
        additionalChargePerItem:data.additionalChargePerItem,
        weightBasedCharge:data.weightBasedCharge
      };
    const apiurl = `/api/delivery-charge/update`;
   

    try {
      const res = await fetch(apiurl,{ 
        method: 'POST',
        body: JSON.stringify(newData),
        headers: {
          'Content-Type': 'application/json',
        },
        
        
      });

      if (res.status === 200) {
        // router.push(`/admin/delivery-charges`);
        toast({
          title: 'Update Successful',
          description: 'Data has been updated successfully.',
        });
        setIsSheetOpens(false);
        setRefetch(true);
      } else {
        toast({
          title: 'Update Failed',
          description: 'There was an issue updating the data.',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occrred while updating data.',
      });
    }
  };
  const { setValue } = form;
  const [isLoading, setLoading] = useState(true);
  
  useEffect(() => {
    if (deliveryData) {
        setValue('description', deliveryData.description || '');
        setValue('deliveryCharge', deliveryData.deliveryCharge || '');
        setValue('additionalChargePerItem', deliveryData.deliveryCharge || '');
        setValue('weightBasedCharge', deliveryData.weightBasedCharge || '');

        setLoading(false);
    }
}, [deliveryData, setValue]);

  return (
    <Form {...form}>
      <div className="">
        <div className=" h-full w-96 mx-auto">
          <h1 className="text-left mb-2 font-bold text-2xl ">Update Delivery Charge</h1>
          {isLoading ? (
                <div className=" h-full w-96 mx-auto">
                {/* <h1 className="text-left mb-2 font-bold text-2xl ">Edit Delivery Charge</h1> */}
                {isLoading ? (
                 <div className="space-y-6 w-full my-auto">
                 {/* Description Field */}
                 <div className="mt-6">
                   <div className="mb-2">
                     <Skeleton className="h-6 w-32" /> {/* Placeholder for FormLabel */}
                   </div>
                   <Skeleton className="h-20 w-full" /> {/* Placeholder for Textarea */}
                 </div>
         
                 {/* Delivery Charge Field */}
                 <div className="mt-4">
                   <div className="mb-2">
                     <Skeleton className="h-6 w-32" /> {/* Placeholder for FormLabel */}
                   </div>
                   <Skeleton className="h-10 w-full" /> {/* Placeholder for Input */}
                 </div>
         
                 {/* Additional Charge Per Item Field */}
                 <div className="mt-4">
                   <div className="mb-2">
                     <Skeleton className="h-6 w-32" /> {/* Placeholder for FormLabel */}
                   </div>
                   <Skeleton className="h-10 w-full" /> {/* Placeholder for Input */}
                 </div>
         
                 {/* Weight Based Charge Field */}
                 <div className="mt-4">
                   <div className="mb-2">
                     <Skeleton className="h-6 w-32" /> {/* Placeholder for FormLabel */}
                   </div>
                   <Skeleton className="h-10 w-full" /> {/* Placeholder for Input */}
                 </div>
         
                 {/* Submit Button */}
                 
               </div>
                ) : (
      
                  
      
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6  w-full my-auto "
                  >
                   {/* {deliveryData?.data.map((item:DeliveryCharge)=>{ */}
                    <div>
                   
                     <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className='mt-6'>
                            <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Description"
                              defaultValue={deliveryData?.description ||""}
                              {...field}
                             
                              className="border-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="deliveryCharge"
                      render={({ field }) => (
                        <FormItem  className='mt-4'>
                            <FormLabel>Delivery Charge <span className="ml-1">($)</span></FormLabel>
                          <FormControl>
                            <Input
                             type='number'
                             min={0}
                              placeholder="Delivery Charge"
                              defaultValue={deliveryData?.deliveryCharge || ""}
                              {...field}
                             
                              className="border-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="additionalChargePerItem"
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                            <FormLabel>Additional Charge Per Item<span className="ml-1">($)</span></FormLabel>
                          <FormControl>
                            <Input
                            type='number'
                            min={0}
                              placeholder="Additional Charge Per Item"
                              defaultValue={deliveryData?.additionalChargePerItem || ""}
                              {...field}
                             
                              className="border-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
      
                    <FormField
                      control={form.control}
                      name="weightBasedCharge"
                      render={({ field }) => (
                        <FormItem className='mt-4'>
                            <FormLabel>Weight Based Charge<span className="ml-1">($)</span></FormLabel>
                          <FormControl>
                            <Input
                            type='number'
                            min={0}
                              placeholder="weight Based Charge"
                              defaultValue={deliveryData?.weightBasedCharge || ""}
                              {...field}
                             
                              className="border-black"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    </div>
                  
      
                 
      
                   
                    <Button type="submit" className=" w-96 ">
                      Submit
                    </Button>
                  </form>              
                )}
              </div>
          ) : (

            

            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6  w-full my-auto "
            >
             {/* {deliveryData?.data.map((item:DeliveryCharge)=>{ */}
              <div>
             
               <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className='mt-6'>
                      <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Description"
                        defaultValue={deliveryData?.description ||""}
                        {...field}
                       
                        className="border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="deliveryCharge"
                render={({ field }) => (
                  <FormItem  className='mt-4'>
                      <FormLabel>Delivery Charge</FormLabel>
                    <FormControl>
                      <Input
                       type='number'
                       min={0}
                        placeholder="Delivery Charge"
                        defaultValue={deliveryData?.deliveryCharge || ""}
                        {...field}
                       
                        className="border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="additionalChargePerItem"
                render={({ field }) => (
                  <FormItem className='mt-4'>
                      <FormLabel>Additional Charge Per Item</FormLabel>
                    <FormControl>
                      <Input
                      type='number'
                      min={0}
                        placeholder="Additional Charge Per Item"
                        defaultValue={deliveryData?.additionalChargePerItem || ""}
                        {...field}
                       
                        className="border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              

              <FormField
                control={form.control}
                name="weightBasedCharge"
                render={({ field }) => (
                  <FormItem className='mt-4'>
                      <FormLabel>Weight Based Charge</FormLabel>
                    <FormControl>
                      <Input
                      type='number'
                      min={0}
                        placeholder="weight Based Charge"
                        defaultValue={deliveryData?.weightBasedCharge || ""}
                        {...field}
                       
                        className="border-black"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              </div>
            

           

             
              <Button type="submit" className=" w-96  bg-[#5e72e4] hover:bg-[#465ad1]">
                Submit
              </Button>
            </form>              
          )}
        </div>
      </div>
    </Form>
  );
};

export default RootDeliveryUpdate;
