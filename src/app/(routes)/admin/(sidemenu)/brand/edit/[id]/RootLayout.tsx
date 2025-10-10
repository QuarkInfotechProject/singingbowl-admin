"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

interface RootLayoutProps {
  data: Record<string, any>;
}

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters." }),
  status: z.boolean({ message: "Please select a valid status." }),
  slug: z.string().min(1, { message: "Brand slug is required." }),
  files: z.object({
    logoImage: z
      .object({
        id: z.number().min(1, { message: "Logo Image must be required." }),
      })
      .default({ id: 2 }),
    bannerImage: z
      .object({
        id: z.number().min(1, { message: "Banner Image must be required." }),
      })
      .default({ id: 2 }),
  }),
  meta: z.object({
    metaTitle: z.string().min(1, { message: "Meta Title is required." }),
    metaDescription: z
      .string()
      .min(1, { message: "Meta Description is required." }),
  }),
});

const RootLayout: React.FC<RootLayoutProps> = ({ data }) => {
  const router = useRouter();
  const [isSheetsOpen, setIsSheetsOpen] = useState<boolean>(false);
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState<boolean>(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLogoPreview, setSelectedLogoPreview] = useState<{
    id: string;
    url: string;
  } | null>(
    data.data.files.logo
      ? {
          id: data.data.files.logo.id,
          url: data.data.files.logo.logoUrl,
        }
      : null
  );
  const [selectedBannerPreview, setSelectedBannerPreview] = useState<{
    id: string;
    url: string;
  } | null>(
    data.data.files.banner
      ? {
          id: data.data.files.banner.id,
          url: data.data.files.banner.bannerUrl,
        }
      : null
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: data.data.name,
      status: Boolean(data.data.status),
      slug: data.data.slug || "",
      files: {
        logoImage: { id: data.data.files.logo?.id },
        bannerImage: { id: data.data.files.banner?.id },
      },
      meta: {
        metaTitle: data.data.meta.metaTitle || "",
        metaDescription: data.data.meta.metaDescription || "",
      },
    },
  });

  // Handle Logo Image Selection
  const handleLogoPreviewSelect = (imageId: { id: string; url: string }) => {
    setSelectedLogoPreview(imageId);
    form.setValue("files.logoImage", { id: imageId.id });
    form.trigger("files.logoImage");
  };

  // Handle Banner Image Selection
  const handleBannerPreviewSelect = (imageId: { id: string; url: string }) => {
    setSelectedBannerPreview(imageId);
    form.setValue("files.bannerImage", { id: imageId.id });
    form.trigger("files.bannerImage");
  };

  // Remove Logo Image
  const handleRemoveLogoImage = () => {
    setSelectedLogoPreview(null);
    form.setValue("files.logoImage", { id: 0 });
    form.trigger("files.logoImage");
  };

  // Remove Banner Image
  const handleRemoveBannerImage = () => {
    setSelectedBannerPreview(null);
    form.setValue("files.bannerImage", { id: 0 });
    form.trigger("files.bannerImage");
  };

  const onSubmit = async (formData: any) => {
    const submittedData = { id: data?.data?.id, ...formData };
    try {
      setIsLoading(true);
      const response = await clientSideFetch({
        url: "/brand/update",
        method: "post",
        body: submittedData,
        debug: true,
        toast: toast,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.push("/admin/brand");
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border p-4 rounded-lg">
      <div className="py-4">
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={() => router.push("/admin/brand")}
            variant="outline"
            size="xs"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Edit Brand</h1>
        </div>
      </div>
      <div className="mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6"
          >
            <div className="flex justify-between items-center gap-x-5">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter brand name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand Slug</FormLabel>
                      <FormControl>
                        <Input placeholder="brand-slug" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-between items-center gap-x-5">
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex justify-start items-end space-x-4">
                      <FormLabel>Status</FormLabel>
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormDescription>
                        {field.value ? "Active" : "Inactive"}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="meta.metaTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meta Title</FormLabel>
                      <FormControl>
                        <Input placeholder="SEO Meta Title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div>
              <FormField
                control={form.control}
                name="meta.metaDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Meta Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="SEO Meta Description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between items-center">
              {/* Logo Image */}
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="files.logoImage.id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <FormLabel>Logo Image</FormLabel>
                        <FormControl>
                          <Dialog
                            isOpen={isLogoDialogOpen}
                            onClose={() => setIsLogoDialogOpen(false)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setIsLogoDialogOpen(true)}
                                className="px-1 py-1 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span className="text-xs">Upload</span>
                              </Button>
                            </DialogTrigger>
                            {isLogoDialogOpen && (
                              <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                                <Tabs
                                  onLogoClick={handleLogoPreviewSelect}
                                  setIsSheetOpen={setIsLogoDialogOpen}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                        </FormControl>
                      </div>
                      <div
                        className="mt-4 border-2 rounded-md p-2"
                        style={{ width: "150px", height: "150px" }}
                      >
                        {selectedLogoPreview && (
                          <div className="relative flex justify-center items-center">
                            <Image
                              src={selectedLogoPreview.url}
                              alt="Logo"
                              height={100}
                              width={100}
                            />
                            <button
                              onClick={handleRemoveLogoImage}
                              className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Banner Image */}
              <div className="flex-1">
                <FormField
                  control={form.control}
                  name="files.bannerImage.id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex gap-2">
                        <FormLabel>Banner Image</FormLabel>
                        <FormControl>
                          <Dialog
                            isOpen={isBannerDialogOpen}
                            onClose={() => setIsBannerDialogOpen(false)}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                onClick={() => setIsBannerDialogOpen(true)}
                                className="px-1 py-1 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span className="text-xs">Upload</span>
                              </Button>
                            </DialogTrigger>
                            {isBannerDialogOpen && (
                              <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                                <Tabs
                                  onLogoClick={handleBannerPreviewSelect}
                                  setIsSheetOpen={setIsBannerDialogOpen}
                                />
                              </DialogContent>
                            )}
                          </Dialog>
                        </FormControl>
                      </div>
                      <div
                        className="mt-4 border-2 rounded-md p-2"
                        style={{ width: "150px", height: "150px" }}
                      >
                        {selectedBannerPreview && (
                          <div className="relative flex justify-center items-center">
                            <Image
                              src={selectedBannerPreview.url}
                              alt="Banner"
                              height={100}
                              width={200}
                            />
                            <button
                              onClick={handleRemoveBannerImage}
                              className="absolute top-0 right-0 p-2 bg-red-500 text-white rounded-full"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button
              disabled={isLoading}
              type="submit"
              className="w-fit py-2 text-base hover:bg-blue-600 bg-blue-600"
            >
              {isLoading ? "Please wait..." : "Update"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RootLayout;
