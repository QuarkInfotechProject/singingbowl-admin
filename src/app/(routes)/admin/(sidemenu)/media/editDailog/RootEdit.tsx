
'use client';
import React from 'react'
import { useState, useEffect } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';
 
import { Button } from "@/components/ui/button"


import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { FileShowResponse } from '@/app/_types/media_Types/fileCategoryShow_Types/fileCategoryShowType';
 

const formSchema = z.object({
  name:  z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  url: z.string().optional(),
})




const RootEdit = ({ editMediaData,setIsSheetOpens }: { editMediaData: FileShowResponse | null ;setIsSheetOpens:any; fileId: string }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  


    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
        
        },
      });
    
      


      
     
      

   

      const handelBack=()=>{
        setIsSheetOpens(false)
      }
      const { setValue } = form;

     useEffect(()=>{
        if(editMediaData){
            form.setValue('name', editMediaData.data?.name);
            form.setValue('url', editMediaData.data?.url);
        }
     },[editMediaData, setValue])

    
   

      const handleSubmit = async () => {
        try {
          const values = form.getValues();
            const formData = {
                ...values
            }
              
            const response = await axios.post('/api/mediaCategory/edit',formData );
      
      
            if (response.status === 200) {
              router.push('/admin/media');
              toast({ description: `${response.data.message}` });
             
              setIsLoading(false);
              setIsSheetOpens(false);
            }
         
        } catch (error) {
          console.log(error);
          if (axios.isAxiosError(error)) {
            setIsLoading(false);
            toast({
              description: error.response?.data.error,
              variant: 'destructive',
            });
          } else {
            setIsLoading(false);
            toast({
              title: `Unexpected Error`,
              description: `${error}`,
              variant: 'destructive',
            });
          }
        }
      };
      


  return (
    <>
     
      
      <div className=' justify-center items-center p-4 w-full mx-auto'>
        <h1 className='font-bold text-2xl mb-6'>Edit File Category</h1>
    <Form {...form}>
      <form className="space-y-4 justify-center items-center  ">
        <FormField
              control={form.control}
              name="name"
              defaultValue={editMediaData?.data?.name}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                    Name
                  </FormLabel>
                  <FormControl>
                     
                        <Input
                         {...field}
                         defaultValue={editMediaData?.data?.name}
                        placeholder='Name'
                          
                        />
                    
              
                
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
              <FormField
              control={form.control}
              name="url"
              defaultValue={editMediaData?.data?.url}
              render={({ field }) => (
                <FormItem>
                
                  <FormControl>
                     
                        <Input
                         {...field}
                         defaultValue={editMediaData?.data?.url}
                       placeholder='Url'
                        type="hidden"
                          
                        />
                    
              
                
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           <div className="flex justify-end space-x-2">
                            <Button
                                type="button"
                             className='bg-red-500 hover:bg-red-600'
                                onClick={handelBack}
                            
                            >
                                Cancel
                            </Button>
                            <Button type="button" onClick={handleSubmit}   className='bg-green-500 hover:bg-green-600'>
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
        
      </form>
    </Form>
    </div>
    </>
  )
}

export default RootEdit
