"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import EditColor from "./edit/page";
import AddColor from "./add/page";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";
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
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const RootLayout = () => {
  const [selectedColor, setSelectedColor] = useState<string | undefined>();
  const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false);
  const [isAddColorOpen, setIsAddColorOpen] = useState<boolean>(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false);
  const [refetch, setRefetch] = useState<boolean>(false);
  const [color, setColor] = useState();
  const [selectedDeleteId, setSelectedDeleteID] = useState<
    string | undefined
  >();
  const [isLoadding, setIsLoadding] = useState<boolean>(false);
  const handleEditColor = (id: string) => {
    if (!id) return;
    setIsSheetOpen(true);
    setSelectedColor(id);
  };
  const handleAddcolor = () => {
    setIsAddColorOpen(true);
  };

  const handleDelete = (id: string) => {
    if (!id) return;
    setIsDeleteDialogOpen(true);
    setSelectedDeleteID(id);
  };

  const onDelete = async (id: string) => {
    const bodyData = {
      id: id,
    };
    setIsLoadding(true);
    try {
      const response = await clientSideFetch({
        url: "/colors/destroy",
        method: "post",
        toast: toast,
        debug: true,
        body: bodyData,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message.message,
          className: "bg-green-500 font-semibold text-white",
        });
        setRefetch(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadding(false);
    }
  };

  const handleChangeStatus = async (id: string) => {
    if (!id) return;
    const bodyData = {
      id: id,
    };
    setIsLoadding(true);
    try {
      const response = await clientSideFetch({
        url: "/colors/change-status",
        method: "post",
        toast: toast,
        debug: true,
        body: bodyData,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message,
          className: "bg-green-500 font-semibold text-white",
        });
        setRefetch(true);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadding(false);
    }
  };
  const getColors = async (page: number = 1) => {
    setIsLoadding(true);
    try {
      const response = await clientSideFetch({
        url: `/colors`,
        method: "post",
        toast: toast,
        debug: true,
        body: { page },
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message,
          className: "bg-green-500 text-white font-semibold",
        });
        setColor(response.data.data);
        setRefetch(false);
        console.log(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoadding(false);
    }
  };
  useEffect(() => {
    getColors();
  }, [refetch]);
  return (
    <>
      {isLoadding ? (
        <TableLoadingSkeleton />
      ) : (
        <div>
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">All COLORS</h1>
            <button
              onClick={handleAddcolor}
              className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl"
            >
              <LucidePlusCircle className="w-5 h-5" />
              <span>Add Color</span>
            </button>
          </div>
          <div className="mt-5 border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-start py-3  font-bold text-base ">Name</TableHead>
                  <TableHead className="text-center py-3 font-bold text-base ">HexCode</TableHead>
                  <TableHead className="text-center py-3 font-bold text-base ">
                    Status
                  </TableHead>
                  <TableHead className="text-center py-3 font-bold text-base ">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {color?.map((color: any, index: number) => (
                  <TableRow key={color.id}>
                    <TableCell className="font-medium">{color.name}</TableCell>
                    <TableCell className="font-medium text-center">
                      <Badge style={{ backgroundColor: color.hexCode }}>
                        {color.hexCode}
                      </Badge>
                    </TableCell>


                    <TableCell className="text-center">
                      {" "}
                      <Switch
                        id={`switch-${color.id}`}
                        checked={color.status === 1}
                        onCheckedChange={() => handleChangeStatus(color.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            className="bg-none hover:bg-transparent outline-none border-none focus:ring-0"
                            variant="outline"
                          >
                            <BsThreeDots />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>

                          <DropdownMenuItem
                            onClick={() => handleEditColor(color.id)}
                          >
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(color.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/*  */}
          <Dialog open={isSheetOpen} onOpenChange={setIsSheetOpen}>
            <DialogTrigger asChild></DialogTrigger>

            {isSheetOpen && (
              <DialogContent className="min-w-lg p-3    h-auto">
                <EditColor
                  setRefetch={setRefetch}
                  setIsSheetOpen={setIsSheetOpen}
                  id={String(selectedColor)}
                />
              </DialogContent>
            )}
          </Dialog>
          <Dialog open={isAddColorOpen} onOpenChange={setIsAddColorOpen}>
            <DialogTrigger asChild></DialogTrigger>

            {isAddColorOpen && (
              <DialogContent className="min-w-lg p-3    h-auto">
                <AddColor
                  setRefetch={setRefetch}
                  setIsAddColorOpen={setIsAddColorOpen}
                />
              </DialogContent>
            )}
          </Dialog>
          {/*  */}

          <AlertDialog
            open={isDeleteDialogOpen}
            onOpenChange={setIsDeleteDialogOpen}
          >
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  Are you sure you want to delete the data ?
                </AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel
                  className="bg-red-500 hover:bg-red-600 text-white mt-4 hover:text-white"
                  onClick={() => setIsDeleteDialogOpen(false)}
                >
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  className="bg-[#5e72e4] hover:bg-[#465ad1]"
                  onClick={() => {
                    if (selectedDeleteId) {
                      onDelete(selectedDeleteId);
                      setIsDeleteDialogOpen(false);
                    }
                  }}
                >
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>

            <AlertDialogTrigger></AlertDialogTrigger>
          </AlertDialog>
          {/*  */}
        </div>
      )}
    </>
  );
};

export default RootLayout;

const TableLoadingSkeleton = () => (
  <div className="mt-5 border rounded-lg">
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-start">
            <Skeleton className="h-5 w-24" />
          </TableHead>
          <TableHead className="text-center">
            <Skeleton className="h-5 w-16" />
          </TableHead>
          <TableHead className="text-center">
            <Skeleton className="h-5 w-16" />
          </TableHead>
          <TableHead className="text-center">
            <Skeleton className="h-5 w-16" />
          </TableHead>
          <TableHead className="text-center">
            <Skeleton className="h-5 w-16" />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: 5 }).map((_, index) => (
          <TableRow key={index}>
            <TableCell className="font-medium">
              <Skeleton className="h-5 w-32" />
            </TableCell>
            <TableCell className="font-medium text-center">
              <Skeleton className="h-5 w-24" />
            </TableCell>
            <TableCell className="font-medium text-center">
              <Skeleton className="h-5 w-16" />
            </TableCell>
            <TableCell className="text-center">
              <Skeleton className="h-5 w-16" />
            </TableCell>
            <TableCell className="font-medium text-center">
              <Skeleton className="h-5 w-16" />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
);
