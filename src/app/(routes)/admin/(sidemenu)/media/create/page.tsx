
'use client';
import React from 'react'
import { useState} from 'react';
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

 

const formSchema = z.object({
  name:  z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  url: z.string().min(2, {
    message: 'Url must be at least 2 characters.',
  }),
})




const MediaPageAdd = ({setIsSheetsOpens,setRefetch}:{setIsSheetsOpens:any;setRefetch:any}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();
  const router = useRouter();
  

const handelBack = ()=> {
  setIsSheetsOpens(false);
}
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          
        },
      });
    
      


      
     
      

   

  

     

    

      const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
               
            const formData = {
                ...values
            }
              

            const response = await axios.post('/api/mediaCategory/create',formData );
      
         
      
            if (response.status === 200) {
              router.push('/admin/media');
              toast({ description: `${response.data.message}` });
              setRefetch(true);
              setIsSheetsOpens(false);
              setIsLoading(false);
            }
         
        } catch (error) {
        
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
        <h1 className='font-bold text-2xl mb-6'>Create File Category</h1>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 justify-center items-center  ">
        <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                    Name
                  </FormLabel>
                  <FormControl>
                     
                        <Input
                         {...field}
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                   Url
                  </FormLabel>
                  <FormControl>
                     
                        <Input
                         {...field}
                         placeholder='Url'
                    
                          
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
                            <Button type="submit"   className='bg-green-500 hover:bg-green-600'>
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
 
      </form>
    </Form>
    </div>
    </>
  )
}

export default MediaPageAdd
