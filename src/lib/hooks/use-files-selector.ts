import axios from "axios";
import { File, FileShowResponse } from "@/app/_types/media_Types/file_Types/fileTypes";
import { useEffect, useState } from "react";
import { useQueries } from "@tanstack/react-query";

interface Props {
  defaultFilesIds: number[];
  isMulti?: boolean;
  callback?: (files: number[]) => void;
}

function useFilesSelector({ defaultFilesIds, isMulti, callback }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [selectedFilesIds, setSelectedFilesIds] = useState<Set<number>>(new Set(defaultFilesIds));
  const fileQueries = useQueries({
    queries: defaultFilesIds.map((fileId) => ({
      queryKey: ["media-file", fileId],
      queryFn: () => fetchFile(fileId),
      staleTime: Infinity,
    })),
    combine: (results) => {
      return {
        data: results.map((result) => result.data),
        pending: results.some((result) => result.isPending),
      };
    },
  });

  useEffect(() => {
    if (!fileQueries.pending) {
      // @ts-ignore
      setSelectedFiles(fileQueries.data);
    }
  }, [fileQueries]);

  async function fetchFile(id: number) {
    try {
      const { data } = await axios.get(`/api/files/show/${id}`);
      const file: FileShowResponse = data.data;
      return {
        id,
        filename: file.filename,
        width: file.width,
        height: file.height,
        imageUrl: file.url,
        thumbnailUrl: file.thumbnailUrl,
      };
    } catch (error) {
      return undefined;
    }
  }

  function selectFiles(files: File[]) {
    const fileIds = files.map((file) => file.id);
    if (!isMulti) {
      const selectedFilesIds = fileIds.slice(0, 1);
      setSelectedFilesIds(new Set(selectedFilesIds));
      setSelectedFiles(files.slice(0, 1));
      callback?.(selectedFilesIds);
      return;
    }
    const updatedSelection = new Set(selectedFilesIds);
    fileIds.forEach((id) => {
      updatedSelection.add(id);
      const selectedFiles = files.filter((file) => updatedSelection.has(file.id));

      callback?.(Array.from(updatedSelection));
      setSelectedFilesIds(updatedSelection);
      setSelectedFiles(selectedFiles);
    });
  }

  function removeFile(fileId: number) {
    const updatedSelection = new Set(selectedFilesIds);
    updatedSelection.delete(fileId);
    setSelectedFilesIds(updatedSelection);
    setSelectedFiles(selectedFiles.filter((file) => file.id !== fileId));
    callback?.(Array.from(updatedSelection));
  }

  return {
    selectedFiles,
    setSelectedFiles,
    selectedFilesIds,
    setSelectedFilesIds,
    selectFiles,
    removeFile,
    fetchFile,
  };
}

export default useFilesSelector;