'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AiOutlineLoading } from 'react-icons/ai';
import adminRoutes from '@/lib/adminRoutes';
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
import axios from 'axios';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
    id: number;
  title: string;
    icon: string | null;
    url: string;
    status?: boolean;
}

interface menuData {
  id: number;
  title: string;
  url: string;
  icon: string;
}

const AddMenu = ({
  parentId,
  menuData,
}: {
  parentId: string;
  menuData: menuData | undefined;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const formSchema = z.object({
    title: z
      .string()
      .min(2, {
        message: 'Menu Title must be at least 2 characters.',
      })
      .default(`${menuData?.title}`),
    url: z
      .string()
      .min(2, {
        message: 'Route must be at least 2 characters.',
      })
      .default(`${menuData?.url}`),
    icon: z
      .string()
      .min(2, {
        message: 'Icon must be at least 2 characters.',
      })
      .default(`${menuData?.icon}`).optional(),
   
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
  
    },
  });

  const onSubmit = async (submitedValues: z.infer<typeof formSchema>) => {
    setIsLoading(true);

    const formData: FormData = {
        id: parseInt(parentId, 10),
        title: submitedValues.title,
        url: submitedValues.url,
        icon: submitedValues.icon ?? null, 
       
    
    };
    try {
      const { data } = await axios.post('/api/menu', formData);
      if (data) {
        toast({ description: `${data.message}` });
        router.push(adminRoutes.menu);
        setIsLoading(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log(error)
        setIsLoading(false);
        toast({
          description: error.response?.data?.error || error.message,
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
          <h1 className="text-center font-bold text-2xl ">Edit Menu</h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-2  w-full my-auto"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Menu Title</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={menuData?.title}
                      placeholder="Title"
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
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Route</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Route"
                      defaultValue={menuData?.url}
                      {...field}
                      className="border-black  "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Icon</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Icon"
                      defaultValue={menuData?.icon}
                      {...field}
                      className="border-black  "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
             
              <Button disabled={isLoading} type="submit" className="px-8">
                {isLoading && (
                  <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
                )}
                Submit
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default AddMenu;
