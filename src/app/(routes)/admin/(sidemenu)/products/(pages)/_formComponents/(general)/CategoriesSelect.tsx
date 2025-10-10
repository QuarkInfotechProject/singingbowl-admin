"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";

type CategoryT = {
  id: number;
  name: string;
  children?: CategoryT[];
};

type OptionT = {
  value: number;
  label: string;
};

const CategoriesSelect = ({ field }: any) => {
  const [loading, setLoading] = useState(false);
  const [categoriesOptions, setCategoriesOptions] = useState<OptionT | []>([]);

  const flattenCategories = (
    categories: CategoryT[],
    level: number = 0
  ): { value: number; label: string }[] => {
    let flattenedCategories: { value: number; label: string }[] = [];

    categories.forEach((category) => {
      flattenedCategories.push({
        value: category.id,
        label: `${">  ".repeat(level * 1)}${category.name}`,
      });

      if (category.children && category.children.length > 0) {
        flattenedCategories = [
          ...flattenedCategories,
          ...flattenCategories(category.children, level + 1),
        ];
      }
    });
    return flattenedCategories;
  };

  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get("/api/category?perPage=1000");
        if (data) {
          const flatCategories: any = flattenCategories(data.data);
          setLoading(false);
          setCategoriesOptions(flatCategories);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    getCategories();
  }, []);
  const handleKeyDown = (event: any) => {
    if (event.key === "Enter") {
      event.preventDefault();
      event.stopPropagation();
    }
  };
  return (
    <>
      <Select
        isDisabled={loading}
        value={
          categoriesOptions
            ? categoriesOptions?.filter((option) =>
                field.value ? field.value.includes(option.value) : false
              )
            : []
        }
        onChange={(selectedOptions) => {
          field.onChange(
            Array.isArray(selectedOptions)
              ? selectedOptions.map((option) => option.value)
              : []
          );
        }}
        options={categoriesOptions || []}
        placeholder="Select Categories"
        isMulti
        onKeyDown={handleKeyDown}
      />
    </>
  );
};

export default CategoriesSelect;
