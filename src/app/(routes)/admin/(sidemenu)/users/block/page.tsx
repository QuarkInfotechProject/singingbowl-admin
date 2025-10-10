'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { MdBlockFlipped } from 'react-icons/md';
import { AiOutlineLoading, AiOutlineWarning } from 'react-icons/ai';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface BlockButtonProps {
    IdData: string;
    onSuccess:() => Promise<void>
    // onBlockSucess:() => void;
}

interface BlockEndUserDTO {
  uuid: string;
  remarks: string;
}

const BlockButton: React.FC<BlockButtonProps> = ({
    IdData,
    onSuccess
    // onBlockSucess,

}) => {
  const [blockEndUserDTO, setBlockEndUserDTO] = useState<BlockEndUserDTO>({
    uuid: '',
    remarks: '',
  });
  const [remarksForDialog, setRemarksForDialog] = useState<string>('');
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [remarksError, setRemarksError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);

  const handleBlockClick = () => {
    setBlockEndUserDTO({ ...blockEndUserDTO, uuid:IdData });
    setIsDialogOpen(true);
  };

  const handleSaveChangesClick = async () => {
    try {
      setIsLoading(true);

      const remarks = remarksForDialog || '';

      if (!remarks) {
        setRemarksError('Please provide reason for blocking.');
        setIsLoading(false);
        return;
      }

      if (remarks.length < 2 || remarks.length > 100) {
        setRemarksError('Reason must be between 2 and 100 characters.');
        setIsLoading(false);
        return;
      }
      const updatedBlockEndUserDTO = { remarks,uuid:IdData };
console.log("reasd",updatedBlockEndUserDTO)
      const response = await axios.post(
        '/api/endUser/block',
        updatedBlockEndUserDTO
      );

      if (response.data.code === 0) {
        toast({
          // title: 'User deActivated successfully',
          description: response?.data?.message,
          variant: "default",
          className: "bg-green-600 text-white ",
        });
        onSuccess();
        setIsDialogOpen(false);
  //  onBlockSucess();
      } else {
        toast({
          description: response?.data?.message,
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        description: error.response?.data?.message || error.message,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="item-center">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative inline-block ">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                 
                      <div className=" text-sm w-32" onClick={handleBlockClick} >
                        
                        Block 
                      </div>
                
                </TooltipTrigger>
                
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[525px]">
          <DialogTitle className="text-lg font-semibold">
            Are you sure?
          </DialogTitle>

          <DialogDescription className=" font-semibold mt-4 flex items-center">
            <AiOutlineWarning
              className="text-red-400 mx-2 flex item-center"
              size={40}
            />
            Blocking this user will effectively cut off their access to any
            future updates.
          </DialogDescription>

          <div className="grid mt-4">
            <DialogTitle className="text-xs font-semibold">
              Please type the reason for blocking
            </DialogTitle>
            <div className="grid grid-cols-2 items-center mt-2">
              <Input
                type="text"
                className="col-span-4 w-full sm:col-span-3 p-2 rounded-lg border border-gray-300 focus:ring focus:ring-red-400"
                placeholder="Enter your reason"
                minLength={2}
                maxLength={100}
                value={remarksForDialog}
                onChange={(e) => {
                  setRemarksForDialog(e.target.value);
                  setRemarksError('');
                }}
              />
            </div>
            {remarksError && <p className="text-red-500">{remarksError}</p>}
          </div>
          <DialogFooter className="mt-4 items-center w-full">
            <div className="flex justify-end items-center space-x-2">
            <DialogClose asChild>
                <Button   onClick={() => setIsDialogOpen(false)}  className="cursor-pointer rounded-lg w-full bg-red-500 hover:bg-red-600">
                  Cancel
                </Button>
              </DialogClose>

           
              <Button
                onClick={handleSaveChangesClick}
                disabled={isLoading}
        
                className="  cursor-pointer rounded-lg w-full bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                
                Block user
              </Button>
             
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BlockButton;
