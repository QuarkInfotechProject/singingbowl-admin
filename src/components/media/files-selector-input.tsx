import React from "react";
import MediaPopup from "./media-popup";
import { Button } from "../ui/button";
import { IconUpload, IconX } from "@tabler/icons-react";
import { File } from "@/app/_types/media_Types/file_Types/fileTypes";
import { cn } from "@/lib/utils";

interface Props {
  selectedFiles: File[];
  onSelect: (file: File[]) => void;
  onRemove: (fileId: number) => void;
  recommendedSize?: string;
  isMulti?: boolean;
  imageClassName?: string;
}

function FilesSelectorInput({ selectedFiles, onSelect, onRemove, recommendedSize, isMulti, imageClassName }: Props) {
  const firstFile = selectedFiles?.[0];

  return (
    <div className="grid gap-2">
      {isMulti ? (
        <div className="flex gap-4 flex-wrap">
          {selectedFiles.map((file) => (
            <div key={file.id} className="relative">
              <img
                className={cn("size-20 md:size-40 aspect-square object-cover rounded-lg border", imageClassName)}
                src={file.thumbnailUrl.endsWith("pdf") ? "/images/placeholders/pdf.png" : file.thumbnailUrl}
              />
              <div
                className="border border-gray-300 rounded-full p-1 absolute top-1 right-1 text-black bg-white flex items-center justify-center cursor-pointer"
                onClick={() => onRemove(file.id)}
              >
                <IconX stroke={1.5} size={16} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="relative max-w-[--files-selector-img-width]">
          {firstFile && (
            <>
              <img
                className={cn("w-full aspect-square object-cover rounded-lg border", imageClassName)}
                src={firstFile.thumbnailUrl.endsWith("pdf") ? "/images/placeholders/pdf.png" : firstFile.thumbnailUrl}
              />
              <div
                className="border border-gray-300 rounded-full p-1 absolute top-1 right-1 text-black bg-white flex items-center justify-center cursor-pointer"
                onClick={() => onRemove(firstFile.id)}
              >
                <IconX stroke={1.5} size={16} />
              </div>
            </>
          )}
        </div>
      )}
      <MediaPopup selectedFiles={selectedFiles} onSelect={onSelect} isMulti={isMulti}>
        <Button type="button" variant="outline" className="w-full">
          <IconUpload className="h-4 w-4 mr-2" />
          Upload
        </Button>
      </MediaPopup>
      {recommendedSize && <p className="text-sm text-muted-foreground">Recommended size: {recommendedSize} pixels</p>}
    </div>
  );
}

export default FilesSelectorInput;