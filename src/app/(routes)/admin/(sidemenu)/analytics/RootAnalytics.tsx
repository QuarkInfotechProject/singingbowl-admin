"use client";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RootAnalytics = ({
  selectedPresetDate,
  selectedTimeInterval,
  performanceData,
  revenueStat,
  leaderBoards,
}: any) => {
  //*******Data Mapping Start for NetSales********//
  // Function to format date for X-axis (MMM DD)
  const current = performanceData?.current?.current || 0;
  const comparison = performanceData?.comparison?.comparison || 0;
  const formatShortDate = (dateStr: any) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };
  // Function to format date for tooltip (YYYY-MM-DD)
  const formatFullDate = (dateStr: any) => {
    return dateStr;
  };

  // Process data for chart
  const processChartData = () => {
    const maxLength = Math.max(
      revenueStat?.current?.netSales.length,
      revenueStat?.comparison?.netSales.length
    );

    return Array.from({ length: maxLength }).map((_, index) => {
      const currentData = revenueStat.current.netSales[index];
      const previousData = revenueStat.comparison.netSales[index];

      return {
        shortDate: currentData
          ? formatShortDate(currentData.date)
          : formatShortDate(previousData.date),
        Current: currentData ? parseFloat(currentData.netSales) : null,
        Previous: previousData ? parseFloat(previousData.netSales) : null,
        // currentFullDate:current,
        currentFullDate: currentData ? formatFullDate(currentData.date) : null,
        // previousFullDate:comparison,
        previousFullDate: previousData
          ? formatFullDate(previousData.date)
          : null,
      };
    });
  };

  const CustomTooltip = ({ active, payload }: any) => {
    const isOrders = payload[0]?.payload?.title;
    if (active && payload && payload.length) {
      return (
        <div className="bg-white px-8 border py-5 rounded shadow-lg">
          <div className="flex flex-col gap-2">
            <p className="font-semibold">{isOrders ? "Orders" : "NET SALES"}</p>
            {payload.map((entry, index) => {
              const isCurrentYear = entry.name === "Current";
              const isOrderChart = entry?.payload?.title === "Orders";
              const fullDate = isCurrentYear
                ? payload[0]?.payload.currentFullDate
                : payload[0]?.payload.previousFullDate;

              if (entry.value !== null) {
                return (
                  <>
                    <div>
                      <div key={index} className="flex space-x-5">
                        <p
                          className={
                            isCurrentYear
                              ? "whitespace-nowrap relative before:content-[''] before:h-3.5 before:w-3.5 before:bg-green-600 before:absolute before:top-[55%] before:left-[-22px] before:transform before:translate-y-[-50%] z-0 text-[#2A9D90] font-semibold"
                              : "whitespace-nowrap relative before:content-[''] before:h-3.5 before:w-3.5 before:bg-red-600 before:absolute before:top-[55%] before:left-[-22px] before:transform before:translate-y-[-50%] z-0 text-amber-700 font-semibold"
                          }
                        >
                          {` ${fullDate} `}
                        </p>

                        <p className="font-semibold text-black">
                          {isOrderChart
                            ? entry?.value
                            : `Rs${" "}${
                                entry?.value
                                  ? entry.value
                                      .toFixed(2)
                                      .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                  : "0"
                              }`}
                        </p>
                      </div>
                    </div>
                  </>
                );
              }
              return null;
            })}
          </div>
        </div>
      );
    }
    return null;
  };
  const chartData = processChartData();
  // *********Data Mapping start for Orders*************//
  const currentOrder = revenueStat?.current?.orders || 0;
  const comparisionOrder = revenueStat?.comparison?.orders || 0;

  const processChartDataForOrders = () => {
    const maxLength = Math.max(
      revenueStat?.current?.orders.length,
      revenueStat?.comparison?.orders.length
    );

    return Array.from({ length: maxLength }).map((_, index) => {
      const currentData = revenueStat.current.orders[index];
      const previousData = revenueStat.comparison.orders[index];

      return {
        title: "Orders",
        shortDate: currentData
          ? formatShortDate(currentData.date)
          : formatShortDate(previousData.date),
        Current: currentData ? parseFloat(currentData?.orders) : null,
        Previous: previousData ? parseFloat(previousData?.orders) : null,
        currentFullDate: currentData ? formatFullDate(currentData.date) : null,
        previousFullDate: previousData
          ? formatFullDate(previousData.date)
          : null,
      };
    });
  };

  const ordersChartData = processChartDataForOrders();

  // Extract Yaxis for Netsales

  const allValues = [
    ...chartData.map((data) => data.Current).filter((val) => val !== null),
    ...chartData.map((data) => data.Previous).filter((val) => val !== null),
  ];

  const maxValue = Math.max(...allValues, 0); // Ensure we handle empty arrays by including 0
  const defaultMax = 10000;
  const roundedMaxValue =
    maxValue === 0 ? defaultMax : Math.ceil(maxValue / 10000) * 10000;

  const uniqueTicks = [];
  for (let i = 0; i <= roundedMaxValue; i += 10000) {
    uniqueTicks.push(i);
  }
  // Extract for Orders

  const allOrders = [
    ...ordersChartData
      .map((data) => data.Current)
      .filter((val) => val !== null),
    ...ordersChartData
      .map((data) => data.Previous)
      .filter((val) => val !== null),
  ];

  const maxOrder = Math.max(...allOrders, 0); // Include 0 to handle empty arrays
  const defaultMaxorder = 4; // Default maximum value

  // If maxOrder is 0, use defaultMax, otherwise round up to nearest multiple of 4
  const roundedMaxOrders =
    maxOrder === 0 ? defaultMaxorder : Math.ceil(maxOrder / 4) * 4;

  const uniqueOrder = [];
  for (let i = 0; i <= roundedMaxOrders; i += 4) {
    uniqueOrder.push(i);
  }
  return (
    <div>
      {/* Performance */}
      <div className="mt-6">
        <div className="flex  items-center px-5 space-x-5">
          <p className="font-semibold text-xl">Performance</p>
          <Separator className="mt-2 w-[967px] " />
          <div className="font-semibold">:</div>
        </div>
        <div className="flex mt-6 justify-center items-center space-x-6 px-4">
          <div className="w-56 h-28 gap-y-2 border rounded-md flex justify-center items-center flex-col cursor-pointer">
            <p className="font-semibold text-xl">Total Sales</p>
            <div className="flex justify-between gap-x-4">
              <p className="whitespace-nowrap font-semibold">
                Rs{" "}
                {performanceData?.current?.sales?.totalSales?.toLocaleString()}
              </p>

              <p
                className={`h-7 w-8 rounded-md whitespace-nowrap px-7 flex justify-center items-center ${
                  performanceData?.current?.sales?.totalSales === 0 &&
                  performanceData?.comparison?.sales?.totalSales === 0
                    ? "bg-gray-500 text-white leading-none" // Add bg-gray if both are 0
                    : performanceData?.current?.sales?.totalSales === 0
                    ? "bg-red-500 text-white leading-none"
                    : performanceData?.comparison?.sales?.totalSales === 0
                    ? "bg-green-600 text-white leading-none"
                    : ((performanceData?.current?.sales?.totalSales -
                        performanceData?.comparison?.sales?.totalSales) /
                        performanceData?.comparison?.sales?.totalSales) *
                        100 >
                      0
                    ? "bg-green-600 text-white leading-none"
                    : "bg-red-500 text-white leading-none"
                }`}
              >
                {
                  // Check for NaN and show 0 if true
                  isNaN(
                    ((performanceData?.current?.sales?.totalSales -
                      performanceData?.comparison?.sales?.totalSales) /
                      performanceData?.comparison?.sales?.totalSales) *
                      100
                  )
                    ? "0"
                    : performanceData?.current?.sales?.totalSales === 0 &&
                      performanceData?.comparison?.sales?.totalSales === 0
                    ? "0" // If both are 0, show 0%
                    : performanceData?.current?.sales?.totalSales === 0
                    ? "-100"
                    : performanceData?.comparison?.sales?.totalSales === 0
                    ? "100"
                    : (
                        ((performanceData?.current?.sales?.totalSales -
                          performanceData?.comparison?.sales?.totalSales) /
                          performanceData?.comparison?.sales?.totalSales) *
                        100
                      )
                        ?.toFixed(0)
                        ?.toLocaleString()
                }{" "}
                %
              </p>
            </div>
          </div>

          {/*  */}

          <div className="w-56 h-28 border gap-y-2 cursor-pointer rounded-md flex justify-center items-center flex-col">
            <p className="font-semibold text-xl">Net Sales</p>
            <div className="flex space-x-2">
              <p className="whitespace-nowrap font-semibold">
                Rs {performanceData?.current?.sales?.netSales?.toLocaleString()}
              </p>

              <p
                className={`h-7 w-8 rounded-md whitespace-nowrap px-7 flex justify-center items-center leading-none ${
                  performanceData?.current?.sales?.netSales === 0 &&
                  performanceData?.comparison?.sales?.netSales === 0
                    ? "leading-none bg-gray-500 text-white" // Add bg-gray if both are 0
                    : performanceData?.current?.sales?.netSales === 0
                    ? "leading-none bg-red-500 text-white"
                    : performanceData?.comparison?.sales?.netSales === 0
                    ? "bg-green-600 leading-none text-white"
                    : ((performanceData?.current?.sales?.netSales -
                        performanceData?.comparison?.sales?.netSales) /
                        performanceData?.comparison?.sales?.netSales) *
                        100 >
                      0
                    ? "bg-green-600 text-white"
                    : "bg-red-500 text-white"
                }`}
              >
                {
                  // Check for NaN and show 0 if true
                  isNaN(
                    ((performanceData?.current?.sales?.netSales -
                      performanceData?.comparison?.sales?.netSales) /
                      performanceData?.comparison?.sales?.netSales) *
                      100
                  )
                    ? "0"
                    : performanceData?.current?.sales?.netSales === 0 &&
                      performanceData?.comparison?.sales?.netSales === 0
                    ? "0" // If both are 0, show 0%
                    : performanceData?.current?.sales?.netSales === 0
                    ? "-100"
                    : performanceData?.comparison?.sales?.netSales === 0
                    ? "100"
                    : (
                        ((performanceData?.current?.sales?.netSales -
                          performanceData?.comparison?.sales?.netSales) /
                          performanceData?.comparison?.sales?.netSales) *
                        100
                      )
                        ?.toFixed(0)
                        ?.toLocaleString()
                }{" "}
                %
              </p>
            </div>
          </div>

          {/*  */}

          <div className="w-56 h-28 border gap-y-2 rounded-md cursor-pointer flex justify-center items-center flex-col">
            <p className="font-semibold text-xl">Orders</p>
            <div className="flex space-x-2">
              <p className="whitespace-nowrap font-semibold">
                {performanceData?.current?.sales?.totalOrders?.toLocaleString()}
              </p>

              <p
                className={`h-7 w-8 rounded-md px-7 whitespace-nowrap flex justify-center items-center leading-none ${
                  performanceData?.current?.sales?.totalOrders === 0 &&
                  performanceData?.comparison?.sales?.totalOrders === 0
                    ? "bg-gray-500 text-white leading-none" // Add bg-gray if both are 0
                    : performanceData?.current?.sales?.totalOrders === 0
                    ? "bg-red-500 text-white leading-none"
                    : performanceData?.comparison?.sales?.totalOrders === 0
                    ? "bg-green-600 text-white leading-none"
                    : ((performanceData?.current?.sales?.totalOrders -
                        performanceData?.comparison?.sales?.totalOrders) /
                        performanceData?.comparison?.sales?.totalOrders) *
                        100 >
                      0
                    ? "bg-green-600 text-white leading-none"
                    : "bg-red-500 text-white leading-none"
                }`}
              >
                {
                  // Check for NaN and show 0 if true
                  isNaN(
                    ((performanceData?.current?.sales?.totalOrders -
                      performanceData?.comparison?.sales?.totalOrders) /
                      performanceData?.comparison?.sales?.totalOrders) *
                      100
                  )
                    ? "0"
                    : performanceData?.current?.sales?.totalOrders === 0 &&
                      performanceData?.comparison?.sales?.totalOrders === 0
                    ? "0" // If both are 0, show 0%
                    : performanceData?.current?.sales?.totalOrders === 0
                    ? "-100"
                    : performanceData?.comparison?.sales?.totalOrders === 0
                    ? "100"
                    : (
                        ((performanceData?.current?.sales?.totalOrders -
                          performanceData?.comparison?.sales?.totalOrders) /
                          performanceData?.comparison?.sales?.totalOrders) *
                        100
                      )
                        ?.toFixed(0)
                        ?.toLocaleString()
                }{" "}
                %
              </p>
            </div>
          </div>

          {/*  */}

          <div className="w-56 h-28 border gap-y-2 rounded-md cursor-pointer flex justify-center items-center flex-col">
            <p className="font-semibold text-xl">Product Sold</p>
            <div className="flex space-x-2">
              <p className="font-semibold">
                {performanceData?.current?.sales?.productsSold?.toLocaleString()}
              </p>

              <p
                className={`h-7 w-8 rounded-md px-7 whitespace-nowrap flex justify-center items-center leading-none ${
                  performanceData?.current?.sales?.productsSold === 0 &&
                  performanceData?.comparison?.sales?.productsSold === 0
                    ? "bg-gray-500 text-white leading-none" // Add bg-gray if both are 0
                    : performanceData?.current?.sales?.productsSold === 0
                    ? "bg-red-500 text-white leading-none"
                    : performanceData?.comparison?.sales?.productsSold === 0
                    ? "bg-green-600 text-white leading-none"
                    : ((performanceData?.current?.sales?.productsSold -
                        performanceData?.comparison?.sales?.productsSold) /
                        performanceData?.comparison?.sales?.productsSold) *
                        100 >
                      0
                    ? "bg-green-600 text-white leading-none"
                    : "bg-red-500 text-white leading-none"
                }`}
              >
                {
                  // Check for NaN and show 0 if true
                  isNaN(
                    ((performanceData?.current?.sales?.productsSold -
                      performanceData?.comparison?.sales?.productsSold) /
                      performanceData?.comparison?.sales?.productsSold) *
                      100
                  )
                    ? "0"
                    : performanceData?.current?.sales?.productsSold === 0 &&
                      performanceData?.comparison?.sales?.productsSold === 0
                    ? "0" // If both are 0, show 0%
                    : performanceData?.current?.sales?.productsSold === 0
                    ? "-100"
                    : performanceData?.comparison?.sales?.productsSold === 0
                    ? "100"
                    : (
                        ((performanceData?.current?.sales?.productsSold -
                          performanceData?.comparison?.sales?.productsSold) /
                          performanceData?.comparison?.sales?.productsSold) *
                        100
                      )
                        ?.toFixed(0)
                        ?.toLocaleString()
                }{" "}
                %
              </p>
            </div>
          </div>

          {/*  */}

          <div className="w-56 h-28 border gap-y-2 rounded-md cursor-pointer flex justify-center items-center flex-col">
            <p className="font-semibold text-xl">Variations Sold</p>
            <div className="flex space-x-2">
              <p className="whitespace-nowrap font-semibold">
                {performanceData?.current?.sales?.variationsSold?.toLocaleString()}
              </p>

              <p
                className={`h-7 w-8 rounded-md whitespace-nowrap px-7 flex justify-center items-center leading-none ${
                  performanceData?.current?.sales?.variationsSold === 0 &&
                  performanceData?.comparison?.sales?.variationsSold === 0
                    ? "bg-gray-500 text-white leading-none" // Add bg-gray if both are 0
                    : performanceData?.current?.sales?.variationsSold === 0
                    ? "bg-red-500 text-white leading-none"
                    : performanceData?.comparison?.sales?.variationsSold === 0
                    ? "bg-green-600 text-white leading-none"
                    : ((performanceData?.current?.sales?.variationsSold -
                        performanceData?.comparison?.sales?.variationsSold) /
                        performanceData?.comparison?.sales?.variationsSold) *
                        100 >
                      0
                    ? "bg-green-600 text-white leading-none"
                    : "bg-red-500 text-white leading-none"
                }`}
              >
                {
                  // Check for NaN and show 0 if true
                  isNaN(
                    ((performanceData?.current?.sales?.variationsSold -
                      performanceData?.comparison?.sales?.variationsSold) /
                      performanceData?.comparison?.sales?.variationsSold) *
                      100
                  )
                    ? "0"
                    : performanceData?.current?.sales?.variationsSold === 0 &&
                      performanceData?.comparison?.sales?.variationsSold === 0
                    ? "0" // If both are 0, show 0%
                    : performanceData?.current?.sales?.variationsSold === 0
                    ? "-100"
                    : performanceData?.comparison?.sales?.variationsSold === 0
                    ? "100"
                    : (
                        ((performanceData?.current?.sales?.variationsSold -
                          performanceData?.comparison?.sales?.variationsSold) /
                          performanceData?.comparison?.sales?.variationsSold) *
                        100
                      )
                        ?.toFixed(0)
                        ?.toLocaleString()
                }{" "}
                %
              </p>
            </div>
          </div>

          {/*  */}
        </div>
      </div>

      {/* Chart components */}
      <div className="mt-6">
        <div className="flex  items-center px-5 space-x-5">
          <p className="font-semibold text-xl">Chart</p>
          <Separator className="mt-2 w-[1035px] " />
          <div className="font-semibold">:</div>
        </div>
        {/* charts */}
        <div className="flex justify-around items-center mt-4">
          <div className="h-[540px] w-[560px] border">
            <div className="border-b-2 p-3 font-semibold">Net sales</div>
            <div className="h-[410px] flex justify-start items-center py-2  ">
              {current?.length === 0 && comparison?.length === 0 ? (
                <>
                  <div className="flex justify-center hide-scrollbar  w-full hide-scrollbar    ">
                    <p className="text-center  font-semibold text-red-400">
                      No Data Recorded for the selected time period
                    </p>{" "}
                  </div>
                </>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 5, right: 8, left: 2, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) => {
                        if (value === 0) return "0";
                        return `${value / 1000}k`;
                      }}
                      ticks={uniqueTicks}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="Current"
                      stroke="#2A9D90"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="Previous"
                      stroke="#E76E50"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <Separator />
            <div>
              <div className="p-2 space-y-2">
                <div className="flex justify-between items-center px-4">
                  <div className="flex  items-center space-x-3 font-semibold">
                    {" "}
                    <span className="h-3.5 w-3.5 bg-green-500"></span>{" "}
                    <p>
                      {" "}
                      {selectedPresetDate?.label} ({current})
                    </p>
                  </div>
                  <p className="font-semibold">
                    {" "}
                    Rs{" "}
                    {performanceData?.current?.sales?.netSales?.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between font-semibold items-center px-4">
                  <div className="flex items-center space-x-3">
                    {" "}
                    <span className="h-3.5 w-3.5 round bg-red-500"></span>{" "}
                    <p>
                      {" "}
                      {selectedTimeInterval?.label} ({comparison})
                    </p>
                  </div>
                  <p>
                    {" "}
                    Rs{" "}
                    {performanceData?.comparison?.sales?.netSales?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="h-[540px] w-[560px] border">
            <div className="border-b-2 p-3 font-semibold">Orders</div>
            <div className="h-[410px] flex justify-start items-start py-2">
              {currentOrder?.length === 0 && comparisionOrder?.length === 0 ? (
                <>
                  {" "}
                  <div className="flex justify-center hide-scrollbar  mt-44 w-full hide-scrollbar    ">
                    <p className="text-center  font-semibold text-red-400">
                      No Data Recorded for the selected time period
                    </p>{" "}
                  </div>
                </>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={ordersChartData}
                    margin={{ top: 5, right: 8, left: 2, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="shortDate" tick={{ fontSize: 12 }} />
                    <YAxis
                      tickFormatter={(value) => value}
                      ticks={uniqueOrder}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="Current"
                      stroke="#2A9D90"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                    <Line
                      type="monotone"
                      dataKey="Previous"
                      stroke="#E76E50"
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      connectNulls
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
            <Separator />
            <div>
              <div className="p-2 space-y-2">
                <div className="flex justify-between items-center px-4">
                  <div className="flex items-center space-x-3 font-semibold">
                    {" "}
                    <span className="h-3.5 w-3.5 bg-green-500"></span>{" "}
                    <p>
                      {" "}
                      {selectedPresetDate?.label} ({current})
                    </p>
                  </div>
                  <p>
                    {" "}
                    {performanceData?.current?.sales?.totalOrders?.toLocaleString()}
                  </p>
                </div>
                <div className="flex justify-between items-center px-4">
                  <div className="flex items-center space-x-3 font-semibold">
                    {" "}
                    <span className="h-3.5 w-3.5 round bg-red-500"></span>{" "}
                    <p>
                      {selectedTimeInterval?.label} ({comparison})
                    </p>
                  </div>
                  <p>
                    {" "}
                    {performanceData?.comparison?.sales?.totalOrders?.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Leaderboards */}
      <div className="mt-6">
        <div className="flex  items-center px-5 space-x-5">
          <p className="font-semibold text-xl">Leaderboards</p>
          <Separator className="mt-2 w-[964px] " />
          <div className="font-semibold">:</div>
        </div>
        {/* Leaderboards */}
        <div className="flex justify-around items-center mt-4">
          <div className="h-96 w-[550px] border">
            <div className="border-b-2 p-3 font-semibold">
              Top Customers - Total Spend
            </div>
            <div className="h-80 p-2 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Total Spend
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderBoards?.data?.customers?.length !== 0 ? (
                    leaderBoards?.data?.customers?.map((customer) => (
                      <TableRow>
                        <TableCell className="whitespace-nowrap">
                          {customer?.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {customer?.orders?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          Rs {customer?.totalSpend?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div className="flex justify-center hide-scrollbar  w-full hide-scrollbar  mt-28  ml-16">
                      <p className="text-center  font-semibold text-red-400">
                        No Data Recorded for the selected time period
                      </p>{" "}
                    </div>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="h-96 w-[550px] border">
            <div className="border-b-2 p-3 font-semibold">
              Top Coupons - Number of Orders
            </div>
            <div className="h-80 p-2 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" whitespace-nowrap">
                      Coupon code
                    </TableHead>
                    <TableHead className="text-center">Orders</TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Amount discounted
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderBoards?.data?.coupons?.length !== 0 ? (
                    leaderBoards?.data?.coupons?.map((coupons: any) => (
                      <TableRow>
                        <TableCell>{coupons?.code}</TableCell>
                        <TableCell className="text-center">
                          {coupons?.orders?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          Rs {coupons?.amountDiscounted?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div className="flex justify-center hide-scrollbar  w-full hide-scrollbar  mt-28  ml-32">
                      <p className="text-center  font-semibold text-red-400">
                        No Data Recorded for the selected time period
                      </p>{" "}
                    </div>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
      </div>
      {/* Leaderboards */}
      <div className="mt-8">
        {/* Leaderboards */}
        <div className="flex justify-around items-center mt-4">
          <div className="h-96 w-[550px] border">
            <div className="border-b-2 p-3 font-semibold">
              Top categories - Item sold
            </div>
            <div className="h-80 p-2 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" whitespace-nowrap">
                      Categories
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Item Sold
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Net Sales
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderBoards?.data?.categories?.length !== 0 ? (
                    leaderBoards?.data?.categories?.map((categories) => (
                      <TableRow>
                        <TableCell>{categories?.name}</TableCell>
                        <TableCell className="text-center">
                          {categories?.itemsSold?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          Rs {categories?.netSales?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div className="flex justify-center w-full hide-scrollbar items-center mt-28 ml-28">
                      <p className="text-center   font-semibold text-red-400">
                        No Data Recorded for the selected time period
                      </p>{" "}
                    </div>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <div className="h-96 w-[550px] border">
            <div className="border-b-2 p-3 font-semibold">
              Top products - item sold
            </div>
            <div className="h-80 p-2 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className=" whitespace-nowrap">
                      Product
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Item Sold
                    </TableHead>
                    <TableHead className="text-center whitespace-nowrap">
                      Net sales
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaderBoards?.data?.products?.length !== 0 ? (
                    leaderBoards?.data?.products?.map((products) => (
                      <TableRow>
                        <TableCell>{products?.name}</TableCell>
                        <TableCell className="text-center">
                          {products?.itemsSold?.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          Rs {products?.netSales?.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <div className="flex justify-center w-full hide-scrollbar items-center mt-28 ml-28">
                      <p className="text-center   font-semibold text-red-400">
                        No Data Recorded for the selected time period
                      </p>{" "}
                    </div>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>
        {/*LeaderBoards  */}
      </div>
    </div>
  );
};

export default RootAnalytics;
