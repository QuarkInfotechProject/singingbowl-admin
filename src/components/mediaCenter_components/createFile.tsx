"use client";
import React from "react";
import axios from "axios";
import makeAnimated from "react-select/animated";
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import { IconX } from "@tabler/icons-react";

// Define types for media files
interface MediaFile {
  file: File;
  type: "image" | "video";
  preview: string;
}

const formSchema = z.object({
  files: z
    .array(
      z.string().refine(
        (value) => {
          if (typeof value === "string") {
            const allowedImageFormats = ["jpeg", "jpg", "png", "webp", "gif"];
            const allowedVideoFormats = ["mp4", "webm", "mov", "avi"];
            const fileFormat = value.split(".").pop()?.toLowerCase();

            return (
              fileFormat &&
              (allowedImageFormats.includes(fileFormat) ||
                allowedVideoFormats.includes(fileFormat))
            );
          }
          return false;
        },
        {
          message:
            "File must be one of the following formats: jpeg, jpg, png, webp, gif, mp4, webm, mov, avi",
        }
      )
    )
    .optional(),
  fileCategoryId: z.number().optional(),
});

const CreateFile = ({ onClickTab }: { onClickTab: any }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<MediaCategory[]>([]);
  const animatedComponents = makeAnimated();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  // Increased max file size to 50MB for video support
  const MAX_FILE_SIZE = 50 * 1024 * 1024;

  const isFileTypeSupported = (file: File) => {
    const allowedImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    const allowedVideoTypes = [
      "video/mp4",
      "video/webm",
      "video/quicktime",
      "video/x-msvideo",
    ];
    return (
      allowedImageTypes.includes(file.type) ||
      allowedVideoTypes.includes(file.type)
    );
  };

  const createFilePreview = (file: File): Promise<MediaFile> => {
    return new Promise((resolve) => {
      const isVideo = file.type.startsWith("video/");

      if (isVideo) {
        const video = document.createElement("video");
        video.preload = "metadata";
        video.onloadedmetadata = () => {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(video, 0, 0);
          resolve({
            file,
            type: "video",
            preview: URL.createObjectURL(file),
          });
        };
        video.src = URL.createObjectURL(file);
      } else {
        resolve({
          file,
          type: "image",
          preview: URL.createObjectURL(file),
        });
      }
    });
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(
      (file) => file.size <= MAX_FILE_SIZE && isFileTypeSupported(file)
    );

    if (validFiles.length !== acceptedFiles.length) {
      toast({
        description:
          "Some files were skipped due to size or format restrictions",
        variant: "destructive",
      });
    }

    const newMediaFiles = await Promise.all(
      validFiles.map((file) => createFilePreview(file))
    );

    setMediaFiles((prev) => [...prev, ...newMediaFiles]);
    form.clearErrors("files");
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].preview);
      updated.splice(index, 1);
      return updated;
    });
  };

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const res = await fetch(`/api/mediaCategory`, {
          method: "GET",
        });
        const data = await res.json();
        setCategoryData(data.data);
      } catch (error) {}
    };

    fetchCategoryData();

    // Cleanup previews on component unmount
    return () => {
      mediaFiles.forEach((mediaFile) => {
        URL.revokeObjectURL(mediaFile.preview);
      });
    };
  }, []);

  console.log("files data of media", mediaFiles);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log("click ");
    try {
      if (mediaFiles.length > 0) {
        setIsLoading(true);
        const formData = new FormData();
        mediaFiles.forEach((mediaFile, index) => {
          formData.append("files[]", mediaFile.file);
          // formData.append("fileTypes[]", mediaFile.type);
        });

        console.log("file data here", formData);

        formData.append(
          "fileCategoryId",
          values?.fileCategoryId?.toString() || ""
        );

        const response = await axios.post("/api/media/create", formData);

        if (response.status === 200) {
          onClickTab(1);
          toast({
            description: `${response.data.message}`,
            variant: "default",
            className: "bg-green-500 text-white",
          });
          setIsLoading(false);
        }
      } else {
        toast({
          description: "Please select at least one file to upload",
          variant: "destructive",
        });
      }
    } catch (error) {
      setIsLoading(false);
      if (axios.isAxiosError(error)) {
        toast({
          description: error.response?.data.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="p-4 w-full">
      <Form {...form}>
        <form
          id="create-file"
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 justify-center w-full items-center"
        >
          <FormField
            control={form.control}
            name="files"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      className="cursor-pointer w-full"
                    >
                      <Input
                        type="file"
                        multiple
                        accept="image/*, video/*"
                        onChange={(e) =>
                          onDrop(Array.from(e.target.files || []))
                        }
                        className="border-2 border-dashed border-gray-300 p-4 min-h-[100px] w-full flex flex-wrap items-center justify-center"
                      />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      {mediaFiles.map((mediaFile, index) => (
                        <div key={index} className="inline-block mt-4 relative">
                          <span
                            className="cursor-pointer absolute right-4 top-4 rounded-full bg-gray-100 border text-black p-1"
                            onClick={() => removeMediaFile(index)}
                          >
                            <IconX size={16} />
                          </span>
                          {mediaFile.type === "video" ? (
                            <video
                              src={mediaFile.preview}
                              className="border-2 border-dashed w-40 h-40 p-2 max-w-full aspect-square object-cover mt-[10px]"
                              controls
                            />
                          ) : (
                            <img
                              src={mediaFile.preview}
                              alt={`Preview ${index}`}
                              className="border-2 border-dashed w-40 h-40 p-2 max-w-full aspect-square object-cover mt-[10px]"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            form="create-file"
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          >
            {isLoading ? "Uploading..." : "Upload Media"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CreateFile;
