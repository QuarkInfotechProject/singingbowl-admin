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
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import FileAddPage from "../../../app/(routes)/admin/(sidemenu)/file/create/page";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { FaCopy, FaEdit, FaEye, FaPause, FaPlay } from "react-icons/fa";
import ImageEditSidebar from "@/app/(routes)/admin/(sidemenu)/products/(pages)/_formComponents/SideBar";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";

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
  grouped: 0 | null;
  fileCategoryId: number | null;
  fileName: string;
  sortBy: "filename" | "created_at" | "size";
  sortDirection: "asc" | "desc";
}

interface CategoryT {
  id: number;
  name: string;
  url: string;
}

const AllImages = ({
  trigger,
  onSelect,
  toUpdate = "base",
  uploadedImages = [],
}: {
  trigger: React.ReactNode;
  onSelect: (file: string) => void;
  toUpdate?: "base" | "additional" | "descriptions";
  uploadedImages?: string[];
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
  // local ids, additional ids, images, and additional images
  const [activeCategory, setActiveCategory] = useState("");
  const [localBaseId, setLocalBaseId] = useState<string>("");
  const [localBaseThumbnail, setLocalBaseThumbnail] = useState<string>("");
  const [localBaseImage, setLocalBaseImage] = useState<string>("");
  const [localAdditionalIds, setLocalAdditionalIds] = useState<string[]>([]);
  const [localAdditionalThumbnails, setLocalAdditionalThumbnails] = useState<
    string[]
  >([]);
  const [localDescriptionThumbnails, setLocalDescriptionThumbnails] =
    useState("");
  const [localDescriptionIds, setLocalDescriptionIds] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useState<ImgFilterT>({
    grouped: null,
    fileCategoryId: null,
    fileName: "",
    sortBy: "",
    sortDirection: "",
  });

  const total = 100; // Allow up to 100 images for gallery
  const handleIsImagesLoading = (bool: boolean) => {
    setIsImagesLoading(bool);
  };

  const handleTabChange = (index) => {
    setActiveTabIndex(index);
  };
  const handleIsCategoryLoading = (bool: boolean) => {
    setIsImagesLoading(bool);
  };

  const fetchImages = async () => {
    try {
      const { data } = await clientSideFetch({
        url: `/files?page=${currentPage}`,
        method: "post",
        body: filters,
        toast,
        debug: true,
        handleLoading: handleIsImagesLoading,
      });
      setImages(data.data.data);
      setTotalPages(data.data.last_page);
    } catch (error) {
      console.error("Error fetching images:", error);
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

  // useEffect(() => {
  //   if (open && activeTabIndex === 1) {
  //     fetchImages();
  //     fetchCategories();
  //   }
  // }, [open]);
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
      setLocalBaseImage(imageUrl);
    } else if (toUpdate === "additional") {
      const existsThumbnail = localAdditionalThumbnails.includes(imageUrl);
      const existsId = localAdditionalIds.includes(id);

      if (existsId && existsThumbnail) {
        return;
      }

      setLocalAdditionalThumbnails([...localAdditionalThumbnails, imageUrl]);
      setLocalAdditionalIds([...localAdditionalIds, id]);
    } else if (toUpdate === "descriptions") {
      setLocalDescriptionThumbnails(imageUrl);
      setLocalDescriptionIds(id);
    }
  };
  const handleConfirmUpload = (
    toUpdate: "base" | "additional" | "descriptions"
  ) => {
    if (toUpdate === "base") {
      onSelect(localBaseImage);
      setLocalBaseThumbnail("");
      setLocalBaseImage("");
      setLocalBaseId("");
      setLocalDescriptionThumbnails("");
    } else if (toUpdate === "additional") {
      // Call onSelect for each selected image
      localAdditionalIds.forEach((id, index) => {
        onSelect(localAdditionalThumbnails[index], parseInt(id));
      });
      // Clear the selections after inserting
      setLocalAdditionalIds([]);
      setLocalAdditionalThumbnails([]);
    } else if (toUpdate === "descriptions") {
      onSelect(localDescriptionThumbnails, parseInt(localDescriptionIds));
      setLocalDescriptionThumbnails("");
      setLocalDescriptionIds("");
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
    }, 1000),
    []
  );

  useEffect(() => {
    debouncedSetFilters(inputValue);

    return () => { };
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
      <Dialog open={open} onOpenChange={setOpen}>
        <div>
          <DialogTrigger className="w-full" asChild>
            {trigger}
          </DialogTrigger>
          <DialogContent className="max-w-[1350px] w-full mx-auto h-[90vh] flex flex-col p-0 gap-0">
            <div className="h-full w-full">
              <Tabs selectedIndex={activeTabIndex} onSelect={handleTabChange} className="h-full flex flex-col">
                <TabList>
                  <Tab value={2}>Local Upload</Tab>
                  <Tab value={1}>Gallery</Tab>
                </TabList>
                <TabPanel value={2}>
                  <FileAddPage onClickTab={handleTabChange} />
                </TabPanel>
                <TabPanel value={1} className="flex-1 min-h-0 flex flex-col">
                  <div className="h-full flex flex-col relative">
                    <DialogHeader className="bg-gray-100 p-2">
                      {/* <DialogTitle>Select Image</DialogTitle> */}
                      <div className="grid grid-cols-3  my-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          placeholder="Search..."
                        />
                        <div className="mx-auto">
                          <Select
                            onValueChange={(val) =>
                              setFilters({ ...filters, sortBy: val })
                            }
                            disabled={images.length <= 0}
                            defaultValue="filename"
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select a fruit" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sort By:</SelectLabel>
                                {/* <SelectItem value="" >Sort by</SelectItem> */}
                                <SelectItem value="filename">
                                  File Name
                                </SelectItem>
                                <SelectItem value="created_at">
                                  Date Created
                                </SelectItem>
                                <SelectItem value="size">File Size</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="mx-auto">
                          <Select
                            defaultValue="asc"
                            disabled={images.length <= 0}
                            onValueChange={(val: "asc" | "desc") =>
                              setFilters({ ...filters, sortDirection: val })
                            }
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Ascending" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectLabel>Sort Order:</SelectLabel>
                                <SelectItem value="asc">Ascending</SelectItem>
                                <SelectItem value="desc">Descending</SelectItem>
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </DialogHeader>
                    <div className="grid gap-2 grid-cols-[15%_1fr] flex-1 min-h-0 overflow-hidden px-2">
                      <div className="overflow-y-auto py-4 h-full border-r">
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
                                <span className="w-[70%] overflow-x-hidden text-start font-normal">
                                  {item.name}
                                </span>
                              </Button>
                            );
                          })}
                      </div>
                      <div className="grid grid-cols-[75%_1fr] h-full overflow-hidden">
                        {isImagesLoading ? (
                          <div className="h-full overflow-y-auto text-lg text-center">
                            <div className="grid gap-4 grid-cols-6 p-4">
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
                          <div className="h-full overflow-y-auto pb-4 p-2">
                            <div
                              className={`grid gap-y-5   ${images &&
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
                                  className={`relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-700 hover:text-black focus:z-20 focus:outline-offset-0 ${currentPage === 1
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
                                  className={`relative inline-flex items-center rounded-r-md px-2 py-2 hover:text-black text-gray-700  focus:z-20 focus:outline-offset-0 ${currentPage === totalPages
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
                        <div className="border-l h-full overflow-y-auto">
                          <ImageEditSidebar
                            selectedImage={selectedImage}
                            onClose={() => setSelectedImage(null)}
                            updateImage={updateImage}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-white border-t px-4 py-2 w-full">
                      <div className="flex gap-4 items-center">
                        <div className="w-4/5">
                          <p className="mb-2 font-medium">
                            Total Images :{" "}
                            {toUpdate === "additional" ? (
                              <span
                                className={`font-normal ${localAdditionalIds.length +
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
                                {localDescriptionIds.length > 0 ? 1 : 0} / 1
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
                                          Your browser does not support the
                                          video tag.
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

                            {localDescriptionThumbnails.length > 0 && (
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
                                      Your browser does not support the video
                                      tag.
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
                            onClick={() => handleConfirmUpload(toUpdate)}
                            disabled={
                              (toUpdate === "base" &&
                                localBaseThumbnail.length === 0) ||
                              (toUpdate === "additional" &&
                                localAdditionalThumbnails.length === 0) ||
                              (toUpdate === "descriptions" &&
                                localDescriptionThumbnails.length === 0)
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
      </Dialog>
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
  const [isVideoHovered, setIsVideoHovered] = useState(false);
  const [localItem, setLocalItem] = useState(item);
  const [isLoading, setIsLoading] = useState(false);
  const isVideo = (url) => url.toLowerCase().endsWith(".mp4");
  const isItemVideo = isVideo(item.imageUrl);

  const handleImageClick = (e) => {
    e.preventDefault();
    handleFiles(item.id.toString(), item.imageUrl, toUpdate);
    setSelectedImage(item); // Set the selected image when clicked
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
                className="w-[150px] h-[100px] object-cover rounded border"
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
            <Image
              src={item.imageUrl}
              className={`items-center h-[100px] w-[100px] mx-auto justify-center border rounded-sm bg-gray-300 ${uploadedImages?.includes(item.id.toString()) &&
                "pointer-events-none"
                } ${(uploadedImages?.length + localAdditionalIds.length >= total ||
                  localAdditionalIds.includes(item.id.toString()) ||
                  localDescriptionIds.includes(item.id.toString()) ||
                  localBaseId === item.id.toString()) &&
                "opacity-45 pointer-events-none"
                }`}
              height={200}
              width={200}
              alt={item.fileName}
            />
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
          {/* {item.fileName} */}
          {/* {isItemVideo && <span className="ml-1 text-blue-500">(Video)</span>} */}
        </p>
      </div>
    </div>
  );
};
