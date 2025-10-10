"use client";
import React, { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
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
import ShowData from "./show/page";
import EditUser from "./edit/[uuid]/page";
import {
  useEndUser,
  endUser,
  EndUserProvider,
} from "../context/contextEndUser/context";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import BlockData from "./block/page";
import ActivateButton from "./activate/page";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Transaction } from "@/app/_types/transactiontype/transactionType";
import { IoFilterOutline } from "react-icons/io5";
import { BsThreeDots } from "react-icons/bs";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import Router from "next/router";
import { useRouter } from "next/navigation";
const TransactionPage = () => {
  const { state, dispatch } = useEndUser();
  const paymentMethods = ["esewa", "khalti", "cod", "visa/master", "imepay"];
  const { userData, currentPage, totalPages } = state;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchPaymentMethod, setSearchPaymentMethod] = useState("");
  const PAGE_RANGE_DISPLAY = 3;

  const [isLoading, setIsLoading] = useState(true);

  const [isBlockOpen, setIsBlockOpen] = useState(false);
  const [isActivateOpen, setIsActivateOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [editID, setEditID] = useState("");
  const [isOpenEdit, setIsopenEdit] = useState(false);
  const router = useRouter();

  const toggleCreateDialog = (id: number) => {
    setSelectedItemId(id);
    setIsSheetOpen(true);
  };
  const toggleBlockDialog = (id: number) => {
    setSelectedItemId(id);
    setIsBlockOpen(true);
  };
  const toggleCreateEditDialog = (id: number) => {
    router.push(`/admin/users/edit/${id}`);
  };
  const toggleActivateDialog = (id: number) => {
    setSelectedItemId(id);
    setIsActivateOpen(true);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await endUser(dispatch, currentPage, {
        name: searchOrderId,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, currentPage]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetchData();
  //   }, 3000); // 30 seconds

  //   return () => clearInterval(interval);
  // }, [fetchData]);

  const isSearchFieldFilled = () => searchOrderId || searchPaymentMethod;

  const handleClear = () => {
    setSearchOrderId("");
    setSearchPaymentMethod("");
    endUser(dispatch, currentPage, {});
  };
  const handleFilterOrders = () => {
    endUser(dispatch, currentPage, {
      name: searchOrderId,
      //   paymentMethod: searchPaymentMethod,
    });
  };

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    dispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div></div>
        <div>
          <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilterOutline className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-80 p-4 mr-8">
              <DropdownMenuLabel>Search</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Search by Name"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                />

                <div className="flex flex-row gap-2">
                  <Button
                    className="bg-blue-500  border"
                    onClick={handleFilterOrders}
                  >
                    Search
                  </Button>
                  {isSearchFieldFilled() && (
                    <Button className=" bg-red-500  " onClick={handleClear}>
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Users</CardTitle>
          <CardDescription>Manage users</CardDescription>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile Picture</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                  {/* <TableHead>payment Method</TableHead> */}
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5].map((index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <Skeleton className="h-9 w-9 rounded-full" />
                        </TableCell>

                        <TableCell className="font-medium">
                          <Skeleton className="h-4 w-[150px]" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-6 w-16 rounded-full" />
                        </TableCell>

                        <TableCell>
                          <Skeleton className="h-4 w-[200px]" />
                        </TableCell>

                        <TableCell className="text-center">
                          <div className="flex justify-center">
                            <Skeleton className="h-8 w-8 rounded-md" />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </>
                ) : userData?.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="flex flex-col items-center justify-center">
                        <p className="text-red-500 text-lg font-bold">
                          No results found.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  userData?.data?.map((item) => (
                    <TableRow key={item.uui}>
                      <TableCell className="font-medium">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            src={item.profilePicture}
                            alt={item.fullName}
                          />
                          <AvatarFallback>
                            {getInitials(item.fullName)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.fullName}
                      </TableCell>
                      <TableCell>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "Active"
                              ? "bg-green-100 text-green-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {item.status === "Active" ? "Active" : "Block"}{" "}
                        </span>
                      </TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <BsThreeDots />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => toggleCreateEditDialog(item.uuid)}
                            >
                              Edit{" "}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => toggleCreateDialog(item.uuid)}
                            >
                              View{" "}
                            </DropdownMenuItem>

                            {item.status === "Active" && (
                              <div
                                className=" mb-1 hover:bg-gray-100 cursor-pointer w-full p-1"
                                onClick={() => toggleBlockDialog(item.uuid)}
                              >
                                <BlockData
                                  IdData={selectedItemId}
                                  onSuccess={fetchData}
                                />{" "}
                              </div>
                            )}
                            {item.status === "Blocked" && (
                              <div
                                className=" mb-1 hover:bg-gray-100 cursor-pointer w-full p-1"
                                onClick={() => toggleActivateDialog(item.uuid)}
                              >
                                <ActivateButton
                                  IdData={selectedItemId}
                                  onSuccess={fetchData}
                                />{" "}
                              </div>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>

                        <Dialog
                          open={isSheetOpen}
                          onOpenChange={setIsSheetOpen}
                        >
                          <DialogTrigger asChild></DialogTrigger>
                          {isSheetOpen && (
                            <DialogContent className="max-w-[700px]  h-[650px]">
                              <ShowData IdData={selectedItemId} />
                            </DialogContent>
                          )}
                        </Dialog>
                        {/* edit */}
                        {/* <Dialog
                          open={isOpenEdit}
                          onOpenChange={setIsopenEdit}
                        >
                          <DialogTrigger asChild></DialogTrigger>
                          {isOpenEdit && (
                            <DialogContent className="max-w-[800px]  h-[730px]">
                              <EditUser IdData={editID} />
                            </DialogContent>
                          )}
                        </Dialog> */}
                      </TableCell>
                    </TableRow>
                  ))
                )}
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
    </div>
  );
};

// Wrap the component with the OrderProvider
const TransactionPageWithProviders = () => (
  <EndUserProvider>
    <TransactionPage />
  </EndUserProvider>
);

export default TransactionPageWithProviders;
