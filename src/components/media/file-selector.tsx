import React, { useState } from "react";
import axios from "axios";
import Image from "next/image";
import { useMediaFilter } from "@/lib/context/media-filter-context";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { File } from "@/app/_types/media_Types/file_Types/fileTypes";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { IconLink } from "@tabler/icons-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface Props {
  isMulti?: boolean;
  selectedFiles: File[];
  onSelect?: (files: File[]) => void;
  onClick?: (file: File) => void;
}

function FileSelector({ isMulti, selectedFiles, onSelect, onClick }: Props) {
  const [selectedFilesIds, setSelectedFilesIds] = useState<Set<number>>(new Set(selectedFiles.map((file) => file.id)));
  const { search, sortBy, category } = useMediaFilter();
  const { data, isFetching } = useQuery<File[]>({
    queryKey: ["file-selector", search, sortBy, category],
    queryFn: async () => {
      const { data } = await axios.post("/api/media", {
        fileCategoryId: category === "all" ? "" : category,
        fileName: search,
        sortBy: sortBy.split(".")?.[0] || "",
        sortDirection: sortBy.split(".")?.[1] || "",
      });
      setSelectedFilesIds(new Set([]));
      return data?.data?.data;
    },
  });

  function selectFiles(file: File) {
    const updatedSelection = new Set(selectedFilesIds);
    if (!isMulti) {
      setSelectedFilesIds(new Set([file.id]));
      return;
    }
    if (updatedSelection.has(file.id)) {
      updatedSelection.delete(file.id);
    } else {
      updatedSelection.add(file.id);
    }
    setSelectedFilesIds(updatedSelection);
  }

  function submitSelection() {
    const selectedIds = new Set(selectedFilesIds);
    const selectedFiles = data?.filter((file) => selectedIds.has(file.id));
    selectedFiles && onSelect?.(selectedFiles);
  }

  return (
    <div>
      <ScrollArea className="max-h-[60vh]">
        <div
          className={cn(
            "grid grid-cols-2 min-[440px]:grid-cols-3 md:grid-cols-4 min-[960px]:grid-cols-5 lg:grid-cols-4 xl:grid-cols-5",
            "gap-4 border p-4 rounded-lg max-h-[60vh]"
          )}
        >
          {!isFetching &&
            data &&
            data.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                selected={selectedFilesIds.has(file.id)}
                onClick={() => {
                  selectFiles(file);
                  onClick?.(file);
                }}
              />
            ))}
          {isFetching && <LoadingSkeletions />}
          {!isFetching && !data?.length && <p className="text-center col-span-5">No files found.</p>}
        </div>
      </ScrollArea>
      <Button disabled={!selectedFilesIds.size} className="w-40 mt-4" size="sm" type="button" onClick={submitSelection}>
        Select
      </Button>
    </div>
  );
}

export default FileSelector;

function LoadingSkeletions() {
  return (
    <>
      {Array.from(new Array(10)).map((_, index) => (
        <Skeleton key={index} className="rounded-lg w-full h-auto object-cover aspect-square" />
      ))}
    </>
  );
}

function FileCard({ file, selected, onClick }: { file: File; selected: boolean; onClick: () => void }) {
  return (
    <div className="relative group" key={file.id}>
      <Image
        width={200}
        height={200}
        aria-selected={selected}
        className="w-full h-auto object-contain select-none aspect-square aria-selected:outline aria-selected:outline-3 aria-selected:outline-primary bg-gradient-to-r from-slate-50 to-zinc-100 rounded-lg"
        draggable={false}
        src={file.thumbnailUrl.endsWith(".pdf") ? "/images/placeholders/pdf.png" : file.thumbnailUrl}
        alt={file.filename}
        onClick={onClick}
      />
      <div className="opacity-0 group-hover:opacity-100 text-foreground absolute bottom-0 left-0 right-0 bg-background border border-border p-2 pointer-events-none transition-opacity duration-300 rounded-b-lg">
        <p className="truncate text-sm">{file.filename}</p>
      </div>
      <Link
        className="border border-gray-300 rounded-full p-1 absolute top-1 right-1 text-black bg-white flex items-center justify-center"
        target="_blank"
        title={file.filename}
        href={file.imageUrl}
      >
        <IconLink stroke={1.5} size={20} />
      </Link>
    </div>
  );
}