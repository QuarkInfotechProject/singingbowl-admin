import {
  SetStateAction,
  useState,
  Dispatch,
  useEffect,
  useCallback,
} from "react";
import { UseFormReturn, useFieldArray, useWatch } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../add/page";
import { SheetTrigger } from "@/components/ui/sheet";
import { DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OptionValueT } from "../AllImages";
import { X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CiCirclePlus } from "react-icons/ci";
import FetchImage from "@/components/ui/fetchImage";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FaTrash } from "react-icons/fa";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import VariantDetails from "./VariantDetailOld";
import VariantDetailss from "./VariantDetail";
import VariantForm from "./VariantForm";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";

interface SelectColorOptionsT {
  id: number;
  name: string;
  hexCode: string;
  status: number;
}

// Type for image objects in your form
interface ImageObject {
  id: number;
  url: string;
}

const VariantOptions = ({
  form,
  colorValues,
  setColorValues,
  setIsVariant,
  setBaseOrAdditional,
  setUploadedImages,
  isColor,
  isColorImagesEditing,
  valueIndex,
  setIsColorImagesEditing,
  setValueIndex,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  setColorValues: Dispatch<SetStateAction<OptionValueT>>;
  setIsVariant: Dispatch<SetStateAction<boolean>>;
  setBaseOrAdditional: Dispatch<SetStateAction<"base" | "additional">>;
  setUploadedImages: Dispatch<SetStateAction<string[]>>;
  colorValues: OptionValueT;
  isColor: boolean;
  isColorImagesEditing: boolean;
  setIsColorImagesEditing: Dispatch<SetStateAction<boolean>>;
  valueIndex: number;
  setValueIndex: Dispatch<SetStateAction<number>>;
}) => {
  const { toast } = useToast();

  // Use useWatch instead of getValues
  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  });

  const { fields, append, remove } = useFieldArray({
    name: "options.0.values",
    control: form.control,
  });

  // Watch color values in real-time
  const watchedColorValues = useWatch({
    control: form.control,
    name: "options.0.values",
    defaultValue: [],
  });

  const [selectColorOptions, setSelectColorOptions] = useState<
    SelectColorOptionsT[]
  >([]);
  const [takenColors, setTakenColors] = useState<string[]>([]);
  const [takenCombined, setTakenCombined] = useState<string[]>([]);

  // Watch for changes in color values
  useEffect(() => {
    if (isColor && watchedColorValues) {
      const takenColorss = watchedColorValues.map((item) => item.optionName);
      setTakenColors(takenColorss);

      const takenHex = watchedColorValues.map((item) => item.optionData);
      const combined = takenColorss.map(
        (item, index) => `${item} ${takenHex[index]}`
      );
      setTakenCombined(combined);
    }
  }, [watchedColorValues, isColor]);

  useEffect(() => {
    const getColors = async () => {
      try {
        const response = await clientSideFetch({
          url: `/colors`,
          method: "post",
          toast: toast,
          debug: true,
          body: null,
        });
        if (response?.status === 200) {
          setSelectColorOptions(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching colors:", error);
      }
    };
    getColors();
  }, [toast]);

  // Helper function to get image URL from image object or string
  const getImageUrl = (imageData: ImageObject | string): string => {
    if (!imageData) return "";
    if (typeof imageData === "string") {
      if (imageData.startsWith("http") || imageData.startsWith("/")) {
        return imageData;
      }
      return "";
    }
    if (typeof imageData === "object" && imageData?.url) {
      return imageData.url;
    }

    return "";
  };

  // Helper function to get image ID from image object or string
  const getImageId = (imageData: ImageObject | string): string => {
    if (!imageData) return "";

    if (typeof imageData === "object" && imageData?.id) {
      return imageData.id.toString();
    }

    if (typeof imageData === "string") {
      return imageData;
    }

    return "";
  };

  // Check if image is a new upload (string ID) vs existing image (object with URL)
  const isNewImage = (imageData: ImageObject | string): boolean => {
    return typeof imageData === "string";
  };

  // Handle image updates from the upload component
  const handleImageUpdate = (
    images: string[],
    isBase: boolean,
    valueIdx?: number
  ) => {
    if (isColorImagesEditing && valueIdx !== undefined) {
      if (isBase) {
        form.setValue(
          `options.0.values.${valueIdx}.files.baseImage`,
          images[0] || ""
        );
        form.trigger(`options.0.values.${valueIdx}.files.baseImage`);
      } else {
        const currentImages =
          form.getValues(
            `options.0.values.${valueIdx}.files.additionalImage`
          ) || [];
        const newImages = [...currentImages, ...images];
        form.setValue(
          `options.0.values.${valueIdx}.files.additionalImage`,
          newImages
        );
        form.trigger(`options.0.values.${valueIdx}.files.additionalImage`);
      }
    } else {
      if (isBase) {
        setColorValues((prev) => ({
          ...prev,
          files: {
            ...prev.files,
            baseImage: images[0] || "",
            additionalImage: prev.files?.additionalImage || [],
          },
        }));
      } else {
        setColorValues((prev) => {
          const currentImages = prev.files?.additionalImage || [];
          const newImages = [...currentImages, ...images];
          return {
            ...prev,
            files: {
              ...prev.files,
              baseImage: prev.files?.baseImage || "",
              additionalImage: newImages,
            },
          };
        });
      }
    }
  };

  // Handle drag and drop for reordering images
  const handleDragEnd = useCallback(
    (result: DropResult, valueIndex?: number) => {
      if (!result.destination) return;
      const { source, destination } = result;
      if (valueIndex !== undefined) {
        const currentImages =
          form.getValues(
            `options.0.values.${valueIndex}.files.additionalImage`
          ) || [];
        const reorderedImages = Array.from(currentImages);
        const [removed] = reorderedImages.splice(source.index, 1);
        reorderedImages.splice(destination.index, 0, removed);
        form.setValue(
          `options.0.values.${valueIndex}.files.additionalImage`,
          reorderedImages
        );
        form.trigger(`options.0.values.${valueIndex}.files.additionalImage`);
      } else {
        setColorValues((prev) => {
          const currentImages = prev.files?.additionalImage || [];
          const reorderedImages = Array.from(currentImages);
          const [removed] = reorderedImages.splice(source.index, 1);
          reorderedImages.splice(destination.index, 0, removed);
          return {
            ...prev,
            files: {
              ...prev.files,
              baseImage: prev.files?.baseImage || "",
              additionalImage: reorderedImages,
            },
          };
        });
      }
    },
    [form, setColorValues]
  );

  // Handle removing images from new color values
  const handleRemove = (imageToRemove: ImageObject | string) => {
    setColorValues((prev) => {
      const updatedImages =
        prev.files?.additionalImage?.filter((image) => {
          if (typeof imageToRemove === "string" && typeof image === "string") {
            return image !== imageToRemove;
          }
          if (typeof imageToRemove === "object" && typeof image === "object") {
            return image.id !== imageToRemove.id;
          }
          return true;
        }) || [];

      return {
        ...prev,
        files: {
          baseImage: prev.files?.baseImage || "",
          additionalImage: updatedImages,
        },
      };
    });
  };

  const handleSaveColorValues = () => {
    append(colorValues);
    setColorValues({
      optionName: "",
      optionData: "",
      files: {
        baseImage: "",
        additionalImage: [],
      },
    });
  };
  
  const handleRemoveColorValues = (index: number) => {
    try {
      const currentValues = form.getValues("options.0.values") || [];
      // Create a new array without the item to be removed
      const updatedValues = [...currentValues];
      updatedValues.splice(index, 1);
      // Update the form with the new array
      form.setValue("options.0.values", updatedValues, {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });

      // Force a form update to ensure UI reflects changes
      form.trigger("options.0.values");

      // Update the taken colors state
      const updatedTakenColors = updatedValues.map((item) => item.optionName);
      setTakenColors(updatedTakenColors);

      const updatedTakenHex = updatedValues.map((item) => item.optionData);
      const updatedCombined = updatedTakenColors.map(
        (item, idx) => `${item} ${updatedTakenHex[idx]}`
      );
      setTakenCombined(updatedCombined);

      // Reset the color values state
      setColorValues({
        optionName: "",
        optionData: "",
        files: {
          baseImage: "",
          additionalImage: [],
        },
      });

      // If array is empty, reset the form field
      if (updatedValues.length === 0) {
        form.setValue("options.0.values", [], {
          shouldValidate: true,
          shouldDirty: true,
          shouldTouch: true,
        });
      }
    } catch (error) {
      console.error("Error removing color value:", error);
    }
  };
  const handleColorValueChange = (value: string) => {
    const [name, hexCode] = value.split(" #");
    const formattedHexCode = `#${hexCode}`;

    setColorValues((prev) => ({
      ...prev,
      optionName: name,
      optionData: formattedHexCode,
    }));
  };

  const handleDeleteAdditionalImage = (imageIdx: number, valueIdx: number) => {
    const currentOptions = options || [];
    if (currentOptions[0]?.values?.[valueIdx]?.files?.additionalImage) {
      const updatedImages = currentOptions[0].values[
        valueIdx
      ].files.additionalImage.filter((item, index) => index !== imageIdx);
      form.setValue(
        `options.0.values.${valueIdx}.files.additionalImage`,
        updatedImages
      );
      form.trigger(`options.0.values.${valueIdx}.files.additionalImage`);
    }
  };

  // Safe access to options
  const safeOptions = options || [];
  const colorOptions = safeOptions[0]?.values || [];

 

  return (
    <>
      <div className="w-full">
        {isColor ? (
          <>
            <div className="mt-4  border rounded bg-blue-50 p-3">
              <h3 className="mb-4">
                Color Family <span className="text-red-500">*</span>
              </h3>
              {colorOptions.map((item, index) => {
                return (
                  <div
                    key={`${item.optionName}-${index}`}
                    className="flex border p-3 gap-3 mb-4"
                  >
                    <FormField
                      control={form.control}
                      name={`options.0.values.${index}.optionName`}
                      render={({ field }) => (
                        <FormItem>
                          <div>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value || ""}
                              disabled
                            >
                              <FormControl>
                                <SelectTrigger className="w-[200px]">
                                  <SelectValue placeholder="Select Color" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {selectColorOptions.length > 0 &&
                                  selectColorOptions.map((colorItem) => {
                                    return (
                                      <SelectItem
                                        value={`${colorItem.name}`}
                                        key={colorItem.id}
                                        disabled={form
                                          .getValues("options.0.values")
                                          ?.map((item) => item.optionName)
                                          ?.includes(colorItem.name)}
                                      >
                                        <span
                                          style={{
                                            backgroundColor: colorItem.hexCode,
                                          }}
                                          className="h-2 w-2 rounded-full inline-block mr-2"
                                        />
                                        {colorItem.name}
                                      </SelectItem>
                                    );
                                  })}
                              </SelectContent>
                            </Select>
                            <FormMessage className="font-normal mt-2" />
                          </div>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`options.0.values.${index}.optionData`}
                      render={({ field }) => (
                        <FormItem className="hidden">
                          <div>
                            <FormControl>
                              <Input
                                readOnly
                                placeholder="Color hex Value"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage className="font-normal mt-2" />
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Base Image */}
                    <FormField
                      control={form.control}
                      name={`options.0.values.${index}.files.baseImage`}
                      render={({ field }) => (
                        <SheetTrigger
                          onClick={() => {
                            setIsVariant(true);
                            setBaseOrAdditional("base");
                            const imageId = getImageId(field?.value);
                            setUploadedImages(imageId ? [imageId] : []);
                            setIsColorImagesEditing(true);
                            setValueIndex(index);
                          }}
                        >
                          <div className="h-[70px] w-[70px] border border-purple-800 border-dashed flex items-center justify-center">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger type="button">
                                  {field?.value ? (
                                    isNewImage(field.value) ? (
                                      <FetchImage id={field.value} />
                                    ) : (
                                      <img
                                        src={getImageUrl(field.value)}
                                        alt="Base"
                                        className="h-[70px] w-[70px] object-cover rounded"
                                        onError={(e) => {
                                          console.error(
                                            "Image failed to load:",
                                            getImageUrl(field.value)
                                          );
                                          e.currentTarget.style.display =
                                            "none";
                                        }}
                                      />
                                    )
                                  ) : (
                                    <CiCirclePlus className="h-12 w-12 text-purple-600" />
                                  )}
                                </TooltipTrigger>
                                <TooltipContent>
                                  Click on the image to change it
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                          <p className="text-xs text-center mt-2">Base Image</p>
                        </SheetTrigger>
                      )}
                    />

                    {/* Additional Images */}
                    <div className="overflow-x-auto hide-scrollbar">
                      <DragDropContext
                        onDragEnd={(result) => handleDragEnd(result, index)}
                      >
                        <Droppable
                          droppableId={`additionalImages-${index}`}
                          direction="horizontal"
                        >
                          {(provided) => (
                            <div
                              className="flex w-[700px] gap-4 items-start basis-full"
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              {item.files?.additionalImage?.map(
                                (imageData, imageIdIdx) => {
                                  const imageId = getImageId(imageData);
                                  const imageUrl = getImageUrl(imageData);
                                  return (
                                    <Draggable
                                      draggableId={`${imageId}-${index}-${imageIdIdx}`}
                                      index={imageIdIdx}
                                      key={`${imageId}-${index}-${imageIdIdx}`}
                                    >
                                      {(provided, snapshot) => (
                                        <div
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          {...provided.dragHandleProps}
                                          className={`p-1 relative h-[70px] w-[70px] border border-purple-800 border-dashed flex items-center justify-center ${
                                            snapshot.isDragging
                                              ? "shadow-lg scale-105"
                                              : ""
                                          }`}
                                        >
                                          {isNewImage(imageData) ? (
                                            <FetchImage
                                              id={imageData}
                                              className="h-[70px] w-[70px] object-cover"
                                            />
                                          ) : (
                                            <img
                                              src={imageUrl}
                                              alt={`Additional ${imageIdIdx}`}
                                              className="h-[70px] w-[70px] object-cover rounded"
                                              onError={(e) => {
                                                console.error(
                                                  "Image failed to load:",
                                                  imageUrl
                                                );
                                                e.currentTarget.style.display =
                                                  "none";
                                              }}
                                            />
                                          )}
                                          <button
                                            type="button"
                                            onClick={(e) =>
                                              handleDeleteAdditionalImage(
                                                imageIdIdx,
                                                index
                                              )
                                            }
                                            className="absolute top-1 right-1 bg-gray-500 text-white rounded-full p-2 h-5 w-5 grid place-content-center"
                                            title="remove"
                                          >
                                            <X className="h-4 w-4" />
                                          </button>
                                        </div>
                                      )}
                                    </Draggable>
                                  );
                                }
                              )}
                              {provided.placeholder}
                              <SheetTrigger
                                onClick={() => {
                                  setIsVariant(true);
                                  setBaseOrAdditional("additional");
                                  setIsColorImagesEditing(true);
                                  setValueIndex(index);
                                  if (item.files?.additionalImage) {
                                    const imageIds = item.files.additionalImage
                                      .map((img) => getImageId(img))
                                      .filter((id) => id);
                                    setUploadedImages(imageIds);
                                  } else {
                                    setUploadedImages([]);
                                  }
                                }}
                                disabled={
                                  item.files?.additionalImage &&
                                  item.files?.additionalImage.length >= 8
                                }
                              >
                                <div
                                  className={`${
                                    item.files?.additionalImage &&
                                    item.files?.additionalImage.length >= 8 &&
                                    "hidden"
                                  } h-[70px] w-[70px] border border-purple-800 border-dashed flex items-center justify-center`}
                                >
                                  <CiCirclePlus className="h-12 w-12 text-purple-600" />
                                </div>
                              </SheetTrigger>
                            </div>
                          )}
                        </Droppable>
                      </DragDropContext>
                    </div>

                    <Button
                      type="button"
                      className="ms-auto h-fit w-fit p-2 rounded-full bg-red-500 text-white hover:bg-red-600 hover:text-white"
                      onClick={() => handleRemoveColorValues(index)}
                      title="Delete"
                      variant={"outline"}
                    >
                      <FaTrash />
                    </Button>
                  </div>
                );
              })}

              {/* New Color Selection Section */}
              <div className="flex gap-4 mt-5 bg-white py-5 px-4">
                <div>
                  <Select
                    value={
                      colorValues.optionName
                        ? `${colorValues.optionName} ${colorValues.optionData}`
                        : ""
                    }
                    onValueChange={(value) => handleColorValueChange(value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select Color" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectColorOptions.length > 0 &&
                        selectColorOptions.map((item) => {
                          return (
                            <SelectItem
                              disabled={
                                takenCombined.includes(
                                  `${item.name} ${item.hexCode}`
                                ) || takenColors.includes(item.name)
                              }
                              value={`${item.name} ${item.hexCode}`}
                              key={item.id}
                            >
                              <span
                                style={{ backgroundColor: item.hexCode }}
                                className="h-2 w-2 rounded-full inline-block mr-2"
                              />
                              {item.name}
                            </SelectItem>
                          );
                        })}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex-grow hide-scrollbar overflow-scroll flex gap-5">
                  <SheetTrigger
                    onClick={() => {
                      setIsVariant(true);
                      setBaseOrAdditional("base");
                      if (colorValues.files?.baseImage) {
                        const imageId = getImageId(colorValues.files.baseImage);
                        setUploadedImages(imageId ? [imageId] : []);
                      } else {
                        setUploadedImages([]);
                      }
                      setIsColorImagesEditing(false);
                    }}
                  >
                    <div className="h-[70px] w-[70px] border border-purple-800 border-dashed flex items-center justify-center">
                      {colorValues?.files?.baseImage ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger type="button">
                              {isNewImage(colorValues.files.baseImage) ? (
                                <FetchImage id={colorValues.files.baseImage} />
                              ) : (
                                <img
                                  src={getImageUrl(colorValues.files.baseImage)}
                                  alt="Base"
                                  className="h-[70px] w-[70px] object-cover rounded"
                                  onError={(e) => {
                                    console.error(
                                      "Image failed to load:",
                                      getImageUrl(colorValues.files.baseImage)
                                    );
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
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
                    <p className="text-xs text-center mt-2">Base Image</p>
                  </SheetTrigger>

                  <div className="flex gap-4 mb-6 items-center">
                    <DragDropContext
                      onDragEnd={(result) => handleDragEnd(result)}
                    >
                      <Droppable
                        droppableId="newColorAdditionalImages"
                        direction="horizontal"
                      >
                        {(provided) => (
                          <div
                            className="flex gap-4 items-center"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {colorValues.files?.additionalImage?.map(
                              (imageData, idx) => {
                                const imageId = getImageId(imageData);
                                const imageUrl = getImageUrl(imageData);
                                return (
                                  <Draggable
                                    draggableId={`new-${imageId}-${idx}`}
                                    index={idx}
                                    key={`new-${imageId}-${idx}`}
                                  >
                                    {(provided, snapshot) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        className={`p-4 relative h-[70px] w-[70px] border border-purple-800 border-dashed flex items-center justify-center ${
                                          snapshot.isDragging
                                            ? "shadow-lg scale-105"
                                            : ""
                                        }`}
                                      >
                                        {isNewImage(imageData) ? (
                                          <FetchImage
                                            id={imageData}
                                            className="h-[70px] w-[70px] object-contain"
                                          />
                                        ) : (
                                          <img
                                            src={imageUrl}
                                            alt={`Additional ${idx}`}
                                            className="h-[70px] w-[70px] object-contain rounded"
                                            onError={(e) => {
                                              console.error(
                                                "Image failed to load:",
                                                imageUrl
                                              );
                                              e.currentTarget.style.display =
                                                "none";
                                            }}
                                          />
                                        )}
                                        <button
                                          type="button"
                                          onClick={(e) =>
                                            handleRemove(imageData)
                                          }
                                          className="absolute top-1 right-1 bg-gray-500 text-white rounded-full p-2 h-5 w-5 grid place-content-center"
                                          title="remove"
                                        >
                                          <X className="h-4 w-4" />
                                        </button>
                                      </div>
                                    )}
                                  </Draggable>
                                );
                              }
                            )}
                            {provided.placeholder}
                            <SheetTrigger
                              onClick={() => {
                                setIsVariant(true);
                                setBaseOrAdditional("additional");
                                setIsColorImagesEditing(false);
                                if (colorValues.files?.additionalImage) {
                                  const imageIds =
                                    colorValues.files.additionalImage
                                      .map((img) => getImageId(img))
                                      .filter((id) => id);
                                  setUploadedImages(imageIds);
                                } else {
                                  setUploadedImages([]);
                                }
                              }}
                              disabled={
                                colorValues.files &&
                                colorValues.files.additionalImage.length >= 8
                              }
                            >
                              <div
                                className={`${
                                  colorValues.files &&
                                  colorValues.files.additionalImage.length >=
                                    8 &&
                                  "hidden"
                                } h-[70px] w-[70px] border border-purple-800 border-dashed flex items-center justify-center`}
                              >
                                <CiCirclePlus className="h-12 w-12 text-purple-600" />
                              </div>
                            </SheetTrigger>
                          </div>
                        )}
                      </Droppable>
                    </DragDropContext>
                  </div>
                </div>

                <div>
                  <Button
                    onClick={handleSaveColorValues}
                    type="button"
                    disabled={
                      colorValues.optionName.length < 1 ||
                      colorValues.optionData.length < 1 ||
                      !colorValues.files?.baseImage ||
                      !colorValues.files?.additionalImage?.length
                    }
                  >
                    Save
                  </Button>
                </div>
              </div>
            </div>

            {/* OTHER variants after color */}
            {safeOptions.length > 1 &&
              safeOptions.map((item, index) => {
                if (index === 0) {
                  return null;
                } else {
                  return (
                    <VariantForm
                      form={form}
                      key={`${item.name}-${index}`}
                      variantTitle={item.name}
                      variantIndex={index}
                    />
                  );
                }
              })}
          </>
        ) : (
          <>
            {safeOptions.map((item, index) => {
              return (
                <VariantForm
                  form={form}
                  key={`${item.name}-${index}`}
                  variantTitle={item.name}
                  variantIndex={index}
                />
              );
            })}
          </>
        )}
      </div>
      <VariantDetails form={form} />
      <VariantDetailss form={form} />
    </>
  );
};

export default VariantOptions;
