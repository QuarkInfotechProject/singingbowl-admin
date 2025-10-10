"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Select from "react-select";
import { Product } from "@/app/_types/products_Type/productType";
import { LaunchContent } from "@/app/_types/newLaunche-Types/newLaunchShow";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  link: z.string().nonempty("Link is required"),
  unitsSold: z
    .string()
    .nonempty("UnitsSold is required")
    .refine((val) => !isNaN(Number(val)), {
      message: "Units sold must be a valid number",
    })
    .transform(Number)
    .refine((val) => val >= 0, { message: "Units sold cannot be negative" }),
  reviewsCount: z
    .string()
    .nonempty("Reviews Count id required.")
    .refine((val) => !isNaN(Number(val)), {
      message: "Reviews count must be a valid number",
    })
    .transform(Number)
    .refine((val) => val >= 0, { message: "Reviews count cannot be negative" }),
  productId: z.string().min(1, { message: "Product selection is required" }),
  isActive: z.boolean(),
});

type ProductOption = {
  value: number;
  label: string;
};

const RootEdit = ({
  setRefetch,
  editContentData,
  fileId,
  setIsSheetOpens,
}: {
  setRefetch: (refetch: boolean) => void;
  editContentData: LaunchContent | null;
  fileId: number;
  setIsSheetOpens: (open: boolean) => void;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [catalogData, setCatalogData] = useState<Product[]>([]);
  const [defaultProductOption, setDefaultProductOption] =
    useState<ProductOption | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: editContentData?.data.isActive === 1 ? true : false,
      link: editContentData?.data.link?.toString() || "",
      unitsSold: editContentData?.data.unitsSold?.toString() || " ",
      reviewsCount: editContentData?.data.reviewsCount?.toString() || " ",
      productId: editContentData?.data.productId?.toString() || "",
    },
  });

  useEffect(() => {
    const getcatalogs = async () => {
      try {
        const res = await fetch(`/api/products`, {
          method: "POST",
        });
        const data = await res.json();
        setCatalogData(data.data.data);

        if (editContentData?.data) {
          const defaultProduct = data.data.data.find(
            (product: Product) =>
              product.id.toString() ===
              editContentData.data.productId.toString()
          );

          if (defaultProduct) {
            const productOption = {
              value: defaultProduct.id,
              label: defaultProduct.name,
            };

            // Set default product option
            setDefaultProductOption(productOption);

            // Set product ID in form
            form.setValue("productId", defaultProduct.id.toString());
          }
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive",
        });
      }
    };

    getcatalogs();
  }, [editContentData, form, toast]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fromData = {
      id: fileId.toString(),
      isActive: values.isActive,
      link: values.link.toString(),
      unitsSold: values.unitsSold.toString(),
      reviewsCount: values.reviewsCount.toString(),
      productId: values.productId.toString(),
    };
    setIsLoading(true);
    const result = formSchema.safeParse(fromData);
    if (!result.success) {
      // Handle validation errors
      result.error.issues.forEach((issue) => {
        const path = issue.path.join(".") as keyof typeof values;
        form.setError(path, {
          type: "manual",
          message: issue.message,
        });
      });
      return;
    }
    try {
      const { data } = await axios.post("/api/daraz-counts/update", fromData);
      if (data) {
        toast({
          description: `${data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        setRefetch(true);
        setIsSheetOpens(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorResponse = error.response?.data;
        // Handle specific field errors
        if (errorResponse?.errors) {
          Object.entries(errorResponse.errors).forEach(([key, message]) => {
            form.setError(key as keyof typeof values, {
              type: "manual",
              message: message as string,
            });
          });
        }

        if (errorResponse?.error) {
          toast({
            description: errorResponse.error,
            variant: "destructive",
          });
        }
      } else {
        toast({
          title: "Unexpected Error",
          description: `${error}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Update Daraz Count</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Link Input */}
              <FormField
                control={form.control}
                name="link"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Link</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter link" {...field} />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Units Sold Input */}
              <FormField
                control={form.control}
                name="unitsSold"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Units Sold</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Units sold"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Reviews Count Input */}
              <FormField
                control={form.control}
                name="reviewsCount"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Reviews Count</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Reviews count"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Product Select */}
              <FormField
                control={form.control}
                name="productId"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>Select Product</FormLabel>
                    <FormControl>
                      <Controller
                        name="productId"
                        control={form.control}
                        render={({ field: { onChange, value } }) => {
                          const selectedOption = catalogData.find(
                            (product) => product.id === value
                          );

                          return (
                            <Select
                              options={catalogData.map((product) => ({
                                value: product.id,
                                label: product.name,
                              }))}
                              value={
                                selectedOption
                                  ? {
                                      value: selectedOption.id,
                                      label: selectedOption.name,
                                    }
                                  : defaultProductOption
                              }
                              onChange={(selectedOption) => {
                                onChange(
                                  selectedOption
                                    ? selectedOption.value.toString()
                                    : ""
                                );
                              }}
                              placeholder="Select a product"
                            />
                          );
                        }}
                      />
                    </FormControl>
                    <FormMessage>{fieldState.error?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/* Active Checkbox */}
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>
                        This Active Offer is currently{" "}
                        {field.value ? "active" : "inactive"}
                      </FormDescription>
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="bg-[#5e72e4] hover:bg-[#465ad1]"
            >
              Submit
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootEdit;
