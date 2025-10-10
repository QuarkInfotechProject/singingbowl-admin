"use client";
import React, { useEffect, useState } from "react";
import RootAnalytics from "./RootAnalytics";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { differenceInDays } from "date-fns";
import "react-day-picker/dist/style.css";
import { IoMdArrowDropdown, IoMdArrowDropup } from "react-icons/io";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { FaCircleInfo } from "react-icons/fa6";

const preset = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Yesterday",
    value: "yesterday",
  },
  {
    label: "Week to date",
    value: "week_to_date",
  },
  {
    label: "Last week",
    value: "last_week",
  },
  {
    label: "Month to date",
    value: "month_to_date",
  },
  {
    label: "Last month",
    value: "last_month",
  },
  {
    label: "Quarter to date",
    value: "quarter_to_date",
  },
  {
    label: "Last quarter",
    value: "last_quarter",
  },
  {
    label: "Year to date",
    value: "year_to_date",
  },
  {
    label: "Last year",
    value: "last_year",
  },
];
const interval = [
  {
    label: "Previous period",
    value: "previous_period",
  },
  {
    label: "Previous year",
    value: "previous_year",
  },
];
const Page = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("presets");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [selectedPresetDate, setselectedPresetDate] = useState({
    label: "Today",
    value: "today",
  });
  const [selectedTimeInterval, setselectedTimeInterval] = useState({
    label: "Previous period",
    value: "previous_period",
  });
  const [loading, setloading] = useState(false);
  const [performanceData, setperformanceData] = useState();
  const [revenueStat, setrevenueStat] = useState();
  const [leaderBoards, setLeaderBoards] = useState();
  const handleSearch = () => {
    if (activeTab === "customFields") {
      const from = format(dateRange?.from || "", "yyyy-MM-dd");
      const to = format(dateRange?.to || "", "yyyy-MM-dd");
      getperformanceIndicators({
        filter: {
          startDate: from,
          endDate: to,
        },
        compareTo: selectedTimeInterval?.value,
      });
      getRevenueStats({
        filter: {
          startDate: from,
          endDate: to,
        },
        compareTo: selectedTimeInterval?.value,
      });
      getleaderboards({
        filter: {
          startDate: from,
          endDate: to,
        },
      });
      setIsSearchOpen(false);
    } else {
      getperformanceIndicators({
        filter: selectedPresetDate?.value,
        compareTo: selectedTimeInterval?.value,
        startDate: "",
        endDate: "",
      });
      getRevenueStats({
        filter: selectedPresetDate?.value,
        compareTo: selectedTimeInterval?.value,
        startDate: "",
        endDate: "",
      });
      getleaderboards({
        filter: selectedPresetDate?.value,
        startDate: "",
        endDate: "",
      });
      setIsSearchOpen(false);
    }
  };

  const handleClear = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  useEffect(() => {
    if (activeTab === "presets") {
    }
  }, [activeTab]);

  const handleDateRangeChange = (range: {
    from: Date | undefined;
    to: Date | undefined;
  }) => {
    setDateRange(range);
  };

  const getperformanceIndicators = async ({ compareTo, filter }: any) => {
    setloading(true);
    try {
      const formData = {
        filter: filter || "last_month",
        compareTo: compareTo || "previous_period",
      };
      const res = await clientSideFetch({
        url: "/analytics/performance-indicators",
        method: "post",
        body: formData,
        debug: true,
      });
      if (res?.status === 200) {
        const newData = res?.data.data || {};
        setperformanceData(newData);
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const getRevenueStats = async ({ compareTo, filter }: any) => {
    setloading(true);
    try {
      const formData = {
        filter: filter || "last_month",
        compareTo: compareTo || "previous_period",
      };

      const res = await clientSideFetch({
        url: "/analytics/revenue-stats",
        method: "post",
        body: formData,
        debug: true,
      });
      if (res?.status === 200) {
        const newData = res?.data.data || {};
        setrevenueStat(newData);
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  const getleaderboards = async ({ filter }: any) => {
    setloading(true);
    try {
      const formData = {
        filter: filter || "last_month",
      };

      const res = await clientSideFetch({
        url: "/analytics/leaderboards",
        method: "post",
        body: formData,
        debug: true,
      });
      if (res?.status === 200) {
        const newData = res?.data || {};
        setLeaderBoards(newData);
        setloading(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };
  useEffect(() => {
    getperformanceIndicators({
      filter: "",
      compareTo: "",
      filter: {
        startDate: " ",
        endDate: " ",
      },
    });
    getleaderboards({
      filter: "",
      filter: {
        startDate: " ",
        endDate: " ",
      },
    });
    getRevenueStats({
      filter: "",
      compareTo: "",
      filter: {
        startDate: " ",
        endDate: " ",
      },
    });
  }, []);
  const current = performanceData?.current?.current || "";
  const comparison = performanceData?.comparison?.comparison || "";
  // Handle input changes to update the date range
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "from" | "to"
  ) => {
    const value = e.target.value;
    const newDate = value ? new Date(value) : undefined;
    setDateRange((prev) => ({ ...prev, [type]: newDate }));
  };

  if (loading) {
    return (
      <>
        <div>
          <div className="flex items-center space-x-4">
            {/* Dropdown Menu Skeleton */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="auto">
                <Button
                  variant="outline"
                  className="grid grid-cols-6 items-center h-16"
                >
                  <div className="text-blue-800 font-semibold">
                    <p></p>
                  </div>

                  <div className="col-span-4 flex-grow">
                    <div className="flex flex-col justify-start items-start font-bold text-blue-800">
                      {/* Skeleton for the first line (Custom or Preset label) */}
                      <div className="space-x-2 justify-center items-center flex">
                        <div className="w-24 h-4 bg-gray-300 animate-pulse rounded"></div>
                        <div className="w-12 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </div>

                      {/* Skeleton for second line (Time Interval) */}
                      <div className="flex items-center mt-2">
                        <div className="w-32 h-4 bg-gray-300 animate-pulse rounded"></div>
                        <div className="ml-2 w-16 h-4 bg-gray-300 animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Icon Skeleton */}
                  <div className="ml-8">
                    <div className="w-8 h-8 bg-gray-300 animate-pulse rounded-full"></div>
                  </div>
                </Button>
              </DropdownMenuTrigger>

              {/* Dropdown Menu Content Skeleton */}
              <DropdownMenuContent className="w-[460px] h-[520px] overflow-y-auto p-4 relative left-32">
                <DropdownMenuLabel className="py-0 font-semibold">
                  <div className="w-1/2 h-4 bg-gray-300 animate-pulse rounded"></div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Tab Skeleton */}
                <div className="flex space-x-4 mb-2 items-center border-b-2 py-2">
                  <div className="w-20 h-6 bg-gray-300 animate-pulse rounded"></div>
                  <div className="w-20 h-6 bg-gray-300 animate-pulse rounded"></div>
                </div>

                {/* Tab Content Skeleton for Presets */}
                <div className="space-y-2">
                  <div className="flex flex-wrap justify-center items-center ">
                    <div className="w-48 h-16 bg-gray-300 animate-pulse rounded"></div>
                    <div className="w-48 h-16 bg-gray-300 animate-pulse rounded"></div>
                    <div className="w-48 h-16 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                </div>

                {/* Skeleton for Custom Fields */}
                <div className="space-y-2">
                  <div className="flex space-x-2 mb-4">
                    <div className="flex-grow">
                      <div className="w-full h-6 bg-gray-300 animate-pulse rounded"></div>
                      <div className="w-full h-12 bg-gray-300 animate-pulse rounded mt-2"></div>
                    </div>
                    <div className="w-12 h-6 bg-gray-300 animate-pulse rounded"></div>
                    <div className="flex-grow">
                      <div className="w-full h-6 bg-gray-300 animate-pulse rounded"></div>
                      <div className="w-full h-12 bg-gray-300 animate-pulse rounded mt-2"></div>
                    </div>
                  </div>

                  <div className="flex justify-center items-center">
                    <div className="w-72 h-72 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                </div>

                {/* Skeleton for Compare To */}
                <div className="flex justify-center mt-0 items-center flex-col">
                  <div className="w-32 h-6 bg-gray-300 animate-pulse rounded mb-2"></div>
                  <div className="flex">
                    <div className="w-44 h-12 bg-gray-300 animate-pulse rounded"></div>
                    <div className="w-44 h-12 bg-gray-300 animate-pulse rounded"></div>
                    <div className="w-44 h-12 bg-gray-300 animate-pulse rounded"></div>
                  </div>
                </div>

                {/* Action Buttons Skeleton */}
                <div className="flex justify-between px-8 mt-4 mb-2">
                  <div className="w-32 h-12 bg-blue-500 animate-pulse rounded"></div>
                  <div className="w-32 h-12 bg-red-500 animate-pulse rounded"></div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* RootAnalytics Skeleton */}
          <div className="mt-6">
            <div className="flex items-center px-5 space-x-5">
              <p className="font-semibold text-xl"></p>
              <div className="w-20 h-6 bg-gray-300 animate-pulse rounded-md" />
              <p />
              <div className="mt-2 w-[1000px] h-1 bg-gray-200" />
              <div></div>
            </div>
            <div className="flex mt-6 justify-center items-center space-x-6 px-4">
              {/* Skeleton for Total Sales */}

              <div className="w-56 h-28 border gap-y-2 cursor-pointer rounded-md flex justify-center items-center flex-col">
                <p className="font-semibold text-xl"></p>
                <div className="w-20 h-6 bg-gray-300 animate-pulse rounded-md" />
                <p />
                <div className="flex space-x-2">
                  <p className="whitespace-nowrap font-semibold"></p>
                  <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-md" />
                  <p />
                  <p className="h-7 w-8 rounded-md whitespace-nowrap px-7 flex justify-center items-center bg-gray-300 animate-pulse"></p>
                  <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
                  <p />
                </div>
              </div>
              <div className="w-56 h-28 border gap-y-2 cursor-pointer rounded-md flex justify-center items-center flex-col">
                <p className="font-semibold text-xl"></p>
                <div className="w-20 h-6 bg-gray-300 animate-pulse rounded-md" />
                <p />
                <div className="flex space-x-2">
                  <p className="whitespace-nowrap font-semibold"></p>
                  <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-md" />
                  <p />
                  <p className="h-7 w-8 rounded-md whitespace-nowrap px-7 flex justify-center items-center bg-gray-300 animate-pulse"></p>
                  <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
                  <p />
                </div>
              </div>
              {/* Skeleton for Orders */}
              <div className="w-56 h-28 border gap-y-2 rounded-md cursor-pointer flex justify-center items-center flex-col">
                <p className="font-semibold text-xl"></p>
                <div className="w-20 h-6 bg-gray-300 animate-pulse rounded-md" />
                <p />
                <div className="flex space-x-2">
                  <p className="whitespace-nowrap font-semibold"></p>
                  <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-md" />
                  <p />
                  <p className="h-7 w-8 rounded-md px-7 whitespace-nowrap flex justify-center items-center bg-gray-300 animate-pulse"></p>
                  <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
                  <p />
                </div>
              </div>
              {/* Skeleton for Product Sold */}
              <div className="w-56 h-28 border gap-y-2 rounded-md cursor-pointer flex justify-center items-center flex-col">
                <p className="font-semibold text-xl"></p>
                <div className="w-20 h-6 bg-gray-300 animate-pulse rounded-md" />
                <p />
                <div className="flex space-x-2">
                  <p className="whitespace-nowrap font-semibold"></p>
                  <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-md" />
                  <p />
                  <p className="h-7 w-8 rounded-md px-7 whitespace-nowrap flex justify-center items-center bg-gray-300 animate-pulse"></p>
                  <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
                  <p />
                </div>
              </div>
              {/* Skeleton for Variations Sold */}
              <div className="w-56 h-28 border gap-y-2 rounded-md cursor-pointer flex justify-center items-center flex-col">
                <p className="font-semibold text-xl"></p>
                <div className="w-20 h-6 bg-gray-300 animate-pulse rounded-md" />
                <p />
                <div className="flex space-x-2">
                  <p className="whitespace-nowrap font-semibold"></p>
                  <div className="w-24 h-6 bg-gray-300 animate-pulse rounded-md" />
                  <p />
                  <p className="h-7 w-8 rounded-md px-7 whitespace-nowrap flex justify-center items-center bg-gray-300 animate-pulse"></p>
                  <div className="w-6 h-6 bg-gray-300 animate-pulse rounded-full" />
                  <p />
                </div>
              </div>
            </div>

            {/*  */}
            <div className="mt-6">
              {/* Header */}
              <div className="flex items-center px-5 space-x-5">
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                <div className="h-0.5 w-full bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-4 bg-gray-200 rounded-full animate-pulse" />
              </div>
              {/* Charts Container */}
              <div className="flex justify-around items-center mt-4">
                {/* Net Sales Chart Skeleton */}
                <div className="h-[540px] w-[560px] border rounded-lg">
                  {/* Chart Header */}
                  <div className="border-b-2 p-3">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  {/* Chart Area */}
                  <div className="h-[410px] p-4">
                    {/* Chart Grid Lines */}
                    <div className="h-full w-full flex flex-col justify-between">
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                    </div>
                    {/* Loading Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  {/* Chart Legend */}
                  <div className="border-t p-2 space-y-2">
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3.5 w-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3.5 w-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                {/* Orders Chart Skeleton */}
                <div className="h-[540px] w-[560px] border rounded-lg">
                  {/* Chart Header */}
                  <div className="border-b-2 p-3">
                    <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
                  </div>
                  {/* Chart Area */}
                  <div className="h-[410px] p-4">
                    {/* Chart Grid Lines */}
                    <div className="h-full w-full flex flex-col justify-between">
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                      <div className="h-0.5 w-full bg-gray-100" />
                    </div>
                    {/* Loading Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-2 w-32 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                  {/* Chart Legend */}
                  <div className="border-t p-2 space-y-2">
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3.5 w-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                    <div className="flex justify-between items-center px-4">
                      <div className="flex items-center space-x-3">
                        <div className="h-3.5 w-3.5 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                </div>
                {/*  */}
              </div>
              <div className="mt-6">
                {/* Header */}
                <div className="flex items-center px-5 space-x-5">
                  <div className="h-7 w-32 bg-gray-200 rounded animate-pulse" />
                  <div className="h-0.5 w-[950px] bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-4 bg-gray-200 rounded animate-pulse" />
                </div>
                {/* Leaderboards Container */}
                <div className="flex justify-around items-center mt-4">
                  {/* Top Customers Table Skeleton */}
                  <div className="h-96 w-[550px] border rounded-lg">
                    {/* Table Header */}
                    <div className="border-b-2 p-3">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {/* Table Content */}
                    <div className="h-80 p-2">
                      {/* Table Header Row */}
                      <div className="flex justify-between border-b py-3">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                      </div>
                      {/* Table Rows */}
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Top Coupons Table Skeleton */}
                  <div className="h-96 w-[550px] border rounded-lg">
                    {/* Table Header */}
                    <div className="border-b-2 p-3">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {/* Table Content */}
                    <div className="h-80 p-2">
                      {/* Table Header Row */}
                      <div className="flex justify-between border-b py-3">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      {/* Table Rows */}
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-around items-center mt-4">
                  {/* Top Customers Table Skeleton */}
                  <div className="h-96 w-[550px] border rounded-lg">
                    {/* Table Header */}
                    <div className="border-b-2 p-3">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {/* Table Content */}
                    <div className="h-80 p-2">
                      {/* Table Header Row */}
                      <div className="flex justify-between border-b py-3">
                        <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                      </div>
                      {/* Table Rows */}
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Top Coupons Table Skeleton */}
                  <div className="h-96 w-[550px] border rounded-lg">
                    {/* Table Header */}
                    <div className="border-b-2 p-3">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                    </div>
                    {/* Table Content */}
                    <div className="h-80 p-2">
                      {/* Table Header Row */}
                      <div className="flex justify-between border-b py-3">
                        <div className="h-4 w-28 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                        <div className="h-4 w-32 bg-gray-200 rounded animate-pulse" />
                      </div>
                      {/* Table Rows */}
                      <div className="space-y-4 mt-4">
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                        <div className="flex justify-between py-2">
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <div>
      <div className="flex items-center space-x-4">
        <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
          <DropdownMenuTrigger asChild className="auto ">
            <Button
              variant="outline"
              className="grid grid-cols-6    items-center justify-between h-16"
            >
              <div className="col-span-5 flex-grow">
                <div className="flex flex-col justify-start items-start font-bold text-blue-800">
                  <p className="space-x-2 justify-center items-center flex">
                    {activeTab === "customFields" ? (
                      <span>Custom</span>
                    ) : (
                      <span>{selectedPresetDate?.label}</span>
                    )}{" "}
                    <span className="text-black">( {current} )</span>
                    {activeTab === "customFields" &&
                      dateRange?.from &&
                      dateRange?.to && (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <FaCircleInfo color="red" size={16} />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="font-semibold">
                                {dateRange?.from && dateRange?.to
                                  ? `${
                                      differenceInDays(
                                        dateRange?.to,
                                        dateRange?.from
                                      ) + 1
                                    } days Selected`
                                  : null}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      )}
                  </p>
                  <div className="flex items-center space-x-2">
                    <div className="ml-0 text-blue-800 p-0 font-bold">
                      <p>vs</p>
                    </div>
                    <div>
                      <span>{selectedTimeInterval?.label}</span>{" "}
                      <span className="text-black ml-2">( {comparison} )</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="ml-7">
                {isSearchOpen ? (
                  <IoMdArrowDropup size={28} />
                ) : (
                  <IoMdArrowDropdown size={28} />
                )}{" "}
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[460px] h-[510px] overflow-y-auto  px-4 pb-6 relative left-32">
            <DropdownMenuLabel className="py-0 font-semibold">
              SELECT A DATE RANGE
            </DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Tab Navigation */}
            <div className="flex space-x-4 mb-2 items-center border-b-2 py-2">
              <button
                className={`text-sm font-semibold py-1 px-5 rounded-sm ${
                  activeTab === "presets"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("presets")}
              >
                Presets
              </button>
              <button
                className={`text-sm font-semibold py-1 px-5 rounded-sm ${
                  activeTab === "customFields"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600"
                }`}
                onClick={() => setActiveTab("customFields")}
              >
                Custom
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === "presets" && (
              <div className="space-y-2">
                <div className="flex flex-wrap justify-center items-center ">
                  {preset.map((presets) => (
                    <>
                      <div
                        onClick={() => setselectedPresetDate(presets)}
                        key={presets.value}
                        className="w-48 hover:bg-gray-100 cursor-pointer border flex justify-center items-center p-4"
                      >
                        <p className="flex justify-center items-center mr-2">
                          {selectedPresetDate?.value === presets.value && (
                            <p className="h-2 w-2 mt-1 bg-blue-400 mr-4"> </p>
                          )}{" "}
                          {presets.label}
                        </p>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "customFields" && (
              <div>
                <div className="flex justify-between items-center space-x-2">
                  <div className="flex-grow">
                    <p>Start Date</p>
                    <Input
                      type="date"
                      value={
                        dateRange?.from
                          ? format(dateRange.from, "yyyy-MM-dd")
                          : ""
                      }
                      onChange={(e) => handleInputChange(e, "from")}
                      placeholder="Start Date"
                      className="w-full cursor-text"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="font-semibold text-slate-500">to</p>
                  </div>
                  <div className="flex-grow">
                    <p>End Date</p>
                    <Input
                      type="date"
                      value={
                        dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : ""
                      }
                      onChange={(e) => handleInputChange(e, "to")}
                      placeholder="End Date"
                      className="w-full cursor-text"
                    />
                  </div>
                </div>

                <div className="flex justify-center items-center">
                  <DayPicker
                    className="relative pb-0"
                    mode="range"
                    selected={dateRange}
                    onSelect={handleDateRangeChange}
                    toDate={new Date()}
                    defaultMonth={dateRange?.from || new Date()}
                  />
                </div>
              </div>
            )}

            <div className="flex justify-center mt-0 items-center flex-col">
              <p className="p-2">COMPARE TO</p>
              <div className="flex">
                {interval.map((interval) => (
                  <div
                    onClick={() => setselectedTimeInterval(interval)}
                    key={interval.value}
                    className="w-44 border p-2 flex justify-center items-center cursor-pointer hover:bg-gray-200"
                  >
                    <p className="flex justify-center items-center mr-2">
                      {selectedTimeInterval?.value === interval.value && (
                        <p className="h-2 w-2 mt-1 bg-blue-400 mr-4"> </p>
                      )}{" "}
                      {interval.label}
                    </p>
                  </div>
                ))}
                <div></div>
              </div>
            </div>
            {/* Action Buttons */}
            <div className="flex justify-between  px-8 mt-4 mb-2 ">
              <Button
                className=" bg-blue-500 font-semibold hover:bg-blue-600 text-white"
                onClick={handleSearch}
              >
                Update
              </Button>
              <Button
                className="  bg-red-500 font-semibold hover:bg-red-600 text-white"
                onClick={handleClear}
              >
                Clear
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <RootAnalytics
        selectedTimeInterval={selectedTimeInterval}
        selectedPresetDate={selectedPresetDate}
        revenueStat={revenueStat}
        leaderBoards={leaderBoards}
        performanceData={performanceData}
      />
    </div>
  );
};

export default Page;
