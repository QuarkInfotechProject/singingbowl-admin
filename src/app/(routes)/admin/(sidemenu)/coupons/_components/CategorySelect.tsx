import Select from "react-select";
import makeAnimated from "react-select/animated";
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

const animatedComponents = makeAnimated();

// Define proper types for the Category objects
interface Category {
  id: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const CategorySelect = ({ form, field }: { form: any; field: any }) => {
  const [selectedCategory, setSelectedCategory] = useState<SelectOption[]>([]);

  const renderCategory = (Category: Category[]) => {
    return Category?.map((currentCategory) => ({
      value: currentCategory.id,
      label: currentCategory.name,
    }));
  };

  // Get Category using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["Categoryelect"],
    queryFn: async () => {
      return await clientSideFetch({
        url: "/categories",
        method: "get",
        toast: "skip",
      });
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const Category = data?.data.data || [];
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load Category. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Set default selected Category when the Category are fetched and `field.value` is available
  useEffect(() => {
    if (Category.length > 0 && field.value && field.value.length > 0) {
      const defaultSelected = renderCategory(Category).filter((option) =>
        field.value.includes(option.value)
      );
      setSelectedCategory(defaultSelected);
    } else if (!field.value || field.value.length === 0) {
      setSelectedCategory([]);
    }
  }, [Category, field.value]);

  const handleCategoryChange = (selectedValue: SelectOption[] | null) => {
    if (selectedValue && selectedValue.length > 0) {
      const selectedCategoryIds = selectedValue.map(
        (selected) => selected.value
      );
      setSelectedCategory(selectedValue);
      form.setValue(field.name, selectedCategoryIds);
      form.trigger(field.name);
    } else {
      setSelectedCategory([]);
      form.setValue(field.name, []);
      form.trigger(field.name);
    }
  };

  return (
    <div>
      <Select
        {...field}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={renderCategory(Category)}
        isMulti
        onChange={handleCategoryChange}
        value={selectedCategory}
        className="w-full"
        isLoading={isLoading}
        placeholder={isLoading ? "Loading Category..." : "Select Category..."}
        noOptionsMessage={() =>
          isLoading ? "Loading..." : "No Category found"
        }
      />
    </div>
  );
};

export default CategorySelect;
