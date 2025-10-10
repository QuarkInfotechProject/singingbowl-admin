"use client";
import { z } from "zod";
import { UseFormReturn, useForm } from "react-hook-form";
import { format, parse, parseISO } from "date-fns";
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
import { Switch } from "@/components/ui/switch";
import CategoriesSelect from "./CategoriesSelect";
import TagsSelect from "./TagsSelect";
import BrandSelect from "./BrandSelect";
const GeneralSide = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const formatDateTimeForInput = (dateTimeStr: string | null) => {
    if (!dateTimeStr) return "";
    const date = new Date(dateTimeStr);
    return format(date, "yyyy-MM-dd HH:mm");
  };

 

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

  // Get current and max dates in correct format
  const currentDateTime = formatDateTimeForInput(new Date().toISOString());
  const maxDateTime = formatDateTimeForInput(
    new Date(new Date().setFullYear(new Date().getFullYear() + 2)).toISOString()
  );

  return (
    <div className="p-3">
      {/* Rest of your JSX code remains the same */}
      <div className="rounded pb-2">
        <h2 className="font-medium">Categories, Tags and Status </h2>
      </div>

      {/* product status */}
      <div className="rounded p-5 mt-2 bg-white shadow-sm">
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4 items-center justify-between">
                <FormLabel className="">Show in Shop</FormLabel>
                <div>
                  <FormControl>
                    <Switch
                      checked={field.value === 1}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 1 : 0)
                      }
                    />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                </div>
              </div>
              <FormDescription className="mt-1 text-sm">
                The product will be available on your store, when enabled.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
      <div className="rounded p-5 mt-2 bg-white shadow-sm">
        <FormField
          control={form.control}
          name="bestSeller"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4 items-center justify-between">
                <FormLabel>Best Seller</FormLabel>
                <div>
                  <FormControl>
                    <Switch
                      checked={!!field.value}
                      onCheckedChange={(checked) =>
                        field.onChange(checked ? 1 : 0)
                      }
                    />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* tags and categories */}
      <div className="rounded p-5 mt-2 gap-y-5 bg-white shadow-sm">
        <FormField
          control={form.control}
          name="brandId"
          render={({ field }) => (
            <FormItem>
              <div className="gap-4 items-start justify-end">
                <div className="mb-4">
                  <FormLabel className="font-semibold">Brand</FormLabel>
                  <FormDescription className="mt-1 text-sm">
                    Choose brand for your product.
                  </FormDescription>
                </div>
                <div>
                  <FormControl>
                    <BrandSelect field={field} />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categories"
          render={({ field }) => (
            <FormItem>
              <div className="gap-4 mt-5 items-start justify-end">
                <div className="mb-4">
                  <FormLabel className="font-semibold">Category</FormLabel>
                  <FormDescription className="mt-1 text-sm">
                    Choose categories for your product.
                  </FormDescription>
                </div>
                <div>
                  <FormControl>
                    <CategoriesSelect field={field} />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tags"
          render={({ field }) => (
            <FormItem>
              <div className="mt-6 gap-4 items-start justify-end">
                <div className="mb-4">
                  <FormLabel className="font-semibold">Tags</FormLabel>
                  <FormDescription className="mt-1 text-sm">
                    Choose tags for your product.
                  </FormDescription>
                </div>
                <div>
                  <FormControl>
                    <TagsSelect field={field} />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                </div>
              </div>
            </FormItem>
          )}
        />
      </div>

      {/* <div className="rounded p-5 mt-2 bg-white shadow-sm">
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
                    // If you need to store the API format separately
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
                    // If you need to store the API format separately
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
      </div> */}

      <div className="rounded p-5 mt-2 bg-white shadow-sm">
        <FormField
          control={form.control}
          name="newFrom"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>New From</FormLabel>
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
                      form.setValue("newFrom", formattedDate);
                    }
                  }}
                  step="60"
                />
              </FormControl>
              <FormDescription>
                Choose the new from date and time to display "new" tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newTo"
          render={({ field }) => (
            <FormItem className="flex flex-col mt-4">
              <FormLabel>New To</FormLabel>
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
                      form.setValue("newTo", formattedDate);
                    }
                  }}
                  step="60"
                />
              </FormControl>
              <FormDescription>
                Choose the new to date and time to display "new" tag.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default GeneralSide;
