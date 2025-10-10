import { FileShowResponse } from "@/app/_types/media_Types/file_Types/fileTypes";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import FileEditForm from "./file-edit-form";
import { IconLoader2 } from "@tabler/icons-react";
import { useWindowSize } from "@uidotdev/usehooks";

interface Props {
  fileId: number | undefined | null;
}

function MediaPopupSidebar({ fileId }: Props) {
  const { width } = useWindowSize();
  const isMobile = width && width < 768;
  const { data, isPending } = useQuery<FileShowResponse>({
    queryKey: ["media-file", fileId],
    queryFn: async () => {
      const { data } = await axios.get(`/api/files/show/${fileId}`);
      return {
        ...data.data,
        id: fileId,
      };
    },
    throwOnError: false,
    enabled: typeof fileId === "number",
  });

  if (isMobile) return null;

  if (isPending && typeof fileId === "number") {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <IconLoader2 className="animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <p>Select a file</p>
      </div>
    );
  }

  return <FileEditForm file={data} />;
}

export default MediaPopupSidebar;