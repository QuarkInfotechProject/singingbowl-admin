'use client';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
  DialogContent,
  DialogDescription,
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
  name: string;
  url: string;
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
      const res = await axios.post('/api/tags/add', data);
      if (res.status === 200) {
        setIsLoading(false);
        setDialogOpen(false);
        toast({
          className:"bg-green-500 font-semibold text-white",
          description: 'Tags added succesfully',
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

  return (
    <DialogContent className="sm:max-w-[900px]">
      <DialogHeader>
        <DialogTitle>Add Tag</DialogTitle>
        <DialogDescription>Click add Tag when you're done.</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
         
          <div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                {...register('name', {
                  required: 'First Name is required',
                })}
                className={`${
                  errors.name && 'border-red-500'
                } col-span-3 w-[600px]`}
                id="name"
                type="text"
                disabled={isLoading}
              />
            </div>
            {errors.name && (
              <p className="text-red-400 mt-1 text-sm capitalize text-end">
                Name is required
              </p>
            )}
          </div>

          <div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="url" className="text-right">
                 Url
              </Label>
              <Input
                {...register('url', {
                  required: 'Url is required',
                })}
                className={`${
                  errors.url && 'border-red-500'
                } col-span-3 w-[600px]`}
                id="url"
                type="text"
                disabled={isLoading}
              />
            </div>
            {errors.url && (
              <p className="text-red-400 mt-1 text-sm capitalize text-end">
                Url is required
              </p>
            )}
          </div>
          
        </div>
        <DialogFooter>
          <Button disabled={isLoading} type="submit" className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white">
            {isLoading && (
              <AiOutlineLoading className=" mr-2 animate-spin" size={20} />
            )}
            Submit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
