"use client";
import { useEffect, useState, useMemo } from "react";
import { z } from "zod";
import { UseFormReturn, useWatch, useFieldArray } from "react-hook-form";
import { usePathname } from "next/navigation";
import { formSchema } from "../../add/page";
import { transformOutgoingData } from "../../edit/[uuid]/RootLayout";

interface Option {
  optionName: string;
  files?: {
    baseImage?: string;
    additionalImage?: string[];
    descriptionVideo?: string;
  };
  optionData?: string;
  [key: string]: any;
}

interface Category {
  name: string;
  values: Option[];
}

interface ProcessedOption {
  categoryName: string;
  name: string;
}

interface Variant {
  name: string;
  sku: string;
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
  [key: string]: any;
}

const VariantDetails = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const pathname = usePathname();
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    setIsEditMode(pathname.includes("/edit"));
  }, [pathname]);

  // Watch all necessary fields in real-time
  
  const options = useWatch({
    control: form.control,
    name: "options",
    defaultValue: []
  });

  const productName = useWatch({
    control: form.control,
    name: "productName",
    defaultValue: ""
  });

  const variants = useWatch({
    control: form.control,
    name: "variants",
    defaultValue: []
  });

  const {
    fields: detailFields,
    append: detailAppend,
    remove: detailRemove,
  } = useFieldArray({
    name: "variants",
    control: form.control,
  });

  // Process options data with real-time updates
  const processedOptions = useMemo(() => {
    const result: ProcessedOption[][] = [];

    if (!transformOutgoingData(options) || !Array.isArray( transformOutgoingData(options))) {
      return result;
    }

    // Filter out any empty or invalid categories
    const validOptions = transformOutgoingData(options).filter(
      (category: Category) => 
        category && 
        category.name && 
        Array.isArray(category.values) && 
        category.values.length > 0
    );

    validOptions.forEach((category: Category) => {
      const categoryName = category.name;
      const categoryOptions: ProcessedOption[] = [];

      // Filter out any invalid options
      const validValues = category.values.filter((option: Option) => {
        if (!option) return false;
        const nameKey = Object.keys(option).find(
          (key) => key.toLowerCase().includes("name") && key !== "optionData"
        );
        return nameKey && option[nameKey];
      });

      validValues.forEach((option: Option) => {
        const nameKey = Object.keys(option).find(
          (key) => key.toLowerCase().includes("name") && key !== "optionData"
        );

        const optionNameValue = nameKey && option[nameKey]
          ? String(option[nameKey])
          : "Unknown Option";

        categoryOptions.push({
          categoryName: categoryName,
          name: optionNameValue,
        });
      });

      if (categoryOptions.length > 0) {
        result.push(categoryOptions);
      }
    });

    return result;
  }, [options]);

  // Generate variants when options change
  useEffect(() => {
    if (!processedOptions.length) {
      // Clear variants if no options exist
      form.setValue("variants", [], {
        shouldValidate: true,
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }

    const currentVariants = form.getValues("variants") || [];
    const combinations = generateCombinations(processedOptions);

    const newVariants: Variant[] = combinations.map((combo, index) => {
      const currentVariant = currentVariants[index] || {};

      const optionValues = combo.map((opt) => opt.name);
      const sku = formatSku(optionValues);

      const optionFields: Record<string, string> = {};
      combo.forEach((opt, idx) => {
        optionFields[`optionData${idx + 1}`] = opt.categoryName;
        optionFields[`optionName${idx + 1}`] = opt.name;
      });

      const displayName = `${productName} ${optionValues.join(" ")}`;

      return {
        name: displayName,
        sku,
        status: currentVariant.status ?? 1,
        originalPrice: currentVariant.originalPrice ?? undefined,
        specialPrice: currentVariant.specialPrice ?? null,
        specialPriceStart: currentVariant.specialPriceStart ?? "",
        specialPriceEnd: currentVariant.specialPriceEnd ?? "",
        quantity: currentVariant.quantity ?? undefined,
        inStock: currentVariant.inStock ?? 1,
        ...optionFields,
      };
    });

    // Always update to ensure UI reflects current state
    form.setValue("variants", newVariants, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [processedOptions, form, productName]);

  // Helper functions
  const generateCombinations = (
    optionSets: ProcessedOption[][],
    index = 0,
    current: ProcessedOption[] = [],
    results: ProcessedOption[][] = []
  ): ProcessedOption[][] => {
    if (index === optionSets.length) {
      results.push([...current]);
      return results;
    }

    optionSets[index].forEach((option: ProcessedOption) => {
      current.push(option);
      generateCombinations(optionSets, index + 1, current, results);
      current.pop();
    });

    return results;
  };

  const formatSku = (parts: string[]): string =>
    `${productName}-${parts.join("-")}`.replace(/\s+/g, "-").toLowerCase();

  const deepEqual = (obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (typeof obj1 !== typeof obj2) return false;
    if (obj1 == null || obj2 == null) return false;
    if (typeof obj1 !== "object") return false;

    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);

    if (keys1.length !== keys2.length) return false;

    for (let key of keys1) {
      if (!keys2.includes(key)) return false;

      const val1 = obj1[key];
      const val2 = obj2[key];

      if (typeof val1 === "object" && typeof val2 === "object") {
        if (!deepEqual(val1, val2)) return false;
      } else if (val1 !== val2) {
        return false;
      }
    }

    return true;
  };

  return (
    <div className="attributes">
      {/* Debug information - remove in production */}
      {/* <div className="hidden">
        <pre>{JSON.stringify(options, null, 2)}</pre>
        <pre>{JSON.stringify(processedOptions, null, 2)}</pre>
        <pre>{JSON.stringify(variants, null, 2)}</pre>
      </div> */}
    </div>
  );
};

export default VariantDetails;