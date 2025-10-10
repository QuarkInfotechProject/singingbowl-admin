"use client";
import React, { useEffect, useState } from "react";
import ImageEditForm from "./ImageEditForm";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";

const ImageEditSidebar = ({ selectedImage, onClose, updateImage }) => {
  if (!selectedImage) return null;
  console.log("selectedImage ????", selectedImage);
  return (
    <div className="p-4 border-l h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Edit Media</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mb-4">
        {selectedImage.imageUrl?.endsWith(".mp4") ? (
          <video
            // id={editMediaData?.data?.id}
            src={selectedImage.imageUrl}
            className="w-20 h-20 object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src={selectedImage.imageUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={selectedImage.imageUrl}
            alt="Preview"
            className="w-20 h-20 object-cover"
          />
        )}

        {/* <img 
          src={selectedImage.thumbnailUrl} 
          alt={selectedImage.fileName}
          className="w-20 h-20 object-contain justify-start items-start  "
        /> */}
      </div>

      <div className="">
        <div>
          {/* <label className="block text-sm font-medium mb-1">File Name</label> */}
          {selectedImage.fileName}
        </div>

        <div>
          {/* <label className="block text-sm font-medium mb-1">Dimensions</label> */}
          <p className="text-sm text-gray-600">
            {selectedImage.width} × {selectedImage.height}
          </p>
        </div>

        <ImageEditForm
          id={selectedImage.id}
          updateImage={updateImage}
          setIsImageEditPopover={() => {}}
        />
      </div>
    </div>
  );
};

export default ImageEditSidebar;
