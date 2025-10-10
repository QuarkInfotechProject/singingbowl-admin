import React, { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { FileShowResponse } from "@/app/_types/media_Types/file_Types/fileTypes";
import { IconLoader2, IconTrash } from "@tabler/icons-react";
import FileEditForm from "./file-edit-form";
import { useToast } from "../ui/use-toast";
import { ScrollArea } from "../ui/scroll-area";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerDescription,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
} from "../ui/dialog-or-drawer";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import { MdDelete } from "react-icons/md";

interface Props {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  fileId: number;
}

function FilePopup({ fileId, open, onOpenChange }: Props) {
  const [imageLoading, setImageLoading] = useState(true);
  const [mediaLoading, setMediaLoading] = useState(true);
  const queryClient = useQueryClient();
  const [data, setData] = useState<FileShowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // const { data, isPending } = useQuery<FileShowResponse>({
  //   queryKey: ["media-file", fileId],
  //   queryFn: async () => {
  //     const { data } = await axios.get(`/api/files/show/${fileId}`);
  //     return {
  //       ...data.data,
  //       id: fileId,
  //     };
  //   },
  //   throwOnError: false,
  // });

  console.log("fileId", fileId);

  useEffect(() => {
    const fetchFileData = async () => {
      if (!fileId) return;

      try {
        setIsLoading(true);
        setError(null);
        const response = await axios.get(`/api/files/show/${fileId}`);
        setData({
          ...response.data.data,
          id: fileId,
        });
      } catch (err) {
        setError("Failed to fetch file data");
        toast({
          description: "Failed to load file details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFileData();
  }, [fileId, toast]);

  const isVideo = (url: string) => {
    const videoExtensions = [".mp4", ".webm", ".ogg", ".mov"];
    return videoExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  };

  const renderMedia = (file: FileShowResponse) => {
    if (isVideo(file.url)) {
      return (
        <div className="relative w-full aspect-video">
          {mediaLoading && (
            <Skeleton className="w-full h-full rounded-lg absolute top-0 left-0" />
          )}
          <video
            className={`w-full h-[400px] rounded-lg object-fit ${
              mediaLoading ? "invisible" : "visible"
            }`}
            loop
            autoPlay
            muted
            onLoadedData={() => setMediaLoading(false)}
            onError={() => {
              setMediaLoading(false);
              toast({
                description: "Failed to load video",
                variant: "destructive",
              });
            }}
          >
            <source
              src={file.url}
              type={`video/${file.url.split(".").pop()}`}
            />
            Your browser does not support the video tag.
          </video>
        </div>
      );
    } else {
      return (
        <div className="relative">
          {mediaLoading && (
            <Skeleton className="w-full h-[400px] rounded-lg absolute top-0 left-0" />
          )}
          <Image
            className={`w-full h-auto rounded-lg object-contain ${
              mediaLoading ? "invisible" : "visible"
            }`}
            width={1000}
            height={1000}
            src={file.url}
            alt={file.alternativeText || ""}
            onLoadingComplete={() => setMediaLoading(false)}
            onError={() => {
              setMediaLoading(false);
              toast({
                description: "Failed to load image",
                variant: "destructive",
              });
            }}
            priority
          />
        </div>
      );
    }
  };

  console.log("data od show file", data);
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="grid md:grid-cols-2 gap-4 p-4">
          <div className="space-y-4">
            <Skeleton className="w-full h-[400px] rounded-lg" />
            <div className="flex justify-end">
              <Skeleton className="w-10 h-10 rounded-md" />
            </div>
          </div>
          <div className="md:border-l p-4 space-y-4">
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-10 rounded-md" />
            <Skeleton className="w-full h-20 rounded-md" />
            <Skeleton className="w-24 h-10 rounded-md" />
          </div>
        </div>
      );
    }

    if (!data) {
      return (
        <div className="flex justify-center items-center h-[50vh]">
          <p className="text-gray-500">File not found</p>
        </div>
      );
    }

    return (
      <div className="grid md:grid-cols-2 gap-4">
        <div className="relative p-4 flex flex-col gap-4">
          {renderMedia(data)}
          <div className="text-sm text-muted-foreground">
            {isVideo(data.url) ? "Video" : "Image"} file: {data.name}
          </div>
        </div>
        <div className="md:border-l p-4">
          <FileEditForm
            file={data}
            fileId={fileId}
            onOpenChange={onOpenChange}
          />
        </div>
      </div>
    );
  };

  return (
    <DialogOrDrawer open={open} onOpenChange={onOpenChange}>
      <DialogOrDrawerContent className="max-w-5xl overflow-hidden">
        <DialogOrDrawerHeader>
          <DialogOrDrawerTitle>Media Details</DialogOrDrawerTitle>
          <DialogOrDrawerDescription>
            Edit or delete this file.
          </DialogOrDrawerDescription>
        </DialogOrDrawerHeader>
        <ScrollArea className="h-[70vh] max-h-[70vh] md:max-h-[80vh] md:h-full">
          {renderContent()}
        </ScrollArea>
      </DialogOrDrawerContent>
    </DialogOrDrawer>
  );
}

export default FilePopup;
