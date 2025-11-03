"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import Tabs from "../mediaCenter_components/tabs";
import dynamic from "next/dynamic";
const CkEditor = dynamic(
  () => {
    return import("@/components/ui/ckeditor");
  },
  { ssr: false }
);
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState, useEffect } from "react";
import { CategoryT } from "@/app/_types/category_Types/categoryType";
import { MdOutlineFileUpload } from "react-icons/md";

const formSchema = z
  .object({
    name: z.string().min(2, { message: "Name is required" }),
    url: z.string().min(2, { message: "url is required" }),
    description: z.string().nullable(),
    files: z.object({
      logo: z.number().optional(),
      banner: z
        .union([z.number(), z.literal("")])
        .optional()
        .default(""),
    }),

    status: z.boolean().default(false).optional(),
    searchable: z.boolean().default(false).optional(),
    parentId: z.string().optional(),

    filterPriceMin: z
      .string()
      .min(1, { message: "Minimum price is required" })
      .refine((val) => !isNaN(Number(val)), {
        message: "Minimum price must be a valid number",
      })
      .transform((val) => Number(val)),

    filterPriceMax: z
      .string()
      .min(1, { message: "Maximum price is required" })
      .refine((val) => !isNaN(Number(val)), {
        message: "Maximum price must be a valid number",
      })
      .transform((val) => Number(val)),
  })
  .superRefine((data, ctx) => {
    // Validate price comparison
    if (data.filterPriceMin > data.filterPriceMax) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum price cannot be greater than maximum price",
        path: ["filterPriceMin"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum price cannot be less than minimum price",
        path: ["filterPriceMax"],
      });
    }
  });

interface AddCategoriesProps {
  parentId: number | null;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  addFormData: CategoryT | undefined;
  setFormData: (data: any) => void;
  formData: any;
}

const AddForm = ({
  parentId,
  setRefetch,
  addFormData,
  formData,
  setFormData,
}: AddCategoriesProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [isSheetOpens, setIsSheetOpens] = useState(false);

  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: number; url: string }[]
  >([]);
  const [selectedPreviewMulti, setSelectedPreviewMulti] = useState<
    { id: number; url: string }[]
  >([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      url: "",
      status: true,
      searchable: true,
      filterPriceMin: undefined,
      filterPriceMax: undefined,
      description: "",
      parentId: parentId?.toString() || "",
      files: {
        logo: undefined,
        banner: "",
      },
    },
    mode: "onChange",
  });

  const handlePreviewSelect = (imageId: any) => {
    const numericId = Number(imageId.id);
    form.setValue("files.banner", numericId);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        banner: numericId,
      },
    }));
    setSelectedPreviewMulti([{ url: imageId.url, id: numericId }]);
  };

  const handlePreviewSelected = (imageId: any) => {
    const numericId = Number(imageId.id);
    form.setValue("files.logo", numericId);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        logo: numericId,
      },
    }));

    setSelectedPreviews([{ url: imageId.url, id: numericId }]);
  };

  const handleRemoveImage = (idToRemove: number) => {
    const updatedPreviews = selectedPreviews.filter(
      (preview) => preview.id !== idToRemove
    );

    const LogoId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : undefined;

    form.setValue("files.logo", LogoId);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        logo: LogoId,
      },
    }));
    setSelectedPreviews(updatedPreviews);
  };

  const handleRemoveImageMulti = (idToRemove: number) => {
    const updatedPreviews = selectedPreviewMulti.filter(
      (preview) => preview.id !== idToRemove
    );

    const bannerId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : "";

    form.setValue("files.banner", bannerId);
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        banner: bannerId,
      },
    }));

    setSelectedPreviewMulti(updatedPreviews);
  };

  useEffect(() => {
    const unwatch = form.watch((watchedValues) => {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        name: watchedValues.name,
        url: watchedValues.url,
        status: watchedValues.status,
        searchable: watchedValues.searchable,
        filterPriceMin: watchedValues.filterPriceMin
          ? Number(watchedValues.filterPriceMin)
          : undefined,
        filterPriceMax: watchedValues.filterPriceMax
          ? Number(watchedValues.filterPriceMax)
          : undefined,
        files: {
          banner: watchedValues.files?.banner,
          logo: watchedValues.files?.logo,
        },
        description: watchedValues.description,
        parentId: parentId?.toString() || "",
      }));
    });

    return () => {
      unwatch.unsubscribe();
    };
  }, [form, setFormData, parentId]);

  const handleSubmits = async () => {
    setSubmitting(true);
    setIsLoading(true);

    try {
      // Validate the entire form before submission
      const isValid = await form.trigger();
      if (!isValid) {
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      const { data } = await axios.post("/api/category/category-add", formData);
      if (data) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white ",
        });
        setRefetch((prev: boolean) => !prev);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        if (error.response?.data.errors) {
          const validationErrors = error.response.data.errors.name;
          const validationErrorsUrl = error.response.data.errors.url;

          if (validationErrors) {
            for (const fieldName in validationErrors) {
              form.setError("name", {
                type: "server",
                message: validationErrors[fieldName],
              });
            }
          }

          if (validationErrorsUrl) {
            for (const fieldUrl in validationErrorsUrl) {
              form.setError("url", {
                type: "server",
                message: validationErrorsUrl[fieldUrl],
              });
            }
          }
        } else {
          toast({
            description: error?.response?.data?.message || "An error occurred",
            variant: "destructive",
          });
        }
      } else {
        setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
    setSubmitting(false);
  };

  useEffect(() => {
    if (addFormData) {
      setIsLoading(false);
    }
  }, [addFormData]);

  const toggleCreateDialog = () => {
    setIsSheetsOpen(true);
  };

  const toggleCreateDialogs = () => {
    setIsSheetOpens(true);
  };

  return (
    <Form {...form}>
      <div className="">
        <div className="space-y-8">
          <div className=" h-full w-[450px] mx-auto">
            <h1 className="text-left font-bold text-2xl ">Add Categories</h1>
            <h1 className=" text-md text-left tracking-loose font-sm opacity-50 mt-2">
              {" "}
              {parentId === 0 ? "" : addFormData?.name}
            </h1>
            <div className="space-y-2  w-full my-auto ">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-black dark:text-white">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Name"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors("name");
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-black dark:text-white">
                      Url
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Url"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors("url");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filterPriceMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-black dark:text-white">
                      Min_Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="minprice"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors("filterPriceMin");
                          // Trigger validation for both price fields
                          form.trigger(["filterPriceMin", "filterPriceMax"]);
                        }}
                        onBlur={() => {
                          form.trigger("filterPriceMin");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="filterPriceMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md text-black dark:text-white">
                      Max_Price
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="maxprice"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          form.clearErrors("filterPriceMax");
                          // Trigger validation for both price fields
                          form.trigger(["filterPriceMin", "filterPriceMax"]);
                        }}
                        onBlur={() => {
                          form.trigger("filterPriceMax");
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="files.logo"
                render={({ field }) => (
                  <FormItem className="mt-10">
                    <FormLabel className="text-md">Logo</FormLabel>

                    <br />
                    <FormControl>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            className="flex flex-row gap-1"
                            variant="outline"
                            onClick={toggleCreateDialog}
                          >
                            {" "}
                            <MdOutlineFileUpload /> Upload
                          </Button>
                        </DialogTrigger>
                        {isSheetsOpen && (
                          <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                            <Tabs
                              onLogoClick={handlePreviewSelected}
                              setIsSheetOpen={setIsSheetsOpen}
                            />
                          </DialogContent>
                        )}
                      </Dialog>
                    </FormControl>
                    <div>
                      <div className="">
                        <div
                          className="border-2 border-gray-100    rounded-md p-2"
                          style={{ width: "150px", height: "150px" }}
                        >
                          {selectedPreviews.map((selectedImage) => (
                            <div key={selectedImage.id} className="  relative">
                              <Image
                                {...field}
                                src={selectedImage.url}
                                alt="select BaseImage"
                                width={150}
                                height={150}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImage(selectedImage.id)
                                }
                                className="absolute top-0 left-28 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="files.banner"
                render={({ field }) => (
                  <FormItem className="mt-10">
                    <FormLabel className="text-md">Banner</FormLabel>
                    <br />
                    <FormControl>
                      <Dialog
                        open={isSheetOpens}
                        onOpenChange={setIsSheetOpens}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex flex-row gap-1"
                            onClick={toggleCreateDialogs}
                          >
                            {" "}
                            <MdOutlineFileUpload /> Upload
                          </Button>
                        </DialogTrigger>
                        {isSheetOpens && (
                          <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                            <Tabs
                              onLogoClick={handlePreviewSelect}
                              setIsSheetOpen={setIsSheetOpens}
                            />
                          </DialogContent>
                        )}
                      </Dialog>
                    </FormControl>
                    <div
                      className="border-2 border-gray-100 w-32 h-32   rounded-md p-2"
                      style={{ width: "150px", height: "150px" }}
                    >
                      {selectedPreviewMulti.length > 0 && (
                        <div className="  ">
                          {selectedPreviewMulti.map((selectedImage) => (
                            <div key={selectedImage.id} className=" relative">
                              <Image
                                {...field}
                                src={selectedImage.url}
                                width={150}
                                height={150}
                                alt="Selected Preview"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImageMulti(selectedImage.id)
                                }
                                className="absolute top-0 left-28 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mt-4  h-auto ">
                    <FormLabel className="text-lg">Description</FormLabel>
                    <FormControl>
                      <CkEditor
                        id="cat-description"
                        initialData={""}
                        onChange={(content) => {
                          form.setValue("description", content);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-between">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-md">Status</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="ml-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className=" text-md">Searchable</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="ml-4"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  disabled={isLoading}
                  onClick={handleSubmits}
                  className="px-8 text-white hover:text-white bg-[#5e72e4] hover:bg-[#465ad1]"
                >
                  Submit
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default AddForm;
