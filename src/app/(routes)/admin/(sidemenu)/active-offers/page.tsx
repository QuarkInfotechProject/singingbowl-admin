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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ProcessProvider,
  useActive,
  fetchActive,
} from "../context/cotextActiveOffer/context";
import { Transaction } from "@/app/_types/transactiontype/transactionType";
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";
import { BsThreeDots } from "react-icons/bs";
import { useToast } from "@/components/ui/use-toast";
import Add from "./add/page";
import { buttonVariants } from "@/components/ui/button";

const TransactionPage = () => {
  const { state, dispatch } = useActive();

  const { activeData, currentPage, totalPages } = state;

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
    fetchActive(dispatch, currentPage, {});
    setRefetch(false);
  }, [dispatch, currentPage, refetch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/activeOffers/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();

        setRefetch(true);
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
      } else {
        toast({
          description: "Failed to delete the category",
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
    <div className="flex  flex-col gap-4">
      <div className="flex  flex-row justify-between">
        <h1></h1>

        <Dialog>
          <DialogTrigger asChild>
            <a
              className={buttonVariants()}
              onClick={toggleCreateDialog}
              style={{ textDecoration: "none", backgroundColor: "transparent" }}
            >
              <button className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl">
                <LucidePlusCircle className="w-5 h-5" />
                <span>Add Active Offer</span>
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
          <CardTitle>Active Offers </CardTitle>
          <CardDescription>Manage active offers</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Text</TableHead>
                  {/* <TableHead>payment Method</TableHead> */}
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {activeData?.data?.map((item: Transaction) => (
                  <TableRow key={item.orderId}>
                    <TableCell className="font-medium">
                      <img
                        src={item?.files[0]?.imageUrl}
                        alt="image"
                        width={50}
                        height={50}
                      />
                    </TableCell>
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
                    <TableCell className="text-center">{item.text}</TableCell>

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
                            Are you sure you want to delete the data?
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

                      <AlertDialogTrigger></AlertDialogTrigger>
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
            disabled={currentPage === 1}
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
            disabled={currentPage === totalPages}
          >
            <span className="">Next</span>
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          </div>
        </nav>
      </div>
      {/* <div className="flex flex-row gap-7 items-center mt-4">
      <Button
        variant="outline"
        size="sm"
        onClick={handlePreviousClick}
        disabled={currentPage === 1}
      >
        Previous
      </Button>
      <div className="flex items-center space-x-2">
        {generatePageNumbers(totalPages, currentPage)?.map((page, index) => (
          <Button
            key={index}
            variant={page === currentPage ? "default" : "outline"}
            size="sm"
            onClick={() => typeof page === 'number' ?dispatch({ type: 'SET_CURRENT_PAGE', payload: page }) : null}
          >
            {page}
          </Button>
        ))}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={handleNextClick}
        disabled={currentPage === totalPages}
      >
        Next
      </Button>
    </div> */}
    </div>
  );
};

// Wrap the component with the OrderProvider
const TransactionPageWithProviders = () => (
  <ProcessProvider>
    <TransactionPage />
  </ProcessProvider>
);

export default TransactionPageWithProviders;
