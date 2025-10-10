"use client";
import React from "react";
import { useState, useEffect } from "react";
import File from "../../components/mediaCenter_components/file";
import EditFile from "../EditFile/editfile";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";

import { ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

import { ApiResponse } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import { Button } from "@/components/ui/button";
import Loading from "../../app/(routes)/admin/(sidemenu)/media/Loading";
import { AiOutlineSearch } from "react-icons/ai";
import { FaFolderOpen } from "react-icons/fa6";

import { useToast } from "@/components/ui/use-toast";

import { FileResponse } from "@/app/_types/media_Types/file_Types/fileTypes";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";

const MediaCenter = ({
  fileCategory,
  setRefetch,
  refetch,
  onLogoClick,
  setIsSheetOpen,
  onClickTab,
}: {
  fileCategory: ApiResponse | null;
  onLogoClick: (data: any) => void;
  setIsSheetOpen: any;
  onClickTab: (data: any) => void;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [fileShowCategory, setFileShowCategory] = useState<FileResponse | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState(null);
  const [imageHovered, setImageHovered] = useState(false);
  const [categoryHovered, setCategoryHovered] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState(null);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState(null);

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
    } catch (error) {}
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
    } catch (error) {}
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
    } catch (error) {}

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
    } catch (error) {}
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
    } catch (error) {}
  };

  useEffect(() => {
    handleSearch();
  }, []);

  const handleInsert = (id, url) => {
    onLogoClick({ id, url });
    setIsSheetOpen(false);
  };

  const getpagination = async () => {
    try {
      const url = `/api/media/media-page/${currentPage}`;

      const res = await fetch(url, {
        method: "POST",
      });
      const data = await res.json();
      setFileShowCategory(data);
      setTotalPages(data.data.last_page);
    } catch (error) {}
  };

  useEffect(() => {
    getpagination();
  }, [currentPage, totalPages]);

  const PAGE_RANGE_DISPLAY = 3;

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
  };

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
    } catch (error) {}
  };

  useEffect(() => {
    if (fileShowCategory) {
      setIsLoading(false);
    }
  }, [fileShowCategory]);

  useEffect(() => {
    if (refetch) {
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

  console.log("selected image prreviuews here", selectedImagePreview);
  return (
    <div className="p-4 h-[535px] flex-row flex">
      <div className="w-[100%]">
        <ResizablePanelGroup
          direction="horizontal"
          className="max-h-full max-w-[1350px] border"
        >
          <div
            className="items-start gap-y-2 p-2 w-[13%] h-80"
            data-panel
            data-panel-group-id=":r12:"
            data-panel-id=":r13:"
            data-panel-size="33.3"
          >
            <p className="mb-3 font-medium">Categories:</p>
            <span>
              <Button
                // variant="outline"
                className="border-b-0 rounded-none last:border-b w-full justify-start"
                variant={activeButton === "allImages" ? "secondary" : "outline"}
                onClick={() => getImage("allImages")}
              >
                <Folder className="mr-3 h-4 w-4 text-lime-500" />
                <span> All Images</span>
              </Button>
            </span>
            <span>
              <Button
                // variant="outline"
                className="border-b-0 rounded-none last:border-b w-full justify-start"
                variant={
                  activeButton === "ungroupedImages" ? "secondary" : "outline"
                }
                onClick={() => getCategory("ungroupedImages")}
              >
                <Folder className="mr-3 h-4 w-4 text-lime-500" />
                <span>Ungrouped</span>
              </Button>
            </span>
            <div
              className="h-96 mt-4 overflow-y-auto overflow-x-hidden [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 "
            >
              {fileCategory?.data.map((item) => (
                // <span     className="border-b-0 rounded-none last:border-b w-full justify-start"
                //   onClick={() => getName(item.id)}
                //   key={item.id}
                // >
                //  <Folder className="mr-3 h-4 w-4 text-cyan-500" />
                //  <span className="w-[70%] overflow-x-hidden text-start font-normal">
                //                   {item.name}
                //                 </span>
                // </span>

                <Button
                  onClick={() => getName(item.id)}
                  title={item.name}
                  className="border-b-0 rounded-none last:border-b w-full justify-start"
                  key={item.id}
                  variant={
                    activeButton === item.name.toLowerCase()
                      ? "secondary"
                      : "outline"
                  }
                >
                  <Folder className="mr-3 h-4 w-4 text-cyan-500" />
                  <span className="w-[70%] overflow-x-hidden text-start font-normal">
                    {item.name}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          <div className="border-l"></div>
          <div
            className="h-full w-[100%]"
            data-panel
            data-panel-group-id=":r1c:"
            data-panel-id=":r1d:"
            data-panel-size="1.0"
          >
            <div className="gap-4 w-[100%]">
              <span>
                <div className="mb-2 flex p-3 justify-between w-[700px]">
                  <div className="flex flex-row">
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Search by Name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border text-xs rounded p-2 mr-2 w-60 dark:text-gray-300 h-[40px]"
                      />
                    </div>
                    <div className="mt-2">
                      <button
                        className="bg-white py-1 px-3 mt-2 h-[35px] rounded border border-gray-300 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-100 hover:bg-gray-100 hover:text-blue-500"
                        onClick={handleSearch}
                      >
                        <AiOutlineSearch className="text-lg" />
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
                        <option
                          key={index}
                          value={JSON.stringify(option.value)}
                        >
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* {isLoading ? (
                <Loading />
              ) : ( */}
                <File
                  fileShowCategory={fileShowCategory}
                  isEditDialogOpen={isEditDialogOpen}
                  selectedFileId={selectedFileId}
                  setIsEditDialogOpen={setIsEditDialogOpen}
                  setSelectedFileId={setSelectedFileId}
                  // setIsSheetOpen={setIsSheetOpen}
                  setFileShowCategory={setFileShowCategory}
                  onLogoClick={onLogoClick}
                  setSelectedUrl={setSelectedUrl}
                  setSelectedId={setSelectedId}
                  setSelectedImagePreview={setSelectedImagePreview}
                />
                {/* )} */}
              </span>
              <div className="flex flex-row justify-between text-left mb-2 ">
                <div className="flex justify-start items-center mt-6 select-none">
                  <nav
                    className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                    aria-label="Pagination"
                  >
                    <div
                      className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${
                        currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={handlePreviousClick}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                      <span className="">Prev</span>
                    </div>

                    <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold  text-gray-900  ring-gray-300 focus:outline-offset-0">
                      Page {currentPage} of {totalPages}
                    </span>

                    <div
                      className={`relative inline-flex items-center rounded-r-md px-2 py-2 hover:text-black text-gray-700  focus:z-20 focus:outline-offset-0 ${
                        currentPage === totalPages
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={handleNextClick}
                      disabled={currentPage === totalPages}
                    >
                      <span className="">Next</span>
                      <ChevronRight className="h-4 w-4" aria-hidden="true" />
                    </div>
                  </nav>
                </div>

                <div
                  className={`w-60 h-[70px]  border-gray-400 ${
                    selectedImagePreview ? "border-2 border-dashed" : ""
                  } p-2 mt-4`}
                >
                  {selectedImagePreview && (
                    <div className="absolute">
                      {selectedImagePreview?.endsWith(".mp4") ? (
                        <video
                          // id={editMediaData?.data?.id}
                          src={selectedImagePreview}
                          className="w-14 h-14 object-cover"
                          autoPlay
                          loop
                          muted
                          playsInline
                        >
                          <source src={selectedImagePreview} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img
                          src={selectedImagePreview}
                          alt="Preview"
                          className="w-14 h-14 object-cover"
                        />
                      )}
                    </div>
                    // <div className="absolute">
                    //   <Image
                    //     src={selectedImagePreview}
                    //     alt="Selected Image Preview"
                    //     width={100}
                    //     height={100}
                    //     className='w-14 h-14 p-2 '
                    //   />
                    //   <button
                    //     type="button"
                    //     onClick={() => setSelectedImagePreview(null)}
                    //     className="absolute top-0 right-0 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
                    //   >
                    //     <FaTimes />
                    //   </button>
                    // </div>
                  )}
                </div>
                <div className="flex flex-row gap-4 p-4 mt-4 ">
                  <Button
                    className="bg-black text-white"
                    onClick={() => handleInsert(selectedId, selectedUrl)}
                  >
                    Insert
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="border-l overflow-y-auto overflow-x-hidden h-[32rem] w-[300px]">
            {isEditDialogOpen && (
              <EditFile
                fileIds={selectedFileId}
                isEditDialogopen={isEditDialogOpen}
                setIsEditDialogOpen={setIsEditDialogOpen}
                onClickTab={onClickTab}
              />
            )}
          </div>
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default MediaCenter;
