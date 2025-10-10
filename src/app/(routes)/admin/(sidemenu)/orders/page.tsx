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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { BsThreeDots } from "react-icons/bs";
import { FaEye, FaTrash } from "react-icons/fa";
import { Order } from "@/app/_types/orderType/orderType";
import ShowData from "./showInital/page";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  useOrder,
  fetchOrders,
  OrderProvider,
} from "../context/contextOrder/context";
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
import { IoFilterOutline } from "react-icons/io5";
import { ChevronLeft, ChevronRight, Filter } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import makeAnimated from "react-select/animated";
import Selects from "react-select";
const PENDING_PAYMENT_LABEL = "Pending Payment";
const ORDER_PLACED_LABEL = "Order Placed";
const SHIPPED_LABEL = "Shipped";
const DELIVERED_LABEL = "Delivered";
const REFUNDED_LABEL = "Refunded";
const PARTIALLY_REFUNDED_LABEL = "Partially Refunded";
const FAILED_LABEL = "Failed";
const NCELL_ORDER_LABEL = "Ncell Order";
const FAILED_DELIVERY_LABEL = "Failed Delivery";
const AWAITING_REFUND_LABEL = "Awaiting Refund";
const READY_TO_SHIP_LABEL = "Ready To Ship";
const DRAFT_LABEL = "Draft";
const ON_HOLD_LABEL = "On Hold";
const CANCELLED_LABEL = "Cancelled";

const updateStatus = [
  { label: PENDING_PAYMENT_LABEL, value: "Pending Payment" },
  { label: ORDER_PLACED_LABEL, value: "Order Placed" },
  { label: SHIPPED_LABEL, value: "Shipped" },
  { label: DELIVERED_LABEL, value: "Delivered" },
  { label: REFUNDED_LABEL, value: "Refunded" },
  { label: PARTIALLY_REFUNDED_LABEL, value: "Partially Refunded" },
  { label: FAILED_LABEL, value: "Failed" },
  { label: NCELL_ORDER_LABEL, value: "Ncell Order" },
  { label: FAILED_DELIVERY_LABEL, value: "Failed Delivery" },
  { label: AWAITING_REFUND_LABEL, value: "Awaiting Refund" },
  { label: READY_TO_SHIP_LABEL, value: "Ready To Ship" },
  { label: DRAFT_LABEL, value: "Draft" },
  { label: ON_HOLD_LABEL, value: "On Hold" },
  { label: CANCELLED_LABEL, value: "Cancelled" },
];
interface month {
  month: String;
  index: Number;
}
const OrderPage = () => {
  const { state: orderState, dispatch: orderDispatch } = useOrder();
  const { state: endUserState, dispatch: endUserDispatch } = useEndUser();
  const { orderData, currentPage, totalPages } = orderState;
  const { userData } = endUserState;
  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [searchUserName, setSearchUserName] = useState("");
  const [statusData, setStatusData] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUserUuid, setSelectedUserUuid] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [selectedStatusKey, setSelectedStatusKey] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const router = useRouter();
  const debouncedStatusKey = useDebounce(selectedStatusKey, 300);
  const PAGE_RANGE_DISPLAY = 3;
  const { toast } = useToast();
  const debouncedSearchTerm = useDebounce(searchUserName, 400);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId") || "";
  const [month, setMonth] = useState<month[] | []>([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const animatedComponents = makeAnimated();
  const [selectedUsername, setSelectedUsername] = useState("");
  const [optionsValue, setOptionsValue] = useState([]);
  const getOrder = async () => {
    try {
      setLoading(true);
      const url = `/api/orderDetails/status`;
      const res = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      setStatusData(data?.data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);
  const uniqueStatuses = [
    ...new Set(statusData?.map((order: Order) => order?.key)),
  ];
  const handleFilterOrders = () => {
    fetchOrders(orderDispatch, currentPage, userId, {
      orderId: searchOrderId,
      month: selectedMonth?.index ? selectedMonth?.index.toString() : "",
      year: selectedMonth?.month
        ? selectedMonth?.month.toString().split(" ")[1]
        : "",
      status: debouncedStatusKey === "all" ? "" : debouncedStatusKey,
      userId: selectedUserUuid,
    });
    setIsSearchOpen(false);
  };

  const handleFilterUser = useCallback(() => {
    endUser(endUserDispatch, currentPage, { name: debouncedSearchTerm });
  }, [debouncedSearchTerm, endUserDispatch, currentPage]);

  useEffect(() => {
    if (debouncedStatusKey) {
      handleFilterOrders();
    }
  }, [debouncedStatusKey]);

  useEffect(() => {
    if (debouncedSearchTerm?.trim() !== "") {
      endUser(endUserDispatch, currentPage, { name: debouncedSearchTerm });
    } else {
      setOptionsValue([]);
    }
  }, [debouncedSearchTerm, handleFilterUser]);

  const isSearchFieldFilled = () => {
    return (
      searchOrderId !== "" ||
      searchDate !== "" ||
      searchUserName !== "" ||
      selectedMonth !== null ||
      selectedUsername !== ""
    );
  };

  const handleClear = () => {
    setSearchOrderId("");
    setSearchDate("");
    setSelectedUserUuid("");
    setSelectedStatusKey("");
    setSearchUserName("");
    setIsDropdownOpen(false);
    setSelectedUsername("");
    setOptionsValue([]);
    fetchOrders(orderDispatch, 1, userId, {});
    setSelectedMonth(null);
  };

  // **********************************S
  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    orderDispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    orderDispatch({ type: "SET_CURRENT_PAGE", payload: newPage });
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

  const onDelete = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orderDetails/del`, {
        method: "POST",
        body: JSON.stringify({ orderId: id }),
      });

      if (res.ok) {
        const data = await res.json();
        toast({ description: data.message });
        // Remove the deleted order from the local state
        orderDispatch({
          type: "SET_ORDER_DATA",
          payload: {
            ...orderData,
            data: orderData.data.filter((order: Order) => order.id !== id),
          },
        });
      } else {
        toast({
          description: "Failed to delete the order",
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

  useEffect(() => {
    fetchOrders(orderDispatch, currentPage, userId, {});
  }, [currentPage, orderDispatch]);

  const handleClickStatus = (key: string) => {
    router.push("/admin/orders");
    setSearchOrderId("");
    setSearchDate("");
    setSelectedUserUuid("");
    setSelectedStatusKey("");
    setSearchUserName("");
    setSelectedUsername("");
    setOptionsValue([]);
    setSelectedMonth(null);
    setSelectedStatusKey(key);
  };
  const handleDeleteClick = (id: number) => {
    setSelectedItemId(id);
    setDeleteDialogOpen(true);
  };

  const handleViewClick = (order: any) => {
    setSelectedOrder(order);
    setViewDialogOpen(true);
  };

  const getColor = (status: string) => {
    switch (status) {
      case "Pending Payment":
        return "bg-gray-200 text-gray-800";
      case "Order Placed":
        return "bg-green-200 text-green-800 font-semibold";
      case "Shipped":
        return "bg-blue-600 text-white";
      case "Delivered":
        return "bg-green-500 text-white font-semibold";
      case "Refunded":
        return "bg-gray-300 text-gray-800";
      case "Partially Refunded":
        return "bg-red-700 text-white";
      case "Failed":
        return "bg-red-200 text-red-800 font-semibold";
      case "Ncell Order":
        return "bg-[#622691] text-white font-semibold";
      case "Failed Delivery":
        return "bg-gray-200 text-yellow-600 font-semibold";
      case "Awaiting Refund":
        return "bg-red-700 text-white";
      case "Ready To Ship":
        return "bg-yellow-500 text-white";
      case "Draft":
        return "bg-gray-300 text-gray-800";
      case "On Hold":
        return "bg-[#fee08b] text-yellow-800";
      case "Cancelled":
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-300 text-gray-800";
    }
  };

  const handleEdit = (id: any) => {
    router.push(`/admin/orders/edit/${id}`);
  };

  // Functions For getting Months
  const getPast18MonthsWithIndex = () => {
    // Get the current date
    const today = new Date();
    const past18Months = [];
    for (let i = 0; i < 18; i++) {
      const pastDate = new Date(today);
      pastDate.setMonth(today.getMonth() - i);
      const formattedDate = pastDate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      const monthIndex = pastDate.getMonth() + 1;
      const monthObj = {
        month: formattedDate,
        index: monthIndex,
      };
      past18Months.push(monthObj);
    }

    return past18Months;
  };

  useEffect(() => {
    const month = getPast18MonthsWithIndex();
    setMonth(month);
  }, []);
  const handleMonthsChange = (value: any) => {
    setSelectedMonth(value);
  };

  const handleSearchNameChange = (value: any) => {
    setSearchUserName(value);
  };
  const handleSelectChange = (selectedValue: any) => {
    setSelectedUsername(selectedValue);
    setSelectedUserUuid(selectedValue?.value);
    setSearchUserName(selectedValue?.label);
    setOptionsValue([]);
  };
  useEffect(() => {
    if (userData?.data) {
      const options =
        userData?.data?.map((item) => ({
          label: item.fullName,
          value: item.uuid,
        })) || [];
      setOptionsValue(options);
    }
  }, [userData]);
  //
  const getLabelStatus = (status: String) => {
    const matchedStatus = updateStatus.find((item) => item.value === status);
    if (matchedStatus) {
      return matchedStatus.label;
    } else {
      return status;
    }
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between ">
        <div></div>
        <div className="z-50">
          {" "}
          <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilterOutline className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 overflow-visible pb-2 p-4 mr-16">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="space-y-2 p-2">
                <div className="relative">
                  <Selects
                    className="basic-single"
                    classNamePrefix="select"
                    isMulti={false}
                    isClearable
                    components={animatedComponents}
                    options={optionsValue}
                    onChange={handleSelectChange}
                    value={selectedUsername}
                    onInputChange={handleSearchNameChange}
                    placeholder="Search..."
                    components={{ DropdownIndicator: null }}
                    styles={{
                      menu: (base) => ({
                        ...base,
                        position: "absolute",
                        zIndex: 9999,
                        backgroundColor: "white",
                        width: "100%",
                      }),
                      control: (base) => ({
                        ...base,
                        zIndex: 0,
                      }),
                      container: (base) => ({
                        ...base,
                        zIndex: 0,
                      }),
                    }}
                  />
                </div>

                <Input
                  type="text"
                  placeholder="Order ID"
                  value={searchOrderId}
                  onChange={(e) => setSearchOrderId(e.target.value)}
                  className="mt-2"
                />

                <Select
                  value={selectedMonth}
                  onValueChange={handleMonthsChange}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {selectedMonth?.month || "Select month"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {month?.map((monthItem, index) => (
                      <SelectItem key={index} value={monthItem}>
                        {monthItem.month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex flex-row gap-4 mt-4">
                  <Button
                    className="bg-blue-500 hover:bg-blue-600"
                    onClick={handleFilterOrders}
                  >
                    Search
                  </Button>
                  {isSearchFieldFilled() && (
                    <Button
                      className="bg-red-500 hover:bg-red-600"
                      onClick={handleClear}
                    >
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
          <CardTitle>Order Management</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="flex flex-wrap gap-4 p-4 ">
            {statusData?.map((item) => (
              <div
                key={item.name}
                onClick={() => handleClickStatus(item.key)}
                className={`cursor-pointer font-medium flex gap-1 items-center ${
                  (selectedStatusKey || "all") === item.key
                    ? "text-black font-medium "
                    : "text-blue-700"
                }`}
              >
                <span className="font-semibold text-xs">{item.name}</span>

                <span className="text-xs text-gray-500">({item.count})</span>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Date</TableHead>

                  <TableHead>Billing </TableHead>
                  <TableHead>Ship To </TableHead>
                  <TableHead className="text-center whitespace-nowrap">
                    Coupon(s) Used
                  </TableHead>
                  <TableHead className="text-center">Total</TableHead>
                  <TableHead className="text-center">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderData?.data?.map((item: Order) => (
                  <TableRow
                    key={item.id}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/admin/orders/show/${item.id}`);
                    }}
                  >
                    <TableCell className="font-medium whitespace-nowrap ">
                      #{item.id} {item.customerName}
                      <a
                        className="ml-2 "
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewClick(item.id);
                        }}
                      >
                        <FaEye className=" inline-block cursor-pointer text-blue-500 hover:text-blue-700" />
                      </a>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full ${getColor(
                          item.status
                        )} text-xs font-semibold`}
                      >
                        {getLabelStatus(item?.status)}
                        {/* {item.status} */}
                      </span>
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      {item.date}
                    </TableCell>

                    <TableCell>
                      {item.shipTo}, <br></br>
                      {item.shipToAddress} <br />
                      <span className="text-slate-500 font-semibold">
                        {" "}
                        via {item.paymentMethod}
                      </span>
                    </TableCell>

                    <TableCell className="">
                      <a
                        href={`https://www.google.com/maps?q=${encodeURIComponent(
                          item?.shipToAddress
                        )}`}
                        target="_blank"
                        className="text-blue-600 hover:underline "
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                      >
                        {item?.shipTo}, <br></br>
                        {item?.shipToAddress}
                      </a>
                    </TableCell>

                    <TableCell className="text-center">
                      {item.coupons.length > 0 ? (
                        <TooltipProvider>
                          <div className="grid grid-cols-2 gap-2  max-w-sm">
                            {item?.coupons.map((cou) => (
                              <Tooltip key={cou.couponCode}>
                                <TooltipTrigger asChild>
                                  <span className="cursor-pointer border w-fit text-xs p-1 mt-2 text-center">
                                    {cou.couponCode}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>
                                    {cou.isPercent
                                      ? `${cou.value}%`
                                      : cou.discountAmount}
                                  </p>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </div>
                        </TooltipProvider>
                      ) : (
                        <span className="font-semibold">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center whitespace-nowrap">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="font-semibold cursor-pointer">
                              Rs{" "}{item.total}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>{item.paymentMethod}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                    <TableCell className="text-center ">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <BsThreeDots />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Order Actions</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Link
                              href={`/admin/orders/show/${item.id}`}
                              className="flex items-center cursor-pointer w-full"
                            >
                              View
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(item.id);
                            }}
                          >
                            Edit
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteClick(item.id);
                            }}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>

                      <AlertDialog
                        open={deleteDialogOpen}
                        onOpenChange={setDeleteDialogOpen}
                      >
                        <AlertDialogTrigger asChild>
                          {/* <button className="flex items-center w-full text-red-500 hover:text-red-700">
              Delete
            </button> */}
                        </AlertDialogTrigger>
                        {/* {deleteDialogOpen && (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-30"></div>
  )} */}
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure you want to delete this order?
                            </AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel
                              className="bg-red-500 hover:bg-red-600 text-white hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteDialogOpen(false);
                              }}
                            >
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-[#5e72e4] hover:bg-[#465ad1]"
                              onClick={(e) => {
                                e.stopPropagation();
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
                      {/* <div className="flex justify-center space-x-2">
                      <Link href={`/admin/orderDetails/show/${item.id}`} className="text-blue-500 hover:text-blue-700">
                        <FaEye />
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <FaTrash className="text-red-500 hover:text-red-700" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to delete this order?</AlertDialogTitle>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => onDelete(item.id)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div> */}
                    </TableCell>
                  </TableRow>
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
          {/* <div className="flex justify-between items-center mt-4">
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
                onClick={() => typeof page === 'number' ? orderDispatch({ type: 'SET_CURRENT_PAGE', payload: page }) : null}
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

          <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
            <DialogTrigger asChild></DialogTrigger>
            {viewDialogOpen && (
              <DialogContent className="max-w-[700px]  h-auto">
                <ShowData IdData={selectedOrder} />
              </DialogContent>
            )}
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
};

// Wrap the component with the OrderProvider
const OrderPageWithProviders = () => (
  <EndUserProvider>
    <OrderProvider>
      <OrderPage />
    </OrderProvider>
  </EndUserProvider>
);

export default OrderPageWithProviders;
