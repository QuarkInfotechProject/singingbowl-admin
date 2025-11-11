"use client";
import { OrderApiResponse } from "@/app/_types/orderType/showType";
import React, { useEffect, useState } from "react";
import crypto from "crypto";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import {
  FaUser,
  FaMapMarkerAlt,
  FaBoxOpen,
  FaMoneyBillWave,
  FaTrash,
  FaUserSecret,
  FaChevronUp,
  FaChevronDown,
  FaUndo,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { BsQuestionSquareFill } from "react-icons/bs";
import { FaDownload } from "react-icons/fa6";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import axios from "axios";

const PENDING_PAYMENT = "pending_payment";
const ORDER_PLACED = "processing";
const ON_HOLD = "on_hold";
const DELIVERED = "completed";
const CANCELLED = "cancelled";
const REFUNDED = "refunded";
const FAILED = "failed";
const NCELL_ORDER = "ncell_order";
const FAILED_DELIVERY = "failed_delivery";
const AWAITING_REFUND = "awaiting_refund";
const PARTIALLY_REFUNDED = "partially_refund";
const SHIPPED = "shipped";
const READY_TO_SHIP = "shipment";
const DRAFT = "draft";
const updateStatus = [
  { label: "Pending Payment", value: PENDING_PAYMENT },
  { label: "Order Placed", value: ORDER_PLACED },
  { label: "Shipped", value: SHIPPED },
  { label: "Delivered", value: DELIVERED },
  { label: "Refunded", value: REFUNDED },
  { label: "Partially Refunded", value: PARTIALLY_REFUNDED },
  { label: "Failed", value: FAILED },
  { label: "Ncell Order", value: NCELL_ORDER },
  { label: "Failed Delivery", value: FAILED_DELIVERY },
  { label: "Awaiting Refund", value: AWAITING_REFUND },
  { label: "Ready To Ship", value: READY_TO_SHIP },
  { label: "Draft", value: DRAFT },
  { label: "On Hold", value: ON_HOLD },
  { label: "Cancelled", value: CANCELLED },
];

const OrderPageView = ({ params }: { params: { id: string } }) => {
  const [orderShow, setOrderShow] = useState<OrderApiResponse | null>(null);
  const [refundShow, setRefundShow] = useState<OrderApiResponse | null>(null);
  const [logShow, setLogShow] = useState<OrderApiResponse | null>(null);
  const [newStatus, setNewStatus] = useState<string>("");
  const [newNote, setNewNote] = useState<string>("");
  const [noteText, setNoteText] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [refetch, setRefetch] = useState(false);
  const [isRefundExpanded, setIsRefundExpanded] = useState(false);
  const [selectedOrders, setSelectedOrders] = useState({});
  const [selectedItems, setSelectedItems] = useState<{
    [key: string]: {
      quantity: number;
      totalAmount: number;
      unitAmount: number;
    };
  }>({});
  const [selectAll, setSelectAll] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundConfirmed, setRefundConfirmed] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [isAnyItemSelected, setIsAnyItemSelected] = useState(false);

  const [quantity, setQuantity] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const router = useRouter();
  const { toast } = useToast();
  const toggleRefund = () => {
    setIsRefundExpanded(!isRefundExpanded);
    if (!isRefundExpanded) {
      setSelectedItems({});
      setSelectAll(false);
    }
  };

  const handleOtherOrders = (selectedId) => {
    if (selectedId) {
      router.push(`/admin/orders?userId=${selectedId}`);
    }
  };
  // Function to convert hash to color
  const hashToColor = (hash) => {
    if (!hash) return;
    const cleanHash = hash.charAt(0) === "#" ? hash.substring(1, 7) : hash;
    const rgb = parseInt(cleanHash, 16);
    const r = (rgb >> 16) & 0xff;
    const g = (rgb >> 8) & 0xff;
    const b = (rgb >> 0) & 0xff;
    return `rgb(${r}, ${g}, ${b})`;
  };

  const ColorCircle = ({ color }) => (
    <span
      className="inline-block w-3 h-3 rounded-full mr-1 align-middle"
      style={{ backgroundColor: color }}
    />
  );
  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/orderDetails/showDetail/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data: OrderApiResponse = await res.json();
        setOrderShow(data);
        setNewStatus(data.data.status);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };
    getData(params.id);
  }, [params.id]);

  useEffect(() => {
    const getRefund = async (id: string) => {
      const url = `/api/order/refund/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data: OrderApiResponse = await res.json();
        setRefundShow(data);
        // setNewStatus(data.data.status);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };
    getRefund(params.id);
  }, [params.id, refreshTrigger]);

  useEffect(() => {
    const getLog = async (id: string) => {
      const url = `/api/order/orderLog/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data: OrderApiResponse = await res.json();
        setLogShow(data);
        // setNewStatus(data.data.status);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };
    getLog(params.id);
  }, [params.id, refreshTrigger]);

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };
  // const handleQuantityChange = (e) => {
  //   const newValue = Math.min(Math.max(0, parseInt(e.target.value) || 0));
  //   setQuantity(newValue);

  // };
  const refundTotal = selectedOrders?.refund?.totalAmount;
  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    const item = orderShow?.data.itemsOrdered.find(
      (i) => i.orderItemId === itemId
    );
    if (item) {
      const validQuantity = Math.min(Math.max(0, newQuantity), item.quantity);
      const newTotalAmount = validQuantity * parseFloat(item.unitPrice);
      const unitAmounts = parseFloat(item.unitPrice);

      setSelectedItems((prev) => ({
        ...prev,
        [itemId]: {
          quantity: validQuantity,
          totalAmount: newTotalAmount,
          unitAmount: unitAmounts,
        },
      }));
    }
  };

  const handleItemSelection = (itemId: string, checked: boolean) => {
    let newSelectedItems = { ...selectedItems };

    if (checked) {
      const item = orderShow?.data.itemsOrdered.find(
        (i) => i.orderItemId === itemId
      );
      if (item) {
        newSelectedItems[itemId] = {
          quantity: item.quantity,
          totalAmount: parseFloat(item.lineTotal),
        };
      }
    } else {
      delete newSelectedItems[itemId];
    }

    setSelectedItems(newSelectedItems);
    setIsAnyItemSelected(Object.keys(newSelectedItems).length > 0);
    setSelectAll(
      Object.keys(newSelectedItems).length ===
        orderShow?.data.itemsOrdered.length
    );
  };

  const isItemSelected = (itemId: string) => {
    return !!selectedItems[itemId];
  };

  const calculateTotalRefund = () => {
    return Object.values(selectedItems).reduce(
      (total, item) => total + item.totalAmount,
      0
    );
  };

  if (!orderShow)
    return (
      <div className="container mx-auto p-4 space-y-6">
        {/* Header Section */}
        <div className="flex flex-row justify-between items-center gap-2 px-4">
          <div className="flex justify-center items-center gap-x-2">
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-6 w-32" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>

        {/* Main Order Card */}
        <Card>
          <CardHeader className="bg-gray-50 border-b">
            <CardTitle className="flex items-center">
              <Skeleton className="h-6 w-48" />
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-gray-200">
            {/* Order Header */}
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-9 w-[180px]" />
                  <Skeleton className="h-9 w-28" />
                </div>
              </div>
              <Skeleton className="h-6 w-24" />
            </div>

            {/* Order Items Table */}
            <div className="py-4">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="space-y-4">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      <Skeleton className="h-12 w-12 rounded" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                    <div className="flex items-center space-x-8">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="space-y-3 ml-auto w-48">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer and Shipping Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border p-2">
          <div className="flex flex-col gap-y-3">
            {/* Customer Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
                <div className="border-t-2 my-3 pt-2">
                  <Skeleton className="h-4 w-full" />
                </div>
              </CardContent>
              <CardFooter>
                <div className="flex space-x-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardFooter>
            </Card>

            {/* Shipping Address Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3, 4, 5].map((item) => (
                  <Skeleton key={item} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>

            {/* Customer History Card */}
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[1, 2, 3].map((item) => (
                  <Skeleton key={item} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Notes Card */}
          <div className="flex flex-grow">
            <Card className="w-full">
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-32" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 h-[430px]">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="p-3 rounded-lg border">
                      <Skeleton className="h-16 w-full" />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-24 w-full" />
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-9 w-[200px]" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Payment Info Section */}
        <div className="grid grid-cols-5">
          <div className="col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-6 w-48" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-48" />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );

  const {
    subtotal,
    discount,
    total,
    createdAt,
    paymentMethod,
    transactionDetails,
    status,
    userDetails,
    addressInformation,
    paid,
    totalPaid,
    availableToRefund,
    refundedAmount,
    itemsOrdered,
    orderLogData,
    couponData,
  } = orderShow?.data;

  const handleBack = () => {
    router.push("/admin/orders");
  };

  const handleStatusChange = async () => {
    if (!orderShow) return;
    const id = orderShow.data.id;
    console.log(id, newStatus);

    // Implement the API call to update the status
    try {
      const res = await fetch(`/api/orderDetails/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, status: newStatus }),
      });
      if (res.ok) {
        triggerRefresh();
        setOrderShow((prevState) => ({
          ...prevState!,
          data: { ...prevState!.data, status: newStatus },
        }));
        toast({
          description: "Order status updated successfully",
          className: "bg-green-500 text-white",
        });
        handleStatusChange;
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      toast({
        description: "Failed to update order status",
        variant: "destructive",
      });
    }
  };
  const handleSubmit = async () => {
    if (!orderShow) return;
    const id = orderShow.data.id;
    console.log(id, newNote);

    // Implement the API call to update the status
    try {
      const res = await fetch(`/api/note`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          noteType: newNote,
          note: noteText,
        }),
      });
      if (res.ok) {
        triggerRefresh();
        setOrderShow((prevState) => ({
          ...prevState!,
          data: { ...prevState!.data, status: newStatus },
        }));
        setNoteText("");
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const onDelete = async (id, noteId) => {
    setLoading(true);
    const deleteData = {
      orderId: id,
      noteId: noteId,
    };

    try {
      const res = await fetch(`/api/note/del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();
        triggerRefresh();
        setRefetch(true);
        toast({
          className: "bg-green-500 text-white font-semibold",
          description: `${data.message}`,
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
  const handleSelectAllChange = (checked: boolean) => {
    setSelectAll(checked);
    if (checked && orderShow) {
      const allItems = orderShow.data.itemsOrdered.reduce((acc, item) => {
        acc[item.orderItemId] = {
          quantity: item.quantity,
          totalAmount: parseFloat(item.lineTotal),
          unitAmount: parseFloat(item.unitPrice),
        };
        return acc;
      }, {});
      setSelectedItems(allItems);
    } else {
      setSelectedItems({});
    }
  };

  const handleRoute = (id) => {
    router.push(`/admin/products/edit/${id}`);
  };
  const handleRouteRefund = (id) => {
    router.push(`/admin/products/edit/${id}`);
  };

  const getColor = (status: string) => {
    console.log("status", status);
    switch (status) {
      case PENDING_PAYMENT:
        return "bg-gray-200 text-gray-800 font-semibold";
      case ORDER_PLACED:
        return "bg-green-500 text-white font-semibold";
      case ON_HOLD:
        return "bg-[#fee08b] text-yellow-800";
      case DELIVERED:
        return "bg-green-500 text-white font-semibold";
      case CANCELLED:
        return "bg-gray-300 text-gray-800";
      case REFUNDED:
        return "bg-gray-300 text-gray-800";
      case FAILED:
        return "bg-red-200 text-red-800 font-semibold";
      case NCELL_ORDER:
        return "bg-[#622691] text-white font-semibold";
      case FAILED_DELIVERY:
        return "bg-gray-200 text-yellow-600 font-semibold";
      case AWAITING_REFUND:
        return "bg-red-700 text-white";
      case PARTIALLY_REFUNDED:
        return "bg-red-700 text-white";
      case SHIPPED:
        return "bg-blue-600 text-white";
      case READY_TO_SHIP:
        return "bg-yellow-500 text-white";
      case DRAFT:
        return "bg-gray-300 text-gray-800";
      default:
        return "bg-gray-500 text-white";
    }
  };
  const handleViewProfile = (id) => {
    router.push(`/admin/users/edit/${id}`);
  };
  console.log("new status", newStatus);

  const getLabelStatus = (status: String) => {
    const matchedStatus = updateStatus.find((item) => item.value === status);
    if (matchedStatus) {
      return matchedStatus.label;
    } else {
      return status;
    }
  };
  // const handleRefundSubmit = async () => {};
  //dowmnload
  
  const handleDownload = async (id: string | number) => {
  try {
    if (!id) {
      toast({
        description: "Invalid order ID",
        variant: "destructive",
      });
      return;
    }

    // Environment validation
    const API_SECRET = process.env.NEXT_PUBLIC_API_SECRET;
    const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
    
    if (!API_SECRET || !BASE_URL) {
      toast({
        description: "Configuration error. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    // Generate request signature
    const nonce = crypto.randomBytes(16).toString("hex");
    const timestamp = Date.now();
    const signature = crypto
      .createHmac("sha256", API_SECRET)
      .update(`${nonce}${timestamp}`)
      .digest("hex");
    let token: string;
    try {
      const tokenResponse = await axios.post("/api/getToken", {
        nonce,
        timestamp,
        signature,
      });
      if (!tokenResponse.data?.token) {
        throw new Error("No token received from server");
      }
      token = tokenResponse.data.token;
    } catch (tokenError) {
      toast({
        description: "Authentication failed. Please try again.",
        variant: "destructive",
      });
      return;
    }
    // Download invoice
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: "application/pdf",
    };

    const response = await fetch(
      `${BASE_URL}/orders/download-invoice/${id}`,
      {
        method: "GET",
        headers,
      }
    );

    // Proper response status checking
    if (!response.ok) {
      throw new Error(`Download failed with status: ${response.status}`);
    }

    // Check if response is actually a PDF
    const contentType = response.headers.get("content-type");
    if (contentType && !contentType.includes("application/pdf")) {
      throw new Error("Invalid file format received");
    }
    const blob = await response.blob();
    // Validate blob
    if (blob.size === 0) {
      throw new Error("Empty file received");
    }
    // Create and trigger download
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice-${userDetails?.name}.pdf`;
    
    // More reliable download trigger
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }, 100);
    toast({
      description: "Invoice downloaded successfully",
      className: "bg-green-500 text-white",
    });
  } catch (error) {
    console.error("Download failed:", error);
    
    // More specific error messages
    let errorMessage = "Failed to download invoice";
    
    if (error instanceof Error) {
      if (error.message.includes("status: 404")) {
        errorMessage = "Invoice not found";
      } else if (error.message.includes("status: 403")) {
        errorMessage = "Access denied";
      } else if (error.message.includes("status: 500")) {
        errorMessage = "Server error. Please try again later.";
      }
    }
    
    toast({
      description: errorMessage,
      variant: "destructive",
    });
  }
};
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-row justify-between items-center gap-2 px-4 ">
        <div className="flex justify-center items-center gap-x-2">
          <Button
            onClick={handleBack}
            variant="outline"
            size="xs"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold"> Order Details</h1>
        </div>
        <div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  className="w-16"
                  variant="outline"
                  size="icon"
                  onClick={() => handleDownload(params?.id)}
                >
                  <FaDownload className="h-5 w-5" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Download</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <Card className="">
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="flex items-center text-xl font-semibold text-gray-800">
            <FaBoxOpen className="mr-2 " />
            Order Details and Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-gray-200">
          <div className="py-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <p className="font-semibold text-lg">
                  Order ID: #{orderShow.data.id}
                </p>
                <p className="text-gray-600">
                  Date: {orderShow?.data?.createdAt}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Select value={newStatus} onValueChange={setNewStatus}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status">
                      {getLabelStatus(newStatus)}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {updateStatus?.map((item, index) => (
                      <SelectItem key={index} value={item?.value}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  className="bg-blue-500 hover:bg-blue-600"
                  onClick={handleStatusChange}
                >
                  Update Status
                </Button>
              </div>
            </div>
            <Badge className={`${getColor(status)} font-semibold`}>
              {getLabelStatus(status)}{" "}
            </Badge>
          </div>

          <div className="py-4">
            <h3 className="font-semibold text-lg mb-2">Ordered Items</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  {isRefundExpanded && (
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectAll}
                        onCheckedChange={handleSelectAllChange}
                      />
                      {/* {selectAll && getSelectedOrderIds().length > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                          {getSelectedOrderIds().join(', ')}
                        </span>
                      )} */}
                    </TableHead>
                  )}
                  <TableHead className="">Item</TableHead>
                  <TableHead className="">Options</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                  <TableHead className="text-center">Unit Price</TableHead>
                  <TableHead className="text-center">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderShow?.data.itemsOrdered.map((item) => (
                  <TableRow key={item.orderItemId}>
                    {isRefundExpanded && (
                      <TableCell>
                        <Checkbox
                          checked={isItemSelected(item.orderItemId)}
                          onCheckedChange={(checked) =>
                            handleItemSelection(item.orderItemId, checked)
                          }
                        />
                      </TableCell>
                    )}
                    <TableCell className="font-medium text-center">
                      <div
                        className="flex items-center space-x-2 cursor-pointer"
                        onClick={() => handleRoute(item.id)}
                      >
                        <img
                          src={item.baseImage}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded"
                        />
                        <span>{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="flex justify-start text-center space-x-6 items-center">
                      {item.optionValue1 && (
                        <span className="inline-flex items-center">
                          <span>
                            {`${item.optionName1}`}:{" "}
                            <ColorCircle
                              color={hashToColor(item.optionData1)}
                            />
                            {`${item.optionValue1}`}
                          </span>
                        </span>
                      )}
                      {item.optionValue2 && (
                        <span className="inline-flex items-center ml-2">
                          <span>
                            {`${item.optionName2}`}:{" "}
                            <ColorCircle
                              color={hashToColor(item.optionData2)}
                            />
                            {`${item.optionValue2}`}{" "}
                          </span>
                        </span>
                      )}
                      {item.optionValue3 && (
                        <span className="inline-flex items-center ml-2">
                          <span>
                            {`${item.optionName3}`}:{" "}
                            <ColorCircle
                              color={hashToColor(item.optionData3)}
                            />
                            {`${item.optionValue3}`}
                          </span>
                        </span>
                      )}
                    </TableCell>
                    <TableCell className=" text-center">
                      x {item.quantity}
                      {isRefundExpanded && isItemSelected(item.orderItemId) && (
                        <Input
                          type="number"
                          placeholder="0"
                          className="w-20 ml-2"
                          value={
                            selectedItems[item.orderItemId]?.quantity ||
                            item.quantity
                          }
                          onChange={(e) =>
                            handleQuantityChange(
                              item.orderItemId,
                              parseInt(e.target.value)
                            )
                          }
                          min={0}
                          max={item.quantity}
                        />
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      ${" "}
                      {parseFloat(item.unitPrice).toLocaleString(undefined, {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className="text-center ">
                      ${" "}
                      {parseFloat(item.lineTotal).toLocaleString(undefined, {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 2,
                      })}
                      {isRefundExpanded && isItemSelected(item.orderItemId) && (
                        <Input
                          type="number"
                          placeholder=""
                          className="w-24 ml-2"
                          value={(
                            selectedItems[item.orderItemId]?.totalAmount ||
                            parseFloat(item.lineTotal)
                          ).toFixed(2)}
                          readOnly
                        />
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {!isRefundExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2  gap-6">
              <div className="space-y-4">
                {couponData.length > 0 ? (
                  <div className=" p-4 my-4">
                    <div className="mb-2">
                      <h3 className="text-xs font-semibold px-2.5">Coupon </h3>
                    </div>
                    <TooltipProvider>
                      {couponData.map((cou) => (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-xs  font-semibold text-gray-600 ml-2 cursor-pointer hover:text-black p-2 rounded-sm bg-white  w-fit border">
                              {cou.couponCode}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>
                              {cou.isPercent
                                ? `${cou.value}%`
                                : `$${cou.discountAmount}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      ))}
                    </TooltipProvider>
                  </div>
                ) : (
                  <span className="font-semibold"></span>
                )}
              </div>

              <div>
                <div className="p-6">
                  <div className="space-y-4 ml-52 px-4 ">
                    {/* Subtotal */}
                    <div className="flex justify-between items-center">
                      <span className="font-normal text-xs mr-auto">
                        Subtotal:
                      </span>
                      <span className="font-bold text-xs ml-auto">
                        ${" "}
                        {parseFloat(subtotal).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 3,
                        })}
                      </span>
                    </div>

                    {/* Discount */}
                    <div className="flex justify-between items-center">
                      <span className="font-normal text-xs mr-auto">
                        Discount:
                      </span>
                      <span className="text-red-600 text-xs font-bold ml-auto">
                        - ${" "}
                        {parseFloat(discount)?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          maximumSignificantDigits: 3,
                        })}
                      </span>
                    </div>

                    {/* Total */}
                    <div className="flex justify-between items-center">
                      <span className="font-normal text-xs mr-auto">
                        Total:
                      </span>
                      <span className="font-bold text-xs ml-auto">
                        ${" "}
                        {parseInt(total)?.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                          minimumFractionDigits: 2,
                        })}
                      </span>
                    </div>

                    {/* Paid Amount (if applicable) */}
                    {paid === "Yes" && (
                      <div className="flex border-t py-1 border-gray-200 gap-4 justify-between my-2">
                        <span className="font-normal text-xs mr-auto">
                          Paid
                        </span>
                        <span className="font-bold text-xs ml-auto">
                          ${" "}
                          {parseFloat(totalPaid)?.toLocaleString(undefined, {
                            maximumFractionDigits: 3,
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                    )}

                    {/* Refunded Amount (if applicable) */}
                    {refundedAmount === "Yes" && (
                      <div className="border-t py-1 flex justify-between gap-4 border-gray-200 my-2">
                        <span className="font-normal text-xs mr-auto">
                          Refunded:
                        </span>
                        <span className="font-bold text-xs text-red-500 ml-auto">
                          - ${" "}
                          {parseFloat(refundedAmount)?.toLocaleString(
                            undefined,
                            {
                              maximumFractionDigits: 3,
                              minimumFractionDigits: 2,
                            }
                          )}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="py-4 flex justify-between">
            <Button
              onClick={toggleRefund}
              className={`w-fit flex justify-between items-center ${
                isRefundExpanded
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-blue-500 hover:bg-blue-600"
              } text-white hover:text-white`}
              variant="outline"
            >
              {isRefundExpanded ? "Cancel" : "Refund"}
              {isRefundExpanded ? (
                <FaChevronUp className="ml-2" />
              ) : (
                <FaChevronDown className="ml-2" />
              )}
              {/* {isRefundExpanded ? <FaChevronUp /> : <FaChevronDown />} */}
            </Button>

            {isRefundExpanded && (
              <div className="flex w-fit ">
                <div className=" p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="refund-confirm"
                        className="ml-2 block text-xs text-left   text-gray-900"
                      >
                        Restock refunded items
                      </label>
                      <Checkbox
                        id="refund-confirm"
                        checked={refundConfirmed}
                        onCheckedChange={(checked) =>
                          setRefundConfirmed(checked as boolean)
                        }
                      />
                    </div>
                    <div className="flex items-center text-xs justify-between">
                      <label
                        htmlFor="refund-amount"
                        className="block text-xs  text-left   text-gray-900"
                      >
                        Amount already refunded
                      </label>
                      <span className="font-bold text-red-500">
                        {" "}
                        -${" "}
                        {parseFloat(refundedAmount)?.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 3,
                        })}
                      </span>
                    </div>
                    <div className="flex items-center text-xs justify-between">
                      <label
                        htmlFor="refund-amount"
                        className="block text-xs text-left   text-gray-900"
                      >
                        Total available to refund
                      </label>
                      <span className="font-bold">
                        ${" "}
                        {parseFloat(availableToRefund)?.toLocaleString(
                          undefined,
                          { minimumFractionDigits: 2, maximumFractionDigits: 3 }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center text-xs justify-between">
                      <label
                        htmlFor="refund-amount"
                        className="block text-left  font-medium text-gray-700"
                      >
                        Refund Amount
                      </label>
                      <input
                        type="number"
                        id="refund-amount"
                        value={calculateTotalRefund().toFixed(2)}
                        readOnly
                        className="w-36 p-2 border border-gray-300 rounded-md mt-1"
                      />
                    </div>

                    <div className="flex items-center text-xs gap-4">
                      <label
                        htmlFor="refund-reason"
                        className="block font-medium text-gray-700"
                      >
                        Reason for Refund
                      </label>
                      <input
                        id="refund-reason"
                        placeholder=""
                        className="w-36 h-7 p-2 border border-gray-300 rounded-sm mt-1"
                        type="text"
                        value={refundReason}
                        onChange={(e) => setRefundReason(e.target.value)}
                      />
                    </div>

                    <div className="flex justify-between">
                      <div></div>
                      <Button
                        className="bg-blue-500 hover:bg-blue-600 w-fit "
                        // onClick={() => handleRefundSubmit(orderShow.data.id)}
                      >
                        Process Refund
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      <div className="grid h-[780px] grid-cols-1 md:grid-cols-2 gap-2 border p-2">
        <div className="flex flex-col gap-y-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center ">
                <FaUser className="mr-2 text-blue-500" />
                Customer Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col">
                <p>
                  <strong>Name:</strong> {userDetails.name}
                </p>
                <p>
                  <strong>Email:</strong> {userDetails.email}
                </p>
              </div>

              <div className="border-t-2 my-3">
                <strong className="font-bold">Customer Note :</strong>
                <p>
                  {orderShow?.data?.note
                    ? orderShow?.data?.note
                    : "Not Provided."}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex justify-start items-center space-x-5">
                <p
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => handleViewProfile(userDetails.userId)}
                >
                  Profile
                </p>

                <p
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => handleOtherOrders(userDetails.userId)}
                >
                  View Other Orders
                </p>
              </div>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center ">
                <FaMapMarkerAlt className="mr-2  text-red-500" />
                Shipping Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>FullName : </strong> {addressInformation?.firstName}{" "}
                {addressInformation?.lastName}
              </p>
              <p>
                <strong>Address : </strong>
                {addressInformation?.address}
              </p>
              <p>
                <strong>City :</strong> {addressInformation?.cityName}
              </p>
              <p>
                <strong>Province : </strong>
                {addressInformation?.provinceName}
              </p>
              <p>
                <strong>Zone : </strong> {addressInformation?.zoneName}{" "}
              </p>
              <p>
                <strong>Country : </strong>
                {addressInformation?.countryName}
              </p>
              <p>
                <strong>Mobile:</strong> {addressInformation?.mobile}
              </p>
              <div className="h-5">
                {addressInformation.backupMobile.length > 0 && (
                  <p>
                    <strong>Backup Mobile:</strong>{" "}
                    {addressInformation.backupMobile}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaUser className="mr-2 text-blue-500" />
                Customer history
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="flex">
                <strong className="flex items-center space-x-2">
                  <span className="pb-1"> Total Orders</span>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <BsQuestionSquareFill className="rounded-full" />
                      </TooltipTrigger>
                      <TooltipContent className="h-24 text-white bg-[rgba(0,0,0,0.8)] w-60">
                        <p className="flex-wrap text-md text-center">
                          Total number of non-cancelled, non-failed orders for
                          this customer, including the current one.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>{" "}
                  <span className="px-1 pb-1"> : </span>
                </strong>{" "}
                {userDetails.totalOrders}
              </p>

              <p className="flex">
                <strong className="flex items-center justify-center space-x-2">
                  <span className="pb-1">Total Revenue</span>{" "}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <BsQuestionSquareFill className="rounded-full" />
                      </TooltipTrigger>
                      <TooltipContent className="h-24 text-white bg-[rgba(0,0,0,0.8)] w-60">
                        <p className="flex-wrap text-md text-center">
                          This is the Customer Lifetime Value, or the total
                          amount you have earned from this customer's orders.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <span className="px-1 pb-1"> :</span>
                </strong>{" "}
               $ {userDetails.totalRevenue}
              </p>
              <p>
                <strong>Average Order Value : </strong>
                {"   "}
               $ {userDetails.averageOrderValue}
              </p>
            </CardContent>
            {/* <CardFooter>
              <div className="flex justify-start items-center space-x-5">
                <p
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => handleViewProfile(userDetails.userId)}
                >
                  Profile
                </p>

                <p
                  className="text-blue-500 cursor-pointer underline"
                  onClick={() => handleOtherOrders(userDetails.userId)}
                >
                  View Other Orders
                </p>
              </div>
            </CardFooter> */}
          </Card>
        </div>

        <div className="flex flex-grow">
          <Card className="w-[570px] h-[755px]">
            <CardHeader className="bg-gray-50 h-16">
              <CardTitle className="flex items-center space-x-3 text-lg font-semibold text-gray-700">
                {/* <FaMapMarkerAlt className="mr-2 text-blue-500" /> */}
                Order Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 mt-2">
              <div className="space-y-3 h-[430px] overflow-y-auto p-2">
                {logShow?.data?.map((item) => (
                  <div
                    key={item.noteId}
                    className={`p-3 rounded-lg border border-gray-200 shadow-sm ${
                      item.noteType === "Personal Note"
                        ? "bg-[hsl(324,8%,88%)]"
                        : "bg-gray-"
                    } `}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        {/* <p className="font-medium text-gray-800 flex items-center">
                    {item.noteType === 'Personal Note' ? <FaUserSecret className="mr-2 text-purple-500" /> : <FaUser className="mr-2 text-green-500" />}
                   
                  </p> */}
                        <p className="font-medium text-gray-800 text-sm ">
                          {item.description}
                          <span className="text-xs  text-gray-600">
                            {item.modifierName?.length > 0 && (
                              <p>by {item.modifierName}</p>
                            )}
                          </span>{" "}
                        </p>
                      </div>
                      <button
                        // variant="ghost"
                        className="p-1"
                        onClick={() => onDelete(orderShow.data.id, item.noteId)}
                        // disabled={isLoading}
                      >
                        <FaTrash className="text-red-500 text-xs" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-400 p-0 mt-2">
                      {item.createdAt}
                    </p>
                  </div>
                ))}

                {refundShow?.data?.map((refund, index) => (
                  <div
                    key={index}
                    className="bg-orange-50  p-4 rounded-lg border border-orange-200 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-2 gap-4 text-sm">
                      <span className="text-md font-semibold text-orange-700 flex items-center">
                        <FaUndo className="mr-2" /> Refund
                      </span>
                      <span className="text-xs text-gray-500">
                        {refund.refundDetails.refundedAt}
                      </span>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium text-sm text-gray-700">
                        Amount:{" "}
                      </span>
                      <span className="text-orange-600 text-sm">
                       $ {parseFloat(refund.refundDetails.amount).toFixed(0)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">
                      {refund.refundDetails.reason}
                    </p>
                    <div className="space-y-2">
                      {refund.refundedItems.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          onClick={() => handleRouteRefund(item.id)}
                          className="flex cursor-pointer items-center space-x-2 bg-white p-2 rounded-md"
                        >
                          <img
                            src={item.baseImage}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{item.name}</p>
                            <p className="text-xs text-gray-500">
                              {item.optionName1}:{" "}
                              <span style={{ color: item.optionData1 }}>
                                {item.optionValue1}
                              </span>
                            </p>
                            <p className="text-xs text-gray-500">
                              Qty: {item.quantity} | Amount: ${" "}
                              {parseFloat(item.amount).toFixed(0)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-1 p-1">
                <p className="flex gap-x-3 justify-start items-center">
                  <strong className="pb-1.5">Add Notes</strong>{" "}
                  <span>
                    {" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <BsQuestionSquareFill className="rounded-full" />
                        </TooltipTrigger>
                        <TooltipContent className="h-20 text-white bg-[rgba(0,0,0,0.8)] w-60">
                          <p className="flex-wrap text-md text-center">
                            Add a note for your reference, or add a customer
                            note ( the user will be notified ).
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </span>
                </p>
                <Textarea
                  placeholder="Type your note here..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
                <div className="flex items-center space-x-2 ">
                  <Select value={newNote} onValueChange={setNewNote}>
                    <SelectTrigger className="w-[200px] ">
                      <SelectValue placeholder="Select note type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">Private note</SelectItem>
                      <SelectItem value="3">Note to customer</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    className="bg-blue-500 mt-2 hover:bg-blue-600 "
                    onClick={handleSubmit}
                  >
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-5">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FaMoneyBillWave className="mr-2" />
                Payment Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                <strong>Payment Method:</strong> {paymentMethod}
              </p>
              {transactionDetails && (
                <p>
                  <strong>Initiated Date:</strong>{" "}
                  {transactionDetails?.initiatedDate
                    ? transactionDetails?.initiatedDate
                    : "N/A"}{" "}
                  <br />
                  <strong>Transaction Id:</strong>{" "}
                  {transactionDetails?.transactionId
                    ? transactionDetails?.transactionId
                    : "N/A"}
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-row gap-6 col-span-3">
          <div className="w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default OrderPageView;
