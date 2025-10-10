// "use client";
// import { useEffect, useState } from "react";
// import { UseFormReturn, useWatch } from "react-hook-form";
// import { z } from "zod";
// import { formSchema } from "../../add/page";
// import {
//   Form,
//   FormControl,
//   FormDescription,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import { Calendar } from "@/components/ui/calender";
// import { cn } from "@/lib/utils";
// // import { format, parseISO } from "date-fns";
// import { Button } from "@/components/ui/button";
// import { Switch } from "@/components/ui/switch";
// import { format, parseISO, addMonths, startOfDay, endOfDay } from "date-fns";

// interface ImageT {
//   id: number;
//   fileName: string;
//   width: number;
//   height: number;
//   url: string;
//   thumbnailUrl: string;
// }

// const NoVariantsPricing = ({
//   form,
// }: {
//   form: UseFormReturn<z.infer<typeof formSchema>>;
// }) => {
//   const [hideDates, setHideDates] = useState(true);
//   const { control } = form;
//   const specialPrice = useWatch({ control, name: "specialPrice" });

//   const formatDateForInput = (date: Date) => {
//     return format(date, "yyyy-MM-dd HH:mm");
//   };

//   const getDefaultStartDate = () => {
//     return formatDateForInput(new Date());
//   };

//   const getDefaultEndDate = () => {
//     return formatDateForInput(addMonths(new Date(), 1));
//   };
//   // Initialize dates when special price is entered
//   useEffect(() => {
//     if (specialPrice && specialPrice > 0) {
//       setHideDates(false);
//       if (!form.getValues("specialPriceStart")) {
//         const startDate = getDefaultStartDate();
//         form.setValue("specialPriceStart", startDate);
//         // Set the API formatted date in a separate field
//       }
//       if (!form.getValues("specialPriceEnd")) {
//         const endDate = getDefaultEndDate();
//         form.setValue("specialPriceEnd", endDate);
//         // Set the API formatted date in a separate field
//         // form.setValue("apiSpecialPriceEnd", formatDateForAPI(endDate));
//       }
//     } else {
//       setHideDates(true);
//       form.setValue("specialPriceEnd", null);
//       form.setValue("specialPriceStart", null);
//     }
//   }, [specialPrice, form]);

//   // console.log("deafult date", formatDateForDisplay);
//   console.log("deafult date", getDefaultEndDate);

//   const handleDateChange = (field: string, value: string) => {
//     const startDate =
//       field === "specialPriceStart"
//         ? value
//         : form.getValues("specialPriceStart");
//     const endDate =
//       field === "specialPriceEnd" ? value : form.getValues("specialPriceEnd");

//     if (startDate && endDate && startDate > endDate) {
//       // If start date is after end date, adjust the other date
//       if (field === "specialPriceStart") {
//         form.setValue("specialPriceEnd", value);
//       } else {
//         form.setValue("specialPriceStart", value);
//       }
//     }

//     form.setValue(field, value);
//   };

//   const specialPriceStart = form.watch("specialPriceStart");
//   const specialPriceEnd = form.watch("specialPriceEnd");

//   return (
//     <div className="grid grid-cols-[60%_1fr] gap-6">
//       <div className="bg-white p-5 rounded">
//         <h2 className="font-medium mb-4">Pricing Information</h2>
//         <FormField
//           control={form.control}
//           name="originalPrice"
//           render={({ field }) => (
//             <FormItem>
//               <div className="grid grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end">
//                 <div className="flex justify-end mt-3">
//                   <FormLabel className="font-normal">
//                     Original Price<span className="text-red-600">*</span>
//                   </FormLabel>
//                 </div>
//                 <div>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       min={0}
//                       className={
//                         form.formState.errors.originalPrice &&
//                         "border-red-600 focus:border-red-600"
//                       }
//                       placeholder=""
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage className="font-normal mt-2" />
//                   <FormDescription className="mt-1 text-sm">
//                     Enter the actual price of the product. If there is a
//                     discounted price available, then enter it below and this
//                     price will be crossed out.
//                   </FormDescription>
//                 </div>
//               </div>
//             </FormItem>
//           )}
//         />

//         <FormField
//           control={form.control}
//           name="specialPrice"
//           render={({ field }) => (
//             <FormItem>
//               <div className="grid grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end">
//                 <div className="flex justify-end mt-3">
//                   <FormLabel className="font-normal">
//                     Discounted/Special Price
//                   </FormLabel>
//                 </div>
//                 <div>
//                   <FormControl>
//                     <Input
//                       className={
//                         form.formState.errors.specialPrice &&
//                         "border-red-600 focus:border-red-600"
//                       }
//                       min={0}
//                       placeholder=""
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage className="font-normal mt-2" />
//                   <FormDescription className="mt-1 text-sm">
//                     Enter the discounted or special offer price of the product.
//                     If entered, this price will appear next to the corssed
//                     original price.
//                   </FormDescription>
//                 </div>
//               </div>
//             </FormItem>
//           )}
//         />
//         {/* select dates */}
//         <div
//           className={` grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end ${hideDates ? "hidden" : "grid"
//             }`}
//         >
//           <div className="flex justify-end mt-3"></div>
//           <div className="grid grid-cols-2 gap-4 ">
//             <FormField
//               control={form.control}
//               name="specialPriceStart"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel className="font-normal">
//                     Special Price Start <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <input
//                       type="datetime-local"
//                       className="w-full px-3 text-sm py-2 border rounded-md"
//                       value={field.value}
//                       onChange={(e) => {
//                         const newStartDate = e.target.value;
//                         // Set the display format date
//                         const formattedDate = newStartDate.replace("T", " ");
//                         // form.setValue("specialPriceStart", formattedDate);
//                         // Set the API format date

//                         const endDate = form.getValues("specialPriceEnd");
//                         if (endDate && newStartDate > endDate) {
//                           form.setValue("specialPriceEnd", newStartDate);
//                         }
//                       }}
//                       min={formatDateForInput(new Date())}
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Select start date and time for special price
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="specialPriceEnd"
//               render={({ field }) => (
//                 <FormItem className="flex flex-col">
//                   <FormLabel className="font-normal">
//                     Special Price Ends <span className="text-red-500">*</span>
//                   </FormLabel>
//                   <FormControl>
//                     <input
//                       type="datetime-local"
//                       className="w-full px-3 text-sm py-2 border rounded-md"
//                       value={field.value}
//                       onChange={(e:any) => {
//                         const newEndDate = e.target.value;
//                         // Set the display format date
//                         const formattedDate = newEndDate.replace("T", " ");

//                         // Set the display format date
//                         // form.setValue("specialPriceEnd", formattedDate);
//                         // Set the API format date

//                         const startDate = form.getValues("specialPriceStart");
//                         if (startDate && newEndDate < startDate) {
//                           form.setValue("specialPriceStart", newEndDate);
//                         }
//                       }}
//                       min={
//                         form.getValues("specialPriceStart") ||
//                         formatDateForInput(new Date())
//                       }
//                     />
//                   </FormControl>
//                   <FormDescription>
//                     Select end date and time for special price
//                   </FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//           </div>
//         </div>
//       </div>
//       {/* stock quantity and inStock status */}
//       <div className="rounded p-5 bg-white shadow-sm">
//         <FormField
//           control={form.control}
//           name="quantity"
//           render={({ field }) => (
//             <FormItem>
//               <div className=" gap-4 items-start justify-end">
//                 <div className="mb-3">
//                   <FormLabel className="font-semibold ">
//                     Stock Quantity <span className="text-red-600">*</span>
//                   </FormLabel>
//                   <div>
//                     <FormControl className="mt-2">
//                       <Input
//                         min={0}
//                         type="number"
//                         className={
//                           form.formState.errors.quantity &&
//                           "border-red-600  focus:border-red-600"
//                         }
//                         placeholder=""
//                         {...field}
//                       />
//                     </FormControl>
//                     <FormMessage className="font-normal mt-2" />
//                   </div>
//                   <FormDescription className="mt-3 text-sm">
//                     Enter Number of products you have in stock or the number of
//                     products that you can sell on your website.
//                   </FormDescription>
//                 </div>
//               </div>
//             </FormItem>
//           )}
//         />
//         <FormField
//           control={form.control}
//           name="sku"
//           render={({ field }) => (
//             <FormItem>
//               <div className="grid mb-4 mt-4 gap-4 items-start ">
//                 <div className="flex mt-3">
//                   <FormLabel className="">
//                     SKU(Stock Keeping Unit)
//                     <span className="text-red-600">*</span>
//                   </FormLabel>
//                 </div>
//                 <div>
//                   <FormControl>
//                     <Input
//                       className={
//                         form.formState.errors.sku &&
//                         "border-red-600 focus:border-red-600"
//                       }
//                       placeholder=""
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage className="font-normal mt-2" />
//                   <FormDescription className="mt-1 text-sm">
//                     Enter your product's{" "}
//                     <span
//                       className="underline"
//                       title="It is a number or code that is associated with a particular product or item in order to help identify and track it."
//                     >
//                       SKU
//                     </span>
//                     . You'll use it for maintaining your inventory.
//                   </FormDescription>
//                 </div>
//               </div>
//             </FormItem>
//           )}
//         />
//         {/* in stock */}
//         <FormField
//           control={form.control}
//           name="inStock"
//           render={({ field }) => (
//             <FormItem>
//               <div className="flex gap-4 items-center justify-between">
//                 <FormLabel className="">Stock status</FormLabel>
//                 <div>
//                   <FormControl>
//                     <Switch
//                       checked={field.value === 1}
//                       onCheckedChange={(checked) =>
//                         field.onChange(checked ? 1 : 0)
//                       }
//                     />
//                   </FormControl>
//                   <FormMessage className="font-normal mt-2" />
//                 </div>
//               </div>
//               <FormDescription className="mt-1 text-sm">
//                 Product appears as "out of stock" when disabled. You might want
//                 to manually mark the product as out of stock in some cases.
//               </FormDescription>
//             </FormItem>
//           )}
//         />
//       </div>
//     </div>
//   );
// };

// export default NoVariantsPricing;
"use client";
import { useEffect, useState } from "react";
import { UseFormReturn, useWatch } from "react-hook-form";
import { z } from "zod";
import { formSchema } from "../../add/page";
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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format, addMonths } from "date-fns";

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

  const getDefaultEndDate = () => {
    return formatDateForInput(addMonths(new Date(), 1));
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

  return (
    <div className="grid grid-cols-[60%_1fr] gap-6">
      <div className="bg-white p-5 rounded">
        <h2 className="font-medium mb-4">Pricing Information</h2>
        {/* Original Price Field */}
        <FormField
          control={form.control}
          name="originalPrice"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end">
                <div className="flex justify-end mt-3">
                  <FormLabel className="font-normal">
                    Original Price<span className="text-red-600">*</span>
                  </FormLabel>
                </div>
                <div>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      className={
                        form.formState.errors.originalPrice &&
                        "border-red-600 focus:border-red-600"
                      }
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                  <FormDescription className="mt-1 text-sm">
                    Enter the actual price of the product. If there is a
                    discounted price available, then enter it below and this
                    price will be crossed out.
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Special Price Field */}
        <FormField
          control={form.control}
          name="specialPrice"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end">
                <div className="flex justify-end mt-3">
                  <FormLabel className="font-normal">
                    Discounted/Special Price
                  </FormLabel>
                </div>
                <div>
                  <FormControl>
                    <Input
                      className={
                        form.formState.errors.specialPrice &&
                        "border-red-600 focus:border-red-600"
                      }
                      min={0}
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                  <FormDescription className="mt-1 text-sm">
                    Enter the discounted or special offer price of the product.
                    If entered, this price will appear next to the crossed
                    original price.
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* Date Selection Fields */}
        <div
          className={`grid-cols-[30%_69%] mt-4 gap-4 items-start justify-end ${
            hideDates ? "hidden" : "grid"
          }`}
        >
          <div className="flex justify-end mt-3"></div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="specialPriceStart"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-normal">
                    Special Price Start <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      className="w-full px-3 text-sm py-2 border rounded-md"
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
                  <FormDescription>
                    Select start date and time for special price
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="specialPriceEnd"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel className="font-normal">
                    Special Price Ends <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <input
                      type="datetime-local"
                      className="w-full px-3 text-sm py-2 border rounded-md"
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
                  <FormDescription>
                    Select end date and time for special price
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </div>

      {/* Stock Information Section */}
      <div className="rounded p-5 bg-white shadow-sm">
        {/* Stock Quantity Field */}
        <FormField
          control={form.control}
          name="quantity"
          render={({ field }) => (
            <FormItem>
              <div className="gap-4 items-start justify-end">
                <div className="mb-3">
                  <FormLabel className="font-semibold">
                    Stock Quantity <span className="text-red-600">*</span>
                  </FormLabel>
                  <div>
                    <FormControl className="mt-2">
                      <Input
                        min={1}
                        type="number"
                        // onKeyPress={(e) => {
                        //   if (e.key === "0" && !field.value) {
                        //     e.preventDefault();
                        //   }
                        // }}

                        className={
                          form.formState.errors.quantity &&
                          "border-red-600 focus:border-red-600"
                        }
                        placeholder=""
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="font-normal mt-2 text-red-600">
                      {form.formState.errors.quantity?.message}
                    </FormMessage>
                  </div>
                  <FormDescription className="mt-3 text-sm">
                    Enter Number of products you have in stock or the number of
                    products that you can sell on your website.
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* SKU Field */}
        <FormField
          control={form.control}
          name="sku"
          render={({ field }) => (
            <FormItem>
              <div className="grid mb-4 mt-4 gap-4 items-start">
                <div className="flex mt-3">
                  <FormLabel className="">
                    SKU(Stock Keeping Unit)
                    <span className="text-red-600">*</span>
                  </FormLabel>
                </div>
                <div>
                  <FormControl>
                    <Input
                      className={
                        form.formState.errors.sku &&
                        "border-red-600 focus:border-red-600"
                      }
                      placeholder=""
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="font-normal mt-2" />
                  <FormDescription className="mt-1 text-sm">
                    Enter your product's{" "}
                    <span
                      className="underline"
                      title="It is a number or code that is associated with a particular product or item in order to help identify and track it."
                    >
                      SKU
                    </span>
                    . You'll use it for maintaining your inventory.
                  </FormDescription>
                </div>
              </div>
            </FormItem>
          )}
        />

        {/* In Stock Toggle */}
        <FormField
          control={form.control}
          name="inStock"
          render={({ field }) => (
            <FormItem>
              <div className="flex gap-4 items-center justify-between">
                <FormLabel className="">Stock status</FormLabel>
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
                Product appears as "out of stock" when disabled. You might want
                to manually mark the product as out of stock in some cases.
              </FormDescription>
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default NoVariantsPricing;
