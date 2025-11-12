"use client";

import { z } from "zod";
import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import { formSchema } from "../../add/page";
import { Textarea } from "@/components/ui/textarea";
import { usePathname } from "next/navigation";
import { format } from "date-fns";
import dynamic from "next/dynamic";
const CkEditor = dynamic(
  () => {
    return import("@/components/ui/ckeditor");
  },
  { ssr: false }
);

const General = ({
  form,
  clearErrors,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  clearErrors: any;
}) => {
  const pathname = usePathname();

  const [isEditMode, setIsEditMode] = useState(true);
  useEffect(() => {
    if (pathname.includes("/edit")) {
      setIsEditMode(true);
    } else {
      setIsEditMode(false);
    }
  }, []);

  const formatDateTimeForInput = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // Get current and max dates in correct format
  const currentDateTime = formatDateTimeForInput(new Date().toISOString());
  const maxDateTime = formatDateTimeForInput(
    new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString()
  );

  const handleDateTimeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: any
  ) => {
    const inputValue = e.target.value;
    if (!inputValue) {
      field.onChange(null);
      return;
    }

    // Convert the datetime-local input value to our desired format
    const formattedDate = inputValue.replace("T", " ");
    const date = new Date(inputValue);

    // Store as ISO string in form state but format for API
    field.onChange(date.toISOString());
    return formattedDate;
  };

  const postDescription = useWatch({
    control: form.control,
    name: "description",
  });

  console.log("the description is :::::::::::::::::::::::::::::::::", postDescription)
  const postAdditionalDescription = useWatch({
    control: form.control,
    name: "additionalDescription",
  });
    console.log(
      "the Quality data is ::::::",    );

    console.log("the Quality data is :::::::::::::::::::::::::::::::::", postAdditionalDescription)

  return (
    <div className="bg-white rounded flex flex-col gap-y-5 p-5">
      <h2 className="font-medium mb-4">General Information</h2>
      <FormField
        control={form.control}
        name="productName"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-[30%_69%] gap-4 items-start justify-end">
              <div className="flex justify-end mt-3">
                <FormLabel className="font-normal">
                  Product Name <span className="text-red-600">*</span>
                </FormLabel>
              </div>
              <div>
                <FormControl>
                  <Input
                    className={
                      form.formState.errors.productName &&
                      "border-red-600 focus:border-red-600"
                    }
                    placeholder="eg. Apple's New iPhone 16e Available Now."
                    {...field}
                  />
                </FormControl>
                <FormMessage className="font-normal mt-2" />
              </div>
            </div>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <div className="grid grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end">
              <div className="flex justify-end mt-3">
                <FormLabel className="font-normal">
                  Product URL <span className="text-red-600">*</span>
                </FormLabel>
              </div>
              <div>
                <FormControl>
                  <Input
                    className={
                      form.formState.errors.url &&
                      "border-red-600 focus:border-red-600"
                    }
                    placeholder=" "
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage className="font-normal mt-2" />
                <FormDescription className="mt-1 text-sm">
                  http://.../products/s/.. This URL will be used to get to this
                  product
                </FormDescription>
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Description section */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <div className="mt-4 gap-4 items-start justify-end">
              <div className="mb-4 mt-10">
                <FormLabel className="font-normal">
                  HOW TO USE <span className="text-red-600">*</span>
                </FormLabel>
                <FormDescription className="mt-1 text-sm">
                  Enter a concise description of the product. This will be
                  displayed below the product's title on your website's product
                  page.
                </FormDescription>
              </div>
              <div>
                <CkEditor
                  id="Product-description"
                  initialData={postDescription}
                  onChange={(content) => {
                    form.setValue("description", content);
                  }}
                />
                <FormMessage className="font-normal mt-2" />
              </div>
            </div>
          </FormItem>
        )}
      />

      {/* Additional Description section */}
      <FormField
        control={form.control}
        name="additionalDescription"
        render={({ field }) => (
          <FormItem>
            <div className="mt-4 gap-4 items-start justify-end">
              <div className="mb-4 mt-10">
                <FormLabel className="font-normal">QUALITY </FormLabel>
                <FormDescription className="mt-1 text-sm">
                  Enter additional information about the product. This section
                  is optional and can contain extra details, specifications, or
                  usage guidelines.
                </FormDescription>
              </div>
              <div>
                <CkEditor
                  id="Product-additional-description" 
                  initialData={postAdditionalDescription}
                  onChange={(content) => {
                    form.setValue("additionalDescription", content || "");
                  }}
                />
                <FormMessage className="font-normal mt-2" />
              </div>
            </div>
          </FormItem>
        )}
      />

      <div className="rounded p-2 px-14 mt-7 bg-gray-100 shadow-sm">
        <FormField
          control={form.control}
          name="saleStart"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sale Start</FormLabel>
              <FormControl>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 text-sm border rounded-md"
                  min={currentDateTime}
                  max={maxDateTime}
                  value={
                    field.value
                      ? formatDateTimeForInput(field.value).replace(" ", "T")
                      : ""
                  }
                  onChange={(e) => {
                    const formattedDate = handleDateTimeChange(e, field);
                    if (formattedDate) {
                      form.setValue("saleStart", formattedDate);
                    }
                  }}
                  step="60"
                />
              </FormControl>
              <FormDescription>
                Choose the start date and time for the sale.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="saleEnd"
          render={({ field }) => (
            <FormItem className="mt-4">
              <FormLabel>Sale End</FormLabel>
              <FormControl>
                <input
                  type="datetime-local"
                  className="w-full px-3 py-2 text-sm border rounded-md"
                  min={currentDateTime}
                  max={maxDateTime}
                  value={
                    field.value
                      ? formatDateTimeForInput(field.value).replace(" ", "T")
                      : ""
                  }
                  onChange={(e) => {
                    const formattedDate = handleDateTimeChange(e, field);
                    if (formattedDate) {
                      form.setValue("saleEnd", formattedDate);
                    }
                  }}
                  step="60"
                />
              </FormControl>
              <FormDescription>
                Choose the end date and time for the sale.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default General;
