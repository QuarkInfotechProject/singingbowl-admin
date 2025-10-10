import React, { useState } from "react";
import * as Icons from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import Link from "next/link";
import { useDebounce } from "@uidotdev/usehooks";

interface Props {
  selectedIcon: string;
  onSelect: (icon: string) => void;
}

function IconPicker({ selectedIcon, onSelect }: Props) {
  const [search, setSearch] = useState(selectedIcon ?? "");
  const debouncedSearchTerm = useDebounce(search, 300);

  return (
    <div className="flex flex-col gap-4">
      <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search Icons" />
      <div className="flex gap-4 flex-wrap">
        {Object.keys(Icons)
          .filter((icon) => icon.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
          .slice(0, 30)
          .map((iconName, index) => {
            const Icon = Icons[iconName as keyof typeof Icons] as React.ForwardRefExoticComponent<
              Icons.IconProps & React.RefAttributes<Icons.Icon>
            >;
            return (
              <Icon
                aria-selected={selectedIcon === iconName}
                size={40}
                stroke={1.5}
                className={cn(
                  "rounded-md p-1 hover bg-gray-100 dark:bg-neutral-700 hover:bg-gray-200 dark:hover:bg-neutral-800",
                  "aria-selected:border-2 aria-selected:border-primary cursor-pointer ",
                  "transition-colors duration-300"
                )}
                key={index}
                onClick={() => onSelect(iconName)}
              />
            );
          })}
      </div>
      <Link
        className="underline text-sm text-gray-500 dark:text-gray-400"
        href="https://tabler.io/icons"
        target="_blank"
        rel="external"
      >
        Browse all icons
      </Link>
    </div>
  );
}

export default IconPicker;