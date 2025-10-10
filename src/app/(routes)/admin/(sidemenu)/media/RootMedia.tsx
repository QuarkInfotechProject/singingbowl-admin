"use client";
import React from "react";
import { useState, useEffect } from "react";
import File from "../file/page";
import CreateFile from "../file/create/page";
import { BsThreeDots } from "react-icons/bs";
import EditFile from "./editDailog/page";
import CreateMedia from "./create/page";
import { FaPlus } from "react-icons/fa6";
import { Skeleton } from "@/components/ui/skeleton";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
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
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { ApiResponse } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import { Button } from "@/components/ui/button";
import Loading from "./Loading";
import { AiOutlineSearch } from "react-icons/ai";
import { FaFolderOpen } from "react-icons/fa6";

import { useToast } from "@/components/ui/use-toast";

import { FileResponse } from "@/app/_types/media_Types/file_Types/fileTypes";

const RootMedia = ({
  fileCategory,
  setRefetch,
  refetch,
}: {
  fileCategory: ApiResponse | null;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});
  const { toast } = useToast();
  const [fileShowCategory, setFileShowCategory] = useState<FileResponse | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageHovered, setImageHovered] = useState(false);
  const [categoryHovered, setCategoryHovered] = useState(false);
  const [activeButton, setActiveButton] = useState<string | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  const [isSheetsOpens, setIsSheetsOpens] = useState(false);

  const toggleDropdown = (itemId: number) => {
    const updatedStates = {
      ...dropdownStates,
      [itemId]: !dropdownStates[itemId],
    };
    setDropdownStates(updatedStates);
  };

  const onDelete = async (slug: string) => {
    setIsLoading(true);
    const deleteData = {
      url: slug,
    };

    try {
      const res = await fetch(`/api/mediaCategory/delete`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();

        setRefetch(true);
        toast({ description: `${data.message}` });
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
      setIsLoading(false);
    }
  };

  const getCategory = async (ungroupedImages: string) => {
    setCategoryHovered(false);
    try {
      const res = await fetch(`/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grouped: false,
          fileCategoryId: "",
        }),
      });
      const data = await res.json();
      setFileShowCategory(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
    setCategoryHovered(!categoryHovered);
    setActiveButton(ungroupedImages);
  };
  const getName = async (id: number) => {
    try {
      const res = await fetch(`/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grouped: "",
          fileCategoryId: id,
        }),
      });
      const data = await res.json();
      setFileShowCategory(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  const PAGE_RANGE_DISPLAY = 3;
  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
  };

  const generatePageNumbers = (
    totalPages: number,
    currentPage: number
  ): (number | "...")[] => {
    const pageNumbers: (number | "...")[] = [];

    if (totalPages <= PAGE_RANGE_DISPLAY) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      const startPage = Math.max(1, currentPage - PAGE_RANGE_DISPLAY);
      const endPage = Math.min(totalPages, currentPage + PAGE_RANGE_DISPLAY);

      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push("...");
        }
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push("...");
        }
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const getImage = async (allImages: string) => {
    setImageHovered(false);
    try {
      const res = await fetch(`/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setFileShowCategory(data);

      setRefetch(true);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }

    setImageHovered(!imageHovered);
    setActiveButton(allImages);
  };
  useEffect(() => {
    if (refetch) {
      getImage("default");
      setRefetch(false);
    }
  }, [refetch]);

  const refreshFileData = async () => {
    try {
      const res = await fetch(`/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });
      const data = await res.json();
      setFileShowCategory(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await fetch(`/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: searchTerm,
        }),
      });
      const data = await res.json();
      setFileShowCategory(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };
  useEffect(() => {
    handleSearch();
  }, []);
  const getpagination = async () => {
    try {
      const url = `/api/media/media-page/${currentPage}`;

      const res = await fetch(url, {
        method: "POST",
      });
      const data = await res.json();
      setFileShowCategory(data);
      setTotalPages(data.data.last_page);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    getpagination();
  }, [currentPage, totalPages]);

  const getSort = async (type: string) => {
    try {
      const res = await fetch(`/api/media`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(type),
      });
      const data = await res.json();
      setFileShowCategory(data);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    if (selectedOption) {
      getSort(selectedOption);
    }
  }, [selectedOption]);

  useEffect(() => {
    if (fileShowCategory) {
      setIsLoading(false);
    }
  }, [fileShowCategory]);

  useEffect(() => {
    if (refetch) {
      setIsLoading(true);
      refreshFileData();
      setRefetch(false);
    }
  }, [refetch]);

  const options = [
    { label: "Created 🡣", value: { sortBy: "created_at", sortDirection: "" } },
    {
      label: "Created 🡡",
      value: { sortBy: "created_at", sortDirection: "desc" },
    },
    { label: "Size 🡣", value: { sortBy: "size", sortDirection: "" } },
    { label: "Size 🡡", value: { sortBy: "size", sortDirection: "desc" } },
    { label: "Name A-Z", value: { sortBy: "filename", sortDirection: "" } },
    { label: "Name Z-A", value: { sortBy: "filename", sortDirection: "desc" } },
  ];

  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };
  const toggleCreateDialogs = () => {
    setIsSheetOpens(true);
  };

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Media</h1>
      <ResizablePanelGroup
        direction="horizontal"
        className="max-h-full max-w-full  border"
      >
        <ResizablePanel
          defaultSize={100}
          className="flex flex-col items-start gap-y-2 p-6 justify-center h-full"
        >
          <span>
            {" "}
            <Button
              variant="outline"
              className={`cursor-pointer border p-2 w-40 items-center transition duration-300 ease-in-out hover:bg-orange-400 hover:text-white ${
                activeButton === "allImages" ? "bg-orange-400 text-white " : ""
              }`}
              onClick={() => getImage("allImages")}
            >
              All Images
            </Button>
          </span>
          <span>
            {" "}
            <Button
              variant="outline"
              className={`cursor-pointer w-40  transition duration-300 ease-in-out hover:bg-orange-400 hover:text-white ${
                activeButton === "ungroupedImages"
                  ? "bg-orange-400 text-white"
                  : ""
              }`}
              onClick={() => getCategory("ungroupedImages")}
            >
              Ungrouped Images{" "}
            </Button>
          </span>

          {isLoading ? (
            <div className="h-96 overflow-y-auto overflow-x-hidden w-52">
              {Array(5)
                .fill()
                .map((_, index) => (
                  <div
                    key={index}
                    className="flex flex-row gap-3 cursor-pointer p-2"
                  >
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="h-6 w-36" />
                    <div className="relative">
                      <Skeleton className="w-10 h-10 rounded" />
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="h-96 overflow-y-auto overflow-x-hidden w-52">
              {fileCategory?.data.map((item) => (
                <span
                  className="font-semibold flex flex-row gap-3 cursor-pointer p-2 relative "
                  onClick={() => getName(item.id)}
                >
                  <FaFolderOpen className="items-center mt-1 text-blue-500 hover:text-blue-600" />
                  {item.name}

                  <div className="absolute inset-0 w-40  h-9 bg-black bg-opacity-40 rounded-sm opacity-0 transition-opacity hover:opacity-100">
                    <BsThreeDots
                      className="cursor-pointer text-xl text-black text-md top-0 right-2   mt-1  absolute"
                      onClick={() => toggleDropdown(item?.id)}
                    />

                    {dropdownStates[item.id] && (
                      <div
                        id={`dropdown-${item.id}`}
                        className="absolute z-10 bg-white divide-y divide-gray-100 top-5 right-0 shadow  dark:bg-gray-700"
                      >
                        <ul className="py-2 text-sm text-gray-700 dark:text-gray-200">
                          <li>
                            <Dialog
                              isOpen={isSheetOpens}
                              onClose={() => setIsSheetOpens(false)}
                            >
                              <DialogTrigger asChild>
                                <a
                                  onClick={toggleCreateDialogs}
                                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                                >
                                  Edit
                                </a>
                              </DialogTrigger>
                              {isSheetOpens && (
                                <DialogContent className="max-w-[500px]  h-[300px]">
                                  <EditFile
                                    setIsSheetOpens={setIsSheetOpens}
                                    dataUrl={item.url}
                                  />
                                </DialogContent>
                              )}
                            </Dialog>
                          </li>
                          <li>
                            <AlertDialog>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Are you sure you want to delete the file
                                    Category ?
                                  </AlertDialogTitle>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white hover:text-white">
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="bg-green-500 hover:bg-green-600"
                                    onClick={() => onDelete(item.url)}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>

                              <AlertDialogTrigger>
                                <a className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                                  Delete
                                </a>
                              </AlertDialogTrigger>
                            </AlertDialog>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </span>
              ))}
            </div>
          )}

          <Dialog
            isOpen={isSheetsOpens}
            onClose={() => setIsSheetsOpens(false)}
          >
            <DialogTrigger asChild>
              <a onClick={toggleCreateDialogs}>
                <Button className="mt-auto mx-auto mr-10 gap-2 bg-green-500 hover:bg-green-600 ">
                  {" "}
                  <FaPlus className="w-3 h-3 text-white" />
                  Create file category
                </Button>
              </a>
            </DialogTrigger>
            {isSheetOpens && (
              <DialogContent className="max-w-[500px]  h-[400px]">
                <CreateMedia
                  setIsSheetsOpens={setIsSheetOpens}
                  setRefetch={setRefetch}
                />
              </DialogContent>
            )}
          </Dialog>
        </ResizablePanel>

        <div className="border-l"></div>

        <ResizablePanel defaultSize={400} className="h-full">
          <div className=" gap-4  ">
            <span className="font-semibold">
              <div className="mb-2 flex  p-3 justify-between">
                <div className="flex flex-row">
                  <div className="mt-3">
                    <input
                      type="text"
                      placeholder="Search by Name"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border text-xs rounded p-2 mr-2 w-60 dark:text-gray-300 h-[40px]  "
                    />
                  </div>
                  <div className="mt-2">
                    <button className="bg-white py-1 px-3 mt-2 h-[35px] rounded border border-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-100 hover:bg-gray-100 hover:text-blue-500">
                      <AiOutlineSearch
                        onClick={handleSearch}
                        className="  text-lg"
                      />{" "}
                    </button>
                  </div>
                </div>

                <div className="p-3">
                  <select
                    id="sortSelect"
                    className="w-[140px] h-[40px] border rounded-md p-2 text-[15px] font-semibold"
                    onChange={(e) => {
                      const selectedValue = e.target.value
                        ? JSON.parse(e.target.value)
                        : null;

                      setSelectedOption(selectedValue);
                      getSort(selectedValue);
                    }}
                  >
                    <option value="" disabled selected hidden>
                      Sort by
                    </option>
                    {options.map((option, index) => (
                      <option key={index} value={JSON.stringify(option.value)}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="p-3">
                  <Dialog
                    isOpen={isSheetOpen}
                    onClose={() => setIsSheetOpen(false)}
                  >
                    <DialogTrigger asChild>
                      <Button
                        className="bg-green-500 hover:bg-green-600 gap-2"
                        onClick={toggleCreateDialog}
                      >
                        {" "}
                        <FaPlus className="w-3 h-3 text-white" />
                        Upload Images
                      </Button>
                    </DialogTrigger>
                    {isSheetOpen && (
                      <DialogContent className="max-w-[800px]  h-[550px]">
                        <CreateFile
                          setIsSheetOpen={setIsSheetOpen}
                          setRefetch={setRefetch}
                        />
                      </DialogContent>
                    )}
                  </Dialog>
                </div>
              </div>
              {isLoading ? (
                <div className="grid grid-cols-5 gap-y-4 p-4 gap-x-6 mt-4 ml-4 mb-4 overflow-x-auto select-none h-96">
                  {Array(10)
                    ?.fill()
                    .map((_, index) => (
                      <div key={index} className="relative">
                        <Skeleton className="h-[110px] w-[110px] mx-auto" />
                        <div className="bg-white p-2 flex flex-col text-center overflow-hidden dark:bg-gray-950">
                          <Skeleton className="h-4 w-20 mx-auto" />
                          <Skeleton className="h-3 w-16 mx-auto mt-1" />
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <File
                  fileShowCategory={fileShowCategory}
                  setFileShowCategory={setFileShowCategory}
                />
              )}
            </span>

            <div className="mt-4 text-left">
              <div className=" flex mt-4 text-left ">
                <Button
                  variant="outline"
                  size="sm"
                  className="m-2"
                  onClick={handlePreviousClick}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-4">
                  {generatePageNumbers(totalPages, currentPage).map(
                    (page, index) => (
                      <button
                        key={index}
                        onClick={() =>
                          typeof page === "number" ? setCurrentPage(page) : null
                        }
                        className={page === currentPage ? "font-bold" : ""}
                      >
                        {page}
                      </button>
                    )
                  )}
                </div>
                <div className="mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-2"
                    onClick={handleNextClick}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RootMedia;
