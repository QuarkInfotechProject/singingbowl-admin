"use client";
import { useEffect, useState } from "react";
import Select from "react-select";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";

type CategoryT = {
  id: number;
  name: string;
  children?: CategoryT[];
};

type OptionT = {
  value: number;
  label: string;
};

const BrandSelect = ({ field }: any) => {
  const [loading, setLoading] = useState(false);
  const [brnadOptions, setbrnadOptions] = useState<OptionT[]>([]);

  const flattenbrnad = (
    brnad: CategoryT[],
    level: number = 0
  ): { value: number; label: string }[] => {
    let flattenedbrnad: { value: number; label: string }[] = [];

    brnad.forEach((category) => {
      flattenedbrnad.push({
        value: category.id,
        label: `${">  ".repeat(level * 1)}${category.name}`,
      });

      if (category.children && category.children.length > 0) {
        flattenedbrnad = [
          ...flattenedbrnad,
          ...flattenbrnad(category.children, level + 1),
        ];
      }
    });
    return flattenedbrnad;
  };

  useEffect(() => {
    const getbrnad = async () => {
      setLoading(true);
      try {
        const response = await clientSideFetch({
          url: "/brand",
          method: "post",
          debug: true,
          toast: toast,
          body: null,
        });
        if (response?.status === 200) {
          const flatbrnad: any = flattenbrnad(response.data.data.data);
          setLoading(false);
          setbrnadOptions(flatbrnad);
        }
      } catch (error) {
        setLoading(false);
      }
    };
    getbrnad();
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
          brnadOptions
            ? brnadOptions.find((option) => option.value === field.value) ||
              null
            : null
        }
        onChange={(selectedOption) => {
          field.onChange(selectedOption ? selectedOption.value : null);
        }}
        options={brnadOptions || []}
        placeholder="Select brand"
        isMulti={false}
        onKeyDown={handleKeyDown}
      />
    </>
  );
};

export default BrandSelect;
