"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Sheet } from "@/components/ui/sheet";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormDescription,
} from "@/components/ui/form";
import General from "../_formComponents/(general)/General";
import GeneralSide from "../_formComponents/(general)/GeneralSide";
import AllImages from "../_formComponents/AllImages";
import { useEffect, useMemo, useState } from "react";
import NoVariantsPricing from "../_formComponents/(no_variants)/NoVariantsPricing";
import NoVariantsImages from "../_formComponents/(no_variants)/NoVariantsImages";
import { OptionValueT } from "../_formComponents/AllImages";
import Meta from "../_formComponents/(meta)/meta";
import Attribute from "../_formComponents/(attributes)/attributeSlides";
import RootVariant from "../_formComponents/(variants)/RootVariant";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import RootProducts from "./RootProducts";
import { useRouter } from "next/navigation";
import Others from "../_formComponents/(others)/others";
import { IoIosArrowBack } from "react-icons/io";
import axios from "axios";
import KeySpaces from "../_formComponents/(keyspaces)/KeySpaces";
import NewAttr from "../_formComponents/NewAttributes/NewAttr";
import { transformOutgoingData } from "../edit/[uuid]/RootLayout";

const optionValueSchema = z.object({
  optionName: z.string(),
  optionData: z.string().optional(),
  files: z
    .object({
      baseImage: z.string().optional(),
      additionalImage: z.array(z.string()).optional(),
      descriptionVideo: z.string().optional(),
    })
    .optional(),
});

const optionSchema = z.object({
  name: z.string(),
  isColor: z.string(),
  values: z.array(optionValueSchema),
});

const BooleanLikeInt = z.number().refine((val) => val === 0 || val === 1, {
  message: "Value must be 0 or 1",
});

// Increase options limit to 10
const optionsSchema = z
  .array(optionSchema)
  .min(0)
  .max(10, "Maximum 10 options are allowed");

const variantSchema = z
  .object({
    name: z.string(),
    // Dynamically support up to 10 options
    optionData1: z.string().optional(),
    optionName1: z.string().optional(),
    optionData2: z.string().optional(),
    optionName2: z.string().optional(),
    optionData3: z.string().optional(),
    optionName3: z.string().optional(),
    optionData4: z.string().optional(),
    optionName4: z.string().optional(),
    optionData5: z.string().optional(),
    optionName5: z.string().optional(),
    optionData6: z.string().optional(),
    optionName6: z.string().optional(),
    optionData7: z.string().optional(),
    optionName7: z.string().optional(),
    optionData8: z.string().optional(),
    optionName8: z.string().optional(),
    optionData9: z.string().optional(),
    optionName9: z.string().optional(),
    optionData10: z.string().optional(),
    optionName10: z.string().optional(),
    sku: z
      .string()
      .min(1, { message: "Stock Keeping Unit is required" })
      .refine((value) => !/\s/.test(value), {
        message: "SKU cannot contain whitespace",
      }),
    status: BooleanLikeInt.default(1).optional(),
    originalPrice: z.coerce.number().optional(),
    salestart: z.string().optional(),
    saleEnd: z.string().optional(),
    specialPrice: z.nullable(z.coerce.number()).optional(),
    specialPriceStart: z.string().optional(),
    specialPriceEnd: z.string().optional(),
    quantity: z.coerce
      .number()
      .min(1, { message: "Quantity is required" })
      .optional(),
    inStock: BooleanLikeInt.default(1).optional(),
  })
  .refine(
    (data) => {
      const hasSpecialPrice =
        data.specialPrice != null && data.specialPrice > 0;
      return (
        !hasSpecialPrice ||
        (data.specialPriceStart != null && data.specialPriceStart !== "")
      );
    },
    {
      message: "Special Price Start Date is required",
      path: ["specialPriceStart"],
    }
  )
  .refine(
    (data) => {
      const hasSpecialPrice =
        data.specialPrice != null && data.specialPrice > 0;
      return (
        !hasSpecialPrice ||
        (data.specialPriceEnd != null && data.specialPriceEnd !== "")
      );
    },
    {
      message: "Special Price Start End is required",
      path: ["specialPriceEnd"],
    }
  )
  .refine(
    (data) => {
      if (
        data.specialPrice != null &&
        data.specialPrice > 0 &&
        data.specialPriceStart &&
        data.specialPriceEnd
      ) {
        return (
          new Date(data.specialPriceStart) <= new Date(data.specialPriceEnd)
        );
      }
      return true;
    },
    {
      message: "Special price end date must be after or equal to start date",
      path: ["specialPriceEnd"],
    }
  )
  .refine(
    (data) => {
      if (data.specialPrice != null && data.originalPrice != null) {
        return data.specialPrice <= data.originalPrice;
      }
      return true;
    },
    {
      message: "Special price cannot be more than the original price",
      path: ["specialPrice"],
    }
  );

const variantsSchema = z.array(variantSchema);

const metaSchema = z.object({
  metaTitle: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  metaDescription: z.string().optional(),
});

const AttributeSchema = z.object({
  attributeId: z.string().optional(),
  values: z.union([z.number().array(), z.string().array()]),
});

const keySpaces = z.object({
  key: z.string().optional(),
  value: z.array(z.string()).optional(),
});

const keySpacesSchema = z.array(keySpaces).optional();
const AttributesArraySchema = z.array(AttributeSchema);

const specificationSchema = z.object({
  icon: z.string(),
  content: z.string(),
});

export const formSchema = z
  .object({
    productName: z
      .string()
      .min(1, { message: "Product Name is required" })
      .max(250),
    brandId: z.number().min(1, { message: "Brand is required." }),
    url: z
      .string()
      .min(1, { message: "Product URL is required" })
      .max(250)
      .refine((value) => !/\s/.test(value), {
        message: "URL cannot contain whitespace",
      }),
    bestSeller: z.number().nullable(),
    originalPrice: z.coerce.number().nullable().optional(),
    specialPrice: z.nullable(z.coerce.number()).optional(),
    specialPriceStart: z.string().optional().nullable(),
    specialPriceEnd: z.string().optional().nullable(),
    sku: z
      .string()
      .refine((value) => !/\s/.test(value), {
        message: "SKU cannot contain whitespace",
      })
      .optional(),

    description: z
      .string()
      .min(1, { message: "Product's description is required" }),
    additionalDescription: z.string().nullable().optional(),
    saleStart: z.string().optional(),
    saleEnd: z.string().optional(),
    newFrom: z.string().optional(),
    newTo: z.string().optional(),
    status: BooleanLikeInt.default(1),
    hasVariant: BooleanLikeInt.default(0),
    inStock: BooleanLikeInt,
    categories: z.number().array().min(1, { message: "Category is required" }),
    tags: z.number().array().or(z.string().array()),
    quantity: z.coerce.number().nullable().optional(),
    files: z.object({
      baseImage: z.coerce.string().optional(),
      additionalImage: z.array(z.coerce.string()).optional(),
      descriptionVideo: z.coerce.string().optional(),
    }),
    options: optionsSchema,
    variants: variantsSchema,
    meta: metaSchema,
    attributes: AttributesArraySchema,
    keySpecs: keySpacesSchema,
    relatedProducts: z.array(z.coerce.string()).optional(),
    crossSells: z.array(z.coerce.string()).optional(),
    couponId: z.array(z.coerce.string()).optional(),
    featureId: z.array(z.coerce.string()).optional(),
    activeOfferId: z.array(z.coerce.string()).optional(),
    specifications: z.array(specificationSchema).optional(),
  })
  .refine(
    (data) => {
      const hasSpecialPrice =
        data.specialPrice != null && data.specialPrice > 0;
      return (
        !hasSpecialPrice ||
        (data.specialPriceStart != null && data.specialPriceStart !== "")
      );
    },
    {
      message:
        "When 'specialPrice' is provided, 'specialPriceStart' is required",
      path: ["specialPriceStart"],
    }
  )
  .refine(
    (data) => {
      const hasSpecialPrice =
        data.specialPrice != null && data.specialPrice > 0;
      return (
        !hasSpecialPrice ||
        (data.specialPriceEnd != null && data.specialPriceEnd !== "")
      );
    },
    {
      message: "When 'specialPrice' is provided, 'specialPriceEnd' is required",
      path: ["specialPriceEnd"],
    }
  )
  .refine(
    (data) => {
      if (data.hasVariant === 0) {
        return !!data.files.baseImage;
      }
      if (
        data.hasVariant === 1 &&
        (!data.options[0] || data.options[0].name !== "Color")
      ) {
        return !!data.files.baseImage;
      }
      return true;
    },
    {
      message: "Base image is required",
      path: ["files", "baseImage"],
    }
  )
  .refine(
    (data) => data.hasVariant === 1 || (!!data.sku && data.sku.trim() !== ""),
    {
      message: "SKU is required",
      path: ["sku"],
    }
  )
  .refine((data) => data.hasVariant || !!data.originalPrice, {
    message: "Original Price is required",
    path: ["originalPrice"],
  })
  .refine(
    (data) => {
      if (!data.hasVariant) {
        return typeof data.quantity === "number" && data.quantity >= 1;
      }
      return true;
    },
    {
      message: "Quantity is required and must be a positive number",
      path: ["quantity"],
    }
  )
  .refine(
    (data) => data.hasVariant === 1 || data.inStock === 0 || data.inStock === 1,
    {
      message: "In-stock status is required",
      path: ["inStock"],
    }
  )
  .refine(
    (data) => {
      if (data.originalPrice && data.specialPrice) {
        return data.specialPrice <= data.originalPrice;
      }
      return true;
    },
    {
      message: "Special price cannot be more than the original price",
      path: ["specialPrice"],
    }
  );

export interface ImgFilterT {
  grouped: 0 | null;
  fileCategoryId: number | null;
  fileName: string;
  sortBy: "" | "filename" | "created_at" | "size";
  sortDirection: "asc" | "desc";
}

const AddProduct = () => {
  const [baseOrAdditional, setBaseOrAdditional] = useState<
    "base" | "additional" | "descriptions"
  >("base");
  const [localBaseId, setLocalBaseId] = useState("");
  const [localAdditionalIds, setLocalAdditionalIds] = useState<string[]>([]);
  const [localBaseThumbnail, setLocalBaseThumbnail] = useState("");
  const [localAdditionalThumbnails, setLocalAdditionalThumbnails] = useState<
    string[]
  >([]);
  const [localDescriptionThumbnails, setLocalDescriptionThumbnails] =
    useState("");
  const [localDescriptionIds, setLocalDescriptionIds] = useState("");
  // images search field
  const [inputValue, setInputValue] = useState("");
  const [colorValues, setColorValues] = useState<OptionValueT>({
    optionName: "",
    optionData: "",
    files: {
      baseImage: "",
      additionalImage: [],
    },
  });

  const [uploadedImages, setUploadedImages] = useState<string[]>([]);

  const [isVariant, setIsVariant] = useState(false);

  const [isColorImagesEditing, setIsColorImagesEditing] = useState(false);

  const [valueIndex, setValueIndex] = useState(0);

  const [filters, setFilters] = useState<ImgFilterT>({
    grouped: null,
    fileCategoryId: null,
    fileName: "",
    sortBy: "size",
    sortDirection: "desc",
  });

  const [activeCategory, setActiveCategory] = useState("All Images");

  const handleClearSelectedImages = () => {
    setLocalBaseId("");
    setLocalBaseThumbnail("");
    setLocalAdditionalIds([]);
    setLocalAdditionalThumbnails([]);
    setLocalDescriptionThumbnails("");
  };

  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productName: "",
      url: "",
      brandId: undefined,
      originalPrice: null,
      specialPrice: null,
      specialPriceStart: "",
      specialPriceEnd: "",
      keySpecs: [],
      sku: "",
      bestSeller: 0,
      description: "",
      additionalDescription: "",
      hasVariant: 0,
      status: 1,
      saleEnd: "",
      saleStart: "",
      newFrom: "",
      newTo: "",
      inStock: 1,
      quantity: 1,
      categories: [],
      tags: [],
      files: {
        baseImage: "",
        additionalImage: [],
        descriptionVideo: "",
      },
      options: [],
      variants: [],
      meta: {
        metaTitle: "",
        keywords: [],
        metaDescription: "",
      },
      attributes: [],
      relatedProducts: [],
      crossSells: [],
      couponId: [],
      featureId: [],
      activeOfferId: [],
      specifications: [],
    },
  });

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleIsLoading = (bool: boolean) => {
    setIsLoading(bool);
  };
  const {
    watch,
    formState: { errors },
    clearErrors,
  } = form;

  // Variants options building schemas
  const buildOptionValues = (variant: any) => {
    const optionValues: Record<string, string> = {};

    for (let i = 1; i <= 10; i++) {
      const dataKey = `optionName${i}`;
      const nameKey = `optionData${i}`;
      const data = variant[dataKey];
      const name = variant[nameKey];

      if (name && data) {
        optionValues[name] = data;
      }

      // Delete the keys after use
      delete variant[dataKey];
      delete variant[nameKey];
    }

    return optionValues;
  };

  // end of variants building
  const submit = async (values: z.infer<typeof formSchema>) => {
    const transformedVariants = values.variants.map((variant) => ({
      ...variant,
      optionValues: buildOptionValues(variant),
    }));
    const fromsData = {
      ...values,
      brandId: Number(values.brandId),
      inStock: values?.hasVariant === 1 ? null : values?.inStock,
      variants: transformedVariants,
      files:
        values?.hasVariant === 1
          ? {
              baseImage: null,
              additionalImage: [],
              descriptionVideo: null,
            }
          : values.files,
      options: transformOutgoingData(values.options),
    };

    try {
      const res = await clientSideFetch({
        url: "/products/create",
        debug: true,
        method: "post",
        body: fromsData,
        toast: toast,
        handleLoading: handleIsLoading,
      });

      if (res && res.status === 200) {
        toast({
          description: res.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.push("/admin/products");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description: error?.response?.data?.error,
          variant: "destructive",
        });
      } else {
        toast({
          description: "An unknown error occurred.",
          variant: "destructive",
        });
      }
    }
  };

  const handleFilterReset = () => {
    setFilters({
      grouped: null,
      fileCategoryId: null,
      fileName: "",
      sortBy: "size",
      sortDirection: "desc",
    });
    setActiveCategory("All Images");
    setInputValue("");
  };

  const hasVariantt = useWatch({
    control: form.control,
    name: "hasVariant",
  });
  const options = useWatch({
    control: form.control,
    name: "options",
  });

  useEffect(() => {
    if (hasVariantt === 1) {
      const currentOptions = options || [];
      if (!currentOptions.some((option) => option.name === "Color")) {
        const updatedOptions = [
          {
            name: "Color",
            isColor: "1",
            values: [],
          },
          ...currentOptions,
        ];
        form.setValue("options", updatedOptions);
      }
    }
  }, [hasVariantt, options, form]);

  const handleVariantReset = (val: any) => {
    // val is actually bool
    if (val === 1) {
      form.setValue("files.baseImage", "");
      form.setValue("files.additionalImage", []);
      form.setValue("files.descriptionVideo", "");
    }
    form.setValue("hasVariant", val);
    form.setValue("options", []);
    form.setValue("files", {
      baseImage: "",
      additionalImage: [],
      descriptionVideo: "",
    });
    form.setValue("quantity", null);
    form.setValue("originalPrice", null);
    form.setValue("sku", "");
    form.setValue("variants", []);
    form.setValue("specialPrice", null);
    form.setValue("specialPriceStart", "");
    form.setValue("specialPriceEnd", "");
      form.setValue("description", "");
     form.setValue("additionalDescription", "");
    form.setValue("meta", {
      metaTitle: "",
      keywords: [],
      metaDescription: "",
    });
    form.setValue("attributes", []);
    form.setValue("relatedProducts", []);
    form.setValue("crossSells", []);
    form.setValue("couponId", []);
    form.setValue("featureId", []);
    form.setValue("activeOfferId", []);
    form.setValue("saleStart", "");
    form.setValue("saleEnd", "");
    form.setValue("newFrom", "");
    form.setValue("newTo", "");
  };

  const hasVariant = useWatch({
    control: form.control,
    name: "hasVariant",
  });

  const handleRouter = () => {
    router.push("/admin/products");
  };

  const productName = useWatch({
    control: form.control,
    name: "productName",
    defaultValue: "",
  });

  useEffect(() => {
    const transformedUrl = productName
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-{2,}/g, "-")
      .replace(/\|/g, "-");
    form.setValue("url", transformedUrl);
  }, [productName, form]);

  return (
    <>
      <Dialog
        onOpenChange={() => {
          handleClearSelectedImages();
          handleFilterReset();
        }}
      >
        <AllImages
          inputValue={inputValue}
          setInputValue={setInputValue}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          filters={filters}
          setFilters={setFilters}
          localBaseId={localBaseId}
          setLocalBaseId={setLocalBaseId}
          localBaseThumbnail={localBaseThumbnail}
          setLocalBaseThumbnail={setLocalBaseThumbnail}
          localAdditionalIds={localAdditionalIds}
          setLocalAdditionalIds={setLocalAdditionalIds}
          localDescriptionIds={localDescriptionIds}
          setLocalDescriptionIds={setLocalDescriptionIds}
          localAdditionalThumbnails={localAdditionalThumbnails}
          setLocalAdditionalThumbnails={setLocalAdditionalThumbnails}
          setLocalDescriptionThumbnails={setLocalDescriptionThumbnails}
          localDescriptionThumbnails={localDescriptionThumbnails}
          colorValues={colorValues}
          setColorValues={setColorValues}
          toUpdate={baseOrAdditional}
          isVariant={isVariant}
          form={form}
          uploadedImages={uploadedImages}
          isColorImagesEditing={isColorImagesEditing}
          setIsColorImagesEditing={setIsColorImagesEditing}
          valueIndex={valueIndex}
          setValueIndex={setValueIndex}
        />
        <Form {...form}>
          <form
            id="create-product-form"
            onSubmit={form.handleSubmit(submit)}
            className="space-y-8"
          >
            <div className="flex justify-between ">
              <div className="flex flex-row items-center gap-2">
                <Button
                  onClick={handleRouter}
                  variant="outline"
                  size="sm"
                  className="flex items-center h-8 justify-center p-1"
                >
                  <IoIosArrowBack className="h-4 w-4" />
                </Button>
                <h1 className="text-xl font-bold">Add Products</h1>
              </div>
              <div></div>
            </div>
            <div className="grid grid-cols-[65%_34%] gap-4">
              <General clearErrors={clearErrors} form={form} />
              <GeneralSide form={form} />
            </div>

            <div className="w-[90%]">
              <NoVariantsPricing form={form} />
              <NoVariantsImages
                setIsVariant={setIsVariant}
                setBaseOrAdditional={setBaseOrAdditional}
                setUploadedImages={setUploadedImages}
                form={form}
                setIsColorImagesEditing={setIsColorImagesEditing}
              />
            </div>
            
            <div className="">
              <Meta form={form} />
              <NewAttr form={form} />
              <KeySpaces form={form} />
            </div>
            <RootProducts form={form} />
            <Others form={form} />
            <Button disabled={isLoading} type="submit">
              {isLoading ? "Please wait" : "Submit"}
            </Button>
          </form>
        </Form>
      </Dialog>
    </>
  );
};

export default AddProduct;
