import React, { useState, useEffect, useRef } from "react";
import { FileResponse } from "@/app/_types/media_Types/file_Types/fileTypes";
import copy from "copy-to-clipboard";
import { useToast } from "@/components/ui/use-toast";
import Loading from "./loading";
import { Button } from "../ui/button";
import Image from "next/image";

import { FaCopy } from "react-icons/fa";

const FileMedia = ({
  fileShowCategory,
  setRefetch,
  refetch,
  onLogoClick,
  isEditDialogOpen,
  setSelectedUrl,
  setSelectedId,
  selectedFileId,
  setSelectedImagePreview,
  setIsEditDialogOpen,
  setSelectedFileId,
}: {
  fileShowCategory: FileResponse | null;
  isEditDialogOpen: any;
  setSelectedImagePreview: any;
  setSelectedUrl: any;
  setSelectedId: any;
  selectedFileId: (data: any) => void;

  setIsEditDialogOpen: any;
  setSelectedFileId: (data: any) => void;
  onLogoClick: (data: any) => void;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
}) => {
  const { toast } = useToast();
  const [dropdownStates, setDropdownStates] = useState<{
    [key: string]: boolean;
  }>({});
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImageIds, setSelectedImageIds] = useState([]);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const editDialogRef = useRef(false);

  const toggleDropdown = (itemId: number) => {
    const updatedStates = {
      ...dropdownStates,
      [itemId]: !dropdownStates[itemId],
    };
    setDropdownStates(updatedStates);
  };

  const handleCheckboxChange = (itemId) => {
    if (selectedImageIds.includes(itemId)) {
      setSelectedImageIds(selectedImageIds.filter((id) => id !== itemId));
    } else {
      setSelectedImageIds([...selectedImageIds, itemId]);

      const selectedItem = renderData.find((item) => item.id === itemId);

      if (selectedItem) {
        handleImageClick(itemId, selectedItem.imageUrl || null);
      }
    }
  };

  const handleCopyUrl = (url: string) => {
    try {
      copy(url);
      showCopyToast();
    } catch (error) {
      console.error("Failed to copy URL to clipboard:", error);
    }
  };

  const showCopyToast = () => {
    toast({ description: "URL copied" });
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  // const handleCopyUrl = (url: string) => {
  //   navigator.clipboard.writeText(url)
  //     .then(() => {
  //       toast({

  //         description: "URL copied ",

  //       });
  //       setShowToast(true);
  //       setTimeout(() => {
  //         setShowToast(false);
  //       }, 2000);
  //     })
  //     .catch((error) => {
  //       console.error('Failed to copy URL to clipboard:', error);
  //     });
  // };

  const handleImageClick = (imageId: number, imagesUrl: string) => {
    if (selectedImageId === imageId) {
      setSelectedImageId(null);
    } else {
      setSelectedImageId(imageId);

      setSelectedId(imageId);
      setSelectedUrl(imagesUrl);
      setSelectedImagePreview(imagesUrl);
    }
  };

  useEffect(() => {
    if (setSelectedImageId) {
      onLogoClick(setSelectedImageId);
    }
  }, [setSelectedImageId]);

  const renderData = fileShowCategory?.data?.data;

  useEffect(() => {
    if (!isEditDialogOpen && editDialogRef.current) {
      setIsEditDialogOpen(true);
    }

    editDialogRef.current = false;
  }, [isEditDialogOpen, selectedImageId]);

  const handleEditClick = (itemId) => {
    console.log("click edit");
    setSelectedFileId(itemId);
    editDialogRef.current = true;
    setIsEditDialogOpen((prev) => !prev);
  };

  const isVideo = (url) => {
    return url && typeof url === "string" && url.toLowerCase().endsWith(".mp4");
  };
  console.log("render data", renderData);
  return (
    <div className="grid grid-cols-6 gap-y-2 p-2   mt-4 mr-4   overflow-x-auto select-none h-[300px]  ">
      {renderData?.map((item) => (
        <div>
          <div key={item.id} className="relative ">
            <div
              className="relative "
              onClick={() => {
                handleImageClick(item.id, item.imageUrl);
                handleEditClick(item.id);
              }}
            >
              <input
                type="checkbox"
                checked={selectedImageId === item.id}
                onChange={() => {
                  handleCheckboxChange(item.id);
                }}
                onClick={() => handleEditClick(item.id)}
                className={`absolute top-2 left-6 z-20 ${
                  selectedImageId !== item.id ? "hidden" : ""
                }`}
              />
              {isVideo(item.imageUrl) ? (
                <video
                  id={`video-${item.id}`}
                  className="w-full h-auto z-10 object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100 rounded-sm"
                  poster={item.thumbnailUrl}
                  muted
                  autoPlay
                  loop
                  playsInline
                  //  defaultMuted
                >
                  <source src={item.imageUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <Image
                  src={item.thumbnailUrl}
                  alt="image"
                  width={200}
                  height={200}
                  className="w-28 h-auto object-contain select-none aspect-square bg-gradient-to-r from-slate-50 to-zinc-100 rounded-sm"
                />
              )}

              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0   hover:opacity-100 hover:w-28 hover:h-full rounded-sm  ">
                <div className="flex items-center justify-center  ">
                  <button
                    className="text-white text-[13px] flex mt-20 items-center gap-3  px-3 py-1 rounded   hover:bg-gray-950 "
                    onClick={() => handleCopyUrl(item.imageUrl)}
                  >
                    <FaCopy />
                    Copy Url
                  </button>
                </div>
              </div>
            </div>
          </div>
          <h1 className="text-xs font-bold p-1">{item.fileName}</h1>
        </div>
      ))}
    </div>
  );
};

export default FileMedia;
