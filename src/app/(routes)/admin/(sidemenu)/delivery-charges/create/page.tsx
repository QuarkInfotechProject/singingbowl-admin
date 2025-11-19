'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
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
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
    description: z.string().min(1, 'Description is required') .refine((value) => value.length > 0, {
      message: "Description is required"
    }),
  deliveryCharge:z.string().optional(),
  additionalChargePerItem:z.string().optional(),
  weightBasedCharge:z.string().optional(),
 
});

const AddDelivery = ({setRefetch,setIsSheetOpen}:{setRefetch:any;setIsSheetOpen:any}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
 

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange', 
  });

  const onSubmit = async (submitedValues: z.infer<typeof formSchema>) => {
    setIsLoading(true);

console.log(submitedValues);
    try {
      const { data } = await axios.post('/api/delivery-charge/add', submitedValues );
      if (data) {
        toast({ description: `${data.message}` });
        // router.push('/admin/delivery-charges');
        setRefetch(true);
        setIsLoading(false);
        setIsSheetOpen(false)
        // setRefetch(false);
      } 
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        toast({
          description: error.response?.data?.message || error.message,
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
    <Form {...form}>
      <div className="">
        <div className=" h-full w-96 mx-auto">
          <h1 className="text-left mb-2 font-bold text-2xl ">Add Delivery charge</h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4  w-full my-auto "
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className='mt-6'>
                  <FormLabel className="text-md ">Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Description"
                      {...field}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      // onChange={(e) => {
                      //   field.onChange(e);
                      //   form.trigger("description");
                      // }}
                      // onBlur={() => {
                      //   field.onBlur();
                      //   form.trigger("description"); 
                      // }}   
                     className="border-black    "
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
                <FormItem >
                  <FormLabel className="text-md ">Delivery Charge  <span className="ml-1">($)</span> </FormLabel>
                  <FormControl>
                    <Input
                    type='number'
                    min={0}
                      placeholder="Delivery Charge"
                      {...field}
                      className="border-black   "
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
                <FormItem>
                  <FormLabel className="text-md">Additional Charge Per Item<span className="ml-1">($)</span></FormLabel>
                  <FormControl>
                    <Input
                    type='number'
                    min={0}
                      placeholder="Additional Charge Per Item"
                      {...field}
                      className="border-black   "
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
                <FormItem>
                  <FormLabel className="text-md">Weight Based Charge<span className="ml-1">($)</span></FormLabel>
                  <FormControl>
                    
                    <Input
                    type='number'
                    min={0}
                      placeholder="Weight Based Charge"
                      {...field}
                      className="border-black   "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
           
             
              <Button disabled={isLoading} type="submit"  className="px-8 w-96 bg-[#5e72e4] hover:bg-[#465ad1] ">
                {/* {isLoading && (
                  <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                )} */}
                Submit
              </Button>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default AddDelivery;
