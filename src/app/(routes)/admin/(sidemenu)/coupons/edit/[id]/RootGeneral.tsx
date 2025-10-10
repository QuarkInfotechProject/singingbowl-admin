"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/app/_types/products_Type/productType";
import { ProductT } from "../../../products/(context)/types";
import { Button } from "@/components/ui/button";
import Selects from "react-select";
import makeAnimated from "react-select/animated";
import { useToast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CouponData } from "@/app/_types/coupon-Types/couponShow";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Coupon } from "@/app/_types/coupon-Types/couponType";
import { SelectGroup } from "@radix-ui/react-select";
import { IoIosArrowBack } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton";
import CategorySelect from "../../_components/CategorySelect";
import Productselect from "../../../flash-sale/_components/Productselect";
import { useQuery } from "@tanstack/react-query";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

const formSchema = z.object({
  name: z.string().nonempty("Please enter name."),
  code: z.string().nonempty("Please enter code."),
  value: z.string().nonempty("Please enter value."),
  type: z.string().nonempty({ message: "Please select coupon type" }),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isActive: z.boolean().default(false).optional(),
  usageLimitPerCoupon: z.string().optional(),
  usageLimitPerCustomer: z.string().optional(),
  products: z.array(z.string()).optional(),
  excludeProducts: z.array(z.string()).optional(),
  minimumSpend: z.string().optional(),
  maxDiscount: z.string().optional(),
  isPublic: z.boolean().optional(),
  isBulkOffer: z.boolean().optional(),
  applyAutomatically: z.boolean().optional(),
  individualUse: z.boolean().optional(),
  relatedCoupons: z.array(z.string()).optional(),
  excludedCoupons: z.array(z.string()).optional(),
  minQuantity: z.string().optional(),
  paymentMethods: z.array(z.string()).optional(),
  categories: z.array(z.number()).optional(),
  excludeCategories: z.array(z.number()).optional(),
});

interface RootInventoryProps {
  setFormData: (data: any) => void;
  formData: any;
  editCouponsData: CouponData | undefined;
}

const paymentMethodOptions = [
  { value: "esewa", label: "eSewa" },
  { value: "khalti", label: "Khalti" },
  { value: "IMEPay", label: "IMEPay" },
  { value: "card", label: "Visa/Master" },
  { value: "cod", label: "Cash On Delivery" },
];

// Add a proper type assertion to handle the mixed types in the API response
interface ComplexProduct {
  id: number | string;
  uuid?: string;
  product_name?: string;
  name?: string;
  [key: string]: any;
}

interface ExtendedCouponData extends CouponData {
  discount_type?: string;
  type?: string;
  [key: string]: any;
}

const RootGeneral: React.FC<RootInventoryProps> = ({
  formData,
  setFormData,
  editCouponsData,
}) => {
  const animatedComponents = makeAnimated();
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true); // Set loading to true initially
  const [selectedCatalogsSecond, setSelectedCatalogsSecond] = useState<
    { value: string; label: string }[]
  >([]);
  const [catalogDataSecond, setCatalogDataSecond] = useState<Product[]>([]);
  const [selectedCatalogs, setSelectedCatalogs] = useState<
    { value: string; label: string }[]
  >([]);
  const [catalogData, setCatalogData] = useState<Product[]>([]);
  const [couponData, setCouponData] = useState<Coupon[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<
    { value: string; label: string }[]
  >([]);
  const [couponDataExcluded, setCouponDataExcluded] = useState<Coupon[]>([]);
  const [selectedCouponsExcluded, setSelectedCouponsExcluded] = useState<
    { value: string; label: string }[]
  >([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [selectedPaymentMethods, setSelectedPaymentMethods] = useState<
    { value: string; label: string }[]
  >([]);
  const extendedCouponData = editCouponsData as ExtendedCouponData;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      code: "",
      value: "",
      type: "fixed_cart",
      startDate: "",
      endDate: "",
      isActive: false,
      usageLimitPerCoupon: "",
      usageLimitPerCustomer: "",
      products: [],
      excludeProducts: [],
      minimumSpend: "",
      maxDiscount: "",
      isPublic: false,
      isBulkOffer: false,
      applyAutomatically: false,
      individualUse: false,
      relatedCoupons: [],
      excludedCoupons: [],
      minQuantity: "",
      paymentMethods: [],
      categories: [],
      excludeCategories: [],
    },
  });

  // Explicitly set form values after component mounts and data is available
  useEffect(() => {
    if (editCouponsData) {
      form.setValue("name", editCouponsData.name || "");
      form.setValue("code", editCouponsData.code || "");
      // form.setValue("products",editCouponsData.products||[])
      // form.getValues("excludeProducts",editCouponsData.excludeProducts||[])
      form.setValue("categories", editCouponsData?.categories || []);
      form.setValue(
        "excludeCategories",
        editCouponsData?.excludeCategories || []
      );
      // Handle numeric values with conversion
      if (editCouponsData.value !== undefined) {
        form.setValue("value", editCouponsData.value.toString());
      }
      // Set dropdown values
      if (extendedCouponData.discount_type) {
        form.setValue("type", extendedCouponData.discount_type);
      } else if (extendedCouponData.type) {
        form.setValue("type", extendedCouponData.type);
      }
      // Set date values
      if (editCouponsData.startDate) {
        form.setValue("startDate", editCouponsData.startDate);
      }
      if (editCouponsData.endDate) {
        form.setValue("endDate", editCouponsData.endDate);
      }
      // Set numeric values
      if (editCouponsData?.usageLimitPerCoupon !== undefined) {
        form.setValue(
          "usageLimitPerCoupon",
          editCouponsData?.usageLimitPerCoupon
        );
      }
      if (editCouponsData?.usageLimitPerCustomer !== undefined) {
        form.setValue(
          "usageLimitPerCustomer",
          editCouponsData?.usageLimitPerCustomer
        );
      }
      if (editCouponsData?.minimumSpend !== undefined) {
        form.setValue("minimumSpend", editCouponsData?.minimumSpend);
      }
      if (editCouponsData?.maxDiscount !== null) {
        form.setValue("maxDiscount", editCouponsData?.maxDiscount);
      }
      if (editCouponsData?.minQuantity !== undefined) {
        form.setValue("minQuantity", editCouponsData?.minQuantity);
      }

      // Set boolean values
      form.setValue("isActive", Boolean(editCouponsData.isActive));
      form.setValue("isPublic", Boolean(editCouponsData.isPublic));
      form.setValue("isBulkOffer", Boolean(editCouponsData.isBulkOffer));
      form.setValue(
        "applyAutomatically",
        Boolean(editCouponsData.applyAutomatically)
      );
      form.setValue("individualUse", Boolean(editCouponsData.individualUse));

      setIsLoading(false);
    }
  }, [editCouponsData, form, extendedCouponData]);

  const handelBack = () => {
    router.push("/admin/coupons");
  };

const {data: catProduct, isLoading: catProductLoading} = useQuery({
  queryKey: ["catProduct"],
  queryFn: async () => {
    return await clientSideFetch({
      url: "/products?per_page=1000000",
      method: "post",
      body: {
        status: "1",
        name: "",
        sku: "",
        sortBy: "created_at",
        sortDirection: "asc",
      },
      toast: "skip",
    });
  },
});

// Move setState calls into useEffect
useEffect(() => {
  if (!catProductLoading && catProduct?.data?.data?.data) {
    setCatalogData(catProduct.data.data.data);
    setCatalogDataSecond(catProduct.data.data.data);
  }
}, [catProductLoading, catProduct]);

  useEffect(() => {
    const getCoupons = async () => {
      try {
        const res = await fetch(`/api/coupons`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await res.json();
        setCouponData(data.data.data);
        setCouponDataExcluded(data.data.data);
        // setTotalPages(data.data.last_page)
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getCoupons();
  }, []);

  // Set up payment methods from API data
  useEffect(() => {
    if (editCouponsData?.paymentMethods && paymentMethodOptions) {
      const selectedMethods = paymentMethodOptions.filter((option) =>
        editCouponsData.paymentMethods.includes(option.value)
      );
      setSelectedPaymentMethods(selectedMethods);
    }
  }, [editCouponsData]);

  const renderTags = (
    catalog: Product[]
  ): { value: string; label: string }[] => {
    return catalog.map((product: Product) => {
      // Ensure product.name is a string
      const productName =
        product && product.name ? product.name : `Product ${product.id}`;

      return {
        value: product.id,
        label: productName,
      };
    });
  };

  const renderTagsSecond = (
    catalog: Product[]
  ): { value: string; label: string }[] => {
    return catalog.map((product: Product) => {
      return {
        value: product.id.toString(),
        label: product.name || `Product ${product.id}`,
      };
    });
  };

  const renderCoupons = (
    coupons: Coupon[]
  ): { value: string; label: string }[] => {
    return coupons.map((coupon) => {
      // Ensure coupon.code is a string
      const couponCode =
        coupon && coupon.code ? coupon.code : `Coupon ${coupon.id}`;

      return {
        value: String(coupon.id),
        label: couponCode,
      };
    });
  };

  const renderCouponsExcluded = (
    coupons: Coupon[]
  ): { value: string; label: string }[] => {
    return coupons.map((coupon) => {
      // Ensure coupon.code is a string
      const couponCode =
        coupon && coupon.code ? coupon.code : `Coupon ${coupon.id}`;

      return {
        value: String(coupon.id),
        label: couponCode,
      };
    });
  };

  const handleCouponsClick = (
    selectedOptions: readonly { value: string; label: string }[]
  ) => {
    setSelectedCoupons(selectedOptions as { value: string; label: string }[]);
    form.setValue(
      "relatedCoupons",
      selectedOptions.map((option) => option.value)
    );
  };

  const handleCouponsClickExcluded = (
    selectedOptions: readonly { value: string; label: string }[]
  ) => {
    setSelectedCouponsExcluded(
      selectedOptions as { value: string; label: string }[]
    );
    form.setValue(
      "excludedCoupons",
      selectedOptions.map((option) => option.value)
    );
  };

  const handleTagClick = (
    selectedOptions: readonly { value: string; label: string }[]
  ) => {
    const selectedIds = selectedOptions.map((option) => option.value);
    setSelectedCatalogs(selectedOptions as { value: string; label: string }[]);
    form.setValue("products", selectedIds);
  };

  const handleTagClickSecond = (
    selectedOptions: readonly { value: string; label: string }[]
  ) => {
    const selectedIdss = selectedOptions.map((option) => option.value);
    setSelectedCatalogsSecond(
      selectedOptions as { value: string; label: string }[]
    );
    form.setValue("excludeProducts", selectedIdss);
  };

  useEffect(() => {
    const subscription = form.watch((watchedValues) => {
      setFormData({
        ...watchedValues,
      });
    });
    return () => subscription.unsubscribe();
  }, [form, setFormData]);

  const handlePaymentMethodChange = (
    selectedOptions: readonly { value: string; label: string }[]
  ) => {
    setSelectedPaymentMethods(
      selectedOptions as { value: string; label: string }[]
    );
    form.setValue(
      "paymentMethods",
      selectedOptions.map((option) => option.value)
    );
  };

  useEffect(() => {
    if (editCouponsData) {
      // Set boolean values directly
      form.setValue("isActive", Boolean(editCouponsData.isActive));
      form.setValue("isPublic", Boolean(editCouponsData.isPublic));
      form.setValue("isBulkOffer", Boolean(editCouponsData.isBulkOffer));
      form.setValue(
        "applyAutomatically",
        Boolean(editCouponsData.applyAutomatically)
      );
      form.setValue("individualUse", Boolean(editCouponsData.individualUse));
    }
  }, [editCouponsData, form]);

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // Transform boolean values to match API expectations
      const transformedData = {
        ...formData,
        id: editCouponsData?.id,
        isActive: formData.isActive ? 1 : 0,
        isPublic: formData.isPublic ? 1 : 0,
        isBulkOffer: formData.isBulkOffer ? 1 : 0,
        applyAutomatically: formData.applyAutomatically ? 1 : 0,
        individualUse: formData.individualUse ? 1 : 0,
        freeShipping: 0, // Set freeShipping to 0
        products: formData.products || [],
        excludeProducts: formData.excludeProducts || [],
        relatedCoupons: formData.relatedCoupons || [],
        excludedCoupons: formData.excludedCoupons || [],
        paymentMethods: formData.paymentMethods || [],
      };

      const { data } = await axios.post("/api/coupons/update", transformedData);
      if (data) {
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        router.push("/admin/coupons");
      }
    } catch (error: any) {
      setIsLoading(false);
      if (error.response) {
        // Handling API errors
        if (error.response.data.errors) {
          setErrorMessages(error.response.data.errors);
          Object.keys(error.response.data.errors).forEach((key) => {
            form.setError(key as any, {
              type: "manual",
              message: error.response.data.errors[key][0],
            });
          });
        } else {
          toast({
            description: "An error occurred while creating the coupon",
            variant: "destructive",
          });
        }
      } else {
        toast({
          description: "Unexpected error occurred",
          variant: "destructive",
        });
      }
    }
  };

  // Handle product and excluded product data
  useEffect(() => {
    const setupProductSelections = async () => {
      if (editCouponsData && catalogData.length > 0) {
        console.log("Setting up product and excluded product selections...");

        // Handle included products
        if (
          editCouponsData.products &&
          Array.isArray(editCouponsData.products)
        ) {
          console.log("Products from API:", editCouponsData.products);

          // Map products to IDs for form value
          const productIds = editCouponsData.products.map((item) => {
            if (typeof item === "object" && item !== null) {
              if ("id" in item) {
                return String((item as ComplexProduct).id);
              }
              if ("uuid" in item) {
                return (item as ComplexProduct).uuid!;
              }
            }
            return String(item);
          });

          form.setValue("products", productIds);

          // Map to select options for display
          const selectedProductOptions = productIds
            .map((id) => {
              const product = catalogData.find((p) => p.id === id);
              if (product) {
                return {
                  value: product.id,
                  label: product.name || `Product ${product.id}`,
                };
              }
              return null;
            })
            .filter(Boolean) as { value: string; label: string }[];

          setSelectedCatalogs(selectedProductOptions);
        }

        // Handle excluded products - Fixed implementation
        if (editCouponsData.exclude && Array.isArray(editCouponsData.exclude)) {
          console.log("Excluded products from API:", editCouponsData.exclude);

          // Map excluded products to IDs for form value
          const excludedIds = editCouponsData.exclude.map((item) => {
            if (typeof item === "object" && item !== null) {
              // Handle case when exclude contains full product objects
              // if ("id" in item) {
              //   return String((item as ComplexProduct).id);
              // }
              if ("uuid" in item) {
                return (item as ComplexProduct).uuid;
              }
            }
            return String(item);
          });

          form.setValue("excludeProducts", excludedIds);
          // Create select options from the excluded product IDs
          const excludedProductOptions = excludedIds.map((id) => {
            // Find the product in our catalog data
            const product = catalogDataSecond.find((p) => p.id === id);

            if (product) {
              return {
                value: product.id,
                label: product.name || `Product ${product.id}`,
              };
            }

            // If product not found in catalog, create option from raw data
            const rawProduct = editCouponsData.exclude.find((item) => {
              if (typeof item === "object" && item !== null) {
                return (
                  String((item as ComplexProduct).id) === id ||
                  (item as ComplexProduct).uuid === id
                );
              }
              return String(item) === id;
            });

            if (typeof rawProduct === "object" && rawProduct !== null) {
              return {
                value: id,
                label:
                  (rawProduct as ComplexProduct).product_name ||
                  (rawProduct as ComplexProduct).name ||
                  `Product ${id}`,
              };
            }

            return {
              value: id,
              label: `Product ${id}`,
            };
          });

          console.log(
            "Setting excluded product options:",
            excludedProductOptions
          );
          setSelectedCatalogsSecond(excludedProductOptions);
        }
      }
    };

    setupProductSelections();
  }, [editCouponsData, catalogData, catalogDataSecond, form]);

  // Initialize the selected coupons when coupon data is loaded
  useEffect(() => {
    const setupCouponSelections = async () => {
      if (editCouponsData && couponData.length > 0) {
        // Handle related coupons
        if (
          editCouponsData.includedCoupons &&
          Array.isArray(editCouponsData.includedCoupons)
        ) {
          // Convert to string IDs for form
          const includedIds = editCouponsData.includedCoupons.map((id) => id);
          form.setValue("relatedCoupons", includedIds);

          // Map to select options for display
          const relatedCouponOptions = includedIds
            .map((id) => {
              const coupon = couponData.find((c) => c.id.toString() === id);
              if (coupon) {
                return {
                  value: coupon.id.toString(),
                  label: coupon.code || `Coupon ${coupon.id}`,
                };
              }
              return null;
            })
            .filter(Boolean) as { value: string; label: string }[];

          console.log("Setting related coupon options:", relatedCouponOptions);
          setSelectedCoupons(relatedCouponOptions);
        }

        // Handle excluded coupons
        if (
          editCouponsData.excludedCoupons &&
          Array.isArray(editCouponsData.excludedCoupons)
        ) {
          console.log(
            "Excluded coupons from API:",
            editCouponsData.excludedCoupons
          );

          // Convert to string IDs for form
          const excludedIds = editCouponsData.excludedCoupons.map((id) =>
            id.toString()
          );
          form.setValue("excludedCoupons", excludedIds);
          console.log("Setting excluded coupon IDs:", excludedIds);

          // Map to select options for display
          const excludedCouponOptions = excludedIds
            .map((id) => {
              const coupon = couponDataExcluded.find(
                (c) => c.id.toString() === id
              );
              if (coupon) {
                return {
                  value: coupon.id.toString(),
                  label: coupon.code || `Coupon ${coupon.id}`,
                };
              }
              return null;
            })
            .filter(Boolean) as { value: string; label: string }[];

          console.log(
            "Setting excluded coupon options:",
            excludedCouponOptions
          );
          setSelectedCouponsExcluded(excludedCouponOptions);
        }

        // Handle payment methods
        if (
          editCouponsData.paymentMethods &&
          Array.isArray(editCouponsData.paymentMethods)
        ) {
          console.log(
            "Payment methods from API:",
            editCouponsData.paymentMethods
          );

          form.setValue("paymentMethods", editCouponsData.paymentMethods);

          const selectedMethods = paymentMethodOptions.filter((option) =>
            editCouponsData.paymentMethods.includes(option.value)
          );

          console.log("Setting payment method options:", selectedMethods);
          setSelectedPaymentMethods(selectedMethods);
        }
      }
    };

    setupCouponSelections();
  }, [editCouponsData, couponData, couponDataExcluded, form]);

  return (
    <div className="container mx-auto p-6">
      <div className="flex flex-row items-center gap-2 mb-6">
        <Button
          onClick={() => router.push("/admin/coupons")}
          variant="outline"
          size="sm"
          className="flex items-center justify-center p-1"
        >
          <IoIosArrowBack className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Update Coupon</h1>
      </div>

      <Card className="pt-4">
        <CardContent>
          <Form {...form}>
            <form className="space-y-8">
              {isLoading ? (
                <Skeleton className="h-6 w-96" />
              ) : (
                <div className="space-y-8">
                  {/* Coupon Type Section - Always visible */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Coupon Type
                    </h2>
                    <div className="grid grid-cols-1 max-w-md gap-4">
                      <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-md">
                              Coupon Type
                              <span className="text-red-500 ml-0.5">*</span>
                            </FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(value);
                                form.setValue("type", value);
                              }}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select coupon type..." />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="percentage">
                                  Percentage Discount
                                </SelectItem>
                                <SelectItem value="fixed_cart">
                                  Fixed Cart Discount
                                </SelectItem>
                                <SelectItem value="free_shipping">
                                  Free Shipping
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Only show the rest of the form if coupon type is selected */}
                  {form.watch("type") && (
                    <>
                      {/* General Section */}
                      <div>
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                          General
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Name
                                  <span className="text-red-500 ml-0.5">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Code
                                  <span className="text-red-500 ml-0.5">*</span>
                                </FormLabel>
                                <FormControl>
                                  <Input placeholder="Code" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("type") !== "free_shipping" && (
                            <FormField
                              control={form.control}
                              name="value"
                              rules={{ required: "Value is required" }}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-md">
                                    Value
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                    {form.watch("type") === "percentage" &&
                                      " (0-100%)"}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Value"
                                      type="number"
                                      min={1}
                                      max={
                                        form.watch("type") === "percentage"
                                          ? 100
                                          : undefined
                                      }
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>

                      {/* Amounts Section */}
                      <div>
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                          Amounts
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="minimumSpend"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Minimum Spend
                                  {(form.watch("type") === "percentage" ||
                                    form.watch("type") === "fixed_cart") && (
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  )}
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Minimum Spend"
                                    type="number"
                                    min={1}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {form.watch("type") === "percentage" && (
                            <FormField
                              control={form.control}
                              name="maxDiscount"
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel className="text-md">
                                    Max Discount
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder="Max Discount"
                                      type="number"
                                      min={1}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          )}
                        </div>
                      </div>

                      {/* Usage Section */}
                      <div>
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                          Usage
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="startDate"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Start Date
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    placeholder="start date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="endDate"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  End Date
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="date"
                                    placeholder="end date"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="usageLimitPerCoupon"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Usage Limit Per Coupon
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Usage Limit Per Coupon"
                                    type="number"
                                    min={1}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="usageLimitPerCustomer"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Usage Limit Per Customer
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Usage Limit Per Customer"
                                    type="number"
                                    min={1}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="paymentMethods"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Payment Method
                                </FormLabel>
                                <FormControl>
                                  <Selects
                                    isMulti
                                    options={paymentMethodOptions}
                                    value={selectedPaymentMethods}
                                    onChange={handlePaymentMethodChange}
                                    closeMenuOnSelect={false}
                                    components={makeAnimated()}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="minQuantity"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Minimum Quantity
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Minimum Quantity"
                                    type="number"
                                    {...field}
                                    min={1}
                                    className="border-black"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Products Section */}
                      <div>
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                          Products
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="products"
                            render={(field) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Products
                                </FormLabel>
                                <FormControl>
                                  <Selects
                                    isMulti
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    options={renderTags(catalogData)}
                                    value={selectedCatalogs}
                                    onChange={handleTagClick}
                                  />
                                  {/* <Productselect form={form} field={field} /> */}
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="excludeProducts"
                            render={(field) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Exclude Products
                                </FormLabel>
                                <FormControl>
                                  <Selects
                                    isMulti
                                    closeMenuOnSelect={false}
                                    components={animatedComponents}
                                    options={renderTagsSecond(
                                      catalogDataSecond
                                    )}
                                    value={selectedCatalogsSecond}
                                    onChange={handleTagClickSecond}
                                    placeholder="Select products to exclude"
                                  />

                                  {/* <Productselect form={form} field={field} /> */}
                                </FormControl>
                                <FormDescription>
                                  Products that will be excluded from this
                                  coupon's application
                                </FormDescription>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                          Category
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="categories"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-md">
                                  Include Category
                                </FormLabel>

                                <CategorySelect form={form} field={field} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="excludeCategories"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="text-md">
                                  Exclude Category
                                </FormLabel>
                                <CategorySelect form={form} field={field} />
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Related Coupons Section */}
                      <div>
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                          Related Coupons
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="relatedCoupons"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Related Coupons
                                </FormLabel>
                                <FormControl>
                                  <Selects
                                    isMulti
                                    components={animatedComponents}
                                    options={renderCoupons(couponData)}
                                    onChange={handleCouponsClick}
                                    value={selectedCoupons}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="excludedCoupons"
                            render={({ field }) => (
                              <FormItem className="w-full">
                                <FormLabel className="text-md">
                                  Exclude Coupons
                                </FormLabel>
                                <FormControl>
                                  <Selects
                                    isMulti
                                    components={animatedComponents}
                                    options={renderCouponsExcluded(
                                      couponDataExcluded
                                    )}
                                    onChange={handleCouponsClickExcluded}
                                    value={selectedCouponsExcluded}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      {/* Settings Section */}
                      <div>
                        <h2 className="text-lg font-semibold border-b pb-2 mb-4">
                          Settings
                        </h2>
                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="isActive"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    defaultChecked={
                                      editCouponsData?.isActive === true
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Active
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormDescription>
                                    Coupon Enabled
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="isPublic"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    defaultChecked={
                                      editCouponsData?.isPublic === true
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Public
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormDescription>
                                    Make public coupon
                                  </FormDescription>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="isBulkOffer"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    defaultChecked={
                                      editCouponsData?.isBulkOffer === true
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Bulk Offer
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormDescription>
                                    Allow bulk offer
                                  </FormDescription>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="grid grid-cols-3 gap-4 mt-4">
                          <FormField
                            control={form.control}
                            name="individualUse"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    defaultChecked={
                                      editCouponsData?.individualUse === true
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Individual Use
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormDescription>
                                    Allow individual use only
                                  </FormDescription>
                                </div>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="applyAutomatically"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                <FormControl>
                                  <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    defaultChecked={
                                      editCouponsData?.applyAutomatically ===
                                      true
                                    }
                                  />
                                </FormControl>
                                <div className="space-y-1 leading-none">
                                  <FormLabel>
                                    Apply Automatically
                                    <span className="text-red-500 ml-0.5">
                                      *
                                    </span>
                                  </FormLabel>
                                  <FormDescription>
                                    Apply coupon automatically
                                  </FormDescription>
                                </div>
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <Button
                        type="button"
                        onClick={handleSubmit}
                        className="bg-blue-600 hover:bg-blue-700 hover:text-white text-white"
                      >
                        Update Coupon
                      </Button>
                    </>
                  )}
                </div>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RootGeneral;
