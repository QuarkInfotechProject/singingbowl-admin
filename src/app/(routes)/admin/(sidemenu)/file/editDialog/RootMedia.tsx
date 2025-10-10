
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
import SelectReactSelect, { ValueType } from 'react-select';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ApiResponse, MediaCategory } from '@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes';
import makeAnimated from 'react-select/animated';
import { IoArrowBackCircleSharp } from 'react-icons/io5';
import { FileApiResponse } from '@/app/_types/media_Types/fileShow_Types/fileShowTypes';
import { title } from 'process';
 

const formSchema = z.object({
    id:z.string().optional(),
  fileName: z.string().optional(),
  image:z.string().optional(),
  fileCategoryId: z.union([z.number().nullable(), z.array(z.number())]).optional(),
  alternativeText: z.string().optional(),
    title: z.string().optional(),
    caption: z.string().optional(),
    description: z.string().optional(),
});




const RootMediaEdit = ({ editMediaData,fileId,setIsDailogOpen, setRefetch  }: { editMediaData: FileApiResponse | null ; setIsDailogOpen :any; fileId: string; setRefetch }) => {
  
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState(editMediaData?.data?.thumbnailUrl || null);
  const [selectedCategories, setSelectedCategories] = useState < ValueType<MediaCategory, true>[]
  >([]);
  const { toast } = useToast();
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<MediaCategory []>([]);
  const animatedComponents = makeAnimated();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          
        },
      });
     



     
const handelBack =()=>{
  setIsDailogOpen(false);
}
     

      useEffect(() => {
        if (editMediaData) {
          const initialSelectedCategories = {
            value: editMediaData.data.fileCategoryId,
            label: getCategoryLabelById(editMediaData?.data?.fileCategoryId, categoryData),
          };
          setSelectedCategories([initialSelectedCategories]);
      
          form.setValue('fileCategoryId', editMediaData?.data?.fileCategoryId);
        }
      }, [editMediaData, categoryData, setCategoryData, form]);

    
      console.log(editMediaData)
  const { setValue } = form;

  useEffect(() => {
    if (editMediaData) {  
      form.setValue(
        'fileName',
        editMediaData?.data?.filename
      );
      form.setValue(
        'alternativeText',
        editMediaData?.data?.alternativeText
      );
      form.setValue(
        'caption',
        editMediaData?.data?.caption
      );
      form.setValue(
        'description',
        editMediaData?.data?.description
      );
      form.setValue(
        'title',
        editMediaData?.data?.title
      );
        form.setValue(
          'fileCategoryId',
          editMediaData?.data?.fileCategoryId
        );
        if (editMediaData.data.thumbnailUrl) {
   
            setPreviewImage(editMediaData.data.thumbnailUrl);
        
        } else {
          setPreviewImage(null);
        }
       
    }
  }, [editMediaData, setValue]);
      useEffect(() => {
        const fetchCategoryData = async () => {
          try {
            const res = await fetch(`/api/mediaCategory`, {
              method: 'GET',
            });
            const data = await res.json();
            setCategoryData(data.data);
        
          } catch (error) {}
        };
      
    
        fetchCategoryData();
      }, []);

      const renderCategories = (
        categories: MediaCategory []
      ): ValueType<MediaCategory , true>[] => {
        return categories.reduce(
          (options: ValueType<MediaCategory , true>[], category: MediaCategory) => {
            options.push({
              value: category.id,
              label: category.name,
            });
    
           
    
            return options;
          },
          []
        );
      };
     

      const handleCategoryClick = (selectedOptions: ValueType<ApiResponse, true>) => {
        const selectedIds = Array.isArray(selectedOptions)
        ? selectedOptions.map((option) => option.value)
        : selectedOptions
        ? [selectedOptions.value]
        : [];
      setSelectedCategories(selectedOptions);
    
        form.setValue('fileCategoryId', selectedIds);
      };

      const getCategoryLabelById = (
        categoryId: number,
        categories: MediaCategory[]
      ): string => {
        const findLabel = (items: MediaCategory[]): string => {
          for (const item of items) {
            if (item.id === categoryId) {
              return item.name;
            }
          
          }
          return '';
        };
    
        return findLabel(categories);
      };
    

      const handleSubmit= async () => {
      
        try {
            const values = form.getValues();
        const formData = {
            id: values.id,
             fileName: values.fileName, 
             caption: values.caption, 
             description: values.description, 
             title: values.title, 
             alternativeText: values.alternativeText, 
            fileCategoryId:values.fileCategoryId?.toString(),
          };
           
      
     
           
      
            const response = await axios.post('/api/media/edit', formData);
      
           
      
            if (response.status === 200) {
              router.push('/admin/media');
              toast({ description: `${response.data.message}` });
              setRefetch(true)
      setIsDailogOpen(false)
              setIsLoading(false);
         
          } else {
            
            console.error('No files selected');
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
    <div className='flex flex-row gap-4 '>
          
    <div className='mt-8'>
    {previewImage && (
           <img
             src={previewImage}
             alt="Preview"
             
             className='w-96 h-96 border-2 border-gray-400 border-dashed p-2'
           />
         )}

         <p className='font-semibold text-xs mt-2'>{editMediaData?.data.file}</p>
         <p className='font-semibold text-xs'>{editMediaData?.data.fileCategoryName}</p>
         <p className='font-semibold text-xs'>{editMediaData?.data.size}</p>
        
         
         </div>
     
     
       <div  className=' justify-center items-center p-4 w-40 '>
       <h1 className='font-bold text-xl mb-6'>Edit Media</h1>
    <Form {...form}>
      <form  className="space-y-8 justify-center items-center">
     
      <FormField
              control={form.control}
              name="id"
              defaultValue={fileId ?? ''}
              render={({ field }) => (
                
                <Input
                  type="hidden"
                  defaultValue={fileId}
                  {...field}
                />
              )}
            />
            <div className='flex flex-row gap-4'>
        <FormField
              control={form.control}
              name="fileName"
              defaultValue={editMediaData?.data?.filename}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                    File
                  </FormLabel>
                  <FormControl>
                   
                      
                        <Input
                          className='w-40'
                          defaultValue={editMediaData?.data?.filename}
                          {...field}
                        
                          
                        />
                       </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             
         <FormField
              control={form.control}
              name="fileCategoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md ">File Category</FormLabel>
                  <SelectReactSelect
              
              {...field}
                    components={animatedComponents}
                    options={renderCategories(categoryData)}
                    onChange={handleCategoryClick}
                    value={selectedCategories}
                    
                   
                    className='w-40'
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className='flex flex-row gap-4'>
             <FormField
              control={form.control}
              name="alternativeText"
              defaultValue={editMediaData?.data?.alternativeText}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                  Alternative Text
                  </FormLabel>
                  <FormControl>
                   
                      
                        <Input
                          className='w-40'
                          defaultValue={editMediaData?.data?.alternativeText}
                          {...field}
                        
                          
                        />
                       </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="title"
              defaultValue={editMediaData?.data?.title}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                   Title
                  </FormLabel>
                  <FormControl>
                   
                      
                        <Input
                          className='w-40'
                          defaultValue={editMediaData?.data?.title}
                          {...field}
                        
                          
                        />
                       </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className='flex flex-row gap-4'>
             <FormField
              control={form.control}
              name="caption"
              defaultValue={editMediaData?.data?.caption}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                    Caption
                  </FormLabel>
                  <FormControl>
                   
                      
                        <Input
                          className='w-40'
                          defaultValue={editMediaData?.data?.caption}
                          {...field}
                        
                          
                        />
                       </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="description"
              defaultValue={editMediaData?.data?.description}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md  text-black dark:text-white ">
                  Description
                  </FormLabel>
                  <FormControl>
                   
                      
                        <Input
                          className='w-40'
                          defaultValue={editMediaData?.data?.description}
                          {...field}
                        
                          
                        />
                       </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            </div>
            <div className="flex justify-start space-x-2">
                            <Button
                                type="button"
                             className='bg-red-500 hover:bg-red-600'
                                onClick={handelBack}
                            
                            >
                                Cancel
                            </Button>
                            <Button type="button" onClick={ handleSubmit}  className='bg-green-500 hover:bg-green-600'>
                                {isLoading ? 'Submitting...' : 'Submit'}
                            </Button>
                        </div>
          
        
      </form>
    </Form>
    </div>
    </div>
  )
}

export default RootMediaEdit