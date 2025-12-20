"use client";
import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../add/page";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { format, addMonths } from "date-fns";
import {
  DollarSign,
  Package,
  Tag,
  Scale,
  ToggleLeft,
  Calendar,
  Percent
} from "lucide-react";

const NoVariantsPricing = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const [hideDates, setHideDates] = useState(true);
  const { control } = form;
  const specialPrice = useWatch({ control, name: "specialPrice" });

  const formatDateForInput = (date: Date) => {
    return format(date, "yyyy-MM-dd HH:mm");
  };

  // Modified useEffect to only set end date when special price is entered
  useEffect(() => {
    if (specialPrice && specialPrice > 0) {
      setHideDates(false);
    } else {
      setHideDates(true);
      form.setValue("specialPriceEnd", null);
      form.setValue("specialPriceStart", null);
    }
  }, [specialPrice, form]);

  // Default quantity is set in parent form, no longer forcing it to 1

  return (
    <div className="space-y-6">
      {/* Pricing Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-50 to-green-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <DollarSign className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Pricing Information</h2>
              <p className="text-sm text-gray-500">Set the product price and any discounts</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Original Price */}
          <FormField
            control={form.control}
            name="originalPrice"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-gray-400" />
                      Original Price
                      <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          $
                        </span>
                        <Input
                          type="number"
                          min={0}
                          className={`pl-10 h-11 text-base ${form.formState.errors.originalPrice
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            }`}
                          placeholder="0.00"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="mt-1.5 text-sm" />
                    <FormDescription className="mt-2 text-xs text-gray-500">
                      The regular selling price before any discounts
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Discounted Price */}
          <FormField
            control={form.control}
            name="specialPrice"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Percent className="h-4 w-4 text-gray-400" />
                      Discounted Price
                      <span className="ml-2 px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded-full">
                        Optional
                      </span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative mt-2">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                          $
                        </span>
                        <Input
                          type="number"
                          min={0}
                          className={`pl-10 h-11 text-base ${form.formState.errors.specialPrice
                            ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                            : "border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                            }`}
                          placeholder="0.00"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="mt-1.5 text-sm" />
                    <FormDescription className="mt-2 text-xs text-gray-500">
                      Sale price. Original price will be shown crossed out.
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            )}
          />

          {/* Date Selection - Only shown when special price is set */}
          <div
            className={`transition-all duration-300 ease-in-out ${hideDates ? "hidden" : "block"
              }`}
          >
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-medium text-amber-800">
                  Discount Period
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="specialPriceStart"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        Start Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          type="datetime-local"
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          value={field.value || ""}
                          onChange={(e) => {
                            const newStartDate = e.target.value;
                            field.onChange(newStartDate);
                            const endDate = form.getValues("specialPriceEnd");
                            if (endDate && newStartDate > endDate) {
                              form.setValue("specialPriceEnd", newStartDate);
                            }
                          }}
                          min={formatDateForInput(new Date())}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialPriceEnd"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-medium text-gray-700">
                        End Date <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <input
                          type="datetime-local"
                          className="w-full h-10 px-3 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                          value={field.value || ""}
                          onChange={(e) => {
                            const newEndDate = e.target.value;
                            field.onChange(newEndDate);
                            const startDate = form.getValues("specialPriceStart");
                            if (startDate && newEndDate < startDate) {
                              form.setValue("specialPriceStart", newEndDate);
                            }
                          }}
                          min={
                            form.getValues("specialPriceStart") ||
                            formatDateForInput(new Date())
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Package className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-800">Inventory & Shipping</h2>
              <p className="text-sm text-gray-500">Manage stock and shipping details</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* SKU and Quantity Row */}
          <div className="grid grid-cols-2 gap-6">
            {/* SKU Field */}
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    SKU (Stock Keeping Unit)
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      className={`h-11 text-base ${form.formState.errors.sku
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                        }`}
                      placeholder="e.g., SB-001"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="mt-1.5 text-sm" />
                  <FormDescription className="mt-2 text-xs text-gray-500">
                    Unique product identifier for inventory tracking
                  </FormDescription>
                </FormItem>
              )}
            />

            {/* Quantity Field */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    Stock Quantity
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      step={1}
                      className={`h-11 text-base ${form.formState.errors.quantity
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                        }`}
                      placeholder="e.g., 100"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : parseInt(value, 10));
                      }}
                    />
                  </FormControl>
                  <FormMessage className="mt-1.5 text-sm" />
                  <FormDescription className="mt-2 text-xs text-gray-500">
                    Number of items available in stock
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Weight Field */}
          <FormField
            control={form.control}
            name="weight"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-gray-400" />
                  Product Weight
                </FormLabel>
                <FormControl>
                  <div className="relative max-w-xs">
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      className={`h-11 text-base pr-16 ${form.formState.errors.weight
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-300 focus:border-blue-500"
                        }`}
                      placeholder="e.g., 3.5"
                      {...field}
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        field.onChange(value === "" ? null : parseFloat(value));
                      }}
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      Kg
                    </span>
                  </div>
                </FormControl>
                <FormMessage className="mt-1.5 text-sm" />
                <FormDescription className="mt-2 text-xs text-gray-500">
                  Product weight in kilograms for shipping calculations
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Stock Status Toggle */}
          <div className="pt-4 border-t border-gray-100">
            <FormField
              control={form.control}
              name="inStock"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-white rounded-lg border border-gray-200">
                        <ToggleLeft className="h-5 w-5 text-gray-500" />
                      </div>
                      <div>
                        <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                          Stock Status
                        </FormLabel>
                        <FormDescription className="text-xs text-gray-500 mt-0.5">
                          {field.value === 1
                            ? "Product is available for purchase"
                            : "Product shows as out of stock"}
                        </FormDescription>
                      </div>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value === 1}
                        onCheckedChange={(checked) =>
                          field.onChange(checked ? 1 : 0)
                        }
                        className="data-[state=checked]:bg-emerald-500"
                      />
                    </FormControl>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoVariantsPricing;
