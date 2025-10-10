"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import RootRootArtifactOrder from "./RootArtifactOrder";
import debounce from "lodash.debounce";
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
  ProcessProvider,
  useProcess,
  fetchProcess,
} from "../context/contextOrderProcess/context";
import { Transaction } from "@/app/_types/transactiontype/transactionType";
import { IoFilterOutline } from "react-icons/io5";
import { cn } from "@/lib/utils";
import RootArtifactOrder from "./RootArtifactOrder";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";

const TransactionPage = () => {
  const { state, dispatch } = useProcess();
  const paymentMethods = ["Order Placed", "Ncell Order"];
  const shippingCompany = [
    {
      label: "Don't Send for Shipping",
      value: "None",
    },
    {
      label: "Pathao",
      value: "Pathao",
    },
  ];
  const { transactionData, currentPage, totalPages } = state;
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchStatus, setSearchStatus] = useState("processing");
  const [searchShipping, setSearchShipping] = useState("Pathao");
  const [searchProduct, setSearchProduct] = useState("");
  const [searchLimit, setSearchLimit] = useState("100");
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const isFirstRender = useRef(true);
  const [product, setProduct] = useState([]);

  const PAGE_RANGE_DISPLAY = 3;

  const submitData = {
    orders: selectedOrders,
    shippingCompany: searchShipping,
  };

  console.log("submitData", submitData);
  const onSubmit = async () => {
    try {
      const { data } = await axios.post(
        "/api/orderProcess/orderArtifact/create",
        submitData
      );
      if (data) {
        console.log("success");
        toast.success("Order submitted successfully!");
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        const responseData = error.response.data;
        console.log("ererr", error);
        if (
          responseData.error === "At least one order is required." &&
          responseData.errors &&
          responseData.errors.orders
        ) {
          toast({
            title: "Error",
            description: responseData.errors.orders[0],
            variant: "destructive",
          });
        } else {
          toast({
            title: "Error",
            description:
              responseData.error ||
              "An error occurred while submitting orders.",
            variant: "destructive",
          });
        }
      } else {
      }
    }
  };

  useEffect(() => {
    fetchProcess(dispatch, currentPage, {
      status: searchStatus,
      productName: searchProduct,
      limit: searchLimit,
    });
  }, []);
  const handleProductClick = useCallback(
    (productName: string) => {
      setSearchProduct(productName);
      fetchProcess(dispatch, 1, {
        status: searchStatus,
        productName: productName,
        limit: searchLimit,
      });
    },
    [dispatch, searchStatus, searchLimit]
  );

  useEffect(() => {
    if (transactionData?.allProductNames && isFirstRender.current) {
      setProduct(transactionData?.allProductNames || []);
      isFirstRender.current = false;
    }
  }, [transactionData?.allProductNames]);

  const handleFilterOrders = () => {
    fetchProcess(dispatch, currentPage, {
      status: searchStatus,
      productName: searchProduct,
      limit: searchLimit,
    });
  };

  const debouncedSearch = useCallback(
    debounce(() => {
      handleFilterOrders();
    }, 500), // 500ms delay
    [searchLimit, searchProduct, searchStatus]
  );
  const handleSearchShipping = (value: any) => {
    setSearchShipping(value);
  };
  // Run the debounced search whenever the search inputs change
  useEffect(() => {
    debouncedSearch();

    // Clean up the debounce function
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchLimit, searchProduct, searchStatus, debouncedSearch]);

  useEffect(() => {
    // Reset selectedOrders when transactionData changes
    setSelectedOrders([]);
    setSelectAll(false);
  }, [transactionData]);

  const handleCheckboxChange = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAllChange = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    if (newSelectAll) {
      setSelectedOrders(
        transactionData?.orders?.map((order) => order.id) || []
      );
    } else {
      setSelectedOrders([]);
    }
  };
  // const handleSearchProducts = (value: any) => {
  //   setSearchProduct(value);
  // };

  // const applyFilters = () => {
  //   const selectedOrderIds = Object.entries(selectedOrders)
  //     .filter(([_, isSelected]) => isSelected)
  //     .map(([orderId]) => orderId);
  //   handleFilterOrders(selectedOrderIds);
  // };
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

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row gap-6">
        <div>
          <div className="space-y-4  w-72">
            <div className="space-y-1  ">
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-900"
              >
                Limit
              </label>
              <Input
                type="number "
                min={0}
                placeholder="Limit"
                value={searchLimit}
                onChange={(e) => setSearchLimit(e.target.value)}
              />
            </div>

            <div className="space-y-1  ">
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-900"
              >
                Product
              </label>
              <select
                value={searchProduct}
                onChange={(e) => setSearchProduct(e.target.value)}
                className="input border w-full h-9 rounded-sm p-2"
              >
                <option value="">All</option>
                {product?.map((method, index) => (
                  <option className="w-full" key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1  ">
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-900"
              >
                Order status
              </label>
              <select
                value={searchStatus}
                onChange={(e) => setSearchStatus(e.target.value)}
                className="input border w-full h-9 rounded-sm p-2"
              >
                {/* <option value="">Select Shipping company</option> */}
                {paymentMethods.map((method, index) => (
                  <option key={index} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1  ">
              <label
                htmlFor="limit"
                className="block text-sm font-medium text-gray-900"
              >
                Shipping company
              </label>

              <Select
                value={searchShipping}
                onValueChange={handleSearchShipping}
              >
                <SelectTrigger className="bg-gray-200 input outline-none">
                  <SelectValue>
                    {searchShipping === "None"
                      ? "Don't Send for Shipping"
                      : searchShipping}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {shippingCompany?.map((method, index) => (
                    <SelectItem key={index} value={method.value}>
                      {method.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <h1 className="text-sm font-medium text-gray-900">
                Performs Following Operations
              </h1>
              <ol className="text-xs ml-4 list-decimal">
                <li>Sends Orders to Pathao</li>
                <li>Changes Order status to "Ready to ship"</li>
                <li>Generates Order Files</li>
              </ol>
            </div>

            <Button
              className="bg-blue-500 hover:bg-blue-600 w-60"
              onClick={onSubmit}
            >
              Submit
            </Button>
          </div>
        </div>
        <div>
          <RootArtifactOrder />
        </div>
      </div>
      {transactionData?.orders?.length > 0 ? (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Order Processing</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
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
                    <TableHead>SN</TableHead>
                    <TableHead>Order ID</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Paid</TableHead>
                    <TableHead>Products</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionData?.orders?.map((order, index) => (
                    <TableRow key={order.id} className="hover:bg-gray-50">
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(order.id)}
                          onCheckedChange={() => handleCheckboxChange(order.id)}
                        />
                      </TableCell>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium text-blue-400 hover:text-blue-500">
                        <a href={`/admin/orders/show/${order.id}`}>
                          {order.id}
                        </a>
                      </TableCell>
                      <TableCell className="font-medium">
                        {" "}
                        {order.user}
                      </TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell className="text-center whitespace-nowrap">
                        <Badge className={`${getColor(order?.status)}`}>
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-semibold">
                        Rs{" "}
                        {parseFloat(order.total).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 3,
                        })}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            order.isPaid === "Yes" ? "success" : "destructive"
                          }
                          style={{
                            backgroundColor:
                              order.isPaid === "Yes" ? "green" : "red",
                            color: "white",
                          }}
                        >
                          {order.isPaid}
                        </Badge>
                      </TableCell>
                      <TableCell className="w-[280px]">
                        <Accordion type="single" collapsible className="w-full">
                          <AccordionItem value={`item-${order.id}`}>
                            <AccordionTrigger>
                              View Products ({order.products.length})
                            </AccordionTrigger>
                            <AccordionContent>
                              <ul className="space-y-1">
                                {order.products.map((product, index) => (
                                  <li
                                    key={index}
                                    className="flex justify-between cursor-pointer"
                                  >
                                    <span
                                      className={cn(
                                        product.name.toLowerCase() ===
                                          searchProduct?.toLowerCase() &&
                                          " cursor- font-bold text-primary"
                                      )}
                                      onClick={() =>
                                        handleProductClick(product.name)
                                      }
                                    >
                                      {product.name}
                                    </span>
                                    <span className="font-medium">
                                      x{product.quantity}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </AccordionContent>
                          </AccordionItem>
                        </Accordion>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : null}
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
