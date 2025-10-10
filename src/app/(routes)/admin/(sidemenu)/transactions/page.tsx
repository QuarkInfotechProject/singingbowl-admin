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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaEye, FaTrash } from "react-icons/fa";
import { Order } from "@/app/_types/orderType/orderType";
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

import {
  useEndUser,
  endUser,
  EndUserProvider,
} from "../context/contextEndUser/context";
import { useDebounce } from "@uidotdev/usehooks";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TransactionProvider,
  useTransaction,
  fetchTransaction,
} from "../context/contextTransaction/context";
import { Transaction } from "@/app/_types/transactiontype/transactionType";
import { IoFilterOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
const TransactionPage = () => {
  const { state, dispatch } = useTransaction();
  const paymentMethods = ["esewa", "khalti", "cod", "visa/master", "imepay"];
  const { transactionData, currentPage, totalPages } = state;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchPaymentMethod, setSearchPaymentMethod] = useState("");
  const PAGE_RANGE_DISPLAY = 3;
  const Router = useRouter();
  useEffect(() => {
    fetchTransaction(dispatch, currentPage, {
      transactionCode: searchOrderId,
      paymentMethod: searchPaymentMethod,
    });
  }, []);

  const isSearchFieldFilled = () => searchOrderId || searchPaymentMethod;

  const handleClear = () => {
    // Reset search fields and fetch all transactions again
    setSearchOrderId("");
    setSearchPaymentMethod("");
    fetchTransaction(dispatch, currentPage, {});
  };
  const handleFilterOrders = () => {
    fetchTransaction(dispatch, currentPage, {
      transactionCode: searchOrderId,
      paymentMethod: searchPaymentMethod,
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

  const generatePageNumbers = (
    totalPages: number,
    currentPage: number
  ): (number | "...")[] => {
    const pages = [];
    let startPage = Math.max(1, currentPage - PAGE_RANGE_DISPLAY);
    let endPage = Math.min(totalPages, currentPage + PAGE_RANGE_DISPLAY);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push("...");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push("...");
      pages.push(totalPages);
    }

    return pages;
  };

  const handelView = (id: any) => {
    Router.push(`/admin/orders/show/${id}`);
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
            <DropdownMenuContent className="w-80 p-4">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <Input
                  type="text"
                  placeholder="Transaction code"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                />

                <select
                  value={searchPaymentMethod}
                  onChange={(e) => setSearchPaymentMethod(e.target.value)}
                  className="input border w-full h-10 rounded-sm p-2"
                >
                  <option value="">Select Payment Method</option>
                  {paymentMethods.map((method, index) => (
                    <option key={index} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
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
          <CardTitle>Transaction Management</CardTitle>
        </CardHeader>

        <CardContent>
          {/* 
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          
<Button onClick={handleFilterOrders} className="mb-6 w-fit">Apply Filters</Button>
        </div>
         */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">
                    Transaction Code
                  </TableHead>
                  <TableHead className="text-center">Payment Method</TableHead>
                  <TableHead className="text-center">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!transactionData?.data ||
                transactionData.data?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-48">
                      <div className="flex flex-col items-center justify-center">
                        <div className="text-6xl mb-4">📋</div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          No Transaction Found
                        </h3>
                        <p className="text-gray-500 text-center">
                          There are currently no transaction to display.
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  transactionData?.data?.map((item: Transaction) => (
                    <TableRow key={item.orderId}>
                      <TableCell className="font-medium ">
                        <span
                          className="cursor-pointer"
                          onClick={() => handelView(item.orderId)}
                        >
                          {" "}
                          #{item.orderId}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            item.status === "completed"
                              ? "bg-green-200 text-green-800"
                              : item.status === "pending"
                              ? "bg-yellow-200 text-yellow-800"
                              : "bg-gray-200 text-gray-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        {item.transactionCode}
                      </TableCell>

                      <TableCell className="text-center">
                        {item.paymentMethod}
                      </TableCell>
                      <TableCell className="text-center">
                        {item.createdAt}
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
  <TransactionProvider>
    <TransactionPage />
  </TransactionProvider>
);

export default TransactionPageWithProviders;
