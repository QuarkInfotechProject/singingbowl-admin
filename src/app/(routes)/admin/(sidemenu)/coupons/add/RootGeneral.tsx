"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
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
  SelectGroup,
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
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

import { Product } from "@/app/_types/products_Type/productType";
import makeAnimated from "react-select/animated";
import Selects from "react-select";
import { Coupon, CouponResponse } from "@/app/_types/coupon-Types/couponType";
import { IoIosArrowBack } from "react-icons/io";
import CategorySelect from "../_components/CategorySelect";
import Productselect from "../../flash-sale/_components/Productselect";

const formSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    code: z.string().nonempty("Code is required"),
    type: z.string().default("free_shipping"),
    value: z.string().optional(),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
    isActive: z.boolean().default(false),
    usageLimitPerCoupon: z.string().optional(),
    usageLimitPerCustomer: z.string().optional(),
    products: z.array(z.string()).optional(),
    excludeProducts: z.array(z.string()).optional(),
    minimumSpend: z.string().optional(),
    maxDiscount: z.string().optional(),
    isPublic: z.boolean().default(false),
    isBulkOffer: z.boolean().default(false),
    applyAutomatically: z.boolean().default(false),
    individualUse: z.boolean().default(false),
    relatedCoupons: z.array(z.string()).optional(),
    excludedCoupons: z.array(z.string()).optional(),
    minQuantity: z.string().optional(),
    paymentMethods: z.array(z.string()).optional(),
    categories: z.array(z.number()).optional(),
    excludeCategories: z.array(z.number()).optional(),
  })
  .refine(
    (data) => {
      // Validate value based on coupon type
      if (data.type === "free_shipping") {
        return true; // No validation needed for free_shipping
      }

      // For percentage and fixed_cart, value is required
      if (!data.value) {
        return false;
      }

      // For percentage, validate range 0-100
      if (data.type === "percentage") {
        const numValue = Number(data.value);
        return !isNaN(numValue) && numValue >= 0 && numValue <= 100;
      }

      return true;
    },
    {
      message:
        "Value is required. For percentage coupons, value must be between 0-100.",
      path: ["value"],
    }
  )
  .refine(
    (data) => {
      // Validate minimumSpend based on coupon type
      if (data.type === "free_shipping") {
        return true; // Optional for free_shipping
      }

      return !!data.minimumSpend;
    },
    {
      message:
        "Minimum spend is required for percentage and fixed cart coupons",
      path: ["minimumSpend"],
    }
  )
  .refine(
    (data) => {
      // Validate maxDiscount for percentage coupons with value > 0
      if (data.type === "percentage" && data.value && Number(data.value) > 0) {
        return !!data.maxDiscount;
      }

      return true;
    },
    {
      message:
        "Maximum discount is required for percentage coupons with a value greater than 0",
      path: ["maxDiscount"],
    }
  );

interface RootInventoryProps {
  setFormData: (data: any) => void;
  formData: any;
}
const paymentMethodOptions = [
  { value: "card", label: "Visa/Master" },
  { value: "cod", label: "Cash On Delivery" },
];
const RootGeneral: React.FC<RootInventoryProps> = ({
  formData,
  setFormData,
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [selectedCatalogSet, setSelectedCatalogSet] = useState<string[]>(
    formData.products || []
  );
  const [selectedCatalogSetSecond, setSelectedCatalogSetSecond] = useState<
    string[]
  >([]);
  const [selectedcatalogsSecond, setSelectedCatalogsSecond] = useState<
    { value: string; label: string }[]
  >([]);
  const [catalogDataSecond, setCatalogDataSecond] = useState<Product[]>([]);
  const [selectedcatalogs, setSelectedCatalogs] = useState<
    { value: string; label: string }[]
  >(formData.products || []);
  const [catalogData, setCatalogData] = useState<Product[]>([]);
  const [couponData, setCouponData] = useState<Coupon[]>([]);
  const [selectedCoupons, setSelectedCoupons] = useState<
    { value: string; label: string }[]
  >(formData.relatedCoupons || []);
  const [couponDataExcluded, setCouponDataExcluded] = useState<Coupon[]>([]);
  const [selectedCouponsExcluded, setSelectedCouponsExcluded] = useState<
    { value: string; label: string }[]
  >(formData.excludedcoupons || []);
  const [paymentPaymentMethodsData, setPaymentMethodsData] = useState<Coupon[]>(
    []
  );
  const [errorMessages, setErrorMessages] = useState<Record<string, string[]>>(
    {}
  );
  const [selectedPaymentMethodsData, setSelectedPaymentMethodsData] = useState<
    { value: string; label: string }[]
  >(formData.excludedcoupons || []);
  const animatedComponents = makeAnimated();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
      type: "free_shipping", // Default to free_shipping
      products: formData.products || [],
      excludeProducts: formData.excludeProducts || [],
      relatedCoupons: formData.relatedCoupons?.toString() || [],
      paymentMethods: formData.paymentMethods || [],
      minQuantity: formData.minQuantity || "",
    },
    mode: "onChange",
  });

  const couponType = form.watch("type");

  useEffect(() => {
    const getcatalogs = async () => {
      try {
        const res = await fetch(`/api/products`, {
          method: "POST",
        });
        const data = await res.json();
        setCatalogData(data.data.data);
        setCatalogDataSecond(data.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getcatalogs();
  }, []);

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
        // Fixed: safely access nested data property
        setCouponData(data?.data?.data || []);
        setCouponDataExcluded(data?.data?.data || []);
        // setTotalPages(data.data.last_page)
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getCoupons();
  }, []);

  const handelBack = () => {
    router.push("/admin/coupons");
  };

  const renderTags = (
    catalog: Product[]
  ): { value: string; label: string }[] => {
    return catalog.map((product) => ({
      value: product.id.toString(),
      label: product.name,
    }));
  };

  const handleTagClick = (selectedOptions: any) => {
    const selectedIds = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : [];
    setSelectedCatalogs(selectedOptions);

    form.setValue("products", selectedIds);
  };

  const renderTagsSecond = (
    catalog: Product[]
  ): { value: string; label: string }[] => {
    return catalog.map((product) => ({
      value: product.id.toString(),
      label: product.name,
    }));
  };

  const handleTagClickSecond = (selectedOptionss: any) => {
    const selectedIdss = Array.isArray(selectedOptionss)
      ? selectedOptionss.map((options) => options.value)
      : [];
    setSelectedCatalogsSecond(selectedOptionss);

    form.setValue("excludeProducts", selectedIdss);
  };

  const renderCoupons = (
    coupons: Coupon[]
  ): { value: string; label: string }[] => {
    return coupons.map((coupon) => ({
      value: coupon.id.toString(),
      label: coupon.code,
    }));
  };

  const renderCouponsExcluded = renderCoupons;

  const handleCouponsClick = (selectedOptions: any) => {
    setSelectedCoupons(selectedOptions);
    form.setValue(
      "relatedCoupons",
      selectedOptions.map((option: any) => option.value)
    );
  };

  const handleCouponsClickExcluded = (selectedOptions: any) => {
    setSelectedCouponsExcluded(selectedOptions);
    form.setValue(
      "excludedCoupons",
      selectedOptions.map((option: any) => option.value)
    );
  };

  const handlePayment = (paymentMethodOptions: any) => {
    setSelectedPaymentMethodsData(paymentMethodOptions);

    form.setValue(
      "paymentMethods",
      paymentMethodOptions.map((option: any) => option.value)
    );
  };

  useEffect(() => {
    const unwatch = form.watch((watchedValues) => {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        ...watchedValues,
      }));
    });

    return () => unwatch.unsubscribe();
  }, [form, setFormData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      // Prepare data based on coupon type
      let transformedData = {
        ...formData,
        isActive: formData.isActive ? 1 : 0,
        isPublic: formData.isPublic ? 1 : 0,
        isBulkOffer: formData.isBulkOffer ? 1 : 0,
        applyAutomatically: formData.applyAutomatically ? 1 : 0,
        individualUse: formData.individualUse ? 1 : 0,
        freeShipping: formData.type === "free_shipping" ? 1 : 0,
        products: formData.products || [],
        excludeProducts: formData.excludeProducts || [],
        relatedCoupons: formData.relatedCoupons || [],
        excludedCoupons: formData.excludedCoupons || [],
        paymentMethods: formData.paymentMethods || [],
      };

      // Set type-specific default values
      if (formData.type === "free_shipping") {
        transformedData.value = "0"; // Set default value for free shipping
        transformedData.maxDiscount = "0"; // Set default max discount for free shipping
      }

      const { data } = await axios.post("/api/coupons/create", transformedData);

      if (data) {
        toast({
          description: `${data.message}`,
          className: "bg-green-500 font-semibold text-white",
        });
        router.push("/admin/coupons");
      } else {
        console.error("Error submitting data:", data.statusText);
      }
    } catch (error: any) {
      if (error.response && error.response.data && error.response.data.errors) {
        setErrorMessages(error.response.data.errors);
        // Set form errors
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
    } finally {
      setIsLoading(false);
    }
  };

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
        <h1 className="text-xl font-bold">Add Coupon</h1>
      </div>

      <Card className="pt-4">
        <CardContent>
          {Object.keys(errorMessages).length > 0 && (
            <Alert variant="destructive" className="mb-6">
              <AlertDescription>
                <ul>
                  {Object.entries(errorMessages).map(([key, messages]) => (
                    <li key={key}>{messages[0]}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Coupon Type Selection - Always visible */}
              <div>
                <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                  Coupon Type
                </h2>
                <div className="grid grid-cols-1 max-w-md gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-md">
                          Coupon Type<span className="text-red-500">*</span>
                        </FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => {
                            field.onChange(value);
                            form.setValue("type", value);
                          }}
                        >
                          <FormControl>
                            <SelectTrigger>
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
              {couponType && (
                <>
                  {/* General Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      General
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Name<span className="text-red-500">*</span>
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
                          <FormItem>
                            <FormLabel className="text-md">
                              Code<span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input placeholder="Code" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      {couponType !== "free_shipping" && (
                        <FormField
                          control={form.control}
                          name="value"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-md">
                                Value <span className="text-red-500">*</span>
                                {couponType === "percentage" && " (0-100%)"}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Value"
                                  type="number"
                                  min={1}
                                  max={
                                    couponType === "percentage"
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
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Amounts
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="minimumSpend"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Minimum Spend
                              {(couponType === "percentage" ||
                                couponType === "fixed_cart") && (
                                  <span className="text-red-500">*</span>
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
                      {couponType === "percentage" && (
                        <FormField
                          control={form.control}
                          name="maxDiscount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-md">
                                Max Discount
                                <span className="text-red-500">*</span>
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
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Usage
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Start Date
                            </FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">End Date</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="usageLimitPerCoupon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Usage Limit Per Coupon
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Usage Limit Per Coupon"
                                type="number"
                                {...field}
                                min={1}
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
                          <FormItem>
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
                      {/* Payment Method field hidden - empty array passed in body */}
                      {/* <FormField
                        control={form.control}
                        name="paymentMethods"
                        render={({ field }) => (
                          <FormItem className="w-full">
                            <FormLabel className="text-md">
                              Payment Method
                            </FormLabel>
                            <FormControl>
                              <Selects
                                {...field}
                                isMulti
                                components={animatedComponents}
                                options={paymentMethodOptions}
                                onChange={handlePayment}
                                value={selectedPaymentMethodsData}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      /> */}
                      <FormField
                        control={form.control}
                        name="minQuantity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Min Quantity
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Min Quantity"
                                type="number"
                                min={1}
                                {...field}
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
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Products
                    </h2>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="products"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">Products</FormLabel>
                            {/* <Selects
                              {...field}
                              isMulti
                              components={animatedComponents}
                              options={renderTags(catalogData)}
                              onChange={handleTagClick}
                              value={selectedcatalogs}
                            /> */}
                            <Productselect form={form} field={field} />
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="excludeProducts"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Exclude Products
                            </FormLabel>
                            {/* <Selects
                              {...field}
                              isMulti
                              components={animatedComponents}
                              options={renderTagsSecond(catalogData)}
                              onChange={handleTagClickSecond}
                              value={selectedcatalogsSecond}
                            /> */}
                            <Productselect form={form} field={field} />

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {/* category */}
                  {/* <div>
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
                  </div> */}

                  {/* Related Coupons Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Related Coupons
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="relatedCoupons"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Related Coupons
                            </FormLabel>
                            <Selects
                              {...field}
                              isMulti
                              components={animatedComponents}
                              options={renderCoupons(couponData)}
                              onChange={handleCouponsClick}
                              value={selectedCoupons}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="excludedCoupons"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-md">
                              Excluded Coupons
                            </FormLabel>
                            <Selects
                              {...field}
                              isMulti
                              components={animatedComponents}
                              options={renderCouponsExcluded(
                                couponDataExcluded
                              )}
                              onChange={handleCouponsClickExcluded}
                              value={selectedCouponsExcluded}
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Settings Section */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 border-b pb-2">
                      Settings
                    </h2>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name="isActive"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-md">
                                Active<span className="text-red-500">*</span>
                              </FormLabel>
                              <FormDescription>
                                Enable the coupon
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
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-md">
                                Public<span className="text-red-500">*</span>
                              </FormLabel>
                              <FormDescription>
                                Make coupon public
                              </FormDescription>
                            </div>
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
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-md">
                                Bulk Offer
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormDescription className="">
                                Allow bulk offer
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <FormField
                        control={form.control}
                        name="individualUse"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-md">
                                Individual Use
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormDescription className="">
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
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel className="text-md">
                                Apply Automatically
                                <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormDescription className="">
                                Apply coupon automatically
                              </FormDescription>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-fit bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    {isLoading ? "Submitting..." : "Add Coupon"}
                  </Button>
                </>
              )}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RootGeneral;
