"use client";

import { z } from "zod";
import { UseFormReturn, useWatch } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formSchema } from "../../add/page";
import { Dispatch, SetStateAction } from "react";
import { SheetTrigger } from "@/components/ui/sheet";
import { DialogTrigger } from "@/components/ui/dialog";
import { CiCirclePlus } from "react-icons/ci";
import { X } from "lucide-react";
import Image from "next/image";
import FetchImage from "@/components/ui/fetchImage";
import FetchVideo from "@/components/ui/fetchVideo";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const NoVariantsImages = ({
  form,
  setBaseOrAdditional,
  setUploadedImages,
  setIsVariant,
  setIsColorImagesEditing,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setBaseOrAdditional: Dispatch<
    SetStateAction<"base" | "additional" | "descriptions">
  >;
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
  setIsVariant: Dispatch<SetStateAction<boolean>>;
  setIsColorImagesEditing: Dispatch<SetStateAction<boolean>>;
}) => {
  const baseImage = form.getValues("files.baseImage");
  const additionalImage = form.getValues("files.additionalImage");
  const descriptionVideo = form.getValues("files.descriptionVideo");
  // console.log("uplod image video is selected",uploa)
  const base = useWatch({
    control: form.control,
    name: "files",
  });


  const handleRemove = (id: string) => {
    const updatedIds = additionalImage.filter((idx) => idx !== id);
    form.setValue("files.additionalImage", updatedIds);
  };
  const handleRemoves = (id: string) => {
    const updatedIds = descriptionVideo.filter((idx) => idx !== id);
    form.setValue("files.descriptionVideo", updatedIds);
  };
  // const handleRemoveVideo = () => {
  //   form.setValue("files.descriptionVideo", [])
  // }

  form.watch("files");
  return (
    <div className="rounded bg-white p-5 mt-4">
      <h2 className="font-medium mb-4">Product Images</h2>
      {/* <FormField
        control={form.control}
        name="files.baseImage"
        render={({ field }) => (
          <FormItem>
            <div className=" mt-4 gap-4 items-start justify-end">
              <div className=" mt-3">
                <FormLabel className="font-normal">
                  Featured Image <span className="text-red-600">*</span>
                </FormLabel>
                <FormDescription className="mt-1 text-sm">
                  It's the first and primary image that users see when viewing a
                  product page or listing.
                </FormDescription>
              </div>
              <div className="mt-4">
                <FormControl>
                  <DialogTrigger
                    onClick={() => {
                      setBaseOrAdditional("base");
                      setIsColorImagesEditing(false);
                      setIsVariant(false);
                      setUploadedImages([form.getValues("files.baseImage")]);
                    }}
                  >
                    <div className="h-[110px] w-[110px] border border-purple-800 border-dashed flex items-center justify-center">
                      {baseImage ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <FetchImage id={baseImage} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Click on the image to change it
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <CiCirclePlus className="h-12 w-12 text-purple-600" />
                      )}
                    </div>
                  </DialogTrigger>
                </FormControl>
                <FormMessage className="font-normal mt-2" />
              </div>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="files.additionalImage"
        render={({ field }) => (
          <FormItem>
            <div className=" mt-6 gap-4 items-start justify-end">
              <div className=" mt-3">
                <FormLabel className="font-normal">Additional Images</FormLabel>
                <FormDescription className="mt-1 text-sm">
                  Secondary images offer various perspectives and close-up views
                  to help customers better understand the product.
                </FormDescription>
              </div>
              <div className="mt-4">
                <div className="grid grid-cols-8 gap-4 items-center">
                  {additionalImage &&
                    additionalImage.map((id) => {
                      return (
                        <div
                          key={id}
                          className="p-4 relative h-[90px] w-[90px] border border-purple-800 border-dashed flex items-center justify-center"
                        >
                          <FetchImage
                            id={id}
                            className="h-[70px] w-[70px] object-contain"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleRemove(id)}
                            className="absolute top-1 right-1 bg-gray-500 text-white rounded-full p-2 h-5 w-5 grid place-content-center"
                            title="remove"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  <FormControl>
                    <SheetTrigger
                      onClick={() => {
                        setBaseOrAdditional("additional");
                        setIsColorImagesEditing(false);
                        setIsVariant(false);
                        setUploadedImages(
                          form.getValues("files.additionalImage")
                        );
                      }}
                      disabled={additionalImage.length >= 8}
                    >
                      <div
                        className={`${
                          additionalImage.length >= 8 && "hidden"
                        } h-[90px] w-[90px] border border-purple-800 border-dashed flex items-center justify-center`}
                      >
                        <CiCirclePlus className="h-12 w-12 text-purple-600" />
                      </div>
                    </SheetTrigger>
                  </FormControl>
                </div>
                <FormMessage className="font-normal mt-2" />
              </div>
            </div>
          </FormItem>
        )}
      /> */}
      <FormField
        control={form.control}
        name="files.descriptionVideo"
        render={({ field }) => (
          <FormItem>
            <div className=" mt-6 gap-4 items-start justify-end">
              <div className=" mt-3">
                <FormLabel className="font-normal">Description Video</FormLabel>
                <FormDescription className="mt-1 text-sm">
                  This video will be shown in the product details.
                </FormDescription>
              </div>
              <div className="mt-4">
                <FormControl>
                  <DialogTrigger
                    onClick={() => {
                      setBaseOrAdditional("descriptions");
                      setIsColorImagesEditing(false);
                      setIsVariant(false);
                      setUploadedImages([
                        form.getValues("files.descriptionVideo"),
                      ]);
                    }}
                  >
                    <div className="h-[110px] w-[110px] border border-purple-800 border-dashed flex items-center justify-center">
                      {descriptionVideo && descriptionVideo.length > 0 ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              <FetchVideo id={descriptionVideo} />
                            </TooltipTrigger>
                            <TooltipContent>
                              Click on the image to change it
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <CiCirclePlus className="h-12 w-12 text-purple-600" />
                      )}
                    </div>
                  </DialogTrigger>
                </FormControl>
                <FormMessage className="font-normal mt-2" />
              </div>
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};

export default NoVariantsImages;
