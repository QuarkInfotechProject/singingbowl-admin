"use client";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { formSchema } from "../../add/page";
import {
  Dispatch,
  SetStateAction,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { DialogTrigger } from "@/components/ui/dialog";
import { CiCirclePlus } from "react-icons/ci";
import { X } from "lucide-react";
import FetchImage from "@/components/ui/fetchImage";
import FetchVideo from "@/components/ui/fetchVideo";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

export interface Root {
  baseImage?: RootBaseImage | null;
  additionalImage?: RootAdditionalImage[] | null;
  descriptionVideo?: RootDescriptionVideo[] | null;
}

export interface RootBaseImage {
  id: number;
  baseImageurl: string;
}

export interface RootAdditionalImage {
  id: number;
  additionalImageurl: string;
}

export interface RootDescriptionVideo {
  id: number;
  videoUrl?: string;
  descriptionVideoUrl?: string;
}

interface NoVariantsImagesProps {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setBaseOrAdditional: Dispatch<
    SetStateAction<"base" | "additional" | "descriptions">
  >;
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
  setIsVariant: Dispatch<SetStateAction<boolean>>;
  setIsColorImagesEditing: Dispatch<SetStateAction<boolean>>;
  defaultImages?: Root | null;
}

const MAX_ADDITIONAL_IMAGES = 10;

const NoVariantsImages = ({
  form,
  setBaseOrAdditional,
  setUploadedImages,
  setIsVariant,
  setIsColorImagesEditing,
  defaultImages,
}: NoVariantsImagesProps) => {
  // Form values with safe defaults - use form.watch to ensure reactivity
  const watchedFiles = form.watch("files");
  const baseImage = watchedFiles?.baseImage;
  const additionalImages = watchedFiles?.additionalImage || [];
  const descriptionVideo = watchedFiles?.descriptionVideo || [];

  // State for managing edits and URL mapping
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [imageurlMap, setImageurlMap] = useState<Record<number, string>>({});
  
  // Add a ref to track if we've initialized from defaultImages
  const initializedRef = useRef(false);

  // Initialize form values and URL mapping from defaultImages ONLY ONCE
  useEffect(() => {
    const initializeFormData = () => {
      // Only initialize if we haven't done so before and defaultImages exists
      if (initializedRef.current || !defaultImages) {
        return;
      }

      const urlMap: Record<number, string> = {};

      // Initialize base image
      if (
        defaultImages.baseImage?.id &&
        defaultImages.baseImage?.baseImageurl
      ) {
        form.setValue("files.baseImage", defaultImages.baseImage.id);
        urlMap[defaultImages.baseImage.id] =
          defaultImages.baseImage.baseImageurl;
      } else {
        form.setValue("files.baseImage", null);
      }

      // Initialize additional images
      if (
        Array.isArray(defaultImages.additionalImage) &&
        defaultImages.additionalImage.length > 0
      ) {
        const validAdditionalImages = defaultImages.additionalImage
          .filter((item) => item?.id && item?.additionalImageurl)
          .map((item) => {
            urlMap[item.id] = item.additionalImageurl;
            return item.id;
          });
        form.setValue("files.additionalImage", validAdditionalImages);
      } else {
        form.setValue("files.additionalImage", []);
      }

      // Initialize description video
      if (
        Array.isArray(defaultImages.descriptionVideo) &&
        defaultImages.descriptionVideo.length > 0
      ) {
        const validVideos = defaultImages.descriptionVideo
          .filter(
            (item) => item?.id && (item?.videoUrl || item?.descriptionVideoUrl)
          )
          .map((item) => {
            urlMap[item.id] = item.videoUrl || item.descriptionVideoUrl || "";
            return item.id;
          });
        form.setValue("files.descriptionVideo","");
      } else {
        form.setValue("files.descriptionVideo", "");
      }

      setImageurlMap(urlMap);
      initializedRef.current = true; // Mark as initialized
    };

    initializeFormData();
  }, [defaultImages, form]); // Keep dependencies but use ref to prevent re-initialization

  // Handle removing additional image - prevent re-rendering issues
  const handleRemoveAdditionalImage = useCallback(
    (id: number) => {
      // Remove from URL map first to prevent fetching
      setImageurlMap((prev) => {
        const newMap = { ...prev };
        delete newMap[id];
        return newMap;
      });

      // Then update form value
      const currentImages = form.getValues("files.additionalImage") || [];
      const updatedImages = currentImages.filter((imgId) => imgId !== id);
      form.setValue("files.additionalImage", updatedImages);
    },
    [form]
  );

  // Handle drag and drop reordering
  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const currentImages = form.getValues("files.additionalImage") || [];
      const reorderedImages = [...currentImages];
      const [movedImage] = reorderedImages.splice(result.source.index, 1);
      reorderedImages.splice(result.destination.index, 0, movedImage);

      form.setValue("files.additionalImage", reorderedImages);
    },
    [form]
  );

  // Handle base image selection/replacement
  const handleBaseImageSelect = useCallback(
    (newId: string, newUrl?: string) => {
      const numericId = parseInt(newId, 10);
      const oldId = form.getValues("files.baseImage");

      form.setValue("files.baseImage", numericId);

      setImageurlMap((prev) => {
        const newMap = { ...prev };
        if (oldId && oldId !== numericId) delete newMap[oldId];
        if (newUrl) newMap[numericId] = newUrl;
        return newMap;
      });
    },
    [form]
  );

  // Handle video selection/replacement
  const handleVideoSelect = useCallback(
    (newId: string, newUrl?: string) => {
      const numericId = parseInt(newId, 10);
      const oldIds = form.getValues("files.descriptionVideo") || [];

      form.setValue("files.descriptionVideo", [numericId]);

      setImageurlMap((prev) => {
        const newMap = { ...prev };
        oldIds.forEach((oldId) => {
          if (oldId && oldId !== numericId) delete newMap[oldId];
        });
        if (newUrl) newMap[numericId] = newUrl;
        return newMap;
      });
    },
    [form]
  );

  // Handle adding new additional image
  const handleAddNewImage = useCallback(
    (newId: string, newUrl?: string) => {
      const numericId = parseInt(newId, 10);
      const currentImages = form.getValues("files.additionalImage") || [];

      // Check if we're at the maximum limit
      if (currentImages.length >= MAX_ADDITIONAL_IMAGES) {
        return;
      }

      const updatedImages = [...currentImages, numericId];

      form.setValue("files.additionalImage", updatedImages);

      if (newUrl) {
        setImageurlMap((prev) => ({
          ...prev,
          [numericId]: newUrl,
        }));
      }
    },
    [form]
  );

  // Handle updating existing additional image
  const handleUpdateExistingImage = useCallback(
    (newId: string, newUrl?: string, index: number) => {
      const numericId = parseInt(newId, 10);
      const currentImages = form.getValues("files.additionalImage") || [];
      const updatedImages = [...currentImages];
      const oldId = updatedImages[index];

      updatedImages[index] = numericId;
      form.setValue("files.additionalImage", updatedImages);

      setImageurlMap((prev) => {
        const newMap = { ...prev };
        if (oldId && oldId !== numericId) delete newMap[oldId];
        if (newUrl) newMap[numericId] = newUrl;
        return newMap;
      });

      setEditIndex(null);
    },
    [form]
  );

  // Main image selection router
  const handleImageSelect = useCallback(
    (newId: string, newUrl?: string) => {
      if (editIndex === -1) {
        // Replace base image
        handleBaseImageSelect(newId, newUrl);
      } else if (editIndex === -2) {
        handleVideoSelect(newId, newUrl);
      } else if (typeof editIndex === "number" && editIndex >= 0) {
        handleUpdateExistingImage(newId, newUrl, editIndex);
      } else {
        // Only add new image if editIndex is null
        handleAddNewImage(newId, newUrl);
      }

      // Always reset after image is processed
      setEditIndex(null);
    },
    [
      editIndex,
      handleBaseImageSelect,
      handleVideoSelect,
      handleUpdateExistingImage,
      handleAddNewImage,
    ]
  );

  // Image display component with URL fallback
  const ImageDisplay = useCallback(
    ({ id, className }: { id: number; className?: string }) => {
      const imageurl = imageurlMap[id];

      // If we have a cached URL, use it
      if (imageurl) {
        return (
          <img
            src={imageurl}
            alt="Product"
            className={className || "h-full w-full object-contain"}
            loading="lazy"
            onError={() => console.warn(`Failed to load image: ${imageurl}`)}
          />
        );
      }

      // For new images without cached URLs, fetch them
      return <FetchImage id={id.toString()} className={className} />;
    },
    [imageurlMap]
  );

  // Video display component with URL fallback
  const VideoDisplay = useCallback(
    ({ id }: { id: number }) => {
      const videoUrl = imageurlMap[id];

      // If we have a cached URL, use it
      if (videoUrl) {
        return (
          <video
            src={videoUrl}
            className="h-full w-full object-contain"
            controls={false}
          />
        );
      }

      // For new videos without cached URLs, fetch them
      return <FetchVideo id={id.toString()} />;
    },
    [imageurlMap]
  );

  // Handle media library opening for different types
  const openMediaLibrary = useCallback(
    (
      type: "base" | "additional" | "descriptions",
      index: number | null = null
    ) => {
      setBaseOrAdditional(type);
      setIsColorImagesEditing(false);
      setIsVariant(false);
      setUploadedImages([]);

      if (type === "base") {
        setEditIndex(-1);
      } else if (type === "descriptions") {
        setEditIndex(-2);
      } else if (index !== null) {
        setEditIndex(index);
      } else {
        setEditIndex(null);
      }
    },
    [setBaseOrAdditional, setIsColorImagesEditing, setIsVariant, setUploadedImages]
  );

  // Watch form changes - remove this since we're using form.watch above
  // form.watch("files");

  return (
    <div className="rounded bg-white p-5 mt-4">
      <h2 className="font-medium mb-4">Product Images</h2>

      {/* Featured Image */}
      <FormField
        control={form.control}
        name="files.baseImage"
        render={() => (
          <FormItem>
            <div className="mt-4">
              <div className="mt-3">
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
                  <DialogTrigger onClick={() => openMediaLibrary("base")}>
                    <div className="h-[110px] w-[110px] border border-purple-800 border-dashed flex items-center justify-center cursor-pointer hover:border-purple-600 transition-colors">
                      {baseImage ? (
                        <div className="h-full w-full flex items-center justify-center">
                          <ImageDisplay id={baseImage} />
                        </div>
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

      {/* Additional Images */}
      <FormField
        control={form.control}
        name="files.additionalImage"
        render={() => (
          <FormItem>
            <div className="mt-6">
              <div className="mt-3">
                <FormLabel className="font-normal">Additional Images</FormLabel>
                <FormDescription className="mt-1 text-sm">
                  Secondary images offer various perspectives and close-up views
                  to help customers better understand the product.
                </FormDescription>
              </div>

              <div className="mt-4">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable
                    droppableId="additionalImages"
                    direction="horizontal"
                  >
                    {(provided) => (
                      <div
                        className="grid grid-cols-6 gap-28  md:grid-cols-8 lg:grid-cols-12 "
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                      >
                        {additionalImages.map((id, index) => (
                          <Draggable
                            draggableId={id.toString()}
                            index={index}
                            key={id}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`relative h-[90px] w-[90px]  border border-purple-800 border-dashed flex items-center justify-center cursor-pointer transition-all ${snapshot.isDragging
                                    ? "shadow-lg scale-105"
                                    : "hover:border-purple-600"
                                  }`}
                              >
                                <div className="h-[70px] w-[70px] flex items-center justify-center">
                                  <ImageDisplay
                                    id={id}
                                    className="h-full w-full object-contain"
                                  />
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemoveAdditionalImage(id);
                                  }}
                                  className="absolute -top-2 -right-2 bg-gray-200 text-black rounded-full p-1 h-5 w-5 flex items-center justify-center transition-colors"
                                  title="Remove image"
                                >
                                  <X className="h-3 w-3" />
                                </button>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}

                        {additionalImages.length < MAX_ADDITIONAL_IMAGES && (
                          <FormControl>
                            <DialogTrigger
                              onClick={() =>
                                openMediaLibrary("additional", null)
                              }
                            >
                              <div className="h-[90px] w-[90px] border border-purple-800 border-dashed flex items-center justify-center cursor-pointer hover:border-purple-600 transition-colors">
                                <CiCirclePlus className="h-8 w-8 text-purple-600" />
                              </div>
                            </DialogTrigger>
                          </FormControl>
                        )}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
                <FormMessage className="font-normal mt-2" />
                <p className="text-xs text-gray-500 mt-1">
                  {additionalImages.length} of {MAX_ADDITIONAL_IMAGES} images
                  added
                </p>
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Description Video */}
      <FormField
        control={form.control}
        name="files.descriptionVideo"
        render={() => (
          <FormItem>
            <div className="mt-6">
              <div className="mt-3">
                <FormLabel className="font-normal">Description Video</FormLabel>
                <FormDescription className="mt-1 text-sm">
                  This video will be shown in the product details.
                </FormDescription>
              </div>
              <div className="mt-4">
                <FormControl>
                  <DialogTrigger
                    onClick={() => openMediaLibrary("descriptions")}
                  >
                    <div className="h-[110px] w-[110px] border border-purple-800 border-dashed flex items-center justify-center cursor-pointer hover:border-purple-600 transition-colors">
                      {descriptionVideo.length > 0 ? (
                        <div className="h-full w-full flex items-center justify-center">
                          <VideoDisplay id={descriptionVideo[0]} />
                        </div>
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