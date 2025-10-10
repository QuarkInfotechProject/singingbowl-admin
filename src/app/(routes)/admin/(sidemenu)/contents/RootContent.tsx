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
import AddContent from "./add/page";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { FaEdit } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  ApiResponse,
  DataItem,
  File,
} from "@/app/_types/content-Types/contentType";
import Loading from "./Loading";

import { BsThreeDots } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, CircleFadingPlus } from "lucide-react";
const RootContent = ({ type }: { type: string }) => {
  const [orderData, setOrderData] = useState<ApiResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isSwitchToggled, setIsSwitchToggled] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { toast } = useToast();

  const PAGE_RANGE_DISPLAY = 3;

  const toggleCreateDialogs = (id: string) => {
    setSelectedItemId(id);
    setIsSheetOpens(true);
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

  const Name = {
    type: type,
  };


  const onDelete = async (id: string) => {
    setLoading(true);
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/content/del`, {
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
      const url = `/api/content?page=${currentPage}`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Name),
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

  useEffect(() => {
    getOrder();
    setRefetch(false);
  }, [currentPage, totalPages, refetch]);

  const onToggleSwitch = async (id: number) => {
    setLoading(true);
    const idData = {
      id: id,
    };
    try {
      const res = await fetch(`/api/content/status`, {
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

  const toggleCreateDialog = () => {
    console.log("viehit");

    setIsSheetOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };
  return (
    <div className="p-0 bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div></div>
          {/* <h1 className="text-3xl font-bold text-gray-800">Content Management</h1> */}
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
                  <CircleFadingPlus />
                  <span>Add Content</span>
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

        <div className="bg-white ">
          <Table>
            <TableHeader>
              <TableRow className="bg-white">
                <TableHead className="font-semibold text-black py-4">
                  {" "}
                  Desktop Image
                </TableHead>
                <TableHead className="font-semibold text-black py-4">
                  {" "}
                  Mobile Image
                </TableHead>
                {/* <TableHead className="font-semibold text-black py-4">
                  {" "}
                  Status
                </TableHead> */}
                <TableHead className="font-semibold text-black py-4">
                  {" "}
                  Section Type
                </TableHead>
                <TableHead className="font-semibold text-black py-4">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-black py-4">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading
                ? [...Array(5)].map((_, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <Skeleton className="w-[70px] h-[70px] rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-[70px] h-[70px] rounded-md" />
                      </TableCell>
                      {/* <TableCell>
                        <Skeleton className="w-24 h-8 rounded-full" />
                      </TableCell> */}
                      <TableCell>
                        <Skeleton className="w-32 h-8 rounded-md" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-12 h-6 rounded-full" />
                      </TableCell>
                      <TableCell>
                        <Skeleton className="w-24 h-10 rounded-md" />
                      </TableCell>
                    </TableRow>
                  ))
                : orderData?.data?.map((item) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <TableCell className="p-4">
                        {item.files
                          .filter((file) => file.zone === "desktopImage")
                          .map((image, index) => (
                            <img
                              key={index}
                              src={image.imageUrl}
                              alt={`Desktop Image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg shadow-md"
                            />
                          ))}
                      </TableCell>
                      <TableCell className="p-4">
                        {item.files
                          .filter((file) => file.zone === "mobileImage")
                          .map((image, index) => (
                            <img
                              key={index}
                              src={image.imageUrl}
                              alt={`Mobile Image ${index + 1}`}
                              className="w-24 h-24 object-cover rounded-lg shadow-md"
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
                          {item.isActive === 1 ? "Active" : "Inactive"}
                        </span>
                      </TableCell> */}
                      <TableCell className="font-medium text-black">
                        {item.type === 1
                          ? "Hero section"
                          : item.type === 2
                          ? "Offer Banner section"
                          : item.type === 3
                          ? "Pop Up section"
                          : item.type === 5
                          ? "Hero Section Side Image"
                          : item.type === 6
                          ? "Hero Section GIF"
                          : item.type === 7
                          ? "Flash Sales Offer"
                          : item.type === 8
                          ? "Category Banner Image"
                          : item.type === 9
                          ? "Limited Time Banner Image"
                          : ""}
                      </TableCell>
                      <TableCell>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Switch
                                checked={Boolean(item.isActive)}
                                onCheckedChange={() => onToggleSwitch(item.id)}
                                className={`${
                                  item.isActive ? "bg-black" : "bg-gray-100"
                                } `}
                                style={{ transform: "scale(0.6)" }}
                              />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Toggle Status</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <BsThreeDots className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end ">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => toggleCreateDialogs(item.id)}
                            >
                              Edit
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
                    </motion.tr>
                  ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end items-center mt-6 select-none">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              className={`relative inline-flex items-center rounded-l-md cursor-pointer px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
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

            <span className="relative inline-flex items-center px-4 py-2  text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
              Page {currentPage} of {totalPages}
            </span>

            <div
              className={`relative inline-flex items-center rounded-r-md px-2 cursor-pointer py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Are you sure you want to delete this item?
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
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isSheetOpens} onOpenChange={setIsSheetOpens}>
        <DialogContent className="max-w-[800px] h-[590px]">
          <Edit
            dataId={selectedItemId}
            setIsSheetOpens={setIsSheetOpens}
            setRefetch={setRefetch}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RootContent;
