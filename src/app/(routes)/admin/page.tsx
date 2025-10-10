"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import "react-day-picker/dist/style.css";

import { AdminUserData } from "@/app/_types/adminUser-Types/adminUserTypes";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Dashboard from "@/components/dashboard-components/dashboard";


import { IoFilter, IoFilterOutline } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { format, differenceInDays } from "date-fns";
import { DayPicker } from "react-day-picker";

const UserProfile: React.FC = () => {
  const [data, setData] = useState<AdminUserData[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState(false);
  const [searchStatus, setSearchStatus] = useState("daily");
  const [hasSearched, setHasSearched] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("");
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined,
  });
  const fetchData = async () => {
    try {
    
      setIsLoading(true)
      const requestData = {
        period:
          activeTab === "presets"
            ? searchStatus
            : activeTab === "customFields"
            ? " "
            : "daily",
        startDate:
          activeTab === "presets"
            ? ""
            : dateRange?.from
            ? format(dateRange?.from, "yyyy-MM-dd")
            : " ",
        endDate:
          activeTab === "presets"
            ? ""
            : dateRange?.to
            ? format(dateRange?.to, "yyyy-MM-dd")
            : " ",
      };


      const userDataResponse = await axios.post(`/api/dashboard`, requestData);

      if (userDataResponse.status === 200) {
        const userData = userDataResponse.data.data;
        setData(userData);
      } else {
        toast({
          title: "Error",
          description: userDataResponse?.data?.message || "An error occurred",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description:
          error.response?.data?.message || error.message || "An error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle status change
  const handleStatusChange = (value: string) => {
    setIsFiltering(true);
    setSearchStatus(value);
    setHasSearched(false);
  };

  const handleDateRangeChange = (range: { from?: Date; to?: Date }) => {
    setDateRange(range);
  };

  const handleSearch = () => {
    setIsFiltering(true);
    setHasSearched(true);
    fetchData();
    setIsSearchOpen(false);
  };

  const handleClear = () => {
    setSearchStatus("daily");
    setDateRange({ from: undefined, to: undefined });
    setHasSearched(false);
    fetchData();
    setIsSearchOpen(false);
  };

  useEffect(() => {
    fetchData();
    setRefetch(false);
  }, [refetch]);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "from" | "to"
  ) => {
    const value = e.target.value;
    const newDate = value ? new Date(value) : undefined;
    setDateRange((prev) => ({ ...prev, [type]: newDate }));
  };
  if (isLoading) {
    return (
      <>
        <div className="p-6 space-y-6 animate-pulse">
          {/* Header Skeleton */}
          <div className="h-10 w-1/3 bg-gray-200 rounded-lg" />
          {/* Revenue Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
              </div>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
              </div>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 w-24 bg-gray-200 rounded" />
                <div className="h-6 w-6 bg-gray-200 rounded-full" />
              </div>
              <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>
          {/* User Stats Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
              <div className="h-8 w-16 bg-gray-200 rounded" />
            </div>
          </div>
          {/* Tables Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Top Selling Products Table Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
            {/* Low Stock Products Table Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
                <div className="h-12 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
          {/* Activity & Reviews Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Activity Logs Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 w-40 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            </div>
            {/* Reviews Skeleton */}
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="h-6 w-48 bg-gray-200 rounded mb-6" />
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-12 w-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
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
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div> </div>
        <div>
          <DropdownMenu open={isSearchOpen} onOpenChange={setIsSearchOpen}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <IoFilterOutline className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[500px] p-4 relative right-12">
              <DropdownMenuLabel>Search Options</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Tab Navigation */}
              <div className="flex space-x-4 mb-2 items-center border-b-2 py-2">
                <button
                  className={`text-sm font-semibold py-2 px-4 rounded-md ${
                    activeTab === "presets"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("presets")}
                >
                  Presets
                </button>
                <button
                  className={`text-sm font-semibold py-2 px-4 rounded-md ${
                    activeTab === "customFields"
                      ? "bg-blue-500 text-white"
                      : "text-gray-600"
                  }`}
                  onClick={() => setActiveTab("customFields")}
                >
                  Custom
                </button>
                <div>
                  <p className="font-semibold ">
                    {activeTab !== "presets" && (
                      <>
                        {" "}
                        {dateRange?.from && dateRange?.to
                          ? `${
                              differenceInDays(dateRange?.to, dateRange?.from) +
                              1
                            } days Selected `
                          : null}
                      </>
                    )}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "presets" && (
                <div className="space-y-2">
                  <Select
                    value={searchStatus}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
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
                          dateRange?.to
                            ? format(dateRange.to, "yyyy-MM-dd")
                            : ""
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

              {/* Action Buttons */}
              <div className="flex flex-row space-x-3 mt-2">
                <Button
                  className="bg-blue-500 text-white"
                  onClick={handleSearch}
                >
                  Search
                </Button>
                {(searchStatus !== "daily" ||
                  dateRange?.from ||
                  dateRange?.to) && (
                  <Button
                    className="bg-red-500 text-white"
                    onClick={handleClear}
                  >
                    Clear
                  </Button>
                )}
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Dashboard
        data={data}
        dateDifference={
          dateRange?.from && dateRange?.to
            ? differenceInDays(dateRange?.to, dateRange?.from)
            : null
        }
        activeTab={activeTab}
        searchStatus={searchStatus}
        hasSearched={hasSearched}
        dateRange={dateRange}
      />
    </div>
  );
};

export default UserProfile;
