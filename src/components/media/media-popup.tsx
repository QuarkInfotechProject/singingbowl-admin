import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { File } from "@/app/_types/media_Types/file_Types/fileTypes";
import FileUploader from "./file-uploader";
import MediaFilters from "./media-filters";
import MediaFilterContextProvider from "@/lib/context/media-filter-context";
import FileSelector from "./file-selector";
import UploadOptions from "./upload-options";
import MediaPopupSidebar from "./media-popup-sidebar";
import { IconLayoutSidebarRight } from "@tabler/icons-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

interface Props {
  children?: React.ReactNode;
  selectedFiles?: File[];
  onSelect?: (files: File[]) => void;
  isMulti?: boolean;
}

function MediaPopup({ children, selectedFiles = [], onSelect, isMulti }: Props) {
  const [selectedFileId, setSelectedFileId] = useState<number>();
  const [uploadCategory, setUploadCategory] = useState("all");
  const [tab, setTab] = useState("library");
  const [open, setOpen] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);

  function selectFiles(files: File[]) {
    onSelect && onSelect(files);
    setOpen(false);
  }

  return (
    <MediaFilterContextProvider>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className="w-full" asChild>
          {children}
        </DialogTrigger>
        <DialogContent
          data-sidebar-open={showSidebar}
          className={cn(
            "bg-transparent border-none shadow-none p-0",
            "grid max-w-[1000px]",
            "data-[sidebar-open='true']:max-w-[1300px] lg:data-[sidebar-open='true']:grid-cols-[1fr_300px]"
          )}
        >
          <div className="p-6 sm:rounded-lg bg-background border flex flex-col gap-4">
            <DialogHeader>
              <DialogTitle>Media</DialogTitle>
              <DialogDescription>Select or upload a new file.</DialogDescription>
            </DialogHeader>
            <Tabs value={tab} onValueChange={setTab}>
              <div className="flex justify-between flex-wrap gap-4">
                <TabsList>
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="library">Library</TabsTrigger>
                </TabsList>
                {tab === "upload" && <UploadOptions category={uploadCategory} setCategory={setUploadCategory} />}
                {tab === "library" && (
                  <div className="hidden lg:flex gap-3">
                    <MediaFilters />
                    <Button
                      className="px-2 hidden lg:flex"
                      type="button"
                      variant="outline"
                      onClick={() => setShowSidebar(!showSidebar)}
                    >
                      <IconLayoutSidebarRight />
                    </Button>
                  </div>
                )}
              </div>
              <TabsContent value="upload">
                <FileUploader category={uploadCategory} />
              </TabsContent>
              <TabsContent value="library">
                <FileSelector
                  selectedFiles={selectedFiles}
                  onSelect={selectFiles}
                  onClick={(file) => setSelectedFileId(file.id)}
                  isMulti={isMulti}
                />
              </TabsContent>
            </Tabs>
          </div>
          {showSidebar && (
            <div className="p-6 sm:rounded-lg bg-background border hidden lg:block">
              <MediaPopupSidebar fileId={selectedFileId} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </MediaFilterContextProvider>
  );
}

export default MediaPopup;