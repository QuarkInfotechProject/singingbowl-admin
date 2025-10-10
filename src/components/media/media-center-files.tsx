import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useMediaFilter } from "@/lib/context/media-filter-context";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "../ui/skeleton";
import { File } from "@/app/_types/media_Types/file_Types/fileTypes";
import Link from "next/link";
import FilePopup from "./file-popup";
import { useRouter, useSearchParams } from "next/navigation";
import { IconLink, IconLoader2, IconTrash } from "@tabler/icons-react";
import FileCategories from "./file-categories";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";
import { Checkbox } from "@radix-ui/react-checkbox";
import FileUploader from "./file-upload-categories";
// import { useToast } from "../ui/use-toast";

function MediaCenterFiles({
  activeButton,
  setActiveButton,
  showCategoryEditor,
  setShowCategoryEditor,
}: any) {
  const { search, sortBy, category } = useMediaFilter();
  const searchParams = useSearchParams();
  const fileId = searchParams.get("file");
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [groupedData, setGroupedData] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchMedia = useCallback(async () => {
    const [sortField, sortDirection] = sortBy.split(".") as [
      string,
      "asc" | "desc" | undefined
    ];

    const { data } = await axios.post(`/api/media?page=${page}`, {
      grouped: groupedData,
      fileCategoryId: category === "all" ? "" : category,
      fileName: search,
      sortBy: sortField || "", // Default sort field
      sortDirection: sortDirection || "", // Default sort direction
    });

    setTotalPages(data.data?.last_page);
    // console.log("API response:asd", data.data);
    return data?.data?.data;
  }, [page, search, sortBy, category, groupedData]);

  const { data, isFetching, refetch } = useQuery<File[]>({
    queryKey: ["file-selector", search, sortBy, category, page],
    queryFn: fetchMedia,
    keepPreviousData: true,
  });

  useEffect(() => {
    refetch();
  }, [page, refetch]);

  const handlePrevious = () => {
    setPage((prev) => Math.max(prev - 1, 1)); // Ensure the page does not go below 1
  };

  const handleNext = () => {
    setPage((prev) => Math.min(prev + 1, totalPages)); // Ensure the page does not exceed totalPages
  };

  console.log("fileaoipsdfjpisaod", fileId);
  const handleSelect = (fileId: string, isSelected: boolean) => {
    if (isSelected) {
      setSelectedFiles([...selectedFiles, fileId]);
    } else {
      setSelectedFiles(selectedFiles.filter((id) => id !== fileId));
    }
  };
  const handleSelectAll = (checked: boolean) => {
    if (checked && data) {
      setSelectedFiles(data.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) return;

    try {
      setIsDeleting(true);
      await axios.post("/api/files/destroy", {
        id: selectedFiles,
      });

      await queryClient.invalidateQueries({
        queryKey: ["file-selector"],
      });
      setSelectedFiles([]);
      toast({
        description: `Successfully deleted ${selectedFiles.length} files`,
        variant: "default",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      toast({
        description: "Failed to delete files",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };
  console.log("select dfilesfor", selectedFiles);
  console.log("caetgeoy is here", category);
  return (
    <div className="grid grid-cols-1 xl:grid-cols-[300px_1fr] gap-4">
      <div className="hidden xl:block">
        <FileCategories
          setGroupedData={setGroupedData}
          activeButton={activeButton}
          setActiveButton={setActiveButton}
          showCategoryEditor={showCategoryEditor}
          setShowCategoryEditor={setShowCategoryEditor}
        />
      </div>
      <div>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={
                data?.length === selectedFiles.length && data?.length > 0
              }
              onCheckedChange={handleSelectAll}
            />
            <span className="text-sm text-gray-600">
              {selectedFiles.length} files selected
            </span>
          </div>
          {selectedFiles.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleBulkDelete}
              disabled={isDeleting}
              className="flex items-center gap-2"
            >
              {/* {isDeleting ? (
                <IconLoader2 className="animate-spin" size={16} />
              ) : ( */}
              <IconTrash size={16} />
              {/* )} */}
              Delete Selected
            </Button>
          )}
        </div>
        <ScrollArea className="h-[70vh] border rounded-lg p-4">
          <div className="mb-4">
            {category === "all" ? null : (
              <FileUploader
                category={category}
                showCategoryEditor={showCategoryEditor}
                setShowCategoryEditor={setShowCategoryEditor}
                isFetching={isFetching}
              />
            )}
          </div>
          <div className="grid grid-cols-2 min-[440px]:grid-cols-3 md:grid-cols-4 min-[960px]:grid-cols-5 gap-4">
            {!isFetching &&
              data &&
              data.map((file) => (
                <div>
                  <FileCard
                    key={file.id}
                    file={file}
                    fileId={file.id}
                    isSelected={selectedFiles.includes(file.id)}
                    onSelect={handleSelect}
                    showDeleteIcon={selectedFiles.length > 0}
                  />
                </div>
              ))}
            {isFetching && <LoadingSkeletions />}
            {!isFetching && !data?.length && (
              <p className="text-center col-span-5">No files found.</p>
            )}
          </div>
        </ScrollArea>
        <div className="flex justify-end items-center  select-none">
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            <div
              className={`relative inline-flex items-center cursor-pointer rounded-l-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
                page === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handlePrevious}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              <span className="">Prev</span>
            </div>

            <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-900  ring-gray-300 focus:outline-offset-0">
              Page {page} of {totalPages}
            </span>

            <div
              className={`relative inline-flex items-center cursor-pointer rounded-r-md px-2 py-2 text-gray-700  hover:text-black focus:z-20 focus:outline-offset-0 ${
                page === totalPages ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={handleNext}
              disabled={page === totalPages}
            >
              <span className="">Next</span>
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </div>
          </nav>
        </div>
      </div>

      {fileId && (
        <FilePopup
          fileId={Number(fileId)}
          open
          onOpenChange={(open) => {
            !open && router.back();
          }}
        />
      )}
    </div>
  );
}

export default MediaCenterFiles;

function LoadingSkeletions() {
  return (
    <>
      {Array.from(new Array(10)).map((_, index) => (
        <Skeleton
          key={index}
          className="rounded-lg w-full h-auto object-cover aspect-square"
        />
      ))}
    </>
  );
}

interface FileCardProps {
  file: {
    id: string;
    fileName: string;
    thumbnailUrl: string;
    imageUrl: string;
  };
  fileId: string;
  isSelected: boolean;
  onSelect: (fileId: string, isSelected: boolean) => void;
  showDeleteIcon: boolean;
}

function FileCard({
  file,
  fileId,
  isSelected,
  onSelect,
  showDeleteIcon,
}: FileCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  async function deleteFile() {
    try {
      setIsDeleting(true);
      await axios.post("/api/files/destroy", {
        id: [fileId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["file-selector"],
      });

      toast({
        description: "File has been deleted successfully.",
        variant: "default",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      setIsDeleting(false);
      toast({
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  }

  // Separate handler for checkbox click
  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // e.preventDefault();
    // e.stopPropagation();
    onSelect(fileId, !isSelected);
  };

  // Separate handler for checkbox container click
  // const handleCheckboxContainerClick = (e: React.MouseEvent) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   onSelect(fileId, !isSelected);
  // };

  const isVideo =
    file.thumbnailUrl.endsWith(".mp4") || file.thumbnailUrl.endsWith(".webm");

  return (
    <div>
      <div className="relative group">
        <div
          className={`absolute top-1 left-1 z-30 ${
            isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          }`}
          // onClick={handleCheckboxContainerClick}
        >
          <input
            type="checkbox"
            checked={isSelected}
            onClick={handleCheckboxClick}
            onChange={() => {}} // Required to prevent React warning about controlled component
            className={`h-4 w-4 rounded cursor-pointer
            appearance-none border-2 border-red-600
            checked:bg-red-500 checked:border-red-500
            relative
            before:content-['✓']
            before:absolute
            before:top-1/2
            before:left-1/2
            before:transform
            before:-translate-x-1/2
            before:-translate-y-1/2
            before:text-white
            before:text-xs
            before:opacity-0
            checked:before:opacity-100
          `}
          />
        </div>

        <Link
          href={{
            pathname: "/admin/media",
            query: {
              file: file.id,
            },
          }}
          className="block relative"
        >
          {isVideo ? (
            <video
              width={200}
              height={200}
              className="w-full h-auto z-10 object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100 rounded-lg"
              loop
              muted
              autoPlay
              playsInline
            >
              <source src={file.imageUrl} type="video/mp4" />
            </video>
          ) : (
            <Image
              width={200}
              height={200}
              className="w-full h-auto object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100 rounded-lg"
              draggable={false}
              src={
                file.thumbnailUrl.endsWith(".pdf")
                  ? "/images/placeholders/pdf.png"
                  : file.thumbnailUrl
              }
              alt={file.fileName}
            />
          )}

          <h1 className="text-xs font-bold p-1">{file.fileName}</h1>
        </Link>

        <Link
          className="border border-gray-300 rounded-full p-1 absolute top-1 right-1 z-10 text-black bg-white flex items-center justify-center"
          target="_blank"
          title={file.fileName}
          href={file.imageUrl}
        >
          <IconLink stroke={1.5} size={20} />
        </Link>
      </div>
    </div>
  );
}
