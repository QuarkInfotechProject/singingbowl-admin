"use client";
import React, { useState, useRef, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import makeAnimated from "react-select/animated";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MdOutlineFileUpload } from "react-icons/md";
import { Checkbox } from "@/components/ui/checkbox";
import Select from "react-select";
import { Product } from "@/app/_types/products_Type/productType";

const formSchema = z.object({
  link: z.string().nonempty("please enter link."),
  unitsSold: z
    .string()
    .nonempty("Please enter unitSold")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .transform(Number),
  reviewsCount: z
    .string()
    .nonempty("please enter reviewscount")
    .refine((val) => !isNaN(Number(val)), {
      message: "Must be a valid number",
    })
    .transform(Number),
  productId: z.string().nonempty("please select product"),
  isActive: z.boolean(),
});

const RootCreate = ({
  setRefetch,
  setIsSheetOpenss,
}: {
  setRefetch: any;
  setIsSheetOpenss: any;
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [isSheetsOpen, setIsSheetsOpen] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState<{
    value: number;
    label: string;
  } | null>(null);

  const [catalogData, setCatalogData] = useState<Product[]>([]);
  const [formData, setFormData] = useState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      isActive: false,
      link: "",
      unitsSold: "",
      reviewsCount: "",
      productId: "",
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
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    getcatalogs();
  }, []);

  // const handleRemoveImage = (idToRemove: string) => {

  //   const updatedPreviews = selectedPreview.filter(
  //     (preview) => preview.id !== idToRemove
  //   );

  //   const LogoId = updatedPreviews.length > 0 ? updatedPreviews[updatedPreviews.length - 1].id : '';
  //   setFormData((prevFormData: any) => ({
  //     ...prevFormData,

  //     image: LogoId,

  //   }));
  //   setSelectedPreview(updatedPreviews);
  // };
  // const handleRemoveImages = (idToRemove: string) => {

  //   const updatedPreviews = selectedPreviews.filter(
  //     (preview) => preview.id !== idToRemove
  //   );

  //   const LogoId = updatedPreviews.length > 0 ? updatedPreviews[updatedPreviews.length - 1].id : '';
  //   setFormDatas((prevFormData: any) => ({
  //     ...prevFormData,

  //     mobileFile: LogoId,

  //   }));
  //   setSelectedPreviews(updatedPreviews);
  // };
  console.log("from of image", formData);
  const { clearErrors } = form;
  const handleSubmit = async () => {
    const values = form.getValues();
    const result = formSchema.safeParse(values);

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
    const fromData = {
      isActive: values.isActive,
      link: values.link,
      unitsSold: values.unitsSold,
      reviewsCount: values.reviewsCount,
      productId: values.productId,
    };
   console.log("Subbmitting forms datas while creating",fromData)
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/darazCount/add", fromData);

      if (data) {
        toast({ description: `${data.message}`, className: "bg-green-500 text-white font-semibold" });
        setRefetch(true);
        setIsSheetOpenss(false);
        setIsSheetsOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors?.link;
        const errorDesktop = error.response?.data?.errors?.isActive;
        const errorUnit = error.response?.data?.errors?.unitsSold;
        const errorCount = error.response?.data?.errors?.reviewsCount;
        // const errorImages =error.response?.data?.errors?.files?.mobileImage;

        if (errorMsg) {
          form.setError("link", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("isActive", {
            type: "manual",
            message: errorDesktop || "",
          });
          form.setError("unitsSold", {
            type: "manual",
            message: errorUnit || "",
          });
          form.setError("reviewsCount", {
            type: "manual",
            message: errorCount || "",
          });

          setIsLoading(false);
          toast({
            description: errorMsg,
            variant: "destructive",
          });
        }
      } else {
        setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleProductChange = (
    selectedOption: { value: string; label: string } | null
  ) => {
    setSelectedProduct(selectedOption);
    form.setValue("productId", selectedOption ? selectedOption.value : "");
    clearErrors("productId")
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Add Daraz Count</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="h-full  w-full p-6">
            <form className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="link"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Link
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Enter name"
                          {...field}
                          onChange={(e) => {
                            field.onChange(e);
                            if (fieldState.error) {
                              form.clearErrors("link");
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="unitsSold"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Unit Sold
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Unit Sold"
                          {...field}
                          min={1}
                          onChange={(e) => {
                            field.onChange(e);
                            if (fieldState.error) {
                              form.clearErrors("unitsSold");
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="reviewsCount"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel className="text-md text-black dark:text-white">
                        Review Count
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter Review Count"
                          {...field}
                          min={1}
                          onChange={(e) => {
                            field.onChange(e);
                            if (fieldState.error) {
                              form.clearErrors("reviewsCount");
                            }
                          }}
                        />
                      </FormControl>
                      <FormDescription></FormDescription>
                      <FormMessage> {fieldState.error?.message}</FormMessage>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="productId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Product</FormLabel>
                      <Select
                        options={catalogData.map((product) => ({
                          value: product.id,
                          label: product.name,
                        }))}
                        value={selectedProduct}
                        onChange={handleProductChange}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md  p-4">
                      {/* <FormLabel className="text-md text-black dark:text-white">
               isActive
                </FormLabel> */}
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
                type="button"
                onClick={handleSubmit}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                {" "}
                Submit
              </Button>
            </form>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default RootCreate;
