import React from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Props {
  fileCategoryId: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  activeButton:any;
  setActiveButton:any;
  // fileId:string | null;
}

function FileCategorySelector({ fileCategoryId, setCategory, className,activeButton,setActiveButton }: Props) {
  const { data: categories, isPending } = useQuery<MediaCategory[]>({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/mediaCategory");
      return data?.data;
    },
  });

  const activeCategoryId = activeButton?.startsWith('category-') 
  ? activeButton.replace('category-', '') 
  : null;

// Find the selected category based on the active button
const selectedCategory = categories?.find(
  (cat) => cat.id.toString() === activeCategoryId
);

// Determine display text based on activeButton and selected category
const getDisplayText = () => {
  if (activeButton === 'ungrouped') {
    return 'Ungrouped';
  }
  if (selectedCategory) {
    return selectedCategory.name;
  }
  return 'Select Category';
};

const handleValueChange = (value: string) => {
  setCategory(value);
  if (value === 'all') {
    setActiveButton(null);
  } else {
    setActiveButton(`category-${value}`);
  }
};
  // const selectedCategory = categories?.find((cat) => cat.id.toString()=== fileCategoryId?.toString());
  // console.log("selectercategory data",fileCategoryId?.toString(),categories?.find((cat) => cat.id?.toString()), categories)
console.log("selec categ",activeButton)
// const displayText = activeButton ? activeButton.category : 'Select Category';
  return (
    <Select
      value={activeCategoryId || ''}
      onValueChange={handleValueChange}
      disabled={isPending || !categories?.length}
    >
      <SelectTrigger 
        className={cn("w-fit h-9 min-w-[150px] [&_span]:flex [&_span]:gap-2", className)}
      >
        <SelectValue placeholder="Select Category">
          {getDisplayText()}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All</SelectItem>
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
