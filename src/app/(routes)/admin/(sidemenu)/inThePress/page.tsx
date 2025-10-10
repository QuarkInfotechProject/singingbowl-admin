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
import { Switch } from "@/components/ui/switch";
import Edit from "./edit/page";

import { MdDelete } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import AddContent from "./add/page";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import Loading from "./loading";

import {
  InThePressResponse,
  PressItem,
} from "@/app/_types/inThepress-Types/inThePress";
import { LuCircle } from "react-icons/lu";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BsThreeDots } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RootInThePress = () => {
  const [orderData, setOrderData] = useState<InThePressResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const { toast } = useToast();

  const PAGE_RANGE_DISPLAY = 3;

  const toggleCreateDialogs = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpens(true);
  };
  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };
  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
  };

  const generatePageNumbers = (
    totalPages: number,
    currentPage: number
  ): (number | "...")[] => {
    const pageNumbers: (number | "...")[] = [];

    if (totalPages <= PAGE_RANGE_DISPLAY) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - PAGE_RANGE_DISPLAY);
      const endPage = Math.min(totalPages, currentPage + PAGE_RANGE_DISPLAY);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const onDelete = async (id: string) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/inPress/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();

        setRefetch(true);
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
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

  const getOrder = async () => {
    try {
      setLoading(true);
      const url = `/api/inPress?page=${currentPage}`;

      const res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();

      setOrderData(data.data);
      setTotalPages(data.data.last_page);

      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log("orderData", orderData);
  useEffect(() => {
    getOrder();
    setRefetch(false);
  }, [currentPage, totalPages, refetch]);
  console.log(orderData);

  const onToggleSwitch = async (id: number) => {
    setLoading(true);
    const idData = {
      id: id,
    };

    console.log(idData);
    try {
      const res = await fetch(`/api/inPress/status`, {
        method: "POST",
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        const data = await res.json();

        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setRefetch(true);
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setIsSwitchToggled(true);
    }
  };

  useEffect(() => {
    if (isSwitchToggled) {
      setRefetch((prevRefetch) => !prevRefetch);
      setIsSwitchToggled(false);
    }
  }, [isSwitchToggled, setRefetch]);

  return (
    <>
      <div>
        <div className="flex flex-row justify-between">
          <h1></h1>

          <Dialog>
            <DialogTrigger asChild>
              <a
                className={buttonVariants()}
                onClick={toggleCreateDialog}
                style={{
                  textDecoration: "none",
                  backgroundColor: "transparent",
                }}
              >
                <button className="bg-[#5e72e4] text-white px-4 py-2 flex flex-row items-center gap-2 rounded-md shadow-lg transition-all duration-300 hover:bg-[#465ad1] hover:shadow-xl">
                  <LuCircle className="w-5 h-5" />
                  <span>Add In The Press</span>
                </button>
              </a>
            </DialogTrigger>

            {isSheetOpen && (
              <DialogContent className="max-w-[800px] h-[590px]">
                <AddContent
                  setRefetch={setRefetch}
                  setIsSheetOpenss={setIsSheetOpen}
                />
              </DialogContent>
            )}
          </Dialog>
        </div>
        <div className="bg-white mt-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-black">Title</TableHead>

                <TableHead className="text-black"> Published Date</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead className="text-black">Status</TableHead>
                <th className="font-medium text-black h-12  w-20 ">Action</th>
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-[200px] h-[100px]" />
                    </TableCell>
                    {/* <TableCell>
                      <Skeleton className="w-20 h-4" />
                    </TableCell> */}
                    <TableCell>
                      <Skeleton className="w-4 h-4 rounded-full" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-8 h-4" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-8 h-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                {orderData?.data.map((item: PressItem) => (
                  <TableRow className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell className="font-medium text-sm w-60">
                      {item.title}
                    </TableCell>
                    <TableCell>{item.publishedDate}</TableCell>

                    {/* <TableCell>
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          item.isActive === 1
                            ? "bg-green-100 text-green-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {item.isActive === 1 ? "Active" : "Inactive"}{" "}
                      </span>
                    </TableCell> */}
                    <TableCell className="">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={Boolean(item.isActive)}
                                onCheckedChange={() => onToggleSwitch(item.id)}
                                className={`text-center  ${
                                  item.isActive
                                    ? "text-red-500"
                                    : "text-green-500"
                                }`}
                                style={{ transform: "scale(0.6)" }}
                              />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Status Change</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className=" text-center  flex gap-3  mt-2">
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

                      <Dialog
                        open={isSheetOpens}
                        onOpenChange={setIsSheetOpens}
                      >
                        {isSheetOpens && (
                          <DialogContent className="max-w-[800px] h-[590px]">
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
                              Are you sure you want to delete the data ?
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
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            )}
          </Table>
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
                  currentPage === totalPages
                    ? "opacity-50 cursor-not-allowed"
                    : ""
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
        </div>
      </div>
    </>
  );
};

export default RootInThePress;
