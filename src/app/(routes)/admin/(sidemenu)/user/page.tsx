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
  useEndUser,
  endUser,
  EndUserProvider,
} from "../context/contextEndUser/context";

import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Transaction } from "@/app/_types/transactiontype/transactionType";
import { User } from "@/app/_types/endUser_Types/endUser";

const TransactionPage = () => {
  const { state, dispatch } = useEndUser();
  const { userData, currentPage, totalPages } = state;

  const [searchOrderId, setSearchOrderId] = useState("");

  const PAGE_RANGE_DISPLAY = 3;

  useEffect(() => {
    endUser(dispatch, {});
  }, [dispatch]);

  const handleFilterOrders = () => {
    endUser(dispatch, currentPage, {
      name: searchOrderId,
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
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Order Management</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Input
              type="text"
              placeholder="Name"
              value={searchOrderId}
              onChange={(e) => setSearchOrderId(e.target.value)}
            />

            <Button onClick={handleFilterOrders} className="mb-6 w-fit">
              Apply Filters
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {userData?.data?.map((item: User) => (
                  <TableRow key={item.uuid}>
                    <TableCell className="font-medium">
                      {item.fullName}
                    </TableCell>
                    <TableCell>
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
                    <TableCell>{item.email}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <div className="flex flex-row gap-7 items-center mt-4">
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
              onClick={() =>
                typeof page === "number"
                  ? dispatch({ type: "SET_CURRENT_PAGE", payload: page })
                  : null
              }
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
      </div>
    </>
  );
};

// Wrap the component with the OrderProvider
const TransactionPageWithProviders = () => (
  <EndUserProvider>
    <TransactionPage />
  </EndUserProvider>
);

export default TransactionPageWithProviders;
