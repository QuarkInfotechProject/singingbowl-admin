'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  DialogContent,

  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Dispatch, SetStateAction } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { useGlobalContext } from '../_context/context';

type Inputs = {
    groupName: string;
  createdAt: string;
};

export const AddGroup = ({
  setDialogOpen,
}: {
  setDialogOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useGlobalContext();
  const { toast } = useToast();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();
 

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
   

    setIsLoading(true);

    try {
      const res = await axios.post('/api/roles/add', data);
      if (res.status === 200) {
        setIsLoading(false);
        setDialogOpen(false);
        toast({
          description: res?.data?.message,
          variant: "default",
          className: "bg-green-500 text-white font-semibold ",
        });
        context?.getData();
        reset();
      }
    } catch (error) {
      setIsLoading(false);
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
        return 'error occured';
      }
    }
  };
  const handleCancel = () => {
    setDialogOpen(false);
    reset();
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Create a Group</DialogTitle>
       
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-2 py-4">
          {/* form feild */}
          <div>
            <div className="grid grid-cols-[auto_1fr] items-start gap-2">
              <div className=''>
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              </div>
              <div>
              <Input
                {...register('groupName', {
                  required: ' Name is required',
                })}
                className={`${
                  errors.groupName && 'border-red-500'
                } col-span-3 w-[400px]`}
                id="name"
                type="text"
                disabled={isLoading}
              />
              </div>
            </div>
            {errors.groupName && (
              <p className="text-red-400 mt-1  font-medium  text-sm capitalize text-start ml-12">

                Name is required
              </p>
            )}
          </div>
  
        </div>
        <DialogFooter>
        <Button
            type="button"
            onClick={handleCancel}
            className="bg-red-500 hover:bg-red-600"
          >
            Cancel
          </Button>

          <Button disabled={isLoading} type="submit" className='bg-[#5e72e4] hover:bg-[#465ad1]'>
            {/* {isLoading && (
              <AiOutlineLoading className=" mr-2 animate-spin" size={20} />
            )} */}
            Add Group
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};