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
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Brand name must be at least 2 characters." }),
  status: z.boolean({ message: "Please select a valid status." }),
  slug: z.string().min(1, { message: "Brand slug is required." }),
  files: z.object({
    logoImage: z.object({
      id: z.number().min(1, { message: "Logo Image  must be requires." }),
    }),
    bannerImage: z.object({
      id: z.number().min(1, { message: "Banner Image must be required." }),
    }),
  }),
  meta: z.object({
    metaTitle: z.string().min(1, { message: "Meta Title is required." }),
    metaDescription: z
      .string()
      .min(1, { message: "Meta Description is required." }),
  }),
});

const RootLayout = () => {
  const [isLogoDialogOpen, setIsLogoDialogOpen] = useState<boolean>(false);
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedLogoPreview, setSelectedLogoPreview] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const [selectedBannerPreview, setSelectedBannerPreview] = useState<{
    id: string;
    url: string;
  } | null>(null);
  const handleRouter = () => {
    router.push("/admin/brand");
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      status: true,
      slug: "",
      files: {
        logoImage: {
          id: 0,
        },
        bannerImage: {
          id: 0,
        },
      },
      meta: {
        metaTitle: "",
        metaDescription: "",
      },
    },
  });


  const handleLogoPreviewSelect = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setSelectedLogoPreview({ url: imageId.url, id: imageId.id });
    form.setValue("files.logoImage", { id: Number(imageId.id) }); // Set as object with number
    form.trigger("files.logoImage");
  };
  
  const handleBannerPreviewSelect = (imageId: any) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setSelectedBannerPreview({ url: imageId.url, id: imageId.id });
    form.setValue("files.bannerImage", { id: Number(imageId.id) }); // Set as object with number
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
  const router = useRouter();
  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    try {
      setIsLoading(true);

      // Transform the data to match API expectations
      const formData = {
        name: data.name,
        status: data.status,
        slug: data.slug,
        files: {
          logoImage: data.files.logoImage.id, // Send just the ID
          bannerImage: data.files.bannerImage.id, // Send just the ID
        },
        meta: {
          metaTitle: data.meta.metaTitle,
          metaDescription: data.meta.metaDescription,
        },
      };

      console.log("Transformed data being sent:", formData);

      const response = await clientSideFetch({
        url: "/brand/create",
        debug: true,
        toast: toast,
        method: "post",
        body: formData,
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
    <div className="w-full  border p-4 rounded-lg">
      <div className="py-4">
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={handleRouter}
            variant="outline"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Add Brand</h1>
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
                      <FormLabel className="text-base font-medium">
                        Brand Name
                      </FormLabel>
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
                      <FormLabel className="text-base font-medium">
                        Brand Slug
                      </FormLabel>
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
                      <FormLabel className="text-base font-medium">
                        Status
                      </FormLabel>
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
                      <FormLabel className="text-base font-medium">
                        Meta Title
                      </FormLabel>
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
                    <FormLabel className="text-base font-medium">
                      Meta Description
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        spellCheck={true}
                        className="focus:border-blue-500 focus:outline-none border border-gray-300 rounded-md p-2"
                        placeholder="SEO Meta Description"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-between items-center">
              {/* Logo Image */}
              <div className=" flex-1">
                <FormField
                  control={form.control}
                  name="files.logoImage.id"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-base font-medium">
                          Logo Image
                        </FormLabel>
                        <FormControl>
                          <Dialog
                            open={isLogoDialogOpen}
                            onOpenChange={setIsLogoDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex flex-row gap-2 px-1 py-1 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span className="text-xs">Upload</span>
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                              <Tabs
                                onLogoClick={handleLogoPreviewSelect}
                                setIsSheetOpen={setIsLogoDialogOpen}
                              />
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                      </div>
                      <div
                        className="mt-4 border-2 rounded-md p-2  "
                        style={{
                          width: "150px",
                          overflow: "hidden",
                          height: "150px",
                        }}
                      >
                        {" "}
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
                      <div className="flex flex-row gap-2">
                        <FormLabel className="text-base font-medium">
                          Banner Image
                        </FormLabel>
                        <FormControl>
                          <Dialog
                            open={isBannerDialogOpen}
                            onOpenChange={setIsBannerDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="flex flex-row gap-2 px-1 py-1 h-8"
                              >
                                <MdOutlineFileUpload />
                                <span className="text-xs">Upload</span>
                              </Button>
                            </DialogTrigger>

                            <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                              <Tabs
                                onLogoClick={handleBannerPreviewSelect}
                                setIsSheetOpen={setIsBannerDialogOpen}
                              />
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                      </div>
                      <div
                        className="mt-4 border-2 rounded-md p-2  "
                        style={{
                          width: "150px",
                          height: "150px",
                          overflow: "hidden",
                        }}
                      >
                        {" "}
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

            {/* Submit */}
            <Button
              disabled={isLoading}
              type="submit"
              className="w-fit py-2 hover:bg-blue-600 bg-blue-600"
            >
              {isLoading ? "Please wait..." : "ADD BRAND"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default RootLayout;
