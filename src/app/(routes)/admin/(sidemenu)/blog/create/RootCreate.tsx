"use client";
import React, { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoArrowBackCircleSharp, IoEye, IoEyeOff } from "react-icons/io5";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import QuillEditorComponent from "./quillEditor";
import { Button } from "@/components/ui/button";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Group } from "@/app/_types/group-Types/groupType";
import { IoIosArrowBack } from "react-icons/io";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// ******************8
import dynamic from "next/dynamic";

const CkEditor = dynamic(
  () => {
    return import("@/components/ui/ckeditor");
  },
  { ssr: false }
);

const formSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .refine((value) => value.length > 0, {
      message: "Title is required",
    }),
  slug: z
    .string()
    .min(1, "URL is required")
    .regex(
      /^[a-z0-9-]+$/,
      "URL can only contain lowercase letters, numbers, and hyphens"
    )
    .refine((value) => value.length > 0, {
      message: "URL is required",
    }),
  description: z
    .string()
    .min(1, "Description is required")
    .refine((value) => value.length > 0, {
      message: "Description is required",
    }),
  readTime: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative("Read Time must be a non-negative number")
  ),
  files: z.object({
    desktopImage: z
      .string()
      .min(1, { message: "Desktop image is required" })
      .refine((value) => value.length > 0, {
        message: "Please select a desktop image",
      }),
    mobileImage: z
      .string()
      .min(1, { message: "Mobile image is required" })
      .refine((value) => value.length > 0, {
        message: "Please select a mobile image",
      }),

    meta: z.object({
      metaTitle: z.string(),
      keywords: z.array(z.string()),
      metaDescription: z.string(),
    }),
  }),
});

const RootCreate = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState();
  const [isEditMode, setIsEditMode] = useState(true);

  const [editorData, setEditorData] = useState("");
  const [editorValue, setEditorValue] = useState();
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [isSheetsMobileOpen, setIsSheetsMobileOpen] = useState(false);

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedMobilePreviews, setSelectedMobilePreviews] = useState<
    { id: string; url: string }[]
  >([]);

  const [formDatas, setFormDatas] = useState();

  const descriptionRef = useRef();
  const slugRef = useRef();

  const imageRef = useRef();

  const handleRouter = () => {
    router.push("/admin/blog");
  };
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      readTime: 0,
      files: { desktopImage: "", mobileImage: "" },
      meta: {
        metaTitle: "",
        keywords: [],
        metaDescription: "",
      },
    },
    mode: "onChange",
  });

  // const handleEditorChange = (newData: string) => {
  //   console.log("New editor data:", newData);
  //   setEditorData(newData);
  //   form.setValue("description", newData);
  //   form.trigger("description");
  // };

  // useEffect(() => {
  //   setEditorValue(form.getValues("description") || "");
  // }, []);

  const postDescription = useWatch({
    control: form.control,
    name: "description",
  });
  console.log("FDSFGHJK", form.getValues("description"));

  const handleRemoveImage = (idToRemove: string) => {
    const updatedPreviews = selectedPreviews.filter(
      (preview) => preview.id !== idToRemove
    );

    // const LogoMobileId = updatedMobilePreviews.length > 0 ? updatedMobilePreviews[updatedMobilePreviews.length - 1].id : '';
    const LogoId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : "";
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      desktopImage: LogoId,
      // mobileImage:LogoMobileId
    }));
    setSelectedPreviews(updatedPreviews);
    form.setValue("files.desktopImage", LogoId);
    form.trigger("files.desktopImage");
    // setSelectedMobilePreviews(updatedMobilePreviews);
  };
  const handleRemoveMobileImage = (idToRemove: string) => {
    const updatedMobilePreviews = selectedMobilePreviews.filter(
      (preview) => preview.id !== idToRemove
    );

    const LogoMobileId =
      updatedMobilePreviews.length > 0
        ? updatedMobilePreviews[updatedMobilePreviews.length - 1].id
        : "";
    // const LogoId = updatedPreviews.length > 0 ? updatedPreviews[updatedPreviews.length - 1].id : '';
    setFormDatas((prevFormData: any) => ({
      ...prevFormData,

      // featuredImage: LogoId,
      mobileImage: LogoMobileId,
    }));
    // setSelectedPreviews(updatedPreviews);
    setSelectedMobilePreviews(updatedMobilePreviews);
    form.setValue("files.mobileImage", LogoMobileId);
    form.trigger("files.mobileImage");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = inputValue.trim();
      if (value && !tags.includes(value)) {
        setTags([...tags, value]);
        setInputValue("");
        form.setValue("meta.keywords", [...tags, value]);
      }
    }
  };

  console.log("input Value", inputValue);
  console.log("input Tag", tags);

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSubmit = async () => {
    const values = form.getValues();
    console.log(values);
    if (selectedPreviews.length === 0) {
      form.setError("files.desktopImage", {
        type: "manual",
        message: "Desktop image is required",
      });
    }

    if (selectedMobilePreviews.length === 0) {
      form.setError("files.mobileImage", {
        type: "manual",
        message: "Mobile image is required",
      });
    }
    const isValid = await form.trigger();
    if (
      isValid ||
      selectedPreviews.length === 0 ||
      selectedMobilePreviews.length === 0
    ) {
      // toast({
      //   title: "Validation Error",
      //   description:
      //     "Please fill in all required fields and upload both desktop and mobile images.",
      //   variant: "destructive",
      // });
      return;
    }
    const fromData = {
      ...values,
      description: values?.description,
      files: { ...formDatas },
    };
    console.log("formData??", fromData);
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/Blog/create", fromData);
      console.log("dataasddsf", data);
      if (data) {
        toast({
          variant: "default",
          description: `${data?.message}`,
          className: "bg-green-500 text-white font-semibold text-md",
        });
        router.push("/admin/blog");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;
        // Handle backend validation errors
        if (errorResponse?.error) {
          const { errors } = errorResponse;
          // Clear existing errors
          form.clearErrors();
          // Set new errors from backend
          Object.entries(errors).forEach(([field, message]) => {
            if (field === "title") {
              form.setError("title", {
                type: "manual",
                message: message as string,
              });
            }
            if (field === "slug") {
              form.setError("slug", {
                type: "manual",
                message: message as string,
              });
            }
            if (field === "description") {
              form.setError("description", {
                type: "manual",
                message: message as string,
              });
            }
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
  };

  const toggleCreateDialog = () => {
    setIsSheetsOpen(true);
  };
  const toggleCreateDialogMobile = () => {
    setIsSheetsMobileOpen(true);
  };

  const handlePreviewSelected = (imageData) => {
    if (imageData && imageData.id) {
      setFormDatas((prevFormData: any) => ({
        ...prevFormData,
        desktopImage: imageData.id,
      }));
      setSelectedPreviews([
        {
          url: imageData.url || null,
          id: imageData.id,
        },
      ]);
      form.setValue("files.desktopImage", imageData.id?.toString());
      form.trigger("files.desktopImage");
    } else {
      // If imageData or imageData.id is undefined, clear the selection
      setFormDatas((prevFormData: any) => ({
        ...prevFormData,
        desktopImage: null,
      }));
      setSelectedPreviews([]);
      form.setValue("files.desktopImage", "");
      // form.trigger('files.desktopImage');
    }
    // Optionally close the sheet after selection
    // setIsSheetOpen(false);
  };
  const handlePreviewMobileSelected = (imageData) => {
    if (imageData && imageData.id) {
      setFormDatas((prevFormData: any) => ({
        ...prevFormData,
        mobileImage: imageData.id,
      }));
      setSelectedMobilePreviews([
        {
          url: imageData.url || null,
          id: imageData.id,
        },
      ]);
      form.setValue("files.mobileImage", imageData.id?.toString());
      form.trigger("files.mobileImage");
    } else {
      // If imageData or imageData.id is undefined, clear the selection
      setFormDatas((prevFormData: any) => ({
        ...prevFormData,
        mobileImage: null,
      }));
      setSelectedMobilePreviews([]);
      form.setValue("files.mobileImage", "");
      // form.trigger('files.mobileImage');
    }
    // setIsSheetsOpen(false);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between ">
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={handleRouter}
            variant="outline"
            size="xs"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Add Blog</h1>
        </div>
        <div>
          <Button
            onClick={() => handleSubmit()}
            className=" bg-[#5e72e4] hover:bg-[#465ad1] text-white font-medium"
            // disabled={isLoading}
          >
            {/* {isLoading ? 'Submitting...' : 'Submit'} */}
            Submit
          </Button>
        </div>
      </div>

      {/* <Card className="w-full">
    <CardHeader>
      <CardTitle>Add Blog</CardTitle>
    </CardHeader>
    <CardContent> */}
      <Form {...form}>
        <div className="h-full relative w-full ">
          {/* <h1 className="text-left font-bold text-2xl mb-6 ">Add Blog</h1> */}
          <form className="space-y-8 ">
            <div className="flex relative flex-row gap-4  ">
              {/* Blog Information Card */}
              <Card className="lg:col-span-2  rounded-lg w-full">
                <CardHeader>
                  <CardTitle className="text-xl">Blog Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Title Field */}
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Title</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Title"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.trigger("title"); // Trigger validation on change
                              }}
                              onBlur={() => {
                                field.onBlur();
                                form.trigger("title"); // Trigger validation on blur
                              }}
                              className={`border border-gray-300 focus:border-indigo-500 rounded-md `}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Slug Field */}
                    <FormField
                      control={form.control}
                      name="slug"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">URL</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="URL"
                              {...field}
                              onChange={(e) => {
                                field.onChange(e);
                                form.trigger("slug"); // Trigger validation on change
                              }}
                              onBlur={() => {
                                field.onBlur();
                                form.trigger("slug"); // Trigger validation on blur
                              }}
                              className={`border border-gray-300 focus:border-indigo-500 rounded-md `}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Read Time Field */}
                    <FormField
                      control={form.control}
                      name="readTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Read Time</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Read Time"
                              type="number"
                              min={0}
                              {...field}
                              className="border border-gray-300 focus:border-indigo-500 rounded-md"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Description Field */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="mt-4  h-auto ">
                        <FormLabel className="text-lg">Description</FormLabel>
                        <FormControl>
                          <CkEditor
                            id="post-description"
                            initialData={postDescription}
                            onChange={(content) => {
                              form.setValue("description", content);
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                </CardContent>
              </Card>

              {/* Upload Blog Images Card */}
              <Card className=" rounded-lg w-auto justify-end   ">
                {/* <CardHeader>
      <CardTitle className="text-xl">Upload Blog Images</CardTitle>
    </CardHeader> */}
                <CardContent>
                  <div className="grid gap-4 ">
                    {/* Desktop Image Field */}
                    <FormField
                      control={form.control}
                      name="files.desktopImage"
                      render={({ field, fieldState }) => (
                        <FormItem className="justify-center mt-2">
                          <FormLabel className="text-lg">
                            Desktop Image
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Dialog
                                isOpen={isSheetsOpen}
                                onClose={() => setIsSheetsOpen(false)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={toggleCreateDialog}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md border 
                        ${
                          fieldState.error
                            ? "border-gray-500 focus:border-indigo-500"
                            : "border-gray-300 hover:border-indigo-500"
                        }`}
                                  >
                                    <MdOutlineFileUpload />
                                    <span>Upload</span>
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

                              {/* Preview Desktop Image */}
                              <div
                                className={`mt-4 border-2 rounded-md p-2 
                  ${fieldState.error ? "border-gray-300" : "border-gray-300"}`}
                                style={{ width: "150px", height: "150px" }}
                              >
                                {selectedPreviews.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {selectedPreviews.map((selectedImage) => (
                                      <div
                                        key={selectedImage.id}
                                        className="relative"
                                      >
                                        <Image
                                          src={selectedImage.url}
                                          alt="Selected Image"
                                          width={150}
                                          height={150}
                                          className="rounded-md"
                                        />
                                        <button
                                          type="button"
                                          onClick={() =>
                                            handleRemoveImage(selectedImage.id)
                                          }
                                          className="absolute top-0 right-0 bg-white text-black rounded-full p-1 shadow-md"
                                        >
                                          <FaTimes />
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="flex items-center text-center justify-center h-full text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className="text-red-500 text-sm mt-1">
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />

                    {/* Mobile Image Field */}
                    <FormField
                      control={form.control}
                      name="files.mobileImage"
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-lg">
                            Mobile Image
                          </FormLabel>
                          <FormControl>
                            <div className="space-y-2">
                              <Dialog
                                isOpen={isSheetsMobileOpen}
                                onClose={() => setIsSheetsMobileOpen(false)}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    onClick={toggleCreateDialogMobile}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-md border 
                        ${
                          fieldState.error
                            ? "border-gray-300 hover:border-indigo-500"
                            : "border-gray-300 hover:border-indigo-500"
                        }`}
                                  >
                                    <MdOutlineFileUpload />
                                    <span>Upload</span>
                                  </Button>
                                </DialogTrigger>
                                {isSheetsMobileOpen && (
                                  <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                                    <Tabs
                                      onLogoClick={handlePreviewMobileSelected}
                                      setIsSheetOpen={setIsSheetsMobileOpen}
                                    />
                                  </DialogContent>
                                )}
                              </Dialog>

                              {/* Preview Mobile Image */}
                              <div
                                className={`mt-4 border-2 rounded-md p-2 
                  ${fieldState.error ? "border-gray-300" : "border-gray-300"}`}
                                style={{ width: "150px", height: "150px" }}
                              >
                                {selectedMobilePreviews.length > 0 ? (
                                  <div className="flex flex-wrap gap-2">
                                    {selectedMobilePreviews.map(
                                      (selectedImage) => (
                                        <div
                                          key={selectedImage.id}
                                          className="relative inline-block"
                                        >
                                          <Image
                                            src={selectedImage.url}
                                            alt="Selected Image"
                                            width={150}
                                            height={150}
                                            className="rounded-md"
                                          />
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleRemoveMobileImage(
                                                selectedImage.id
                                              )
                                            }
                                            className="absolute top-0 right-0 bg-white text-black rounded-full p-1 shadow-md"
                                          >
                                            <FaTimes />
                                          </button>
                                        </div>
                                      )
                                    )}
                                  </div>
                                ) : (
                                  <div className="flex items-center text-center justify-center h-full text-gray-400">
                                    No image
                                  </div>
                                )}
                              </div>
                            </div>
                          </FormControl>
                          {fieldState.error && (
                            <FormMessage className="text-red-500 text-sm mt-1">
                              {fieldState.error.message}
                            </FormMessage>
                          )}
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="meta.metaTitle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Meta Title
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="Meta Title" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="meta.metaDescription"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Textarea placeholder="Meta Description" {...field} />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="meta.keywords"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Meta Keywords
                      </FormLabel>
                      <FormControl>
                        <div className="flex items-center flex-wrap border border-gray-300 rounded p-2">
                          {tags.map((tag) => (
                            <div
                              key={tag}
                              className="flex items-center bg-gray-200 rounded-full px-3 py-1 m-1"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="ml-2 text-red-500"
                              >
                                <FaTimes />
                              </button>
                            </div>
                          ))}
                          <input
                            type="text"
                            className="flex-grow focus:outline-none"
                            placeholder="Meta Keywords"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                          />
                        </div>
                      </FormControl>
                      <FormDescription>
                        {" "}
                        Press enter to save the value.
                      </FormDescription>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* <Button onClick={()=>handleSubmit()} className='bg-[#5e72e4] hover:bg-[#465ad1]' disabled={isLoading}>
          {isLoading ? 'Submitting...' : 'Submit'}
          </Button> */}
          </form>
        </div>
      </Form>
      {/* </CardContent>
 </Card> */}
    </div>
  );
};

export default RootCreate;
