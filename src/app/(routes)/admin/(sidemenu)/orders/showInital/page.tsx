"use client";
import { OrderApiResponse } from "@/app/_types/orderType/showInitalType";
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User, Package, Truck, CreditCard } from "lucide-react";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Mail, Phone, ShoppingBag } from "lucide-react";
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
const OrderPageView = (IdData: any) => {
  const [orderShow, setOrderShow] = useState<OrderApiResponse | null>(null);
  const router = useRouter();

  useEffect(() => {
    const getData = async (id: string) => {
      const url = `/api/orderDetails/show/${id}`;
      try {
        const res = await fetch(url, { method: "GET" });
        const data: OrderApiResponse = await res.json();
        setOrderShow(data);
      } catch (error) {
        console.error("Failed to fetch order data:", error);
      }
    };
    getData(IdData.IdData);
  }, [IdData.IdData]);

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

  const getLabelStatus = (status: String) => {
    const matchedStatus = updateStatus.find((item) => item.value === status);
    if (matchedStatus) {
      return matchedStatus.label;
    } else {
      return status;
    }
  };
  if (!orderShow)
    return (
      <div className="flex justify-center items-center  h-[80vh] ">
        <div className="w-full mx-auto bg-white p-4 space-y-6">
          <div className="flex justify-between items-center">
            <Skeleton className="w-32 h-10" /> {/* Back Button Skeleton */}
            <Skeleton className="w-48 h-8" /> {/* Title Skeleton */}
          </div>

          <Card>
            <CardHeader>
              <Skeleton className="w-40 h-6" /> {/* Order Summary Title */}
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <Skeleton className="w-1/2 h-5" /> {/* Order ID and Date */}
                <Skeleton className="w-32 h-10" /> {/* Status Dropdown */}
                <Skeleton className="w-24 h-10" /> {/* Update Button */}
              </div>
              <Skeleton className="w-16 h-6" /> {/* Status Badge */}
              <Table>
                <TableBody>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="w-20 h-5" />
                    </TableCell>{" "}
                    {/* Subtotal */}
                    <TableCell className="text-right">
                      <Skeleton className="w-20 h-5" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="w-20 h-5" />
                    </TableCell>{" "}
                    {/* Discount */}
                    <TableCell className="text-right">
                      <Skeleton className="w-20 h-5" />
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Skeleton className="w-20 h-5 font-bold" />
                    </TableCell>{" "}
                    {/* Total */}
                    <TableCell className="text-right">
                      <Skeleton className="w-20 h-5 font-bold" />
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    );

  const {
    email,
    subtotal,
    discount,
    total,
    paymentMethod,
    transactionCode,
    status,
    addressInformation,
    itemsOrdered,
  } = orderShow?.data;

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
  return (
    <ScrollArea className="h-[80vh] pr-4">
      <div className="space-y-6">
        <div className="text-start">
          <h2 className="text-2xl font-bold">Order </h2>
          <Badge variant="outline" className={`mt-2 ${getColor(status)}`}>
            {getLabelStatus(status)}
            {/* {status} */}
          </Badge>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <div
            className="flex gap-x-20 justify-between 
           mt-2 space-y-1"
          >
            <div className="flex flex-col">
              <h3 className="text-lg font-semibold whitespace-nowrap flex items-center text-blue-700">
                <User className="w-5 h-5 mr-2" />
                Customer Information
              </h3>
              <div>
                <p className="flex items-center text-sm">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  {email}
                </p>
                <p className="flex items-center text-sm">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  {addressInformation.name}
                </p>
                <p className="flex items-center text-sm">
                  <Phone className="w-4 h-4 mr-2 text-blue-500" />
                  {addressInformation.mobile}
                </p>
                {addressInformation.backupMobile?.length > 0 && (
                  <p className="flex items-center text-sm">
                    <Phone className="w-4 h-4 mr-2 text-blue-500" />
                    {addressInformation.backupMobile}
                  </p>
                )}
              </div>
            </div>
           {
            orderShow?.data?.note && (<>
             <div className="flex flex-col">
              <div>
                <p className="font-bold">Customer Note:</p>
              </div>
              <div className="relative top-0">
                <p className="text-wrap">{orderShow?.data?.note}</p>
              </div>
            </div></>)
           }
          </div>
        </div>

        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold flex items-center text-green-700">
            <Truck className="w-5 h-5 mr-2" />
            Shipping Address
          </h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              {" "}
              <strong>Address : </strong>
              {addressInformation.address}
            </p>
            <p>
              <strong>Zone : </strong> {addressInformation.zone}
            </p>
            <p>
              <strong>City : </strong>
              {addressInformation.city}
            </p>
            <p>
              <strong>Province : </strong> {addressInformation.province}
            </p>
            

           
          </div>
        </div>

        {/* <div className="bg-purple-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold flex items-center text-purple-700">
            <ShoppingBag className="w-5 h-5 mr-2" />
            Ordered Items
          </h3>
          <div className="mt-2 space-y-2">
            {itemsOrdered?.map((item, index) => (
              <div key={index} className="flex justify-between text-sm">
                <span>
                  {item?.name} x{item?.quantity}
                </span>
                <span className="text-left">
                  {item?.optionName1}:{" "}
                  <ColorCircle color={hashToColor(item?.optionData1)} />
                  {item?.optionValue1}
                </span>
                <span className="font-medium">{item?.lineTotal}</span>
              </div>
            ))}
          </div>
        </div> */}

        <div className="bg-yellow-50 p-4 flex flex-col rounded-lg">
          <h3 className="text-lg font-semibold flex items-center text-yellow-700 ">
            <Package className="w-5 h-5 mr-2" />
            Order Summary
          </h3>
          {/* Order items */}
          <div className="  rounded-lg  ">
            <div className="mt-2 space-y-2  border-w-8 border-w- py-2">
              {itemsOrdered?.map((item, index) => (
                <div key={index} className="flex justify-between items-center gap-x-32 text-sm">
                  <span className="flex flex-row whitespace-nowrap">
                   {item?.name} x{item?.quantity}
                  </span>
                 <div className=" w-full flex  justify-between">
                 <span className="">
                    {item?.optionName1}:{" "}
                    <ColorCircle color={hashToColor(item?.optionData1)} />
                    {item?.optionValue1}
                  </span>
                  <span className="font-medium">$ {" "}{item?.lineTotal}</span>
                 </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex border-t-2 py-2 m ml-auto mt-2 space-y-1 text-sm">
           <div className=" flex flex-col px-2">
           <div className="flex gap-x-24 ">
              <span>Subtotal:</span>
              <span className="ml-auto">$ {subtotal}</span>
            </div>
            <div className="flex  gap-x-24">
              <span>Discount:</span>
              <span className="ml-auto">-$ {discount}</span>
            </div>
            <div className="flex  gap-x-24 font-semibold">
              <span>Total:</span>
              <span className="ml-auto">$ {total}</span>
            </div>
           </div>
          </div>
        </div>

        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold flex items-center text-red-700">
            <CreditCard className="w-5 h-5 mr-2" />
            Payment Information
          </h3>
          <div className="mt-2 space-y-1 text-sm">
            <p>
              <strong>Payment Method:</strong> {paymentMethod}
            </p>
            {transactionCode?.length > 0 && (
              <p>
                <strong>Transaction Code:</strong> {transactionCode}
              </p>
            )}
          </div>
        </div>
      </div>
    </ScrollArea>
  );
};

export default OrderPageView;
