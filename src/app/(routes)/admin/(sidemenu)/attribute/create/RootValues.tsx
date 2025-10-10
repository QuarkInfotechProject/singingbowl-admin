"use client"
import { Button } from "@/components/ui/button"
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import * as z from 'zod';
import { Input } from "@/components/ui/input"
import { useState } from "react"
import {AiFillDelete} from 'react-icons/ai'
import { useGlobalContext } from "../_context/context";

const formSchema = z.object({
  values: z.array(z.string()).optional(),

});

interface RootValuesProps { 
setFormData: (data: any) => void; 
formData: any;
}


const RootAddValues : React.FC<RootValuesProps> = ({formData,  setFormData})=> {
  const router=useRouter();
  const [isLoading, setIsLoading]=useState(false);
  const context = useGlobalContext();
const {toast} =useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { 
    
    ...formData,
    values:[""], 
    }
  })


  const { fields, append, remove  } = useFieldArray({
    control: form.control,
    name:"values",
  })

  useEffect(() => {

const unwatch = form.watch((watchedValues) => {


    setFormData((prevFormData: any) => ({
      ...prevFormData,
      values: watchedValues.values
    }));
 

});


return () => {
  unwatch.unsubscribe();
};
}, [form, setFormData]);

 

 
 

  const handleSubmit = async (event: React.FormEvent) => {
    // event.preventDefauslt();
   
    setIsLoading(true);
  console.log("form",formData)
 
    try {
      const response = await axios.post(
       '/api/attribute/add',formData
        
      );
      console.log('---Response----', response);
      if (response.status === 200) {
        console.log("Success")
        router.push('/admin/attribute');
        toast({
          description: response.data.message,
          variant: "default",
          className: "bg-green-100 text-green-500 ",
        });
        context?.getData(1);
      
      } else {
        console.error('Error submitting data:', response.statusText);
      }
    } catch (error) {
      console.error('Error submitting data:', error);
    }finally{
      setIsLoading(false);
    }  
  }

    

 

  return (
    <Card className="w-full max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle>Add Values</CardTitle>
    </CardHeader>
    <CardContent>
      <Form {...form}>
        <div className="space-y-6">
          <div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex justify-between items-center">
                <FormField
                  control={form.control}
                  name={`values.${index}`}
                  render={({ field }) => (
                    <FormItem className="mt-2">
                      <FormControl className="ml-4" style={{ width: "40vw" }}>
                        <Input {...field} placeholder="Enter Value" />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="ml-4 mt-2 ">
                  <AiFillDelete onClick={() => remove(index)} className="text-red-500 cursor-pointer" />
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button className="bg-green-500 hover:bg-green-600" onClick={() => append("")}>
              Add Value
            </Button>
            <Button
              onClick={handleSubmit}
              className={cn(
                "bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white",
                isLoading && "cursor-not-allowed opacity-50"
              )}
              disabled={isLoading}
            >
             Submit
            </Button>
          </div>
        </div>
      </Form>
    </CardContent>
  </Card>
  )
}
export default RootAddValues;
