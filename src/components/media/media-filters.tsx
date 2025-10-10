import React, { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { IconSearch, IconX } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { useMediaFilter } from "@/lib/context/media-filter-context";
import FileCategorySelector from "./file-category-selector";
import FileSortOptions from "./file-sort-options";

function MediaFilters({activeButton,setActiveButton}:any) {
  const { category, setCategory, search, sortBy, setSearch, setSortBy } = useMediaFilter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [searchValue, setSearchValue] = useState(search);

  // Update local state when search prop changes
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  const handleSearch = (value: string) => {
    setSearchValue(value);
    setSearch(value);
  };

  const handleClear = () => {
    setSearchValue("");
    setSearch("");
    if (inputRef.current) {
      inputRef.current.value = "";
      inputRef.current.focus();
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
  };

  const handleSearchClick = () => {
    setSearch(searchValue);
  };

  return (
    <div className="flex gap-4 flex-wrap">
      <div className="flex gap-2 w-full sm:w-fit relative">
        <div className="relative flex-1">
          <Input
            ref={inputRef}
            className="h-9 pr-8" // Added padding-right for the clear button
            name="search"
            placeholder="Search"
            value={searchValue}
            onChange={handleInputChange}
            // onChange={(e) => handleSearch(e.target.value)}
          />
          
        </div>
        <Button 
          type="button" 
          size="sm" 
          onClick={() => handleSearch(searchValue)}
          className="bg-[#5e72e4] hover:bg-[#465ad1]"
        >
          <IconSearch />
        </Button>
        {searchValue && (
            <Button
              type="button"
              // variant="ghost"
              size="sm"
             className="bg-red-500 hover:bg-red-600"
              onClick={handleClear}
            >
              <IconX size={16} />
            </Button>
          )}
      </div>
      <FileCategorySelector category={category} setCategory={setCategory} activeButton={activeButton} setActiveButton={setActiveButton} />
      <FileSortOptions sortBy={sortBy} setSortBy={setSortBy} />
    </div>
  );
}

export default MediaFilters;