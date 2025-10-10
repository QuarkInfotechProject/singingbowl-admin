"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon, Users, UserPlus, UserCheck, Repeat } from "lucide-react";
import ShowReview from "../../app/(routes)/admin/(sidemenu)/reviews/show/page";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const Dashboard = ({
  data,
  searchStatus,
  hasSearched,
  dateDifference,
  activeTab,
  dateRange,
}) => {
  // if (!data) {
  //   return <div>Loading...</div>; // Or any other appropriate loading/error state
  // }
  const {
    currentTotalRevenue,
    currentOrderCount,
    currentAvgOrderValue,
    revenueChange,
    orderCountChange,
    avgOrderValueChange,
    totalUsers,
    newUsers,
    newCustomers,
    returningCustomers,
    topSellingProducts,
    lowStockProducts,
    mostSearchedKeywords,
    recentOrders,
    activityLogs,
    productReviews,
  } = data || null;
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [refetch, setRefetch] = useState();
  const router = useRouter();
  const revenueData = [
    {
      name: "Revenue",
      value: parseFloat(currentTotalRevenue),
      change: revenueChange,
    },
    { name: "Orders", value: currentOrderCount, change: orderCountChange },
    {
      name: "Avg Order",
      value: currentAvgOrderValue,
      change: avgOrderValueChange,
    },
  ];

  const userStats = [
    { name: "Total Users", value: totalUsers, icon: Users },
    { name: "New Users", value: newUsers, icon: UserPlus },
    { name: "New Customers", value: newCustomers, icon: UserCheck },
    { name: "Returning Customers", value: returningCustomers, icon: Repeat },
  ];
  console.log("her", selectedItemId);
  const handleEdit = (uuid: any) => router.push(`/admin/products/edit/${uuid}`);
  const handleOrder = (id: any) => router.push(`/admin/orders/show/${id}`);
  // Get colors
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
    <div className="p-6 space-y-6">
      <h1 className="text-3xl  font-bold mb-6 flex  items-center">
        Dashboard
        {hasSearched && (
          <span className="ml-2 flex">
            {activeTab === "customFields"
              ? `(Custom)`
              : searchStatus &&
                `(${
                  searchStatus.charAt(0).toUpperCase() + searchStatus.slice(1)
                }) `}
            {activeTab == "customFields" && hasSearched && dateDifference && (
              <>
                <span className="text-sm  justify-center items-center mt-2 text-slate-600 font-semibold ml-1">
                  <p className="mt-1 space-x-2 tracking-wider leading-loose">
                    {`${dateDifference + 1} days selected `} (From{" "}
                    {format(dateRange?.from, "yyyy/MM/dd")} To{" "}
                    {format(dateRange?.to, "yyyy/MM/dd")})
                  </p>
                </span>
              </>
            )}
          </span>
        )}
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {revenueData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {item.name === "Revenue" || item.name === "Avg Order"
                  ? "Rs "
                  : ""}
                {item.name === "Orders"
                  ? isNaN(parseInt(item.value))
                    ? "0"
                    : parseInt(item.value)
                  : isNaN(parseFloat(item.value))
                  ? "0"
                  : parseFloat(item.value).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 3,
                    })}
              </div>
              <p
                className={`text-xs ${
                  item.change >= 0 ? "text-green-500" : "text-red-500"
                }`}
              >
                {item.change >= 0 ? "+ " : "- "}
                {
                  // Check if item.change is NaN and show 0.00% if invalid
                  isNaN(item.change)
                    ? "0.00" // Show 0% if the change is invalid
                    : Math.abs(item.change).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      })
                }
                % from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* New User Statistics Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {userStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Selling Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Variant</TableHead>
                  <TableHead className="text-center">Quantity</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topSellingProducts?.map((product, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleEdit(product.id)}
                    className="cursor-pointer"
                  >
                    <TableCell>
                      {" "}
                      <img
                        src={product.baseImage}
                        alt={product.productName}
                        className="w-12 h-12 object-cover rounded-md"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder-image.jpg";
                        }}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell>{product.variantName}</TableCell>
                    <TableCell className="text-center">
                      {product.totalQuantity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Low Stock Products</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Variant</TableHead>
                  <TableHead className="text-center">Quantity Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts?.map((product, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleEdit(product.id)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {product.productName}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.variant === "No Variant" ? "-" : product.variant}
                    </TableCell>
                    <TableCell className="text-center">
                      {product.quantityLeft}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Most Searched Keywords</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={mostSearchedKeywords}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="keyword"
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                  height={70}
                  tick={{ fontSize: 12 }}
                />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead>Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="overflow-y-auto h-28">
                {recentOrders?.map((order, index) => (
                  <TableRow
                    key={index}
                    onClick={() => handleOrder(order.orderId)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {order.orderId}
                    </TableCell>
                    <TableCell>{order.customerName}</TableCell>
                    <TableCell className="text-center">
                      <span
                        className={`px-2 py-1 rounded-full ${getColor(
                          order.status
                        )} text-xs font-semibold`}
                      >
                        {order.status}
                      </span>
                    </TableCell>

                    <TableCell>
                      Rs{" "}
                      {parseInt(order.total).toLocaleString(undefined, {
                        maximumFractionDigits: 3,
                        minimumFractionDigits: 2,
                      })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Activity Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {activityLogs?.slice(0, 7)?.map((log, index) => (
                <div key={index} className="flex border-b-2 py-2 items-center">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {log.activityType}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {log.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {log.createdAt}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Product Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {productReviews?.map((review, index) => (
                <Dialog key={index}>
                  <DialogTrigger asChild>
                    <div
                      key={index}
                      className="flex border-b-2 cursor-pointer pb-3 relative  items-center"
                    >
                      <Avatar className="h-9 absolute top-0 w-9">
                        <AvatarImage
                          src={review.profilePicture}
                          alt={review.customerName}
                        />
                        <AvatarFallback>
                          {review?.customerName
                            ?.split(" ")
                            ?.map((item, index) => {
                              if (index === 0) {
                                return item.charAt(0).toUpperCase();
                              }
                              if (
                                index ===
                                review.customerName.split(" ").length - 1
                              ) {
                                return item.charAt(0).toUpperCase();
                              }
                              return null;
                            })
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-16  space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {review.customerName}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {review.productName}
                        </p>
                        <div className="flex items-center">
                          <div className="flex ">
                            {[...Array(5)].map((_, i) => (
                              <StarIcon
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating
                                    ? "text-gray-500 fill-gray-500"
                                    : "text-gray-400 "
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-[680px]">
                    <ShowReview
                      setIsSheetOpen={() => setIsSheetOpen(false)}
                      setRefetch={setRefetch}
                      IdData={review.id}
                    />
                  </DialogContent>
                </Dialog>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
