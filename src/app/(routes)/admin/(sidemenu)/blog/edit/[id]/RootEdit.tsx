"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MdOutlineFileUpload } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { isDataView } from "util/types";
// ***********************
const CkEditor = dynamic(
  () => {
    return import("@/components/ui/ckeditor");
  },
  { ssr: false }
);

// Validation schema using Zod
const formSchema = z.object({
  id: z.string().optional(),
  title: z.string().nonempty("Title is required"),
  slug: z.string().nonempty("Slug is required"),
  description: z.string().optional(),
  readTime: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative("Read Time must be a non-negative number")
  ),
  files: z.object({
    desktopImage: z.string().optional(),
    mobileImage: z.string().optional(),
  }),
  meta: z.object({
    metaTitle: z.string(),
    keywords: z.array(z.string()),
    metaDescription: z.string(),
  }),
});

// Dynamic import for the Quill editor
// const QuillEditorComponent = dynamic(() => import("./quillEditor"), {
//   ssr: false,
//   loading: () => <p>Loading editor...</p>,
// });

const RootEdit = ({ editData, id }) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editorData, setEditorData] = useState(
    editData?.data?.description || ""
  );
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);
  const [isSheetsMobileOpen, setIsSheetsMobileOpen] = useState(false);
  const [tags, setTags] = useState(editData?.data.meta.keywords || []);
  const [inputValue, setInputValue] = useState("");
  const [selectedPreviews, setSelectedPreviews] = useState([]);
  const [selectedMobilePreviews, setSelectedMobilePreviews] = useState([]);
  const [formDatas, setFormDatas] = useState({
    desktopImage: editData?.data.files.desktop?.id || "",
    mobileImage: editData?.data.files.mobile?.id || "",
  });
  // -----------------------------


  // -------------------------

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id,
      title: editData?.data.title || "",
      slug: editData?.data.slug || "",
      description: editData?.data.description || "",
      readTime: editData?.data.readTime || 0,
      meta: {
        metaTitle: editData?.data.meta.metaTitle || "",
        keywords: editData?.data.meta.keywords || [],
        metaDescription: editData?.data.meta.metaDescription || "",
      },
    },
  });
  // CK editor
  const postDescription = useWatch({
    control: form.control,
    name: "description",
  });
  // end if CK
  // const handleEditorChange = (newData) => {
  //   setEditorData(newData);
  // };

  const handleRemoveImage = (idToRemove) => {
    const updatedPreviews = selectedPreviews.filter(
      (preview) => preview.id !== idToRemove
    );
    setSelectedPreviews(updatedPreviews);
    setFormDatas((prev) => ({
      ...prev,
      desktopImage:
        updatedPreviews.length > 0
          ? updatedPreviews[updatedPreviews.length - 1].id
          : "",
    }));
  };

  const handleRemoveMobileImage = (idToRemove) => {
    const updatedMobilePreviews = selectedMobilePreviews.filter(
      (preview) => preview.id !== idToRemove
    );
    setSelectedMobilePreviews(updatedMobilePreviews);
    setFormDatas((prev) => ({
      ...prev,
      mobileImage:
        updatedMobilePreviews.length > 0
          ? updatedMobilePreviews[updatedMobilePreviews.length - 1].id
          : "",
    }));
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

  const handleRemoveTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };
  console.log("EditorData", editorData);

  const handleSubmit = form.handleSubmit(async (values) => {
    const fromData = {
      ...values,
      description: values?.description,
      files: { ...formDatas },
    };

    setIsLoading(true);

    try {
      const response = await axios.post("/api/Blog/edit", fromData);
      if (response.status === 200) {
        toast({
          description: response.data.message,
          className: "bg-green-400 text-white",
        });
        router.push("/admin/blog");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error || "An error occurred";
        toast({
          description: errorMsg,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Unexpected Error",
          description: error.message,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  });
  const toggleCreateDialog = () => {
    setIsSheetsOpen(true);
  };
  const toggleCreateMobileDialog = () => {
    setIsSheetsMobileOpen(true);
  };
  useEffect(() => {
    if (editData?.data.files.desktop) {
      setSelectedPreviews([
        {
          id: editData.data.files.desktop.id.toString(),
          url: editData.data.files.desktop.desktopUrl,
        },
      ]);
    }
    if (editData?.data.files.mobile) {
      setSelectedMobilePreviews([
        {
          id: editData.data.files.mobile.id.toString(),
          url: editData.data.files.mobile.mobileUrl,
        },
      ]);
    }
  }, [editData]);

  const handlePreviewSelected = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) return;
    setFormDatas((prev) => ({
      ...prev,
      desktopImage: imageId.id,
    }));
    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
    // setIsSheetsOpen(false);
  };

  const handlePreviewMobileSelected = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) return;
    setFormDatas((prev) => ({
      ...prev,
      mobileImage: imageId.id,
    }));
    setSelectedMobilePreviews([{ url: imageId.url, id: imageId.id }]);
    setIsSheetsMobileOpen(false);
  };
  //
  const handleRouter = () => {
    router.push("/admin/blog");
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={handleRouter}
            variant="outline"
            size="xs"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Update Blog</h1>
        </div>

        <div>
          {" "}
          <Button
            onClick={handleSubmit}
            className="bg-[#5e72e4] hover:bg-[#465ad1]"
          >
            {isLoading ? "Updating....." : "Update"}
          </Button>
        </div>
      </div>
      <Form {...form}>
        <div className="h-full  w-full ">
          {/* <h1 className="text-left font-bold text-2xl mb-6 ">Add Blog</h1> */}
          <form className="space-y-8">
            <div className="flex flex-row gap-6 ">
              <Card className="w-full">
                <CardHeader>
                  <CardTitle>Blog Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    defaultValue={id}
                    name="id"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Name"
                            type="hidden"
                            defaultValue={id}
                            {...field}
                            className="border-black   "
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      defaultValue={editData?.data.title}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Title
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Title"
                              {...field}
                              defaultValue={editData?.data?.title}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="slug"
                      defaultValue={editData?.data.slug}
                      render={({ field, fieldState }) => (
                        <FormItem>
                          <FormLabel className="text-md text-black dark:text-white">
                            Url
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Url"
                              type="text"
                              {...field}
                              defaultValue={editData?.data.slug}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage>
                            {" "}
                            {fieldState.error?.message}
                          </FormMessage>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="readTime"
                      defaultValue={editData?.data.readTime}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md  text-black dark:text-white">
                            Read Time
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Read Time"
                              {...field}
                              defaultValue={editData?.data.readTime}
                            />
                          </FormControl>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="description"
                    defaultValue={editData?.data.description}
                    render={({ field, fieldState }) => (
                      <FormItem>
                        <FormLabel className=" text-md">Description</FormLabel>
                        {/* <FormControl>
                          <QuillEditorComponent
                            editData={form.getValues("description")}
                            onDataChange={handleEditorChange}
                            {...field}
                          />
                        </FormControl> */}

                        <CkEditor
                          id="post-description"
                          initialData={postDescription}
                          onChange={(content) => {
                            form.setValue("description", content);
                          }}
                        />

                        <FormMessage> {fieldState.error?.message}</FormMessage>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              <Card className="w-auto ">
                {/* <CardHeader>
      <CardTitle className="text-lg">Upload Blog Images</CardTitle>
    </CardHeader> */}

                <CardContent>
                  <div className="grid gap-4">
                    {/* Desktop Image Field */}
                    <FormField
                      control={form.control}
                      name="files.desktopImage"
                      render={({ field }) => (
                        <FormItem className="justify-center mx-auto mt-2">
                          <FormLabel className="text-md">
                            Desktop Image
                          </FormLabel>
                          <FormControl>
                            <Dialog
                              isOpen={isSheetsOpen}
                              onClose={() => setIsSheetsOpen(false)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={toggleCreateDialog}
                                  className="flex flex-row gap-2"
                                >
                                  <MdOutlineFileUpload />
                                  <span>Upload</span>
                                </Button>
                              </DialogTrigger>
                              {isSheetsOpen && (
                                <DialogContent className="max-w-[1300px] mx-auto h-[600px]">
                                  <Tabs
                                    onLogoClick={handlePreviewSelected} // Select image
                                    setIsSheetOpen={setIsSheetsOpen} // Close dialog
                                  />
                                </DialogContent>
                              )}
                            </Dialog>
                          </FormControl>
                          <div>
                            <div
                              className="mt-4 border-2 border-gray-300 rounded-md p-2"
                              style={{ width: "150px", height: "150px" }}
                            >
                              {selectedPreviews.map((selectedImage) => (
                                <div
                                  key={selectedImage.id}
                                  className="mb-2 relative"
                                >
                                  <Image
                                    {...field}
                                    src={selectedImage.url}
                                    alt="Desktop Image"
                                    width={150}
                                    height={150}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveImage(selectedImage.id)
                                    }
                                    className="absolute top-0 left-24 bg-opacity-30 bg-white text-black rounded-full transition-opacity duration-300"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mobile Image Field */}
                    <FormField
                      control={form.control}
                      name="files.mobileImage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-md">
                            Mobile Image
                          </FormLabel>
                          <FormControl>
                            <Dialog
                              isOpen={isSheetsMobileOpen}
                              onClose={() => setIsSheetsMobileOpen(false)}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  onClick={toggleCreateMobileDialog}
                                  className="flex flex-row gap-2"
                                >
                                  <MdOutlineFileUpload />
                                  <span>Upload</span>
                                </Button>
                              </DialogTrigger>
                              {isSheetsMobileOpen && (
                                <DialogContent className="max-w-[1300px] mx-auto h-[600px]">
                                  <Tabs
                                    onLogoClick={handlePreviewMobileSelected} // Select image
                                    setIsSheetOpen={setIsSheetsMobileOpen} // Close dialog
                                  />
                                </DialogContent>
                              )}
                            </Dialog>
                          </FormControl>
                          <div>
                            <div
                              className="mt-4 border-2 border-gray-300 rounded-md p-2"
                              style={{ width: "150px", height: "150px" }}
                            >
                              {selectedMobilePreviews.map((selectedImage) => (
                                <div
                                  key={selectedImage.id}
                                  className="mb-2 relative"
                                >
                                  <Image
                                    {...field}
                                    src={selectedImage.url}
                                    alt="Mobile Image"
                                    width={150}
                                    height={150}
                                  />
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleRemoveMobileImage(selectedImage.id)
                                    }
                                    className="absolute top-0 left-24 bg-opacity-30 bg-white text-black rounded-full transition-opacity duration-300"
                                  >
                                    <FaTimes />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <FormDescription></FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* meta information */}
            <Card className="w-full">
              <CardHeader>
                <CardTitle>Meta Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="meta.metaTitle"
                    defaultValue={editData?.data.meta.metaTitle}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Meta Title
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Meta Title"
                            {...field}
                            defaultValue={editData?.data.meta.metaTitle}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="meta.metaDescription"
                    defaultValue={editData?.data.meta.metaDescription}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md text-black dark:text-white">
                          Meta Description
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Meta Description"
                            {...field}
                            defaultValue={editData?.data.meta.metaDescription}
                          />
                        </FormControl>
                        <FormDescription></FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* meta informations */}
                <FormField
                  control={form.control}
                  name="meta.keywords"
                  defaultValue={editData?.data.meta.keywords}
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
                            defaultValue={editData?.data.meta.keywords}
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
          </form>
        </div>
      </Form>
    </div>
  );
};

export default RootEdit;
