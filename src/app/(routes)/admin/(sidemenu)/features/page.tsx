"use client";
import React, { useCallback, useEffect, useState } from "react";
import Edit from "./edit/page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  FeaturesProvider,
  useFeatures,
  fetchFeatures,
} from "../context/contextFeatures/context";
import { Feature } from "@/app/_types/features-Types/featureType";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { useToast } from "@/components/ui/use-toast";
import { LuCircle } from "react-icons/lu";
import Add from "./add/page";
import { buttonVariants } from "@/components/ui/button";

const FeaturesPage = () => {
  const { state, dispatch } = useFeatures();

  const { activeDatas, currentPage, totalPages } = state;
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const { toast } = useToast();

  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };
  const toggleCreateDialogs = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpens(true);
  };
  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const fetchData = useCallback(() => {
    fetchFeatures(dispatch, currentPage, {});
    setRefetch(false)
  }, [dispatch, currentPage, refetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData, currentPage]);

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const onDelete = async (id: number) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/features/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();
        setRefetch((prev) => !prev);
        setRefetch(true);
        toast({ description: `${data.message}` });
      } else {
        toast({
          description: "Failed to delete the feature",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <h1></h1>

        <Dialog>
          <DialogTrigger asChild>
            <a
              className={buttonVariants()}
              onClick={toggleCreateDialog}
              style={{ textDecoration: "none", backgroundColor: "transparent" }}
            >
              <button className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl">
                <LuCircle className="w-5 h-5" />
                <span>Add Features</span>
              </button>
            </a>
          </DialogTrigger>

          {isSheetOpen && (
            <DialogContent className="max-w-[650px] h-[620px]">
              <Add setRefetch={setRefetch} setIsSheetOpenss={setIsSheetOpen} />
            </DialogContent>
          )}
        </Dialog>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Features </CardTitle>
          <CardDescription>Manage features</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="">Text</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeDatas?.data?.data?.map((item: Feature) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-center">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isActive === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.isActive === 1 ? "Active" : "Inactive"}
                      </span>
                    </TableCell>
                    <TableCell className="">{item.text}</TableCell>

                    <TableCell className="py-4 text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <BsThreeDots />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toggleCreateDialogs(item.id)}
                          >
                            Edit{" "}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleDeleteClick(item.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>

                    <Dialog open={isSheetOpens} onOpenChange={setIsSheetOpens}>
                      {isSheetOpens && (
                        <DialogContent className="max-w-[650px] h-[620px]">
                          <Edit
                            dataId={selectedItemId}
                            setIsSheetOpens={setIsSheetOpens}
                            setRefetch={setRefetch}
                          />
                        </DialogContent>
                      )}
                    </Dialog>

                    <AlertDialog
                      open={deleteDialogOpen}
                      onOpenChange={setDeleteDialogOpen}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you sure you want to delete the feature?
                          </AlertDialogTitle>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                            onClick={() => setDeleteDialogOpen(false)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-[#5e72e4] hover:bg-[#465ad1]"
                            onClick={() => {
                              if (selectedItemId) {
                                onDelete(selectedItemId);
                                setDeleteDialogOpen(false);
                              }
                            }}
                          >
                            Continue
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end items-center mt-6 select-none">
        <nav
          className="isolate inline-flex -space-x-px rounded-md shadow-sm"
          aria-label="Pagination"
        >
          <div
            className={`relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage > 1) handlePreviousClick();
            }}
          >
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            <span className="">Prev</span>
          </div>

          <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
            Page {currentPage} of {totalPages}
          </span>

          <div
            className={`relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
              currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={() => {
              if (currentPage < totalPages) handleNextClick();
            }}
          >
            <span className="">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </nav>
      </div>
    </div>
  );
};

// Wrap the component with the FeaturesProvider
const FeaturesPageWithProviders = () => (
  <FeaturesProvider>
    <FeaturesPage />
  </FeaturesProvider>
);

export default FeaturesPageWithProviders;
