"use client";
import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import Loading from "../Loading";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  ApiResponse,
  MediaCategory,
} from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import makeAnimated from "react-select/animated";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import SelectReactSelect, { ValueType } from "react-select";
import { IconX } from "@tabler/icons-react";

const formSchema = z.object({
  files: z
    .array(
      z.string().refine(
        (value) => {
          if (typeof value === "string") {
            const allowedFormats = ["jpeg", "jpg", "png", "webp", "gif"];
            const fileFormat = value.split(".").pop()?.toLowerCase();
            const isValidFormat =
              fileFormat && allowedFormats.includes(fileFormat);

            const file = new File([value], value);
            const isValidSize = file.size <= MAX_FILE_SIZE;

            return isValidFormat && isValidSize;
          }
          return false;
        },
        {
          message:
            "File must be one of the following formats: jpeg, jpg, png, webp, gif and not exceed 2 MB.",
        }
      )
    )
    .optional(),
  fileCategoryId: z.number().optional(),
});

const MAX_FILE_SIZE = 2 * 1024 * 1024;

const Page = ({ setIsSheetOpen, setRefetch, onClickTab }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File[] | null>(null);
  const [previewImages, setPreviewImages] = useState<string[] | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<number>();
  const { toast } = useToast();
  const router = useRouter();
  const [categoryData, setCategoryData] = useState<MediaCategory[]>([]);
  const animatedComponents = makeAnimated();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handelBack = () => {
    setIsSheetOpen(false);
  };
  const onDrop = (acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.filter((file) => file.size <= MAX_FILE_SIZE);
    const newPreviewImages = newFiles.map((file) => URL.createObjectURL(file));
    setFile((prevFiles) =>
      prevFiles ? [...prevFiles, ...newFiles] : newFiles
    );
    setPreviewImages((prevImages) =>
      prevImages ? [...prevImages, ...newPreviewImages] : newPreviewImages
    );
    form.clearErrors("files");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    onDrop(droppedFiles);
  };

  const removePreviewImage = (index) => {
    if (file !== null && previewImages !== null) {
      const updatedFiles = [...file];
      updatedFiles.splice(index, 1);

      const updatedPreviewImages = [...previewImages];
      updatedPreviewImages.splice(index, 1);

      setFile(updatedFiles.length > 0 ? updatedFiles : null);
      setPreviewImages(
        updatedPreviewImages.length > 0 ? updatedPreviewImages : null
      );
    }
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
  }, []);

  const renderCategories = (categories) => {
    return categories.map((category) => ({
      value: category.id,
      label: category.name,
    }));
  };

  const handleCategoryChange = (selectedOption) => {
    const categoryId = selectedOption ? selectedOption.value : null;
    setSelectedCategories(categoryId);
    form.setValue("fileCategoryId", categoryId);
  };

  const getCategoryLabelById = (categoryId, categories) => {
    const findLabel = (items) => {
      for (const item of items) {
        if (item.id === categoryId) {
          return item.name;
        }
      }
      return "";
    };

    return findLabel(categories);
  };

  const onSubmit = async (values) => {
    try {
      if (file !== null) {
        const formData = new FormData();
        file.forEach((file) => {
          formData.append("files[]", file);
        });

        formData.append(
          "fileCategoryId",
          values?.fileCategoryId?.toString() || ""
        );

        const response = await axios.post("/api/media/create", formData);
        if (response.status === 200) {
          onClickTab(1);
          // router.push('/admin/med/ia');
          toast({
            description: response.data.message,
            variant: "default",
            className: "bg-green-500 text-white",
          });
          // toast({ description: `${response.data.message}` });
          // setRefetch(true);
          // setIsSheetOpen(false);
          setIsLoading(false);
        }
      } else {
        console.error("No files selected");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        toast({
          description: error.response?.data.error,
          variant: "destructive",
        });
      } else {
        setIsLoading(false);
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
      {/* <h1 className='font-bold text-2xl mb-6'>Create Media</h1> */}
      <Form {...form}>
        <form
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
                      className=" cursor-pointer w-full"
                    >
                      <Input
                        type="file"
                        multiple
                        onChange={(e) => onDrop(Array.from(e.target.files))}
                        className="border-2 border-dashed border-gray-300 p-4 min-h-[100px] w-full flex flex-wrap items-center justify-center"
                      />
                      {/* <p className="border-2 border-dashed border-gray-300 p-4 min-h-[100px] w-full flex flex-wrap items-center justify-center">
                        Drag and drop images here
                      </p> */}
                    </div>
                    <div className="flex flex-wrap gap-4 w-full h-[300px] overflow-y-auto">
                      {previewImages !== null &&
                        previewImages.map((previewImage, index) => (
                          <div
                            key={index}
                            className="inline-block mt-4 relative"
                          >
                            <span
                              className="cursor-pointer absolute right-4 top-4 rounded-full bg-gray-100 border text-black p-1"
                              onClick={() => removePreviewImage(index)}
                            >
                              <IconX size={16} />
                            </span>
                            <img
                              src={previewImage}
                              alt={`Preview ${index}`}
                              className=" border-2 border-dashed w-40 h-40 p-2 max-w-full aspect-square object-cover mt-[10px]"
                            />
                          </div>
                        ))}
                    </div>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-start space-x-2">
            {/* <Button
                                type="button"
                             className='bg-red-500 hover:bg-red-600'
                                onClick={handelBack}
                            
                            >
                                Cancel
                            </Button> */}
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
            >
              {isLoading ? "uploading.." : "Upload Image"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Page;
