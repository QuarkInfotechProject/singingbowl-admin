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
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import AddAffiliate from "./add/page";
import { buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { FaEdit, FaEye } from "react-icons/fa";
import Link from "next/link";
// import ViewOrder from './add/page'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Loading from "./loading";
import {
  Affiliate,
  DataTypes,
  File,
} from "@/app/_types/affiliate-Types/affiliateType";
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
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";

const AffiliatePage = ({ activeTab }: { activeTab: string }) => {
  const [orderData, setOrderData] = useState<DataTypes | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isTitleRendered, setIsTitleRendered] = useState(false);

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
      const res = await fetch(`/api/affiliate/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();

        setRefetch(true);
        toast({
          description: data.message,
          variant: "default",
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

  const part = {
    isPartner: activeTab,
  };
  const getOrder = async () => {
    try {
      setLoading(true);
      const url = `/api/affiliate?page=${currentPage}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(part),
      });
      const data = await res.json();

      setOrderData(data.data);
      setTotalPages(data.data.last_page);

      setLoading(false);
    } catch (error) {
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
      const res = await fetch(`/api/affiliate/status`, {
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
  const titleData = orderData?.data.map((item) => item.isPartner);
  console.log("id data", selectedItemId);
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
                  <LucidePlusCircle className="w-5 h-5" />
                  <span>Add Content</span>
                </button>
              </a>
            </DialogTrigger>

            {isSheetOpen && (
              <DialogContent className="max-w-[800px] h-[650px]">
                <AddAffiliate
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
                <TableHead className="text-black">Desktop Image</TableHead>
                <TableHead className="text-black">Mobile Image</TableHead>
                {/* <TableHead>Status</TableHead> */}

                {isTitleRendered && (
                  <TableCell className="text-black">Title</TableCell>
                )}
                <TableHead className="text-black">Partner</TableHead>
                <TableHead className="text-black">Status</TableHead>
                <th className="font-medium  h-12 text-center text-black w-24">
                  Action
                </th>
              </TableRow>
            </TableHeader>
            {/* {orderData?.data.length > 0 ? ( */}
            {loading ? (
              <TableBody>
                {[...Array(5)].map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="w-[100px] h-[100px]" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="w-[100px] h-[100px]" />
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
                    <TableCell>
                      <Skeleton className="w-8 h-4" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            ) : (
              <TableBody>
                {orderData?.data.map((item: Affiliate) => (
                  <TableRow>
                    <TableCell className="font-medium">
                      {item.files
                        .filter((file: File) => file.zone === "desktopLogo")
                        .map((image: File, index: number) => (
                          <img
                            key={index}
                            src={image.imageUrl}
                            alt={`Desktop Image ${index + 1}`}
                            style={{ width: "100px", height: "auto" }}
                          />
                        ))}
                    </TableCell>
                    <TableCell>
                      {item.files
                        .filter((file: File) => file.zone === "mobileLogo")
                        .map((image: File, index: number) => (
                          <img
                            key={index}
                            src={image.imageUrl}
                            alt={`Mobile Image ${index + 1}`}
                            style={{ width: "100px", height: "auto" }}
                          />
                        ))}
                    </TableCell>
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
                    {item.isPartner === 0 && (
                      <TableCell>
                        {item.title}
                        {!isTitleRendered && setIsTitleRendered(true)}
                      </TableCell>
                    )}

                    <TableCell className="font-semibold text-md">
                      {item.isPartner === 1
                        ? "Yes"
                        : item.isPartner === 0
                        ? "No "
                        : ""}
                    </TableCell>

                    <TableCell>
                      {" "}
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div>
                              <Switch
                                checked={Boolean(item.isActive)}
                                onCheckedChange={() => onToggleSwitch(item.id)}
                                className={`text-center mt-2 ${
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
                    <TableCell className=" text-center ">
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
                          <DialogContent className="max-w-[800px] h-[650px]">
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

export default AffiliatePage;
