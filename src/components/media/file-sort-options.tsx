import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { IconArrowDown, IconArrowUp } from "@tabler/icons-react";

interface Props {
  sortBy: string;
  setSortBy: React.Dispatch<React.SetStateAction<string>>;
}

function FileSortOptions({ sortBy, setSortBy }: Props) {
  return (
    <Select value={sortBy} onValueChange={setSortBy}>
      <SelectTrigger className="w-[150px] h-9 [&_span]:flex [&_span]:gap-2 [&_span]:items-center">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem className="*:flex *:justify-between *:flex-grow" value="filename.asc">
          Filename <IconArrowUp size={16} />
        </SelectItem>
        <SelectItem className="*:flex *:justify-between *:flex-grow" value="filename.desc">
          Filename <IconArrowDown size={16} />
        </SelectItem>
        <SelectItem className="*:flex *:justify-between *:flex-grow" value="created_at.asc">
          Created At <IconArrowUp size={16} />
        </SelectItem>
        <SelectItem className="*:flex *:justify-between *:flex-grow" value="created_at.desc">
          Created At <IconArrowDown size={16} />
        </SelectItem>
        <SelectItem className="*:flex *:justify-between *:flex-grow" value="size.asc">
          Size <IconArrowUp size={16} />
        </SelectItem>
        <SelectItem className="*:flex *:justify-between *:flex-grow" value="size.desc">
          Size <IconArrowDown size={16} />
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export default FileSortOptions;