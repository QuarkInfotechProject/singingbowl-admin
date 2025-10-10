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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { MdOutlineFileUpload } from "react-icons/md";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";
import Productselect from "../../_components/Productselect";
import Colorselect from "../../_components/Colorselect";
import { Switch } from "@/components/ui/switch";
import ProductSort from "../../_components/ProductSort";
interface ImagePreview {
  id: string;
  url: string;
}
const FormSchema = z
  .object({
    campaign_name: z
      .string()
      .nonempty({ message: "Campaign name is required" }),
    start_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid start date format",
    }),
    end_date: z.string().refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end date format",
    }),
    theme_color: z.number().min(1, { message: "Theme color is required" }),

    text_color: z.number().min(1, { message: "Text color is required" }),

    product_id: z
      .array(z.string())
      .nonempty({ message: "At least one product is required." }),
    files: z.object({
      desktopBanner: z
        .number()
        .min(1, { message: "DesktopBanner Image is required." }),
      mobileBanner: z
        .number()
        .min(1, { message: "MobileBanner Image is required" }),
    }),
  })
  .refine(
    (data) => {
      const startDate = new Date(data.start_date);
      const endDate = new Date(data.end_date);
      return endDate > startDate;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    }
  );
const RootLayout = ({ data }: { data: any }) => {
  const [isDesktopDialogOpen, setIsDesktopDialogOpen] =
    useState<boolean>(false);
  const [isMobileDialogOpen, setIsMobileDialogOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showSort, setShowSort] = useState<boolean>(false);
  const [selectedLogoPreview, setSelectedLogoPreview] =
    useState<ImagePreview | null>(
      data?.data?.files?.desktopBanner
        ? {
            id: data.data.files.desktopBanner.id,
            url: data.data.files.desktopBanner.url,
          }
        : null
    );
  const [selectedBannerPreview, setSelectedBannerPreview] =
    useState<ImagePreview | null>(
      data?.data?.files?.mobileBanner
        ? {
            id: data.data.files.mobileBanner.id,
            url: data.data.files.mobileBanner.url,
          }
        : null
    );

  const router = useRouter();
  const handleRouter = () => {
    router.push("/admin/flash-sale");
  };
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaign_name: data.data?.campaign_name,
      start_date: data.data.start_date,
      end_date: data.data.end_date,
      theme_color: data.data.theme_color.id,
      text_color: data.data.text_color.id,
      product_id: data.data.product_id,
      files: {
        desktopBanner: data.data.files.desktopBanner.id,
        mobileBanner: data.data.files.mobileBanner.id,
      },
    },
  });
  const handleLogoPreviewSelect = (imageId: ImagePreview) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setSelectedLogoPreview({ url: imageId.url, id: imageId.id });
    form.setValue("files.desktopBanner", imageId.id);
    form.trigger("files.desktopBanner");
  };

  const handleBannerPreviewSelect = (imageId: ImagePreview) => {
    if (!imageId || !imageId.id || !imageId.url) {
      console.warn("Invalid imageId or missing properties");
      return;
    }
    setSelectedBannerPreview({ url: imageId.url, id: imageId.id });
    form.setValue("files.mobileBanner", imageId.id);
    form.trigger("files.mobileBanner");
  };

  const handleRemoveLogoImage = () => {
    setSelectedLogoPreview(null);
    form.setValue("files.desktopBanner", "");
    form.trigger("files.desktopBanner");
  };

  const handleRemoveBannerImage = () => {
    setSelectedBannerPreview(null);
    form.setValue("files.mobileBanner", "");
    form.trigger("files.mobileBanner");
  };
  // Submit logic
  const onSubmit = async (formData: z.infer<typeof FormSchema>) => {
    const updateResult = {
      id: data.data.id,
      ...formData,
    };
    try {
      setIsLoading(true);
      const response = await clientSideFetch({
        url: "/flash-sale/update",
        debug: true,
        toast: toast,
        method: "post",
        body: updateResult,
      });

      if (response?.status === 200) {
        toast({
          description:
            response.data.message || "Flash sale Update successfully",
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.push("/admin/flash-sale");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "An unexpected error occurred";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        className: "bg-red-500 text-white",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="w-full border p-4 rounded-lg">
      <div className="py-4 flex justify-between items-center">
        <div className="flex flex-row items-center gap-2">
          <Button
            onClick={handleRouter}
            variant="outline"
            size="icon"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Add Flash Sales</h1>
        </div>
        <div className="flex justify-center items-center space-x-4">
          <p className="font-semibold text-base">Sort:</p>
          <Switch
            checked={showSort}
            onCheckedChange={() => setShowSort((prev) => !prev)}
          />{" "}
        </div>
      </div>
      <div className="mt-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full space-y-6 gap-y-5"
          >
            <div className="w-full md:flex-1">
              <FormField
                control={form.control}
                name="campaign_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Campaign Name
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Enter campaign name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            {showSort && (
              <ProductSort
                productIds={data.data.product_id}
                fetchUrl="/products?per_page=1000000"
                updateUrl={`/flash-sale/sort-order/${data.data.id}`}
                showDragOrder={true}
                isDrag={false}
              />
            )}
            <div className="w-full md:flex-1">
              <FormField
                control={form.control}
                name="product_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-base font-medium">
                      Select Product
                    </FormLabel>
                    <FormControl>
                      <Productselect field={field} form={form} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Start Date and End Date */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
              <div className="w-full md:flex-1">
                <FormField
                  control={form.control}
                  name="start_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Start Date
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:flex-1">
                <FormField
                  control={form.control}
                  name="end_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        End Date
                      </FormLabel>
                      <FormControl>
                        <Input type="datetime-local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Color Fields */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
              <div className="w-full md:flex-1">
                <FormField
                  control={form.control}
                  name="text_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Text Color
                      </FormLabel>
                      <FormControl>
                        <Colorselect field={field} form={form} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="w-full md:flex-1">
                <FormField
                  control={form.control}
                  name="theme_color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-medium">
                        Theme Color
                      </FormLabel>
                      <FormControl>
                        <Colorselect field={field} form={form} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Image Selection */}
            <div className="flex flex-col md:flex-row justify-between md:items-center gap-5">
              {/* Desktop Image */}
              <div className="w-full md:flex-1">
                <FormField
                  control={form.control}
                  name="files.desktopBanner"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2 items-center">
                        <FormLabel className="text-base font-medium">
                          Desktop Image
                        </FormLabel>
                        <FormControl>
                          <Dialog
                            open={isDesktopDialogOpen}
                            onOpenChange={setIsDesktopDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                type="button"
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
                                setIsSheetOpen={setIsDesktopDialogOpen}
                              />
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                      </div>
                      <div className="mt-4 border-2 rounded-md p-2 w-full md:w-40 h-40 flex items-center justify-center">
                        {selectedLogoPreview ? (
                          <div className="relative overflow-hidden flex justify-center items-center w-full h-full">
                            <Image
                              src={selectedLogoPreview.url}
                              alt="Desktop Banner"
                              layout="responsive"
                              width={100}
                              height={100}
                              objectFit="contain"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveLogoImage}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                            >
                              <FaTimes className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            No image selected
                          </div>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Mobile Banner Image */}
              <div className="w-full md:flex-1">
                <FormField
                  control={form.control}
                  name="files.mobileBanner"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex flex-row gap-2 items-center">
                        <FormLabel className="text-base font-medium">
                          Mobile Banner
                        </FormLabel>
                        <FormControl>
                          <Dialog
                            open={isMobileDialogOpen}
                            onOpenChange={setIsMobileDialogOpen}
                          >
                            <DialogTrigger asChild>
                              <Button
                                type="button"
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
                                setIsSheetOpen={setIsMobileDialogOpen}
                              />
                            </DialogContent>
                          </Dialog>
                        </FormControl>
                      </div>
                      <div className="mt-4 border-2 rounded-md p-2 w-full md:w-40 h-40 flex items-center justify-center">
                        {selectedBannerPreview ? (
                          <div className="relative overflow-hidden flex justify-center items-center w-full h-full">
                            <Image
                              src={selectedBannerPreview.url}
                              alt="Mobile Banner"
                              layout="responsive"
                              width={100}
                              height={100}
                              objectFit="contain"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveBannerImage}
                              className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full"
                            >
                              <FaTimes className="h-3 w-3" />
                            </button>
                          </div>
                        ) : (
                          <div className="text-gray-400 text-sm">
                            No image selected
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
