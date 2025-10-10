import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  fileCategoryId: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  activeButton: any;
  setActiveButton: any;
  // fileId:string | null;
}

function FileCategorySelector({
  fileCategoryId,
  setCategory,
  className,
}: Props) {
  const { data: categories, isPending } = useQuery<MediaCategory[]>({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/mediaCategory");
      return data?.data;
    },
  });

  const selectedCategory = categories?.find(
    (cat) => cat.id.toString() === fileCategoryId?.toString()
  );
  console.log("fileCatefgory", fileCategoryId);

  const getDisplayText = () => {
    if (fileCategoryId === null) {
      return "Ungrouped";
    }
    return selectedCategory?.name || "Select Category";
  };

  const handleValueChange = (value: string) => {
    setCategory(value === "Ungrouped" ? null : value);
  };

  return (
    <Select
      value={fileCategoryId === null ? "Ungrouped" : fileCategoryId?.toString()}
      onValueChange={handleValueChange}
      disabled={isPending || !categories?.length}
    >
      <SelectTrigger
        className={cn(
          "w-fit h-9 min-w-[150px] [&_span]:flex [&_span]:gap-2",
          className
        )}
      >
        <SelectValue>{isPending ? "Loading..." : getDisplayText()}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Ungrouped">Ungrouped</SelectItem>

        {categories?.map((category) => (
          <SelectItem
            className="capitalize"
            key={category.id}
            value={category.id.toString()}
          >
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default FileCategorySelector;
