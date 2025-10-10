"use client";
import { useEffect, useState } from "react";
import { z } from "zod";
import { formSchema } from "../../add/page";
import { UseFormReturn, useWatch, useFieldArray } from "react-hook-form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { transformOutgoingData } from "../../edit/[uuid]/RootLayout";

interface Variant {
  sku: string;
  name: string;
  status?: 0 | 1;
  originalPrice?: number;
  specialPrice?: number | null;
  specialPriceStart?: string;
  specialPriceEnd?: string;
  quantity?: number;
  inStock?: 0 | 1;
  optionName1?: string;
  optionName2?: string;
  optionName3?: string;
  optionName4?: string;
  optionName5?: string;
  optionName6?: string;
  optionName7?: string;
  optionName8?: string;
  optionName9?: string;
  optionName10?: string;
  optionData1?: string;
  [key: string]: any; // For other dynamic fields
}

type VariantFieldPath = `variants.${number}.${keyof Variant}`;

const VariantDetailss = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const variantFormValues = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: [],
  }) as Variant[];

  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  });

  const result: Record<string, string[]> = {};

  interface OptionValue {
    optionName: string;
    optionData?: string;
    files?: {
      baseImage?: string;
      additionalImage?: string[];
      descriptionVideo?: string;
    };
  }

  interface OptionCategory {
    name: string;
    isColor: string;
    values: OptionValue[];
  }

  const watchedOptions: OptionCategory[] = useWatch({
    control: form.control,
    name: "options",
    defaultValue: [],
  });
  transformOutgoingData(watchedOptions).forEach((category: OptionCategory) => {
    const categoryName: string = category.name;
    const optionNameProperty = "optionName";

    if (category.values && category.values.length > 0) {
      result[categoryName] = category.values.map(
        (option: OptionValue) => option[optionNameProperty]
      );
    }
  });

  const values: string[][] = Object.values(result);

  return (
    <div
      className={`overflow-x-auto ${
        variantFormValues.length < 1 ? "hidden" : ""
      }`}
    >
      <p className="text-2xl my-2 mt-5 font-medium">Variant Details</p>
      <Table className="min-w-[1200px]">
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            {Object.keys(result).map((item) => {
              return <TableHead key={item}>{item}</TableHead>;
            })}
            <TableHead>
              Price <span className="text-red-500">*</span>
            </TableHead>
            <TableHead className="whitespace-nowrap">Special Price</TableHead>
            <TableHead className="whitespace-nowrap">
              Special Price Start & End Date
            </TableHead>
            <TableHead>
              Quantity <span className="text-red-500">*</span>
            </TableHead>
            <TableHead className="whitespace-nowrap">Seller SKU</TableHead>
            <TableHead className="whitespace-nowrap">Stock Status</TableHead>
            <TableHead>Available</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {variantFormValues.length > 0 &&
            variantFormValues.map((item, index) => {
              return (
                <TableRow key={item.name}>
                  <div className="hidden">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.optionData1` as VariantFieldPath}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              readOnly
                              className="w-[200px]"
                              placeholder=""
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.name` as VariantFieldPath}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-[200px]"
                              placeholder="Name"
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {Array.from({ length: 10 }, (_, i) => i + 1).map(
                    (optionNum) => {
                      const optionFieldName =
                        `optionName${optionNum}` as keyof Variant;
                      const optionValue = item[optionFieldName];

                      return (
                        optionValue &&
                        optionValue.length > 0 && (
                          <TableCell key={`option-${optionNum}-${index}`}>
                            <FormField
                              control={form.control}
                              name={
                                `variants.${index}.${optionFieldName}` as VariantFieldPath
                              }
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      readOnly
                                      className="w-[100px]"
                                      placeholder=""
                                      {...field}
                                      value={String(field.value ?? "")}
                                    />
                                  </FormControl>
                                  <FormMessage className="font-normal mt-2" />
                                </FormItem>
                              )}
                            />
                          </TableCell>
                        )
                      );
                    }
                  )}

                  <TableCell>
                    <FormField
                      control={form.control}
                      name={
                        `variants.${index}.originalPrice` as VariantFieldPath
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-[150px]"
                              type="number"
                              min={0}
                              placeholder="Original Price"
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={
                        `variants.${index}.specialPrice` as VariantFieldPath
                      }
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-[200px]"
                              placeholder="Discounted/Special Price
"
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                  <TableCell className="justify-center flex items-center text-center">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button className="hover:text-cyan-500" variant="link">
                          Add
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-92">
                        <div>
                          <DateSelect form={form} index={index} />
                        </div>
                      </PopoverContent>
                    </Popover>
                    <FormMessage className="text-xs text-center">
                      {(form.formState.errors.variants?.[index]
                        ?.specialPriceStart?.message ||
                        form.formState.errors.variants?.[index]?.specialPriceEnd
                          ?.message ||
                        form.formState.errors.variants?.[index]
                          ?.specialPrice) &&
                        "Error Here in special price"}
                    </FormMessage>
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.quantity` as VariantFieldPath}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-[120px]"
                              type="number"
                              min={0}
                              placeholder="Quantity"
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`variants.${index}.sku` as VariantFieldPath}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Input
                              className="w-[200px]"
                              type="text"
                              placeholder="sku"
                              {...field}
                              value={String(field.value ?? "")}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className="text-center">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.inStock` as VariantFieldPath}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? 1 : 0)
                              }
                              style={{ transform: "scale(0.6)" }}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell className="text-center">
                    <FormField
                      control={form.control}
                      name={`variants.${index}.status` as VariantFieldPath}
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? 1 : 0)
                              }
                              style={{ transform: "scale(0.6)" }}
                            />
                          </FormControl>
                          <FormMessage className="font-normal mt-2" />
                        </FormItem>
                      )}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </div>
  );
};

export default VariantDetailss;

// const DateSelect = ({
//   form,
//   index,
// }: {
//   form: UseFormReturn<z.infer<typeof formSchema>>;
//   index: number;
// }) => {
//   const specialPriceStart = form.watch(`variants.${index}.specialPriceStart`);
//   const specialPriceEnd = form.watch(`variants.${index}.specialPriceEnd`);

//   const formatDateTime = (date: Date) => {
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");

//     return `${year}-${month}-${day} ${hours}:${minutes}`;
//   };

//   const formatForInput = (dateTimeString: string | null) => {
//     if (!dateTimeString) return "";
//     return dateTimeString.replace(" ", "T");
//   };

//   // Convert "YYYY-MM-DDTHH:mm" to "YYYY-MM-DD HH:mm" for form data
//   const formatForForm = (dateTimeString: string | null) => {
//     if (!dateTimeString) return "";
//     return dateTimeString.replace("T", " ");
//   };
//   const now = formatDateTime(new Date());

//   return (
//     <div className=" mt-3">
//       <FormField
//         control={form.control}
//         name={`variants.${index}.specialPriceStart`}
//         render={({ field }) => (
//           <FormItem className="flex flex-col">
//             <FormLabel className="font-normal">
//               Special Price Start <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <input
//                 type="datetime-local"
//                 className="w-full px-3 py-2 border rounded-md"
//                 onChange={(e) => {
//                   field.onChange(formatForForm(e.target.value));
//                 }}
//                 value={formatForInput(field.value ?? null)}
//                 min={formatForInput(now)}
//                 max={formatForInput(specialPriceEnd ?? null)}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//       <FormField
//         control={form.control}
//         name={`variants.${index}.specialPriceEnd`}
//         render={({ field }) => (
//           <FormItem className="flex flex-col mt-4">
//             <FormLabel className="font-normal">
//               Special Price End <span className="text-red-500">*</span>
//             </FormLabel>
//             <FormControl>
//               <input
//                 type="datetime-local"
//                 className="w-full px-3 py-2 border rounded-md"
//                 onChange={(e) => {
//                   field.onChange(formatForForm(e.target.value));
//                 }}
//                 value={formatForInput(field.value ?? null)}
//                 min={formatForInput(specialPriceStart || now)}
//               />
//             </FormControl>
//             <FormMessage />
//           </FormItem>
//         )}
//       />
//     </div>
//   );
// };

const DateSelect = ({
  form,
  index,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  index: number;
}) => {
  const [startInput, setStartInput] = useState("");
  const [endInput, setEndInput] = useState("");
  const [startDateSet, setStartDateSet] = useState(false);
  const [endDateSet, setEndDateSet] = useState(false);

  const specialPriceStart = form.watch(`variants.${index}.specialPriceStart`);
  const specialPriceEnd = form.watch(`variants.${index}.specialPriceEnd`);

  const formatDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const formatForInput = (dateTimeString: string | null) => {
    if (!dateTimeString) return "";
    return dateTimeString.replace(" ", "T");
  };

  const formatForForm = (dateTimeString: string | null) => {
    if (!dateTimeString) return "";
    return dateTimeString.replace("T", " ");
  };

  const now = formatDateTime(new Date());

  const handleStartOkClick = () => {
    if (startInput) {
      form.setValue(
        `variants.${index}.specialPriceStart`,
        formatForForm(startInput)
      );
      setStartDateSet(true);
      form?.clearErrors("specialPriceStart");
    }
  };

  const handleEndOkClick = () => {
    if (endInput) {
      form.setValue(
        `variants.${index}.specialPriceEnd`,
        formatForForm(endInput)
      );
      setEndDateSet(true);
      form?.clearErrors("specialPriceEnd");
    }
  };

  const handleStartReset = () => {
    setStartInput("");
    form.setValue(`variants.${index}.specialPriceStart`, "");
    setStartDateSet(false);
  };

  const handleEndReset = () => {
    setEndInput("");
    form.setValue(`variants.${index}.specialPriceEnd`, "");
    setEndDateSet(false);
  };

  return (
    <div className="mt-3">
      <FormField
        control={form.control}
        name={`variants.${index}.specialPriceStart`}
        render={() => (
          <FormItem className="flex flex-col">
            <FormLabel className="font-normal">
              Special Price Start <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-md"
                value={startInput || formatForInput(specialPriceStart ?? null)}
                onChange={(e) => setStartInput(e.target.value)}
                min={formatForInput(now)}
                max={formatForInput(specialPriceEnd ?? null)}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs
                  ${startDateSet ? "bg-green-500" : "bg-gray-500"}`}
                onClick={handleStartOkClick}
                title="Confirm Start Date"
              >
                OK
              </button>
              {(startInput || specialPriceStart) && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-xs"
                  onClick={handleStartReset}
                  title="Reset Start Date"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`variants.${index}.specialPriceEnd`}
        render={() => (
          <FormItem className="flex flex-col mt-4">
            <FormLabel className="font-normal">
              Special Price End <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 border rounded-md"
                value={endInput || formatForInput(specialPriceEnd ?? null)}
                onChange={(e) => setEndInput(e.target.value)}
                min={formatForInput(specialPriceStart || now)}
              />
            </FormControl>
            <FormMessage />
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                className={`w-8 h-8 flex items-center justify-center rounded-full text-white text-xs
                  ${endDateSet ? "bg-green-500" : "bg-gray-500"}`}
                onClick={handleEndOkClick}
                title="Confirm End Date"
              >
                OK
              </button>
              {(endInput || specialPriceEnd) && (
                <button
                  type="button"
                  className="w-8 h-8 flex items-center justify-center rounded-full bg-red-500 text-white text-xs"
                  onClick={handleEndReset}
                  title="Reset End Date"
                >
                  <X size={18} />
                </button>
              )}
            </div>
          </FormItem>
        )}
      />
    </div>
  );
};
