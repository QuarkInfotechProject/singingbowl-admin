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
import General from "../../_formComponents/(general)/General";
import GeneralSide from "../../_formComponents/(general)/GeneralSide";
import AllImages from "../../_formComponents/AllImages";
import { useEffect, useState } from "react";
import NoVariantsPricing from "../../_formComponents/(no_variants)/NoVariantsPricing";
import NoVariantsImages from "../../_formComponents/(no_variants)/NoVariantsImages";
import { OptionValueT } from "../../_formComponents/AllImages";
import DescriptionVideo from "../../_formComponents/(no_variants)/DescriptionVideo";
import Meta from "../../_formComponents/(meta)/meta";
import Attribute from "../../_formComponents/(attributes)/attributeSlides";
import RootVariant from "../../_formComponents/(variants)/RootVariant";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog } from "@/components/ui/dialog";
import RootProducts from "./RootProducts";
import { useRouter } from "next/navigation";
import axios from "axios";
import { SingleProductT } from "@/app/_types/products_Type/productType";
import { Input } from "@/components/ui/input";
import Others from "@/app/(routes)/admin/(sidemenu)/products/(pages)/_formComponents/(others)/others";
import { IoIosArrowBack } from "react-icons/io";
import KeySpaces from "../../_formComponents/(keyspaces)/KeySpaces";
import NewAttr from "../../_formComponents/NewAttributes/NewAttr";

// const optionValueSchema = z.object({
//   optionName: z.string(),
//   optionData: z.string().optional(),
//   files: z
//     .object({
//       baseImage: z.string().optional(),
//       additionalImage: z.array(z.string()).optional(),
//       descriptionVideo: z.array(z.string()).optional(),
//     })
//     .optional(),
// });

// const optionSchema = z.object({
//   // id:z.string().optional(),
//   name: z.string(),
//   isColor: z.string(),
//   values: z.array(optionValueSchema),
// });

// const BooleanLikeInt = z.number().refine((val) => val === 0 || val === 1, {
//   message: "Value must be 0 or 1",
// });

// const optionsSchema = z
//   .array(optionSchema)
//   .min(0)
//   .max(3, "Maximum 3 options are allowed");
// const variantSchema = z
//   .object({
//     name: z.string(),
//     optionData1: z.string().optional(),
//     optionName1: z.string().optional(),
//     optionName2: z.string().optional(),
//     optionName3: z.string().optional(),
//     sku: z
//       .string()
//       .min(1, { message: "Stock Keeping Unit is required" })
//       .refine((value) => !/\s/.test(value), {
//         message: "SKU cannot contain whitespace",
//       }),
//     status: BooleanLikeInt.default(1).optional(),
//     originalPrice: z.coerce
//       .number()
//       .min(1, { message: "Original Price is required" })
//       .optional(),
//     specialPrice: z.nullable(z.coerce.number()).optional(),
//     salestart: z.string().optional(),
//     saleEnd: z.string().optional(),
//     newFrom: z.string().optional(),
//     newTo: z.string().optional(),
//     specialPriceStart: z.string().optional(),
//     specialPriceEnd: z.string().optional(),
//     quantity: z.coerce
//       .number()
//       .min(1, { message: "Quantity is required" })
//       .optional(),
//     inStock: BooleanLikeInt.default(1).optional(),
//   })
//   .refine(
//     (data) => {
//       const hasSpecialPrice =
//         data.specialPrice != null && data.specialPrice > 0;
//       return (
//         !hasSpecialPrice ||
//         (data.specialPriceStart != null && data.specialPriceStart !== "")
//       );
//     },
//     {
//       message: "Special Price Start Date is required",
//       path: ["specialPriceStart"],
//     }
//   )
//   .refine(
//     (data) => {
//       const hasSpecialPrice =
//         data.specialPrice != null && data.specialPrice > 0;
//       return (
//         !hasSpecialPrice ||
//         (data.specialPriceEnd != null && data.specialPriceEnd !== "")
//       );
//     },
//     {
//       message: "Special Price Start End is required",
//       path: ["specialPriceEnd"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (
//         data.specialPrice != null &&
//         data.specialPrice > 0 &&
//         data.specialPriceStart &&
//         data.specialPriceEnd
//       ) {
//         return (
//           new Date(data.specialPriceStart) <= new Date(data.specialPriceEnd)
//         );
//       }
//       return true;
//     },
//     {
//       message: "Special price end date must be after or equal to start date",
//       path: ["specialPriceEnd"],
//     }
//   )
//   .refine(
//     (data) => {
//       if (data.specialPrice != null && data.originalPrice != null) {
//         return data.specialPrice <= data.originalPrice;
//       }
//       return true;
//     },
//     {
//       message: "Special price cannot be more than the original price",
//       path: ["specialPrice"],
//     }
//   );

// Image object schema for incoming data
const imageObjectSchema = z.object({
  id: z.number(),
  url: z.string().nullable(), // Make URL nullable
});

// Union type to handle both image objects and image IDs
const imageSchema = z.union([
  z.string().nullable(), // For image ID as string, nullable
  z.number().nullable(), // For image ID as number, nullable
  imageObjectSchema, // For full image object
  z.null(), // Allow null values
]);

const optionValueSchema = z.object({
  id: z.string().optional(), // Add id field for existing values
  optionName: z.string(),
  optionData: z.string().optional(),
  files: z
    .object({
      baseImage: imageSchema.nullable().optional(), // Make baseImage nullable
      additionalImage: z.array(imageSchema).nullable().optional(), // Make additionalImage array nullable
      descriptionVideo: z
        .union([
          z.array(imageSchema), // For arrays
          z.string().nullable(), // For empty string, nullable
          z.array(z.string().nullable()), // For string arrays with nullable strings
        ])
        .nullable()
        .optional(), // Make descriptionVideo nullable
    })
    .nullable()
    .optional(), // Make entire files object nullable
});

const optionSchema = z.object({
  id: z.string().optional(), // Add id field for existing options
  name: z.string(),
  isColor: z.union([
    z.string(), // "0" or "1"
    z.number(), // 0 or 1
  ]),
  values: z.array(optionValueSchema),
});

const BooleanLikeInt = z.number().refine((val) => val === 0 || val === 1, {
  message: "Value must be 0 or 1",
});

const optionsSchema = z
  .array(optionSchema)
  .min(0)
  .max(5, "Maximum 5 options are allowed"); // Increased from 3 to 5 based on your data

const variantSchema = z
  .object({
    name: z.string(),
    optionData1: z.string().optional(),
    optionName1: z.string().optional(),
    optionName2: z.string().optional(),
    optionName3: z.string().optional(),
    optionName4: z.string().optional(), // Added for more options
    optionName5: z.string().optional(), // Added for more options
    sku: z
      .string()
      .min(1, { message: "Stock Keeping Unit is required" })
      .refine((value) => !/\s/.test(value), {
        message: "SKU cannot contain whitespace",
      }),
    status: BooleanLikeInt.default(1).optional(),
    originalPrice: z.coerce
      .number()
      .min(1, { message: "Original Price is required" })
      .optional(),
    specialPrice: z.nullable(z.coerce.number()).optional(),
    salestart: z.string().optional(),
    saleEnd: z.string().optional(),
    newFrom: z.string().optional(),
    newTo: z.string().optional(),
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

// Helper functions for data transformation
const transformIncomingData = (apiData: any) => {
  // Transform incoming API data to form format
  return apiData.map((option: any) => ({
    ...option,
    isColor: option.isColor.toString(),
    values: option.values.map((value: any) => ({
      ...value,
      files: value.files
        ? {
            ...value.files,
            // Handle nullable images
            baseImage: value.files.baseImage || null,
            additionalImage: value.files.additionalImage || [],
            descriptionVideo: value.files.descriptionVideo || null,
          }
        : null,
    })),
  }));
};

const transformOutgoingData = (formData: any) => {
  // Transform form data to API format
  return formData.map((option: any) => ({
    ...option,
    isColor: option.isColor.toString(),
    values: option.values.map((value: any) => ({
      ...value,
      ...(option.isColor == 1 &&
        value.files && {
          files: {
            baseImage: value.files.baseImage
              ? typeof value.files.baseImage === "object"
                ? value.files.baseImage.id
                : parseInt(value.files.baseImage) || null
              : null,
            additionalImage: (value.files.additionalImage || [])
              .filter((img) => img !== null) // Filter out null values
              .map((img: any) =>
                typeof img === "object" ? img.id : parseInt(img) || null
              )
              .filter((id) => id !== null), // Filter out null IDs
            descriptionVideo: value.files.descriptionVideo || "",
          },
        }),
    })),
  }));
};

// Export the schemas and helper functions
export {
  optionValueSchema,
  optionSchema,
  optionsSchema,
  variantSchema,
  BooleanLikeInt,
  transformIncomingData,
  transformOutgoingData,
  imageSchema,
  imageObjectSchema,
};
const variantsSchema = z.array(variantSchema);
const metaSchema = z.object({
  metaTitle: z.string().optional(),
  keywords: z.array(z.string()).optional(),
  metaDescription: z.string().optional(),
});
const AttributeSchema = z.object({
  id: z.string().optional(),
  attributeId: z.string().optional(),
  values: z.union([z.number().array(), z.string().array()]),
});
const keySpaces = z.object({
  key: z.string().optional(),
  value: z.array(z.string()).optional(),
  sortOrder: z.number().optional(),
  status: z.number().optional(),
});
const keySpacesSchema = z.array(keySpaces).optional();
const AttributesArraySchema = z.array(AttributeSchema);

export const formSchema = z
  .object({
    uuid: z.string().min(1, { message: "Uuid required" }),
    productName: z
      .string()
      .min(1, { message: "Product Name is required" })
      .max(250),
    sortOrder: z.string(),
    brandId: z.number().min(1, { message: "Brand is required." }),
    url: z
      .string()
      .min(1, { message: "Product URL is required" })
      .max(250)
      .refine((value) => !/\s/.test(value), {
        message: "URL cannot contain whitespace",
      }),
    bestSeller: z.number().nullable(),
    keySpecs: keySpacesSchema,
    originalPrice: z.coerce.number().optional(),
    specialPrice: z.nullable(z.coerce.number()).optional(),
    salestart: z.string().optional(),
    saleEnd: z.string().optional(),
    newFrom: z.string().optional(),
    newTo: z.string().optional(),
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
    status: BooleanLikeInt.default(1),
    // onSale: BooleanLikeInt.default(1),
    hasVariant: BooleanLikeInt.default(0),
    inStock: BooleanLikeInt.default(1),
    categories: z.number().array().min(1, { message: "Category is required" }),
    tags: z.number().array().or(z.string().array()),
    quantity: z.coerce.number().optional(),
    files: z.object({
      baseImage: z.coerce.string().optional(),
      additionalImage: z.array(z.coerce.string()).optional(),
      descriptionVideo: z.array(z.coerce.string()).optional(),
    }),
    couponId: z.array(z.coerce.string()).optional(),
    featureId: z.array(z.coerce.string()).optional(),
    activeOfferId: z.array(z.coerce.string()).optional(),
    specifications: z.array(z.coerce.string()).optional(),
    options: optionsSchema,
    variants: variantsSchema,
    meta: metaSchema,
    attributes: AttributesArraySchema,
    relatedProducts: z.array(z.coerce.string()).optional(),
    crossSells: z.array(z.coerce.string()).optional(),
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

interface ImgFilterT {
  grouped: 0 | null;
  fileCategoryId: number | null;
  fileName: string;
  sortBy: "" | "filename" | "created_at" | "size";
  sortDirection: "" | "asc" | "desc";
}

const RootLayout = ({
  defaultData,
  uuid,
  defaultProduct,
}: {
  uuid: string;
  defaultData: any;
  defaultProduct: any[];
}) => {
  const [baseOrAdditional, setBaseOrAdditional] = useState<
    "base" | "additional" | "description"
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
  const [prev, setPrev] = useState("");

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
    sortBy: "",
    sortDirection: "",
  });

  const [activeCategory, setActiveCategory] = useState("All Images");

  const handleClearSelectedImages = () => {
    setLocalBaseId("");
    setLocalBaseThumbnail("");
    setLocalAdditionalIds([]);
    setLocalAdditionalThumbnails([]);
    setLocalDescriptionThumbnails([]);
  };

  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      uuid: uuid,
      productName: "",
      url: "",
      brandId: null,
      sortOrder: "",
      saleStart: "",
      saleEnd: "",
      newFrom: "",
      newTo: "",
      originalPrice: null,
      specialPrice: null,
      specialPriceStart: "",
      specialPriceEnd: "",
      keySpecs: [],

      sku: "",
      description: "",
      additionalDescription: "",
      hasVariant: 0,
      status: 1,
      // onSale: 0,
      inStock: 1,
      quantity: null,
      categories: [],
      tags: [],
      files: {
        baseImage: "",
        additionalImage: [],
        descriptionVideo: [],
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
  console.log("uuid is : ", uuid)
  const { clearErrors } = form;
  const router = useRouter();
  const [productData, setProductData] = useState<SingleProductT | {}>({});

  useEffect(() => {
    setDefaultValue(defaultData);
    setProductData(defaultData);
    setPrev(defaultData?.productName);
  }, [uuid]);

  const setDefaultValue = (editProduct: SingleProductT) => {
    form.setValue("productName", editProduct?.productName || " ");
    form.setValue("url", editProduct?.url || " ");
    form.setValue("brandId", editProduct?.brandId);
    form.setValue("description", editProduct?.description || " ");
    form.setValue("additionalDescription", editProduct?.additionalDescription || " ");
    form.setValue("bestSeller", editProduct?.bestSeller);
    form.setValue("keySpecs", editProduct?.keySpecs);

    form.setValue("sortOrder", editProduct?.sortOrder),
      form.setValue("hasVariant", editProduct?.hasVariant || 0);
    form.setValue("saleStart", editProduct?.saleStart || "");
    form.setValue("saleEnd", editProduct?.saleEnd || "");
    form.setValue("newFrom", editProduct?.newFrom || "");
    form.setValue("newTo", editProduct?.newTo || "");
    const numericStatus = editProduct.status ? 1 : 0;
    form.setValue("status", numericStatus);

    form.setValue("inStock", editProduct?.inStock || 1);
    form.setValue("sku", editProduct?.sku || "");
    form.setValue("quantity", editProduct?.quantity || undefined);
    form.setValue(
      "originalPrice",
      (editProduct?.originalPrice && parseFloat(editProduct.originalPrice)) ||
        null
    );
    form.setValue(
      "specialPrice",
      (editProduct?.specialPrice && parseFloat(editProduct.specialPrice)) ||
        null
    );
    form.setValue("specialPriceStart", editProduct?.specialPriceStart || "");
    form.setValue("specialPriceEnd", editProduct?.specialPriceEnd || "");
    form.setValue("files.baseImage", editProduct?.files.baseImage.id);
    form.setValue(
      "files.additionalImage",
      editProduct?.files.additionalImage.map((item) => item.id)
    );
    form.setValue(
      "files.descriptionVideo",
      editProduct?.files.descriptionVideo?.map((item) => item.id)
    );
    form.setValue(
      "categories",
      editProduct?.categories.map((item) => item.id)
    );
    form.setValue("meta.metaTitle", editProduct?.meta.metaTitle);
    form.setValue("meta.metaDescription", editProduct?.meta.metaDescription);
    form.setValue("meta.keywords", editProduct?.meta.keywords);
    form.setValue(
      "relatedProducts",
      editProduct?.relatedProducts && editProduct.relatedProducts.length > 0
        ? editProduct.relatedProducts.map((item) => item.uuid)
        : []
    );
    form.setValue(
      "crossSells",
      editProduct?.crossSellProducts && editProduct.crossSellProducts.length > 0
        ? editProduct.crossSellProducts.map((item) => item.uuid)
        : []
    );
    form.setValue(
      "relatedProducts",
      editProduct?.relatedProducts && editProduct?.relatedProducts.length > 0
        ? editProduct.relatedProducts?.map((product) => product?.uuid)
        : []
    );
    // form.setValue(
    //   "attributes",
    //   editProduct?.attributes && editProduct.attributes.length > 0
    //     ? editProduct.attributes.map((item) => {
    //         return {
    //           id: item.id.toString(),
    //           attributeId: item.attributeId.toString(), // Convert to string if needed
    //           values: item.values.map((value) => value.id),
    //         };
    //       })
    //     : []
    // );
    form.setValue(
      "couponId",
      editProduct.coupons?.map((item) => item.id)
    );
    form.setValue(
      "featureId",
      editProduct.others?.map((item) => item.id)
    );
    form.setValue(
      "activeOfferId",
      editProduct.activeOffers?.map((item) => item.id)
    );
    form.setValue(
      "specifications",
      editProduct.specifications?.map((item) => item)
    );
    // Set options
    if (editProduct?.options && editProduct.options.length > 0) {
      const formattedOptions = editProduct.options.map((option) => ({
        id: option.id,
        name: option.name,
        isColor: option.isColor,
        values: option.values.map((value) => ({
          id: value.id,
          optionName: value.optionName || "",
          optionData: value.optionData || "",
          ...(option.isColor == 1 &&
            value.files && {
              files: {
                baseImage: value.files.baseImage || null,
                additionalImage: value.files.additionalImage || [],
                descriptionVideo: value.files.descriptionVideo || [],
              },
            }),
        })),
      }));
      form.setValue("options", formattedOptions);
    } else {
      form.setValue("options", []);
    }
    // Set variants

    if (editProduct?.variants && editProduct.variants.length > 0) {
      const formattedVariants = editProduct.variants.map((variant) => ({
        name: variant.name,
        optionName1: variant.optionName1 || "",
        optionName2: variant.optionName2 || "",
        optionName3: variant.optionName3 || "",
        optionData1: variant.optionData1 || "",
        sku: variant?.sku || "",
        status: variant.status ? 1 : 0,
        originalPrice: variant.originalPrice
          ? parseFloat(variant.originalPrice)
          : null,
        specialPrice: variant.specialPrice
          ? parseFloat(variant.specialPrice)
          : null,
        specialPriceStart: variant?.specialPriceStart || null,
        specialPriceEnd: variant?.specialPriceEnd || null,
        quantity:
          variant.quantity !== null ? parseInt(variant.quantity, 10) : null,
        inStock: variant.inStock ? 1 : 0,
      }));
      form.setValue("variants", formattedVariants);
    } else {
      form.setValue("variants", []);
    }
  };
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

  const handleSubmit = async () => {
    try {
      const formValues = form.getValues();

      const transformedVariants = formValues?.variants.map((variant) => ({
        ...variant,
        optionValues: buildOptionValues(variant),
      }));
      const newData = {
        ...formValues,
        brandId: Number(formValues?.brandId),
        inStock: formValues?.hasVariant === 1 ? null : formValues?.inStock,
        variants: transformedVariants,
        files:
          formValues?.hasVariant === 1
            ? {
                baseImage: null,
                additionalImage: [],
                descriptionVideo: null,
              }
            : formValues.files,
        options: transformOutgoingData(formValues.options),
      };

      const res = await clientSideFetch({
        url: "/products/update",
        debug: true,
        method: "post",
        body: newData,
        toast: toast,
        // handleLoading: handleIsLoading,
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
      console.error("Error updating product:", error);
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
      sortBy: "",
      sortDirection: "",
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
      const currentOptions = transformOutgoingData(options) || [];
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
  }, [hasVariantt]);

  const handleVariantReset = (val: any) => {
    if (val === 1) {
      form.setValue("files.baseImage", "");
      form.setValue("files.additionalImage", []);
      form.setValue("files.descriptionVideo", []);
    }

    // val is actually bool
    form.setValue("hasVariant", val);
    form.setValue("options", []);
    form.setValue("files", {
      baseImage: "",
      additionalImage: [],
      descriptionVideo: [],
    });
    form.setValue("quantity", null);
    form.setValue("originalPrice", null);
    form.setValue("sku", ""), form.setValue("variants", []);
    form.setValue("specialPrice", null), form.setValue("specialPriceStart", "");
    form.setValue("specialPriceEnd", "");
    // form.setValue("meta", {
    //   metaTitle: "",
    //   keywords: [],
    //   metaDescription: "",
    // }),
    //   form.setValue("attributes", []);
    // form.setValue("relatedProducts", []);
    // form.setValue("crossSells", []);
    // form.setValue("couponId", []);
    // form.setValue("specifications", []);
    // form.setValue("upSells",[])
  };
  const hasVariant = form.getValues("hasVariant");

  const handleRouters = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior

    // Check if there are unsaved changes
    const hasUnsavedChanges = form.formState.isDirty;

    if (hasUnsavedChanges) {
      // Show confirmation dialog
      const confirmLeave = window.confirm(
        "You have unsaved changes. Are you sure you want to leave?"
      );
      if (!confirmLeave) {
        return;
      }
    }

    // Use replace to prevent adding to history stack
    router.replace("/admin/products");
  };

  // urls tranformed
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

    if (productName !== prev) {
      form.setValue("url", transformedUrl);
    }
  }, [productName, form]);

  return (
    <>
      <Form {...form}>
        <form
          id="create-product-form"
          // onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
        >
          <div className="flex justify-between ">
            <div className="flex flex-row items-center gap-2">
              <Button
                onClick={handleRouters}
                variant="outline"
                size="xs"
                className="flex items-center justify-center p-1"
              >
                <IoIosArrowBack className="h-4 w-4" />
              </Button>
              <h1 className="text-xl font-bold">Update Products</h1>
            </div>
            <div></div>
          </div>
          <FormField
            control={form.control}
            name="uuid"
            render={({ field }) => (
              <FormItem className="hidden">
                <div className="grid grid-cols-[30%_69%] gap-4 items-start justify-end">
                  <div className="flex justify-end mt-3">
                    <FormLabel className="font-normal">
                      Product UUId <span className="text-red-600">*</span>
                    </FormLabel>
                  </div>
                  <div>
                    <FormControl>
                      <Input
                        disabled
                        className={
                          form.formState.errors.uuid &&
                          "border-red-600 focus:border-red-600"
                        }
                        {...field}
                      />
                    </FormControl>
                  </div>
                </div>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-[65%_34%] gap-4">
            <General clearErrors={clearErrors} form={form} />
            <GeneralSide form={form} />
          </div>
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
              localDescriptionIds={localDescriptionIds}
              setLocalDescriptionIds={setLocalDescriptionIds}
              localDescriptionThumbnails={localDescriptionThumbnails}
              setLocalDescriptionThumbnails={setLocalDescriptionThumbnails}
              localAdditionalIds={localAdditionalIds}
              setLocalAdditionalIds={setLocalAdditionalIds}
              localAdditionalThumbnails={localAdditionalThumbnails}
              setLocalAdditionalThumbnails={setLocalAdditionalThumbnails}
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
            <div className="w-[90%]">
              <NoVariantsPricing form={form} />
              <NoVariantsImages
                setIsVariant={setIsVariant}
                setBaseOrAdditional={setBaseOrAdditional}
                setUploadedImages={setUploadedImages}
                form={form}
                defaultImages={defaultData.files ?? null}
                setIsColorImagesEditing={setIsColorImagesEditing}
              />
            </div>
          </Dialog>

          <div className="">
            <Meta form={form} />
            <NewAttr
              prevAttributes={defaultData?.attributes || []}
              form={form}
            />
            {/* <Attribute form={form} /> */}
          </div>

          {/*  products and product selection for related upsell and cross sell */}
          <RootProducts defaultProduct={defaultProduct} form={form} />
          <KeySpaces form={form} />
          <Others form={form} />

          <Button
            onClick={() => handleSubmit()}
            type="button"
            className="bg-blue-500 hover:bg-blue-600 text-white hover:text-white"
          >
            Update
          </Button>
        </form>
      </Form>
    </>
  );
};

export default RootLayout;
