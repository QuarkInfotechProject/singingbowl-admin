"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { usePathname } from "next/navigation";
import CreatableSelect from "react-select/creatable";
import React from "react";

import { useToast } from "@/components/ui/use-toast";
import { formSchema } from "../../add/page";
import { SelectedAttributes } from "./attributeSlides";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface AttributeValue {
  id: string;
  value: string;
}

interface AttributeT {
  id: number;
  name: string;
  url: string;
}

interface Option {
  value: string;
  label: string;
}

const SingleAttributeValue = React.memo(({
  form,
  index,
  selectedAttributes,
  attributes,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  index: number;
  selectedAttributes: SelectedAttributes | null;
  attributes: AttributeT[] | undefined;
}) => {
  const pathname = usePathname();
  const { toast } = useToast();

  const [isEditMode, setIsEditMode] = useState(false);
  const [options, setOptions] = useState<Option[]>([]);
  const [valueLoading, setValueLoading] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [attributeData, setAttributeData] = useState<any>(null);

  const attributeId = form.watch(`attributes.${index}.attributeId`);

  // Memoize pathname check
  const isEditPath = useMemo(() => pathname.includes("/edit"), [pathname]);

  // Set edit mode once
  useEffect(() => {
    setIsEditMode(isEditPath);
  }, [isEditPath]);

  // Fetch attribute details
  const fetchAttributeDetails = useCallback(
    async (id: number) => {
      setValueLoading(true);
      try {
        const response = await clientSideFetch({
          url: `/attributes/show/${id}`,
          method: "get",
          toast: "skip",
        });
        const attr = response?.data?.data;
        if (attr?.values) {
          setAttributeData(attr);
          setOptions(
            attr.values.map((val: any) => ({
              value: val.id,
              label: val.value,
            }))
          );
        }
      } catch (error) {
        toast({
          title: "Failed to fetch attribute values",
          className: "bg-red-500 text-white font-semibold",
        });
      } finally {
        setValueLoading(false);
      }
    },
    [toast]
  );

  // Refetch when attribute changes
  useEffect(() => {
    if (attributeId) {
      fetchAttributeDetails(Number(attributeId));
    } else {
      // Clear options when no attribute is selected
      setOptions([]);
      setAttributeData(null);
    }
  }, [attributeId, fetchAttributeDetails]);

  const handleKeyDown = useCallback(async (event: React.KeyboardEvent, field: any) => {
    if (event.key !== "Enter" || !inputValue.trim()) return;
    event.preventDefault();

    const alreadyExists = options.some(
      (opt) => opt.label.toLowerCase() === inputValue.toLowerCase()
    );
    if (alreadyExists) {
      toast({
        title: "This value already exists",
        className: "bg-yellow-500 text-white font-semibold",
      });
      return;
    }

    if (!attributeData) return;

    const updatedValues = [
      ...attributeData.values.map((v: any) => v.value),
      inputValue.trim(),
    ];

    try {
      setValueLoading(true);
      const updateRes = await clientSideFetch({
        url: "/attributes/update",
        method: "post",
        toast: "skip",
        body: {
          ...attributeData,
          values: updatedValues,
        },
      });

      if (updateRes?.status === 200) {
        toast({
          title: "New value added",
          className: "bg-green-500 text-white font-semibold",
        });
        setInputValue("");
        await fetchAttributeDetails(attributeId); // refetch values
      }
    } catch {
      toast({
        title: "Error creating new value",
        className: "bg-red-500 text-white font-semibold",
      });
    } finally {
      setValueLoading(false);
    }
  }, [inputValue, options, attributeData, toast, fetchAttributeDetails, attributeId]);

  const handleAttributeChange = useCallback((val: string, onChange: (value: string) => void) => {
    onChange(val);
    setOptions([]); // Clear previous options
  }, []);

  const handleValueChange = useCallback((selected: any, onChange: (value: string[]) => void) => {
    onChange(selected.map((opt: any) => opt.value));
  }, []);

  // Memoize filtered options for selected values
  const selectedOptions = useMemo(() => {
    const fieldValues = form.getValues(`attributes.${index}.values`) || [];
    return options.filter((opt) => fieldValues.includes(opt.value));
  }, [options, form, index]);

  // Memoize attributes select items
  const attributeSelectItems = useMemo(() => 
    attributes?.map((attr) => (
      <SelectItem key={attr.id} value={attr.id.toString()}>
        {attr.name}
      </SelectItem>
    )),
    [attributes]
  );

  return (
    <>
      {isEditMode && (
        <div className="hidden">
          <FormField
            control={form.control}
            name={`attributes.${index}.id`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Attribute Id</FormLabel>
                <Input type="number" {...field} />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      )}

      <FormField
        control={form.control}
        name={`attributes.${index}.attributeId`}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Attribute</FormLabel>
            <FormDescription>Choose attribute for this entry.</FormDescription>
            <Select
              onValueChange={(val) => handleAttributeChange(val, field.onChange)}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select an attribute" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {attributeSelectItems}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={`attributes.${index}.values`}
        render={({ field }) => (
          <FormItem className="mt-6">
            <FormLabel>Values</FormLabel>
            <FormControl>
              <CreatableSelect
                isMulti
                isClearable
                isLoading={valueLoading}
                inputValue={inputValue}
                onInputChange={setInputValue}
                onKeyDown={(e) => handleKeyDown(e, field)}
                onChange={(selected) => handleValueChange(selected, field.onChange)}
                value={selectedOptions}
                options={options}
                placeholder="Select or create values"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
});

SingleAttributeValue.displayName = "SingleAttributeValue";

export default SingleAttributeValue;