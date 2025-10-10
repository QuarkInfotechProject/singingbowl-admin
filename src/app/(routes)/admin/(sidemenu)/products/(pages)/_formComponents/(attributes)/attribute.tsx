"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";

const TagsSelect = ({ field, setIdData }: any) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [attributeOptions, setAttributeOptions] = useState<OptionT[]>([]);

  const flattenTags = (
    attributes: CategoryT[]
  ): { value: number; label: string }[] => {
    return attributes.map((attribute) => ({
      value: attribute.id,
      label: attribute.name,
    }));
  };

  useEffect(() => {
    const getTags = async () => {
      setLoading(true);
      try {
        const { data }: any = await clientSideFetch({
          url: "/attributes?perPage=10000",
          method: "post",
          toast,
        });
        const flatTags: OptionT[] = flattenTags(data.data.data);
        setAttributeOptions(flatTags);
      } catch (error) {
        console.error("Error fetching attributes:", error);
        toast({
          title: "Error",
          description: "Failed to fetch attributes",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    getTags();
  }, []);

  const selectedOption = attributeOptions.find(
    (option) => option.value === field.value
  );

  return (
    <Select
      isDisabled={loading}
      value={selectedOption}
      onChange={(newSelectedOption) => {
        const selectedId = newSelectedOption?.value.toString();
        setIdData({
          value: newSelectedOption?.value,
          label: newSelectedOption?.label,
        });
        field.onChange(selectedId);
      }}
      options={attributeOptions}
      placeholder="Attributes"
      aria-label="Select attributes"
      isLoading={loading}
      noOptionsMessage={() => "No attributes found"}
    />
  );
};

export default TagsSelect;
