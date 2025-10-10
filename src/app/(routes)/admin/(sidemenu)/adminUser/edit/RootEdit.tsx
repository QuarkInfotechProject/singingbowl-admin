'use client';
import React, { useEffect, useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { AdminUserData } from '@/app/_types/adminUser-Types/adminShow';
import axios from 'axios';
import { IoArrowBackCircleSharp, IoEye, IoEyeOff } from 'react-icons/io5';
import { Checkbox } from '@/components/ui/checkbox';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Select from 'react-select'
  import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from '@/components/ui/form';
import { Group } from '@/app/_types/group-Types/groupType';
import { AdminUserData } from '@/app/_types/adminUser-Types/adminShow';
import { AiOutlineLoading } from 'react-icons/ai';
import { Skeleton } from '@/components/ui/skeleton';
  const formSchema = z.object({
    name: z.string().min(2,{ message: "Name is required" }),
    uuid: z.string().optional(),
    email: z.string().email('Invalid email address').optional(),
password: z.string() .min(8, 'Password must be at least 8 characters long').regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?()_+])(?=.*[a-z]).{8,}$/,
  'Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol')
.optional(),
    groupId: z.number({
      required_error: "Group is required",
      
    }).optional(),
  });



const RootEdit = ({ editData,setRefetch,setIsSheetOpens}: { editData: AdminUserData | null;setRefetch:any;setIsSheetOpens:any}) => {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [group,setGroup] = useState();
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: ({
            uuid: '',
      name: '',
      email: '',
      groupId: undefined,
        }),
      });

   
      
      const  handelBack = ()=>{
       setIsSheetOpens(false);
      }


      useEffect(() => {
        if (editData) {
          form.reset({
            uuid: editData.uuid || '',
            name: editData.fullName || '',
            email: editData.email || '',
            groupId: editData.groupId,
          });
          setTimeout(() => {
            setIsDataLoaded(true);
          }, 500);
        }
      }, [editData, form]);
      useEffect(() => {
        const fetchGroupData = async () => {
          try {
            const res = await fetch(`/api/group`, {
              method: 'GET',
            });
           
            const data = await res.json();
            setGroup(data.data.data);
    
          } catch (error) {}
        };
      
    
        fetchGroupData();
      }, []);

      useEffect(() => {
        if (editData) {
          form.setValue('groupId', editData.groupId);
        }
      }, [editData]);
    
      const onSubmit = async (values: z.infer<typeof formSchema>) => {

        setIsLoading(true);
    
        try {
          const { data } = await axios.post('/api/adminUser/adminUserEdit', fromData );
    
          if (data) {
            toast({ description: data.message ,
              variant: "default",
              className: "bg-green-600 text-white ",
            });
            setRefetch(true);
            setIsSheetOpens(false)
            // router.push('/admin/adminUser');
          }
        } catch (error) {
            console.log("error", error)
          if (axios.isAxiosError(error)) {
            const errorMsg = error?.response?.data?.error;
            const errorPassword =error.response?.data.errors.password[0]
            
            if (errorMsg) {
              form.setError('password', { type: 'manual', message: errorPassword || "" });
              setIsLoading(false);
              toast({
                description: errorMsg,
                variant: 'destructive',
              });
            }
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
      
      <div className="h-full w-full mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Update Admin User</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel className="text-lg text-gray-700 dark:text-gray-300">
                    Name
                </FormLabel>
                <FormControl>
                {!isDataLoaded ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                  <Input placeholder="Name" {...field} defaultValue={editData?.fullName} />
                )}
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            defaultValue={editData?.email}
            render={({ field }) => (
              <FormItem className="" >
                <FormLabel className="text-lg text-gray-700 dark:text-gray-300">
                  Email
                </FormLabel>
                <FormControl>
                {!isDataLoaded ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                  <Input placeholder="Email"  type='email'{...field}  defaultValue={editData?.email} disabled />
                )}
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            
            render={({ field,fieldState }) => (
              <FormItem className="">
                <FormLabel className="text-lg text-gray-700 dark:text-gray-300"> Change Password</FormLabel>
                <FormControl>
                {!isDataLoaded ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
                <div className="relative">
            <Input
              {...field}
             placeholder='Set New Password'
              type={showPassword ? 'text' : 'password'}
            />
            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
              {showPassword ? (
                <IoEye
                  className="text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <IoEyeOff
                  className="text-gray-400 cursor-pointer"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>
          </div>
                  )}
                </FormControl>
                
                <FormDescription></FormDescription>
                
                <FormMessage>
        {fieldState.error?.type === 'min' && 'Password must be at least 8 characters long'}
        {fieldState.error?.message}
      </FormMessage>
              </FormItem>
            )}
          />
          <FormField
      control={form.control}
      name="groupId"
      render={({ field }) => (
        <FormItem className="mt-10">
          <FormLabel className="text-lg text-gray-700 dark:text-gray-300">Group</FormLabel>
          <FormControl>
          {!isDataLoaded ? (
                    <Skeleton className="h-10 w-full" />
                  ) : (
            <Select
              options={group?.map((role) => ({ value: role.id, label: role.name }))}
              onChange={(selectedOption) => form.setValue('groupId', selectedOption?.value)}
              value={
                group
                  ? {
                      value: form.getValues('groupId'),
                      label: group.find((role) => role.id === form.getValues('groupId'))?.name,
                    }
                  : null
              }
              styles={{
                control: (base) => ({
                  ...base,
                  minHeight: '36px',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                }),
                menuPortal: (base) => ({
                  ...base,
                  zIndex: 9999,
                }),
                menu: (base) => ({
                  ...base,
                  marginTop: '4px',
                  marginBottom: '4px',
                  borderRadius: '0.375rem',
                  overflow: 'hidden', // Ensures the inner scrollbar doesn't affect rounded corners
                }),
                menuList: (base) => ({
                  ...base,
                  maxHeight: '120px',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '8px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#d1d5db',
                    borderRadius: '4px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f3f4f6',
                  },
                }),
                option: (base) => ({
                  ...base,
                  fontSize: '0.875rem',
                  padding: '8px 12px',
                }),
              }}
            />
                  )}
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
                            <Button type="submit" className='bg-[#5e72e4] hover:bg-[#465ad1]'>
         
                               Update
                            </Button>
                        </div>

        </form>
      </div>
    </Form>
  )
}

export default RootEdit