"use client";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Dispatch, SetStateAction } from "react";
import { AiOutlineLoading } from "react-icons/ai";
import { useGlobalContext } from "../_context/context";

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
      const res = await axios.post("/api/attribute-sets/add", data);
      if (res.status === 200) {
        setIsLoading(false);
        setDialogOpen(false);
        toast({
          description: res?.data?.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        context?.getData();
        reset();
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data?.message || error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
        return "error occured";
      }
    }
  };

  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Add Attribute Set</DialogTitle>
        <DialogDescription>
          Click add attribute set when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid gap-4 py-4">
          {/* form feild */}
          <div>
            <div className="grid grid-cols-[auto_1fr] items-start gap-4">
              <div className="w-9">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
              </div>
              <div>
                <Input
                  {...register("name", {
                    required: "First Name is required",
                  })}
                  className={`${
                    errors.name && "border-red-500"
                  } col-span-3 w-[400px]`}
                  id="name"
                  type="text"
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.name && (
              <p className="text-red-400 mt-1  font-medium text-sm capitalize text-start ml-14">
                Name is required
              </p>
            )}
          </div>

          {/* <div>
            <div className="grid grid-cols-[auto_1fr] items-start gap-4">
              <div className="w-9">
                <Label htmlFor="url" className="text-right">
                  url
                </Label>
              </div>
              <div>
                <Input
                  {...register("url", {
                    required: "url is required",
                  })}
                  className={`${
                    errors.url && "border-red-500"
                  } col-span-3 w-[400px]`}
                  id="url"
                  type="text"
                  disabled={isLoading}
                />
              </div>
            </div>
            {errors.url && (
              <p className="text-red-400 mt-1 font-medium text-sm capitalize text-start ml-14">
                url is required
              </p>
            )}
          </div> */}
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white"
          >
            Submit
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
};
