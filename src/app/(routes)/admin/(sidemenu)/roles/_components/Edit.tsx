"use client";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useGlobalContext } from "../_context/context";
import { BsExclamationSquareFill, BsThreeDots } from "react-icons/bs";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Permission } from "@/app/_types/module_Types/Module_Type";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type Inputs = {
  id: number;
  groupName: string;
  createdAt: string;
};

interface EditFormProps {
  editData: {
    id: number;
    uuid: string;
    name: string;
    createdAt: string;
  };
  setEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  moduleData: Permission[];
}

export const Edit = ({
  editData,
  moduleData,
}: {
  editData: {
    id: number;
    uuid: string;
    name: string;
    createdAt: string;
  };
  moduleData: Permission[];
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  // const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  const handleEditClick = () => {
    setEditDialogOpen(true);
  };

  const formatDate = (dateString: string): string => {
    // Extract the date part from the string (first 10 characters)
    return dateString.split(" ")[0];
  };
  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };
  const handleDeleteConfirm = () => {
    setDeleteDialogOpen(false);
  };
  return (
    <TableRow
      key={editData.id}
      className="hover:bg-gray-100 transition-colors duration-200"
    >
      <TableCell className="font-medium p-4">{editData.name}</TableCell>
      {/* <TableCell className="font-medium p-4 text-center">{formatDate(editData.createdAt)}</TableCell> */}
      <TableCell className="w-60 text-center">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <BsThreeDots />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="cursor-pointer"
              onClick={handleEditClick}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              className="cursor-pointer"
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
              moduleData={moduleData}
            />
          </DialogContent>
        </Dialog>
      </TableCell>
    </TableRow>
  );
};

const EditForm = ({ editData, setEditDialogOpen, moduleData }: EditFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      id: editData.id,
      groupName: editData.name,
      createdAt: editData.createdAt,
    },
  });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const context = useGlobalContext();
  const { toast } = useToast();

  const handlePermissionSelect = (id: number) => {
    if (selectedPermissions.includes(id)) {
      // If the permission is already selected, remove it
      setSelectedPermissions((prevState) =>
        prevState.filter((permissionId) => permissionId !== id)
      );
    } else {
      // If the permission is not selected, add it
      setSelectedPermissions((prevState) => [...prevState, id]);
    }
  };

  const handleSectionCheckboxToggle = (sectionId: string) => {
    const areAllPermissionsSelectedInSection = moduleData
      .filter((permission) => permission.section === sectionId)
      .every((permission) => selectedPermissions.includes(permission.id));

    if (areAllPermissionsSelectedInSection) {
      const updatedPermissions = selectedPermissions.filter(
        (id) =>
          !moduleData.find(
            (permission) =>
              permission.section === sectionId && permission.id === id
          )
      );
      setSelectedPermissions(updatedPermissions);
    } else {
      // If any permission in the section is not selected, select all
      const permissionsToAdd = moduleData
        .filter((permission) => permission.section === sectionId)
        .map((permission) => permission.id);
      setSelectedPermissions([...selectedPermissions, ...permissionsToAdd]);
    }
  };

  const uniqueSections: string[] = [
    ...new Set(moduleData.map((permission) => permission.section)),
  ];

  const getDatas = async (groupUuid: string) => {
    try {
      const res = await axios.get(`/api/roles/module/show?groupId=${groupUuid}`);

      const data = res.data;

      // Ensure we always set an array to prevent .includes() crash
      setSelectedPermissions(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
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

  useEffect(() => {
    getDatas(editData.uuid);
  }, []);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);

    const selectedModuleData = moduleData
      .filter((permission) => selectedPermissions.includes(permission.id))
      .map((permission) => permission.id);

    const formData = {
      groupId: data.id,
      permissionId: selectedModuleData,
    };

    try {
      const [updateRes, secondApiRes] = await Promise.all([
        axios.post(`/api/roles/update`, data),

        axios.post(`/api/roles/module/update`, formData),
      ]);

      if (updateRes.status === 200 && secondApiRes.status === 200) {
        setIsLoading(false);
        setEditDialogOpen(false);
        toast({
          description:
            "Permission associated with the user group has been fetched successfully.",
          variant: "default",
          className: "bg-green-100 text-green-500 ",
        });
        context?.getData();
        setSelectedPermissions([]);
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
    <div className=" w-[450px] h-[550px] overflow-x-auto">
      <DialogHeader>
        <DialogTitle>Update Group</DialogTitle>
        <DialogDescription>
          Click Update Group when you're done.
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid  py-4">
          {/* form feild */}
          <div>
            <div className="flex flex-row gap-4 items-center  overflow-x-auto">
              <Label htmlFor="name" className="text-left">
                Name
              </Label>
              <Controller
                name="groupName"
                control={control}
                rules={{ required: true }}
                render={({ field }) => (
                  <Input
                    disabled={context?.state.editLoading}
                    className={`${errors.groupName && "border-red-500"
                      } col-span-3 w-72`}
                    id="name"
                    type="text"
                    {...field}
                  />
                )}
              />
            </div>
            {errors.groupName && (
              <p className="text-red-400 mt-1 text-sm capitalize text-end">
                Name is required
              </p>
            )}

            {uniqueSections.map((section) => (
              <div key={section} className="mt-3">
                <div>
                  <input
                    type="checkbox"
                    onChange={() => handleSectionCheckboxToggle(section)}
                    checked={moduleData
                      .filter((perm) => perm.section === section)
                      .every((perm) => selectedPermissions?.includes(perm.id))}
                  />
                  <label className=" ml-1 font-semibold">{section}</label>
                </div>

                {moduleData
                  .filter((perm) => perm.section === section)
                  .map((permission) => (
                    <div key={permission.id} className="ml-6">
                      <input
                        type="checkbox"
                        onChange={() => handlePermissionSelect(permission.id)}
                        checked={selectedPermissions?.includes(permission.id) ?? false}
                      />
                      <label className="ml-1">{permission.name}</label>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <button className="ml-1 cursor-pointer " disabled>
                              <BsExclamationSquareFill className="text-[11px]" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{permission.description}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={isLoading}
            type="submit"
            className="mx-auto w-96 bg-[#5e72e4] hover:bg-[#465ad1]"
          >
            {/* {isLoading && (
              <AiOutlineLoading className=" mr-2 animate-spin" size={20} />
            )} */}
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
      const res = await axios.post(`/api/roles/delete`, { id });
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
          className="bg-[#5e72e4] hover:bg-[#465ad1]"
          onClick={handleDelete}
        >
          Continue
        </AlertDialogAction>
      </AlertDialogFooter>
    </>
  );
};
