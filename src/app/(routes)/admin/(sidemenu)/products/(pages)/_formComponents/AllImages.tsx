"use client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
} from "react";
import { ChevronLeft, ChevronRight, Folder } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../add/page";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import FileAddPage from "../../../file/create/page";
import Link from "next/link";
import { FaCopy } from "react-icons/fa";
import ImageEditSidebar from "./SideBar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import { FaGalacticSenate } from "react-icons/fa6";

interface ImageT {
  id: number;
  fileName: string;
  width: number;
  height: number;
  imageUrl: string;
  thumbnailUrl: string;
}

export interface OptionValueT {
  optionName: string;
  optionData: string;
  files?: {
    baseImage: string;
    additionalImage: string[];
  };
}

interface ImgFilterT {
  grouped: 0 | null; //0 to get those files that don't have any category assigned.
  fileCategoryId: number | null;
  fileName: string;
  sortBy: "" | "filename" | "created_at" | "size";
  sortDirection: "" | "asc" | "desc";
}

interface CategoryT {
  id: number;
  name: string;
  url: string;
}

const AllImages = ({
  activeCategory,
  setActiveCategory,
  filters,
  setFilters,
  form,
  toUpdate,
  uploadedImages,
  localAdditionalIds,
  localAdditionalThumbnails,
  localDescriptionThumbnails,
  setLocalDescriptionThumbnails,
  localBaseId,
  setLocalDescriptionIds,
  localDescriptionIds,
  localBaseThumbnail,
  setLocalAdditionalIds,
  setLocalAdditionalThumbnails,
  setLocalBaseId,
  setLocalBaseThumbnail,
  colorValues,
  setColorValues,
  inputValue,
  setInputValue,
  isVariant = false,
  isColorImagesEditing,
  setIsColorImagesEditing,
  valueIndex,
  setValueIndex,
}: {
  inputValue: string;
  setInputValue: Dispatch<SetStateAction<string>>;
  activeCategory: string;
  setActiveCategory: Dispatch<SetStateAction<string>>;
  form: UseFormReturn<z.infer<typeof formSchema>>;
  toUpdate: "base" | "additional" | "descriptions";
  filters: ImgFilterT;
  setFilters: Dispatch<SetStateAction<ImgFilterT>>;
  uploadedImages: string[];
  localAdditionalIds: string[];
  localAdditionalThumbnails: string[];
  localDescriptionThumbnails: string;
  localBaseId: string;
  localDescriptionIds: string;
  localBaseThumbnail: string;
  setLocalAdditionalIds: Dispatch<SetStateAction<string[]>>;
  setLocalDescriptionIds: Dispatch<SetStateAction<string>>;
  setLocalAdditionalThumbnails: Dispatch<SetStateAction<string[]>>;
  setLocalDescriptionThumbnails: Dispatch<SetStateAction<string>>;
  setLocalBaseId: Dispatch<SetStateAction<string>>;
  setLocalBaseThumbnail: Dispatch<SetStateAction<string>>;
  colorValues: OptionValueT;
  setColorValues: Dispatch<SetStateAction<OptionValueT>>;
  isVariant?: boolean;
  isColorImagesEditing: boolean;
  setIsColorImagesEditing: Dispatch<SetStateAction<boolean>>;
  valueIndex: number;
  setValueIndex: Dispatch<SetStateAction<number>>;
}) => {
  const { toast } = useToast();
  const [images, setImages] = useState<ImageT[] | []>([]);
  const [isImagesLoading, setIsImagesLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  // const [isCategoryLoading, setCategoryLoading] = useState(false)
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTabIndex, setActiveTabIndex] = useState(1);
  const [selectedOption, setSelectedOption] = useState<SortOption | null>(null);
  const total = 8;
  const handleIsImagesLoading = (bool: boolean) => {
    setIsImagesLoading(bool);
  };
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

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };
  const handleIsCategoryLoading = (bool: boolean) => {
    setIsImagesLoading(bool);
  };
  const getSort = (option: SortOption | null) => {
    if (!option) {
      setFilters({
        ...filters,
        sortBy: "created_at",
        sortDirection: "desc",
      });
      return;
    }
    setFilters({
      ...filters,
      sortBy: option.sortBy || "created_at",
      sortDirection: option.sortDirection || "desc",
    });
  };

  const fetchImages = async () => {
    try {
      const { data } = await clientSideFetch({
        url: `/files?page=${currentPage}`,
        method: "post",
        body: filters,
        toast,
        debug: false,
        handleLoading: handleIsImagesLoading,
      });
      setImages(data.data.data);
      setTotalPages(data.data.last_page);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch images",
        variant: "destructive",
      });
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await clientSideFetch({
        url: "/file-categories",
        method: "get",
        toast,
      });
      setCategories(data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    if (activeTabIndex === 1) {
      fetchImages();
      fetchCategories();
    }
  }, [filters, currentPage, activeTabIndex]);

  const handlePreviousClick = () => {
    const newPage = currentPage - 1;
    setCurrentPage(newPage);
  };

  const handleNextClick = () => {
    const newPage = currentPage + 1;
    setCurrentPage(newPage);
  };
  const handleFiles = (
    id: string,
    imageUrl: string,
    toUpdate: "base" | "additional" | "descriptions"
  ) => {
    if (toUpdate === "base") {
      setLocalBaseId(id);
      setLocalBaseThumbnail(imageUrl);
    } else if (toUpdate === "additional") {
      const existsThumbnail = localAdditionalThumbnails.includes(imageUrl);
      const existsId = localAdditionalIds.includes(id);

      if (existsId && existsThumbnail) {
        return;
      }

      setLocalAdditionalThumbnails([...localAdditionalThumbnails, imageUrl]);
      setLocalAdditionalIds([...localAdditionalIds, id]);
    } else if (toUpdate === "descriptions") {
      // const existsDescription = localDescriptionThumbnails.includes(imageUrl);
      // const existsDescriptionId = localDescriptionIds.includes(id);

      // if (existsDescription && existsDescriptionId) {
      //   return;
      // }

      setLocalDescriptionThumbnails(imageUrl);
      setLocalDescriptionIds(id);
    }
  };
  const handleConfirmUpload = (
    toUpdate: "base" | "additional" | "descriptions"
  ) => {
    if (toUpdate === "base") {
      form.setValue("files.baseImage", localBaseId);
    } else if (toUpdate === "additional") {
      const currentAdditionalImageIds =
        form.getValues("files.additionalImage") || [];
      const updatedAdditionalImageIds = [
        ...currentAdditionalImageIds,
        ...localAdditionalIds,
      ];
      form.setValue("files.additionalImage", updatedAdditionalImageIds);
    } else if (toUpdate === "descriptions") {
      form.setValue("files.descriptionVideo", localDescriptionIds);
    }
  };
  const handleRemove = (url: string) => {
    const index = localAdditionalThumbnails.indexOf(url);
    const updatedIds = localAdditionalIds.filter((_, idx) => idx !== index);
    setLocalAdditionalIds(updatedIds);
    const updatedThumbnails = localAdditionalThumbnails.filter(
      (_, idx) => idx !== index
    );
    setLocalAdditionalThumbnails(updatedThumbnails);
  };

  // const handleRemoves = (url: string) => {
  //   const index = localDescriptionThumbnails.indexOf(url);
  //   const updatedIds = localDescriptionIds.filter((_, idx) => idx !== index);
  //   setLocalDescriptionIds(updatedIds);
  //   const updatedThumbnails = localDescriptionThumbnails.filter(
  //     (_, idx) => idx !== index
  //   );
  //   setLocalDescriptionThumbnails(updatedThumbnails);
  // };
  // alternate version of same functions for variants
  const handleConfirmUploadVariant = (
    toUpdate: "base" | "additional" | "descriptions"
  ) => {
    if (toUpdate === "base") {
      if (isColorImagesEditing) {
        form.setValue(
          `options.0.values.${valueIndex}.files.baseImage`,
          localBaseId
        );
      } else {
        setColorValues({
          ...colorValues,
          files: { ...colorValues.files, baseImage: localBaseId },
        });
      }
    } else if (toUpdate === "additional") {
      if (isColorImagesEditing) {
        const currentImages = form.getValues(
          `options.0.values.${valueIndex}.files.additionalImage`
        );
        const updatedAdditionalImages = [
          ...currentImages,
          ...localAdditionalIds,
        ];
        form.setValue(
          `options.0.values.${valueIndex}.files.additionalImage`,
          updatedAdditionalImages
        );
      } else {
        const currentAdditionalImageIds =
          colorValues.files?.additionalImage || [];
        const updatedAdditionalImageIds = [
          ...currentAdditionalImageIds,
          ...localAdditionalIds,
        ];
        setColorValues({
          ...colorValues,
          files: {
            ...colorValues.files,
            additionalImage: updatedAdditionalImageIds,
          },
        });
      }
    } else if (toUpdate === "descriptions") {
      if (isColorImagesEditing) {
        // form.setValue(
        //   `options.0.values.${valueIndex}.files.descriptionVideo`,

        // );
        // const updatedAdditionalImages = [
        //   ...currentImages,
        //   ...localDescriptionIds,
        // ];
        form.setValue(
          `options.0.values.${valueIndex}.files.descriptionVideo`,
          localDescriptionIds
        );
      } else {
        const currentAdditionalImageIds = colorValues.files?.descriptionVideo;
        const updatedAdditionalImageIds = [
          ...currentAdditionalImageIds,
          ...localDescriptionIds,
        ];
        setColorValues({
          ...colorValues,
          files: {
            ...colorValues.files,
            descriptionVideo: localDescriptionIds,
          },
        });
      }
    }
  };

  // debounce the input search
  const debounce = (func, delay): any => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  const debouncedSetFilters = useCallback(
    debounce((value) => {
      setFilters((prevFilters) => ({ ...prevFilters, fileName: value }));
    }, 3000),
    []
  );

  useEffect(() => {
    debouncedSetFilters(inputValue);

    return () => {
      // This is the cleanup function
      // It will be called when the component unmounts or before the effect runs again
      // We don't need to do anything here in this case, but it's good practice to include it
    };
  }, [inputValue, debouncedSetFilters]);

  const updateImage = useCallback((updatedImage) => {
    setImages((prevImages) =>
      prevImages.map((img) =>
        img.id === updatedImage.id ? { ...img, ...updatedImage } : img
      )
    );
  }, []);

  return (
    <>
      <div>
        <DialogContent className="w-full max-w-6xl mx-auto h-full p-4 ">
          <div>
            <Tabs selectedIndex={activeTabIndex} onSelect={handleTabChange}>
              <TabList>
                <Tab value={2}>Local Upload</Tab>
                <Tab value={1}>Gallery</Tab>
              </TabList>
              <TabPanel value={2}>
                <FileAddPage onClickTab={handleTabChange} />
              </TabPanel>
              <TabPanel value={1}>
                <div>
                  <DialogHeader className="bg-gray-100 p-2">
                    {/* <DialogTitle>Select Image</DialogTitle> */}
                    <div className="grid grid-cols-3  my-2">
                      <Input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Search..."
                      />
                      <div className="mx-auto">
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
                      {/* <div className="mx-auto">
                        <Select
                          defaultValue=""
                          disabled={images.length <= 0}
                          onValueChange={(val: "" | "asc" | "desc") =>
                            setFilters({ ...filters, sortDirection: val })
                          }
                        >
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Sort order" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="">Sort by</SelectItem>
                              <SelectItem value="asc">Ascending</SelectItem>
                              <SelectItem value="desc">Descending</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div> */}
                    </div>
                  </DialogHeader>
                  <div className="grid gap-2 grid-cols-[15%_1fr]">
                    <div
                      className="overflow-y-auto [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:rounded-full
  [&::-webkit-scrollbar-track]:bg-gray-100
  [&::-webkit-scrollbar-thumb]:rounded-full
  [&::-webkit-scrollbar-thumb]:bg-gray-300
  dark:[&::-webkit-scrollbar-track]:bg-neutral-700
  dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500 h-[320px] py-4"
                    >
                      <div className="flex items-center justify-between">
                        <p className="mb-3 font-medium">Categories:</p>
                        {/* <p>add +</p> */}
                      </div>
                      <Button
                        onClick={() => {
                          setFilters({
                            ...filters,
                            fileCategoryId: null,
                            grouped: null,
                          });
                          setActiveCategory("All Images");
                        }}
                        title="All Images"
                        className="border-b-0 rounded-none last:border-b w-full justify-start"
                        variant={
                          activeCategory.toLowerCase() === "all images"
                            ? "secondary"
                            : "outline"
                        }
                      >
                        <Folder className="mr-3 h-4 w-4 text-lime-500" />
                        <span className="w-[70%] overflow-x-hidden text-start font-normal">
                          All Images
                        </span>
                      </Button>
                      <Button
                        onClick={() => {
                          setActiveCategory("uncategorized");
                          setFilters({
                            ...filters,
                            fileCategoryId: null,
                            grouped: 0,
                          });
                        }}
                        variant={
                          activeCategory.toLowerCase() === "uncategorized"
                            ? "secondary"
                            : "outline"
                        }
                        title="All Images"
                        className="mb-4 rounded-none  w-full justify-start"
                      >
                        <Folder className="mr-3 h-4 w-4 text-lime-500" />
                        <span className="w-[70%] overflow-x-hidden text-start font-normal">
                          Uncategorized
                        </span>
                      </Button>
                      {categories &&
                        categories.map((item) => {
                          return (
                            <Button
                              onClick={() => {
                                setActiveCategory(item.name);
                                setFilters({
                                  ...filters,
                                  fileCategoryId: item.id,
                                  grouped: null,
                                });
                              }}
                              title={item.name}
                              className="border-b-0 rounded-none last:border-b w-full justify-start"
                              key={item.id}
                              variant={
                                activeCategory.toLowerCase() ===
                                item.name.toLowerCase()
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              <Folder className="mr-3 h-4 w-4 text-cyan-500" />
                              <span className="w-[70%] overflow-x-hidden text-xs text-start font-normal">
                                {item.name}
                              </span>
                            </Button>
                          );
                        })}
                    </div>
                    <div className="grid grid-cols-[75%_1fr]">
                      {isImagesLoading ? (
                        <div className="min-h-[75vh] text-lg text-center">
                          <div className="grid gap-4 grid-cols-6">
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                            <Skeleton className="h-[100px] min-w-full" />
                          </div>
                        </div>
                      ) : (
                        <div className="min-h-[50vh] max-h-[75vh] h-[400px] overflow-auto pb-40">
                          <div
                            className={`grid gap-y-5   ${
                              images &&
                              images.length > 0 &&
                              "grid-cols-6 justify-start"
                            } gap-4 `}
                          >
                            {images && images.length !== 0 ? (
                              images.map((item) => {
                                return (
                                  <SingleImage
                                    updateImage={updateImage}
                                    item={item}
                                    toUpdate={toUpdate}
                                    handleFiles={handleFiles}
                                    uploadedImages={uploadedImages}
                                    total={total}
                                    localAdditionalIds={localAdditionalIds}
                                    localDescriptionIds={localDescriptionIds}
                                    localBaseId={localBaseId}
                                    setSelectedImage={setSelectedImage}
                                  />
                                );
                              })
                            ) : (
                              <div className="min-w-full mx-auto flex items-center justify-center flex-col">
                                <Image
                                  alt="not-found"
                                  height={400}
                                  width={400}
                                  src={"/images/404.png"}
                                />
                                <p className="text-lg font-medium">
                                  Image Not Found
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-start items-center mt-2 mb-2  select-none z-30">
                            <nav
                              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
                              aria-label="Pagination"
                            >
                              <div
                                className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${
                                  currentPage === 1
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                                }`}
                                onClick={handlePreviousClick}
                                disabled={currentPage === 1}
                              >
                                <ChevronLeft
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
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
                                <ChevronRight
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </div>
                            </nav>
                          </div>
                        </div>
                      )}
                      <div className="border-l min-h-[50vh] max-h-[75vh] overflow-y-auto">
                        <ImageEditSidebar
                          selectedImage={selectedImage}
                          onClose={() => setSelectedImage(null)}
                          updateImage={updateImage}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="absolute z-30 bg-white border-t px-4 py-2 bottom-0 w-[900px] left-0">
                    <div className="flex gap-4 items-center">
                      <div className="w-4/5">
                        <p className="mb-2 font-medium">
                          Total Images :{" "}
                          {toUpdate === "additional" ? (
                            <span
                              className={`font-normal ${
                                localAdditionalIds.length +
                                  uploadedImages.length ===
                                  total && "text-green-600"
                              }`}
                            >
                              {localAdditionalIds.length +
                                uploadedImages.length}
                              /{total}
                            </span>
                          ) : toUpdate === "descriptions" ? (
                            <span
                            // className={`font-normal ${
                            //   localDescriptionIds.length + uploadedImages.length === total && "text-green-600"
                            // }`}
                            >
                              {localDescriptionIds?.length > 0 ? 1 : 0} / 1
                            </span>
                          ) : (
                            <span>
                              {localBaseThumbnail.length > 0 ? 1 : 0} / 1
                            </span>
                          )}
                        </p>
                        <div className="bg-gray-100 min-h-[80px] p-2">
                          {localBaseThumbnail.length > 0 && (
                            <div className="absolute">
                              {localBaseThumbnail?.endsWith(".mp4") ? (
                                <video
                                  // id={editMediaData?.data?.id}
                                  src={localBaseThumbnail}
                                  // alt="base"
                                  className="w-16 h-16 object-cover"
                                  autoPlay
                                  loop
                                  muted
                                  playsInline
                                >
                                  <source
                                    src={localBaseThumbnail}
                                    type="video/mp4"
                                  />
                                  Your browser does not support the video tag.
                                </video>
                              ) : (
                                <img
                                  src={localBaseThumbnail}
                                  alt="base"
                                  // alt="Preview"
                                  className="w-16 h-16 object-cover"
                                />
                              )}
                            </div>
                            // <Image
                            //   className="h-[60px] w-[60px] object-contain"
                            //   src={localBaseThumbnail}
                            //   height={60}
                            //   width={60}
                            //   alt="base"
                            // />
                          )}
                          {localAdditionalThumbnails.length > 0 && (
                            <div className="flex max-w-[900px] overflow-x-auto pb-4 gap-6 px-2">
                              {localAdditionalThumbnails.map((url, index) => (
                                <div
                                  key={index}
                                  className="relative flex-shrink-0"
                                >
                                  <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md">
                                    {url?.endsWith(".mp4") ? (
                                      <video
                                        src={url}
                                        className="w-full h-full object-cover"
                                        autoPlay
                                        loop
                                        muted
                                        playsInline
                                      >
                                        <source src={url} type="video/mp4" />
                                        Your browser does not support the video
                                        tag.
                                      </video>
                                    ) : (
                                      <img
                                        src={url}
                                        alt={`Thumbnail ${index + 1}`}
                                        className="w-full h-full object-cover"
                                      />
                                    )}
                                    <button
                                      type="button"
                                      onClick={() => handleRemove(url)}
                                      className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1 transition-colors duration-200"
                                      title="Remove"
                                    >
                                      <X className="h-4 w-4" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {localDescriptionThumbnails?.length > 0 && (
                            <div className="flex max-w-[900px] overflow-x-auto pb-4 gap-6 px-2">
                              {/* {localDescriptionThumbnails.map((url, index) => ( */}
                              {/* <div key={index} className="relative flex-shrink-0"> */}
                              <div className="relative w-24 h-24 rounded-lg overflow-hidden shadow-md">
                                {localDescriptionThumbnails?.endsWith(
                                  ".mp4"
                                ) ? (
                                  <video
                                    src={localDescriptionThumbnails}
                                    className="w-full h-full object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                  >
                                    <source
                                      src={localDescriptionThumbnails}
                                      type="video/mp4"
                                    />
                                    Your browser does not support the video tag.
                                  </video>
                                ) : (
                                  <img
                                    src={localDescriptionThumbnails}
                                    alt="Thumbnail"
                                    className="w-full h-full object-cover"
                                  />
                                )}
                                {/* <button
                  type="button"
                  onClick={() => handleRemoves(url)}
                  className="absolute top-2 right-2 bg-black/70 hover:bg-black/90 text-white rounded-full p-1 transition-colors duration-200"
                  title="Remove"
                >
                  <X className="h-4 w-4" />
                </button> */}
                              </div>
                              {/* </div> */}
                              {/* ))} */}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="w-1/5 flex flex-col gap-4">
                        <Button
                          type="button"
                          asChild
                          onClick={() =>
                            isVariant
                              ? handleConfirmUploadVariant(toUpdate)
                              : handleConfirmUpload(toUpdate)
                          }
                          disabled={
                            (toUpdate === "base" &&
                              localBaseThumbnail.length === 0) ||
                            (toUpdate === "additional" &&
                              localAdditionalThumbnails.length === 0) ||
                            (toUpdate === "descriptions" &&
                              localDescriptionThumbnails?.length === 0)
                          }
                          size="sm"
                        >
                          <DialogClose>Insert</DialogClose>
                        </Button>
                        <Button asChild variant={"outline"} size="sm">
                          <DialogClose>Cancel</DialogClose>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </TabPanel>
            </Tabs>
          </div>
        </DialogContent>
      </div>
    </>
  );
};

export default AllImages;

const SingleImage = ({
  updateImage,
  item,
  toUpdate,
  handleFiles,
  uploadedImages,
  localAdditionalIds,
  localDescriptionIds,
  localBaseId,
  setSelectedImage,
  total,
}: any) => {
  const [isImageEditPopoverOpen, setIsImageEditPopover] = useState(false);
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoKey, setVideoKey] = useState(0);

  const isVideo = (url) => url.toLowerCase().endsWith(".mp4");
  const isItemVideo = isVideo(item.imageUrl);

  const handleImageClick = (e) => {
    e.preventDefault();
    handleFiles(item.id.toString(), item.imageUrl, toUpdate);
    setSelectedImage(item); // Set the selected image when clicked
  };

  const handleVideoClick = (e) => {
    e.preventDefault();
    if (!isPlaying) {
      const video = document.getElementById(`video-${item.id}`);
      if (video) {
        video.play();
        setIsPlaying(true);
      }
    } else {
      const video = document.getElementById(`video-${item.id}`);
      if (video) {
        video.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div key={item.id} className="flex flex-col">
      <div className="relative">
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0   hover:opacity-100 hover:h-[100px] rounded-sm  ">
          <div className="flex items-center justify-center  ">
            <Link target="_blank" href={`${item.imageUrl}`}>
              <button
                className="text-white text-[13px] flex mt-16 items-center gap-3  px-3 py-1 rounded   hover:bg-gray-950 "
                // onClick={() => handleCopyUrl(item.imageUrl)}
              >
                <FaCopy />
                Open Url
              </button>
            </Link>
          </div>
        </div>

        {/* Media content */}
        <div
          className="relative"
          onMouseEnter={() => setIsVideoHovered(true)}
          onMouseLeave={() => setIsVideoHovered(false)}
          // onClick={() => handleFiles(item.id.toString(), item.thumbnailUrl, toUpdate)}
          onClick={handleImageClick}
        >
          {isItemVideo ? (
            <div className="relative">
              <video
                id={`video-${item.id}`}
                className="w-full h-auto z-10 object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100"
                poster={item.imageUrl}
                muted
                autoPlay
                loop
                playsInline
                // defaultMuted
              >
                <source src={item.imageUrl} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          ) : (
            /* Image */
            <div>
              <Image
                src={item.imageUrl}
                className={`w-full h-auto object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100 ${
                  uploadedImages?.includes(item.id.toString()) &&
                  "pointer-events-none"
                } ${
                  (uploadedImages?.length + localAdditionalIds.length >=
                    total ||
                    localAdditionalIds.includes(item.id?.toString()) ||
                    localDescriptionIds?.includes(item.id?.toString()) ||
                    localBaseId === item.id.toString()) &&
                  "opacity-45 pointer-events-none"
                }`}
                height={200}
                width={200}
                alt={item.fileName}
              />
              <h1 className="text-xs font-bold p-1">{item.fileName}</h1>
            </div>
          )}

          {/* Uploaded overlay */}
          {uploadedImages?.includes(item.id.toString()) && (
            <div className="pointer-events-none rounded bg-gray-800/60 text-white flex items-center justify-center h-[100px] w-[138px] absolute top-0 left-0">
              Uploaded
            </div>
          )}
        </div>
      </div>

      {/* Filename */}
      <div>
        <p className="text-xs px-1 overflow-x-hidden leading-tight text-center mt-1">
        </p>
      </div>
    </div>
  );
};