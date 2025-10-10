import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { UploadCloud } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { Input } from "@/components/ui/input";
import { IconFile, IconLoader2, IconX } from "@tabler/icons-react";
import { queryClient } from "@/lib/context/ReactQueryContext";
import { useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FaCheck } from "react-icons/fa";
import { useToast } from "../ui/use-toast";

import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
  DialogOrDrawerTrigger,
} from "../ui/dialog-or-drawer";
import FileCategoryEditor from "./file-category-editor";

interface Props {
  category: string;
  setShowCategoryEditor: any;
  showCategoryEditor: any;
}

interface UploadedFile extends File {
  categoryId: string;
  preview?: string;
}
interface FileToUpload {
  file: File;
  categoryId: string;
  preview?: string;
}

function FileUploader({
  category,
  showCategoryEditor,
  setShowCategoryEditor,
}: Props) {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [filesToUpload, setFilesToUpload] = useState<
    { file: File; categoryId: string }[]
  >([]);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const { toast } = useToast();

  useEffect(() => {
    return () => {
      // Revoke the data uris to avoid memory leaks
      filesToUpload.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      uploadedFiles.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, [filesToUpload, uploadedFiles]);
  const { data: categories } = useQuery({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/mediaCategory");
      return data?.data;
    },
  });

  async function uploadImage(file: File, categoryId: string) {
    try {
      const formData = new FormData();
      formData.append("files[]", file || "");
      formData.append("fileCategoryId", categoryId);
      await axios.post("/api/media/create", formData);

      // Add category information to the uploaded file
      const fileWithCategoryAndPreview = Object.assign(file, {
        categoryId,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }) as UploadedFile;
      setUploadedFiles((prevUploadedFiles) => [
        ...prevUploadedFiles,
        fileWithCategoryAndPreview,
      ]);
      toast({
        description: "File has been created successfully.",
        variant: "default",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      console.log(error);
    }
  }

  const removeUploadedFile = (file: UploadedFile) => {
    if (file.preview) {
      URL.revokeObjectURL(file.preview);
    }
    setUploadedFiles((prevUploadedFiles) => {
      return prevUploadedFiles.filter(
        (prevFile) => prevFile.name !== file.name && prevFile.size !== file.size
      );
    });
  };

  // const onDrop = useCallback(
  //   async (acceptedFiles: File[]) => {
  //     setFilesToUpload((prevUploadProgress) => {
  //       return [
  //         ...prevUploadProgress,
  //         ...acceptedFiles.map((file) => ({
  //           file,
  //           categoryId: selectedCategory,
  //           preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
  //         })),
  //       ];
  //     });
  //     await queryClient.invalidateQueries({
  //       queryKey: ["file-selector"],
  //     });
  //   },
  //   [selectedCategory]
  // );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filesWithPreviews = acceptedFiles.map((file) => ({
        file,
        categoryId: selectedCategory,
        preview: file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : undefined,
      }));

      setFilesToUpload((prevUploadProgress) => [
        ...prevUploadProgress,
        ...filesWithPreviews,
      ]);

      await queryClient.invalidateQueries({
        queryKey: ["file-selector"],
      });
    },
    [selectedCategory]
  );
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSubmit = async () => {
    for (const { file, categoryId } of filesToUpload) {
      await uploadImage(file, categoryId);
    }
    setFilesToUpload([]);
  };

  // Filter files based on selected category
  const filteredFiles = uploadedFiles.filter(
    (file) => file.categoryId === selectedCategory
  );

  console.log("file to uplaod", filesToUpload);
  console.log("file Filter to uplaod", filteredFiles);
  return (
    <div>
      <div className="flex flex-row gap-4 justify-end">
        <div className="mb-4">
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select File Category" />
            </SelectTrigger>
            <SelectContent className="h-auto overflow-auto">
              {categories?.map((cat: any) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <DialogOrDrawer
            open={showCategoryEditor}
            onOpenChange={setShowCategoryEditor}
          >
            <DialogOrDrawerTrigger asChild>
              <Button size="sm" variant="secondary" className="w-full mb-2">
                Add File Category
              </Button>
            </DialogOrDrawerTrigger>
            <DialogOrDrawerContent>
              <DialogOrDrawerHeader>
                <DialogOrDrawerTitle>New File Category</DialogOrDrawerTitle>
              </DialogOrDrawerHeader>
              <div className="p-4 md:p-0">
                <FileCategoryEditor
                  onSuccess={() => setShowCategoryEditor(false)}
                />
              </div>
            </DialogOrDrawerContent>
          </DialogOrDrawer>
        </div>
      </div>
      <div>
        <label
          {...getRootProps()}
          className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-border border-dashed rounded-lg cursor-pointer bg-background"
        >
          <div className="text-center">
            <div className="border p-2 rounded-md max-w-min mx-auto">
              <UploadCloud size={20} />
            </div>
            <p className="mt-2 text-sm text-gray-600">
              <span className="font-semibold text-foreground">Drag files</span>
            </p>
            <p className="text-xs text-muted-foreground">
              Click to upload files &#40;files should be under 2 MB&#41;
            </p>
          </div>
        </label>
        <Input
          {...getInputProps()}
          id="dropzone-file"
          accept=".jpg,.jpeg,.png,.gif,.svg,.pdf"
          type="file"
          className="hidden"
        />
      </div>
      <div className="max-h-[60vh] overflow-auto">
        {filesToUpload.length > 0 && (
          <div>
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {filesToUpload
                .filter((item) => item.categoryId === selectedCategory)
                .map(({ file, preview }) => (
                  <div
                    key={file.name}
                    className="flex justify-between gap-2 rounded-lg overflow-hidden border border-border group pr-2"
                  >
                    <div className="flex items-center flex-1 p-2">
                      {/* <IconFile stroke={1.5} /> */}
                      {file.type.startsWith("image/") && preview ? (
                        <img
                          src={preview}
                          alt={file.name}
                          className="w-12 h-12 object-cover rounded"
                        />
                      ) : (
                        <IconFile stroke={1.5} />
                      )}
                      <div className="w-full ml-2 space-y-1">
                        <div className="text-sm flex justify-between">
                          <p className="text-muted-foreground">
                            {file.name.slice(0, 25)}
                          </p>
                          {/* <IconLoader2
                            size={16}
                            className="animate-spin -mr-2"
                          /> */}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          if (preview) {
                            URL.revokeObjectURL(preview);
                          }
                          setFilesToUpload((prevFiles) =>
                            prevFiles.filter(
                              (f) =>
                                f.file.name !== file.name &&
                                f.file.size !== file.size
                            )
                          );
                        }}
                        className=" hover:text-white transition-all items-center justify-center px-2 flex -mr-2 text-red-500"
                        title="Remove file"
                      >
                        <IconX size={20} />
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
        {filteredFiles.length > 0 && (
          <div>
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files in{" "}
              {categories?.find((cat: any) => cat.id === selectedCategory)
                ?.name || "Selected Category"}
            </p>
            <div className="space-y-2 pr-3">
              {filteredFiles.map((file) => (
                <div
                  key={file.lastModified}
                  className="flex justify-between gap-2 rounded-lg overflow-hidden border border-hover pr-2 transition-all"
                >
                  <div className="flex items-center flex-1 p-2">
                    {file.type.startsWith("image/") && file.preview ? (
                      <img
                        src={file.preview}
                        alt={file.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ) : (
                      <IconFile stroke={1.5} />
                    )}
                    <div className="w-full ml-2 space-y-1">
                      <div className="text-sm flex justify-between">
                        <p className="text-muted-foreground">
                          {file.name.slice(0, 25)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => removeUploadedFile(file)}
                    className="bg-green-500 text-white transition-all items-center justify-center px-2 flex -mr-2"
                  >
                    <FaCheck size={20} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="mt-4 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={filesToUpload.length === 0}
          className="bg-blue-500 hover:bg-blue-600"
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default FileUploader;
