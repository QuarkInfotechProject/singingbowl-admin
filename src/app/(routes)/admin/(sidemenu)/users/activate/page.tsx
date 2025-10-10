"use client";

import React, { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FiUserCheck } from "react-icons/fi";
import { AiOutlineLoading, AiOutlineWarning } from "react-icons/ai";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {Input} from '@/components/ui/input'

interface ActivateButtonProps {
    IdData: string;
    onSuccess:() => Promise<void>
  // onActivateSuccess: () => void;
}

interface ActivateEndUserDTO {
  uuid: string;
  remarks:string;
}

const ActivateButton: React.FC<ActivateButtonProps> = ({
    IdData,
    onSuccess,
}) => {
  console.log("id data of axtivet",IdData)
  const [activateEndUserDTO, setActivateEndUserDTO] =
    useState<ActivateEndUserDTO>({
      uuid: "",
      remarks:"",
    });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [remarksError, setRemarksError] = useState<string>('');
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [remarksForDialog, setRemarksForDialog] = useState<string>('');

  const handleActivateClick = () => {
    setActivateEndUserDTO({ ...activateEndUserDTO, uuid: IdData });
    setIsDialogOpen(true);
  };

  const handleSaveChangesClick = async () => {
    try {
      setIsLoading(true);
      const remarks = remarksForDialog || "";

      if (!remarks) {
        setRemarksError("Please provide a reason for activating.");
        setIsLoading(false);
        return;
      }
      if (remarks.length < 2 || remarks.length > 100) {
        setRemarksError("Reason must be between 2 and 100 characters.");
        setIsLoading(false);
        return;
      }

      const updatedActivateEndUserDTO = {  remarks,uuid:IdData  };

      const response = await axios.post(
        "/api/endUser/activate",
        updatedActivateEndUserDTO
      );

      if (response.data.code === 0) {
        toast({
          // title: "User Activated successfully",
          description: response?.data?.message,
          variant: "default",
          className: "bg-green-600 text-white ",
        });
        onSuccess();
        setIsDialogOpen(false);
        // onActivateSuccess();
      } else {
        toast({
          title: "Error ",
          description: response?.data?.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <div className="relative inline-block">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                    <div
                    className=" text-sm w-32"
                      
                      onClick={handleActivateClick}
                    >
                     Active 
                    </div>
                </TooltipTrigger>
               
              </Tooltip>
            </TooltipProvider>
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader className="p-2 w-full">
            <DialogTitle className="  text-lg">Activate user?</DialogTitle>
          </DialogHeader>
          <DialogDescription className="font-semibold mt-4 flex items-center">
            <AiOutlineWarning
              className="text-yellow-500 mx-2 flex item-center"
              size={40}
            />
            You are about to activate a previously blocked user. Once activated,
            the user will regain access to any future updates.
          </DialogDescription>
          <div className="grid mt-4">
            <DialogTitle className="text-xs font-semibold">
              Please type the reason for re-activating this user
            </DialogTitle>
            <div className="grid grid-cols-4 items-center mt-2">
              <Input
                type="text"
                className="col-span-4 w-full"
                placeholder="Enter your reason"
                minLength={2}
                maxLength={100}
                value={remarksForDialog}
                onChange={(e) => {
                  setRemarksForDialog(e.target.value);
                  setRemarksError("");
                }}
              />
            </div>
            {remarksError && <p className="text-red-500">{remarksError}</p>}{" "}
          </div>
          <DialogFooter>
            <div className="flex justify-end mt-2">
            <DialogClose asChild>
                <Button   onClick={() => setIsDialogOpen(false)}  className="cursor-pointer rounded-lg w-full bg-red-500 hover:bg-red-600">
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={handleSaveChangesClick}
                disabled={isLoading}
                className="mx-2  cursor-pointer bg-[#5e72e4] hover:bg-[#465ad1]"
              >
               
                Activate User
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ActivateButton;
