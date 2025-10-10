import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { IconDotsVertical, IconFolder, IconLoader2 } from "@tabler/icons-react";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import FileCategoryContextMenu from "./file-category-context-menu";
import {
  DialogOrDrawer,
  DialogOrDrawerContent,
  DialogOrDrawerHeader,
  DialogOrDrawerTitle,
  DialogOrDrawerTrigger,
} from "../ui/dialog-or-drawer";
import FileCategoryEditor from "./file-category-editor";
import { useMediaFilter } from "@/lib/context/media-filter-context";
import { FileResponse } from "@/app/_types/media_Types/file_Types/fileTypes";
import { BsThreeDots } from "react-icons/bs";

function FileCategories({
  setGroupedData,
  activeButton,
  setActiveButton,
  showCategoryEditor,
  setShowCategoryEditor,
}: any) {
  // const [showCategoryEditor, setShowCategoryEditor] = useState(false);

  const [fileShowCategory, setFileShowCategory] = useState<FileResponse | null>(
    null
  );
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isContextMenuOpen, setIsContextMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedCategory, setSelectedCategory] =
    useState<MediaCategory | null>(null);
  const { category: activeCategory, setCategory } = useMediaFilter();
  const { data: categories, isPending } = useQuery<MediaCategory[]>({
    queryKey: ["media-categories"],
    queryFn: async () => {
      const { data } = await axios.get("/api/mediaCategory");
      return data?.data;
    },
  });
  const handleUngroupedClick = () => {
    setCategory(""); // Reset category filter
    setGroupedData(0); // Reset grouped data
    setActiveButton("ungrouped");
  };

  const handleCategoryClick = (categoryId: string) => {
    setCategory(String(categoryId));
    setGroupedData(null); // Reset grouped data when selecting a category
    setActiveButton(`category-${categoryId}`);
  };

  const handleDotsClick = (e: React.MouseEvent, category: MediaCategory) => {
    e.preventDefault();
    e.stopPropagation();

    // Get the click position
    const x = e.clientX - 200;
    const y = e.clientY;

    // Set the menu position and open state
    setMenuPosition({ x, y });
    setSelectedCategory(category);
    setIsContextMenuOpen(true);
  };

  React.useEffect(() => {
    const handleClickOutside = () => {
      setIsContextMenuOpen(false);
    };

    if (isContextMenuOpen) {
      document.addEventListener("click", handleClickOutside);
    }

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isContextMenuOpen]);

  console.log("fileShowCategory gr", fileShowCategory);
  return (
    <ScrollArea className="h-[70vh] border p-2 rounded-lg">
      <DialogOrDrawer
        open={showCategoryEditor}
        onOpenChange={setShowCategoryEditor}
      >
        <DialogOrDrawerTrigger asChild>
          <Button size="sm" variant="secondary" className="w-full mb-2">
            Add File Category
          </Button>
        </DialogOrDrawerTrigger>
        <DialogOrDrawerContent>
          <DialogOrDrawerHeader>
            <DialogOrDrawerTitle>New File Category</DialogOrDrawerTitle>
          </DialogOrDrawerHeader>
          <div className="p-4 md:p-0">
            <FileCategoryEditor
              onSuccess={() => setShowCategoryEditor(false)}
            />
          </div>
        </DialogOrDrawerContent>
      </DialogOrDrawer>
      <span>
        {" "}
        <Button
          variant="outline"
          className={`cursor-pointer w-full transition duration-300 ease-in-out mb-4
            ${
              activeButton === "ungrouped"
                ? "bg-gray-100 hover:bg-gray-100"
                : ""
            }
          `}
          onClick={handleUngroupedClick}
        >
          Ungrouped Images{" "}
        </Button>
      </span>

      {isPending ? (
        <div className="flex items-center justify-center h-full">
          <Skeleton className="w-full h-10" />
        </div>
      ) : (
        categories?.map((category) => (
          // <FileCategoryContextMenu category={category} key={category.id}>
          //   <Button
          //     type="button"
          //     key={category.id}
          //     className="w-full justify-start"
          //     variant={`category-${category.id}` === activeButton ? "secondary" : "ghost"}
          //     onClick={() => handleCategoryClick(String(category.id))}
          //   >
          //     <div className="grid grid-cols-[20px_1fr] gap-2 items-center">
          //       <IconFolder size={20} />
          //       <span className="truncate">{category.name}</span>
          //     </div>
          //   </Button>
          // </FileCategoryContextMenu>
          <div
            key={category.id}
            className="relative group"
            onMouseEnter={() => setHoveredCategory(category.id)}
            onMouseLeave={() => setHoveredCategory(null)}
          >
            {/* <FileCategoryContextMenu category={category}> */}
            <Button
              type="button"
              className="w-full justify-start relative"
              variant={
                `category-${category.id}` === activeButton
                  ? "secondary"
                  : "ghost"
              }
              onClick={() => handleCategoryClick(String(category.id))}
            >
              <div className="grid grid-cols-[20px_1fr_20px] gap-2 items-start w-full">
                <IconFolder size={20} />
                <span className="truncate text-left ">{category.name}</span>
                <div
                  className={`transition-opacity duration-200 ${
                    hoveredCategory === category.id
                      ? "opacity-100"
                      : "opacity-0"
                  }`}
                >
                  <FileCategoryContextMenu
                    category={category}
                    setCategory={setCategory}
                    open={isContextMenuOpen}
                    onOpenChange={setIsContextMenuOpen}
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={(e) => handleDotsClick(e, category.id)}
                    >
                      <BsThreeDots size={16} />
                    </Button>
                  </FileCategoryContextMenu>
                </div>
              </div>
            </Button>
            {/* </FileCategoryContextMenu> */}
          </div>
        ))
      )}
    </ScrollArea>
  );
}

export default FileCategories;
