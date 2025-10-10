"use client";
import { useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading } from "react-icons/ai";
import { useGlobalContext } from "../_context/context";
import { FaEdit } from "react-icons/fa";

import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
type Inputs = {
  id: number;
  name: string;
  url: string;
};

export const Edit = ({
  editData,
}: {
  editData: {
    id: number;
    name: string;
    url: string;
  };
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const handleEditClick = () => {
    setEditDialogOpen(true);
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  return (
    <TableRow key={editData.id} className="flex justify-between w-full">
      {/* <TableCell>{editData.id}</TableCell> */}
      <TableCell className="font-medium">{editData.name}</TableCell>
      {/* <TableCell className="font-medium">{editData.url}</TableCell> */}
      <TableCell className="mr-4">
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <BsThreeDots />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="gap-2">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-sm mb-1 cursor-pointer hover:bg-gray-100 p-1"
              onClick={handleEditClick}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-sm hover:bg-gray-100 cursor-pointer p-1"
              onClick={handleDeleteClick}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <DeleteAlert id={editData.id} />
          </AlertDialogContent>
        </AlertDialog>
        <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
          <DialogContent>
            <EditForm
              setEditDialogOpen={setEditDialogOpen}
              editData={editData}
            />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const EditForm = ({ editData, setEditDialogOpen }: any) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: editData.id,
      name: editData.name,
      url: editData.url,
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const context = useGlobalContext();
  const { toast } = useToast();

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/attribute-sets/update`, data);
      if (res.status === 200) {
        setIsLoading(false);
        setEditDialogOpen(false);
        toast({
          description: res?.data?.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        context?.getData();
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
    <div className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Update Attribute Set</DialogTitle>
        <DialogDescription>
          Click update attribute set when you're done.
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
                <Controller
                  name="name"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      disabled={context?.state.editLoading}
                      className={`${
                        errors.name && "border-red-500"
                      } col-span-3`}
                      id="name"
                      type="text"
                      {...field}
                    />
                  )}
                />
              </div>
            </div>
            {errors.name && (
              <p className="text-red-400 mt-1 font-medium text-sm capitalize text-start ml-14">
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
                <Controller
                  name="url"
                  control={control}
                  rules={{ required: true }}
                  render={({ field }) => (
                    <Input
                      disabled={context?.state.editLoading}
                      className={`${errors.url && "border-red-500"} col-span-3`}
                      id="url"
                      type="text"
                      {...field}
                    />
                  )}
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
            Update
          </Button>
        </DialogFooter>
      </form>
    </div>
  );
};

const DeleteAlert = ({ id }: { id: number }) => {
  const context = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/attribute-sets/delete`, { id });
      if (res.status === 200) {
        setIsLoading(false);
        toast({
          description: res?.data?.message,
          variant: "default",
          className: "bg-green-100 text-green-500 ",
        });
        context?.getData();
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
    <>
      <AlertDialogHeader>
        <AlertDialogTitle>
          Are you sure you want to delete this?
        </AlertDialogTitle>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white hover:text-white">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={handleDelete}
          className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white"
        >
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};
