"use client";

import { useEffect, useState } from "react";
import Select from "react-select";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";

type CategoryT = {
  id: number;
  name: string;
  children?: CategoryT[];
};

type OptionT = {
  value: number;
  label: string;
};

const TagsSelect = ({ field }: any) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [tagsOptions, setTagsOptions] = useState<OptionT | []>([]);

  const flattentags = (
    tags: CategoryT[]
  ): { value: number; label: string }[] => {
    let flattenedtags: { value: number; label: string }[] = [];

    tags.forEach((category) => {
      flattenedtags.push({
        value: category.id,
        label: category.name,
      });
    });
    return flattenedtags;
  };

  useEffect(() => {
    const getTags = async () => {
      const { data }: any = await clientSideFetch({
        url: "/tags",
        method: "post",
        toast,
      });
      const flatTags: any = flattentags(data.data.data);

      setTagsOptions(flatTags);
    };
    getTags();
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
          tagsOptions
            ? tagsOptions?.filter((option) =>
                field.value ? field.value.includes(option.value) : false
              )
            : []
        }
        onChange={(selectedOptions) => {
          field.onChange(selectedOptions.map((option) => option.value));
        }}
        options={tagsOptions || []}
        placeholder="Select tags"
        isMulti
        onKeyDown={handleKeyDown}
      />
    </>
  );
};

export default TagsSelect;
