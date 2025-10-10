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
import { FaEdit, FaEye } from "react-icons/fa";

import { Trash } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import Link from "next/link";
import { BsThreeDots } from "react-icons/bs";
import { useRouter } from "next/navigation";

type Inputs = {
  id: number;
  attributeSet: string;
  name: string;
  url: string;
};

export const Edit = ({
  editData,
}: {
  editData: {
    id: number;
    attributeSet: string;
    name: string;
    url: string;
  };
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const router = useRouter();
  const handleEditClick = (id: number) => {
    router.push(`/admin/attribute/update/${id}`);
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleView = (id: number) => {
    router.push(`/admin/attribute/${id}`);
  };
  return (
    <TableRow key={editData.id}>
      {/* <TableCell>{editData.id}</TableCell> */}
      <TableCell className="font-medium">{editData.name}</TableCell>
      <TableCell className="font-medium text-center">{editData.attributeSet}</TableCell>

      {/* <TableCell className="font-medium">{editData.url}</TableCell> */}
      <TableCell className="text-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            {" "}
            <BsThreeDots />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {/* <DropdownMenuItem className="text-sm cursor-pointer" onClick={()=>handleView(editData?.id)} >View</DropdownMenuItem> */}
            <DropdownMenuItem
              className="text-sm cursor-pointer"
              onClick={() => handleEditClick(editData?.id)}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem className="text-sm" onClick={handleDeleteClick}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <DeleteAlert id={editData.id} />
          </AlertDialogContent>
        </AlertDialog>
      </TableCell>
    </TableRow>
  );
};

const DeleteAlert = ({ id }: { id: number }) => {
  const context = useGlobalContext();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/attribute/delete`, { id });
      if (res.status === 200) {
        setIsLoading(false);
        toast({
          description: res.data.message,
          variant: "default",
          className: "bg-green-100 text-green-500 ",
        });
        context?.getData(1);
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
          {isLoading && (
            <AiOutlineLoading className=" mr-2 animate-spin" size={20} />
          )}
          Delete
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};
