"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { FiEdit } from "react-icons/fi";
import { MdDelete } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { BsThreeDots, BsThreeDotsVertical } from "react-icons/bs";
import { IoMdSearch } from "react-icons/io";
import AddUser from "./create/page";
import EditUser from "./edit/page";
import { buttonVariants } from "@/components/ui/button";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import ViewButton from "./Button/ViewButton";
import { Button } from "@/components/ui/button";
import Loading from "./Loading";
import { AiOutlineLoading, AiOutlineSearch } from "react-icons/ai";
import { AdminUserData } from "@/app/_types/adminUser-Types/adminUserTypes";
import { Group } from "@/app/_types/group-Types/groupType";

import { Input } from "@/components/ui/input";
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
import BlockButton from "./Button/BlockButton";
import ActivateButton from "./Button/ActivateButton";
import { FaPlus } from "react-icons/fa6";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { FaSearch } from "react-icons/fa";
import { IoFilter, IoFilterOutline } from "react-icons/io5";
import { request } from "http";
import { ChevronLeft, ChevronRight, LucidePlusCircle } from "lucide-react";

const UserProfile: React.FC = () => {
  const [data, setData] = useState<AdminUserData[]>([]);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [refetch, setRefetch] = useState(false);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchName, setSearchName] = useState("");
  const [searchStatus, setSearchStatus] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [hasSearchResults, setHasSearchResults] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [groupData, setGroupData] = useState<{ [key: string]: string }>({});
  const [position, setPosition] = useState("bottom");
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showNoResults, setShowNoResults] = useState(false);

  const toggleDialogs = () => {
    setIsSheetOpens(true);
  };
  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };

  const options = [
    { label: " Active", value: "1" },
    { label: "Inactive", value: "2" },
    { label: "Deleted", value: "3" },
  ];

  const renderStatus = (status: number) => (
    <span>
      {status === 1 ? (
        <p className=" text-green-500 font-medium  text-xs inline-block border border-green-100  rounded-full px-2 py-1 text-center bg-green-100 bg-opacity-95  ">
          Active
        </p>
      ) : status === 2 ? (
        <p className=" text-blue-500 text-xs inline-block border border-blue-100 font-medium  rounded-full px-2 py-1 text-center bg-blue-100 bg-opacity-95">
          {" "}
          Inactive{" "}
        </p>
      ) : (
        <p className=" text-red-500 text-xs inline-block border border-red-100 font-medium  rounded-full px-2 py-1 text-center bg-red-100 bg-opacity-95">
          {" "}
          Deleted{" "}
        </p>
      )}
    </span>
  );

  const fetchData = async (page?: number) => {
    try {
      const requestData = {
        email: searchEmail,
        name: searchName,
        status: searchStatus,
        // page: page,
      };
      const paginationData = page || currentPage;

      setIsLoading(true);
      const pages = paginationData;
      const [userDataResponse, groupResponse] = await Promise.all([
        axios.post(`/api/adminUser?page=${pages}`, requestData),
        axios.get("/api/group"),
      ]);

      if (userDataResponse.status === 200 && groupResponse.status === 200) {
        const userData = userDataResponse.data;
        const groupData = groupResponse.data;

        setData(userData.data.data);
        setTotalPages(userData.data.last_page);
        setHasSearchResults(userData.data.data.length > 0);

        const groupMap: { [key: string]: string } = {};
        groupData.data.data.forEach((group: Group) => {
          groupMap[group.id] = group.name;
        });
        setGroupData(groupMap);
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

  const handlePreviousClick = async () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      fetchData(newPage);
      // const result = await fetchData(newPage);
      // if (result) {
      //   setData(result.userData);
      //   setTotalPages(result.totalPages);
      //   setHasSearchResults(result.hasResults);
      //   setGroupData(result.groupMap);
      // }
    }
  };

  const handleNextClick = async () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      fetchData(newPage);
      // const result = await fetchData(newPage);
      // if (result) {
      //   setData(result.userData);
      //   setTotalPages(result.totalPages);
      //   setHasSearchResults(result.hasResults);
      //   setGroupData(result.groupMap);
      // }
    }
  };

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchEmail(event.target.value);
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchName(event.target.value);
  };

  const handleStatusChange = (value: string) => {
    setSearchStatus(value);
    // setIsFiltering(true);
    // setCurrentPage(1);
    // Use a callback to ensure we have the latest state
    // setTimeout(() => {
    //   fetchData(1);
    // }, 0);
  };

  // Update useEffect to depend on searchStatus
  // useEffect(() => {
  //   const loadInitialData = async () => {
  //     await fetchData();
  //   };
  //   setRefetch(false);
  //   loadInitialData();
  // }, [isFiltering, searchStatus]);

  const handleSearch = async () => {
    setIsFiltering(true);
    setCurrentPage(1);
    const result = await fetchData(1);

    if (result) {
      setData(result.userData);
      setTotalPages(result.totalPages);
      setHasSearchResults(result.hasResults);
      setGroupData(result.groupMap);
    }
  };
  useEffect(() => {
    const loadInitialData = async () => {
      const result = await fetchData();
      if (result) {
        setData(result.userData);
        setTotalPages(result.totalPages);
        setHasSearchResults(result.hasResults);
        setGroupData(result.groupMap);
      }
    };
    loadInitialData();
  }, [isFiltering]);

  const isSearchFieldFilled = () => {
    return searchEmail !== "" || searchName !== "" || searchStatus !== "";
  };
  const handleClear = async () => {
    setSearchEmail("");
    setSearchName("");
    setSearchStatus("");
    setCurrentPage(1);
    setIsFiltering(false);
    setHasSearchResults(true);
    // const result = await fetchData(1);
    // if (result) {
    //   setData(result.userData);
    //   setTotalPages(result.totalPages);
    //   setHasSearchResults(result.hasResults);
    //   setGroupData(result.groupMap);
    // }
    setIsSearchOpen(false);
  };

  const handleActivateSuccess = () => {
    fetchData();
  };

  const handleBlockSuccess = () => {
    fetchData();
  };

  useEffect(() => {
    fetchData();
    setRefetch(false);
  }, [refetch]);

  const onDelete = async (uuid: string) => {
    setIsLoading(true);
    try {
      const deleteData = {
        uuid: uuid,
      };
      const res = await fetch(`/api/adminUser/adminUserDelete`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-600 text-white ",
        });
        fetchData();
      } else {
        toast({
          description: "Failed to delete the admin user",
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
      setIsLoading(false);
    }
  };


  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div> </div>

        <div className="flex flex-row gap-3">
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
                <div className="space-y-2">
                  <Input
                    type="text"
                    placeholder="Search by Email"
                    value={searchEmail}
                    onChange={handleEmailChange}
                    className="w-full"
                  />
                  <Input
                    type="text"
                    placeholder="Search by Name"
                    value={searchName}
                    onChange={handleNameChange}
                    className="w-full"
                  />
                  <Select
                    value={searchStatus}
                    onValueChange={handleStatusChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Active</SelectItem>
                      <SelectItem value="2">Inactive</SelectItem>
                      <SelectItem value="3">Deleted</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex flex-row gap-2">
                    <Button
                      className="bg-blue-500 text-white"
                      onClick={() => {
                        handleSearch();
                        setIsSearchOpen(false);
                      }}
                    >
                      {/* <AiOutlineSearch className="mr-2 h-4 w-4" /> */}
                      Search
                    </Button>
                    {isSearchFieldFilled() && (
                      <Button
                        className="bg-red-500 text-white"
                        onClick={() => {
                          handleClear();
                          setIsSearchOpen(false);
                        }}
                      >
                        Clear
                      </Button>
                    )}
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div>
            <Dialog>
              <DialogTrigger asChild>
                <a
                  className={buttonVariants()}
                  // onClick={handleCreate}
                  onClick={toggleCreateDialog}
                  style={{ textDecoration: "none", backgroundColor: "white" }}
                >
                  <Button className="flex items-center gap-2 bg-[#5e72e4] hover:bg-[#465ad1] text-white py-2 px-4 rounded-lg  focus:outline-none ">
                    <LucidePlusCircle className="w-4 h-4 text-white" />
                    Add Admin User
                  </Button>
                </a>
              </DialogTrigger>
              {isSheetOpen && (
                <DialogContent className="max-w-[500px]  bg-gray-50 rounded-lg shadow-lg p-4 ">
                  <AddUser
                    setIsSheetOpen={setIsSheetOpen}
                    setRefetch={setRefetch}
                  />
                </DialogContent>
              )}
            </Dialog>
          </div>
        </div>
      </div>
      <Card className="w-full">
        <CardHeader className="flex flex-row justify-between">
          <div className="flex flex-col gap-1 ">
            <CardTitle>Admin Users</CardTitle>

            <CardDescription>Manage admin users</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="w-full  ">
            {isLoading ? (
              <>
                {/* No results skeleton */}
                {/* <div className="flex flex-col items-center justify-center ">
           <Skeleton className="w-48 h-6 mt-4" />
         </div> */}

                {/* Table skeleton */}
                <div className="w-full mt-5">
                  <Skeleton className="h-10 w-full mb-2" />
                  {[...Array(5)].map((_, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex flex-row gap-4 items-center ">
                        <Skeleton className="w-1/5 h-6" />
                        <Skeleton className="w-1/5 h-6" />
                        <Skeleton className="w-1/5 h-6" />
                        <Skeleton className="w-1/5 h-6" />
                        <Skeleton className="w-1/5 h-6" />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pagination skeleton */}
                <div className="flex items-center justify-between mt-8">
                  <Skeleton className="w-16 h-8" />
                  <Skeleton className="w-16 h-8" />
                  <div className="flex space-x-4">
                    <Skeleton className="w-20 h-8" />
                    <Skeleton className="w-20 h-8" />
                  </div>
                </div>
              </>
            ) : (
              <Table className="w-full table-auto mt-5 ">
                <TableHeader className="border-b border-gray-300 dark:bg-gray-800 dark:border-gray-700">
                  <TableRow>
                    <TableHead className=" text-gray-500 font-medium  py-3 px-4">
                      Name
                    </TableHead>
                    <TableHead className=" text-gray-500 font-medium  py-3 px-4">
                      Email
                    </TableHead>
                    <TableHead className=" text-gray-500 font-medium py-3 px-4">
                      Group
                    </TableHead>
                    <TableHead className=" text-gray-500 font-medium text-center py-3 px-4">
                      Status
                    </TableHead>
                    <TableHead className=" text-gray-500 font-medium  text-center py-3 px-4">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody className="">
                  {hasSearchResults ? (
                    data.map((item, index) => (
                      <TableRow key={index} className=" hover:bg-gray-200">
                        <TableCell>{item.fullName}</TableCell>
                        <TableCell>{item.email}</TableCell>
                        <TableCell>
                          {item?.groupId === 1
                            ? "Super Admin"
                            : item?.groupId
                            ? groupData[item.groupId]
                            : "N/A"}
                        </TableCell>

                        <TableCell className="text-center">
                          {renderStatus(item.status)}
                        </TableCell>
                        <TableCell className="border-t-0 border-b-0  flex justify-center gap-4 items-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <a
                                variant="ghost"
                                disabled={item.status === 3}
                                className={`cursor-pointer ${
                                  item.status === 3
                                    ? "pointer-events-none opacity-50"
                                    : ""
                                }`}
                              >
                                <BsThreeDots />
                              </a>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-10 ">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>

                              <DropdownMenuSeparator />

                              {item.status === 1 && (
                                <div className="mb-1 hover:bg-gray-100 cursor-pointer  p-1">
                                  <BlockButton
                                    userUuid={item.uuid}
                                    onBlockSucess={handleBlockSuccess}
                                  />
                                </div>
                              )}
                              {item.status === 2 && (
                                <div className="mb-1 hover:bg-gray-100 cursor-pointer  p-1">
                                  <ActivateButton
                                    userUuid={item.uuid}
                                    onActivateSuccess={handleActivateSuccess}
                                  />
                                </div>
                              )}
                              {item.status !== 3 && (
                                <div className=" flex flex-col gap-2 cursor-pointer  ">
                                  <span className="hover:bg-gray-100 p-1">
                                    <ViewButton DataId={item.uuid} />
                                  </span>

                                  <TooltipProvider>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Dialog>
                                          <DialogTrigger asChild>
                                            <span
                                              className=" text-sm hover:bg-gray-100 cursor-pointer  p-1"
                                              onClick={toggleDialogs}
                                            >
                                              Edit
                                            </span>
                                          </DialogTrigger>
                                          {isSheetOpens && (
                                            <DialogContent className="bg-gray-50">
                                              <EditUser
                                                setRefetch={setRefetch}
                                                setIsSheetOpens={
                                                  setIsSheetOpens
                                                }
                                                DataId={item.uuid}
                                              />
                                            </DialogContent>
                                          )}
                                        </Dialog>
                                      </TooltipTrigger>
                                    </Tooltip>
                                  </TooltipProvider>

                                  <AlertDialog>
                                    <AlertDialogContent>
                                      <AlertDialogHeader>
                                        <AlertDialogTitle>
                                          Are you sure you want to delete the
                                          data ?
                                        </AlertDialogTitle>
                                      </AlertDialogHeader>
                                      <AlertDialogFooter>
                                        <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white hover:text-white">
                                          Cancel
                                        </AlertDialogCancel>
                                        <AlertDialogAction
                                          onClick={() => onDelete(item.uuid)}
                                          className="bg-[#5e72e4] hover:bg-[#465ad1]"
                                        >
                                          Continue
                                        </AlertDialogAction>
                                      </AlertDialogFooter>
                                    </AlertDialogContent>

                                    <AlertDialogTrigger>
                                      <TooltipProvider>
                                        <Tooltip>
                                          <TooltipTrigger asChild>
                                            <div className=" text-sm text-start cursor-pointer hover:bg-gray-100  p-1">
                                              Delete
                                            </div>
                                          </TooltipTrigger>
                                        </Tooltip>
                                      </TooltipProvider>
                                    </AlertDialogTrigger>
                                  </AlertDialog>
                                </div>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-red-500 text-lg font-bold">
                            No results found.
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
            <div className="flex justify-end items-center mt-6 select-none">
              <nav
                className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                aria-label="Pagination"
              >
                <div
                  className={`relative inline-flex cursor-pointer items-center rounded-l-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
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

                <span className="relative inline-flex items-center px-4 py-2  text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
                  Page {currentPage} of {totalPages}
                </span>

                <div
                  className={`relative inline-flex items-center rounded-r-md px-2 cursor-pointer  py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
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
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
