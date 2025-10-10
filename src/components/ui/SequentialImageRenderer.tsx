"use client";
import { useEffect, useState } from "react";
import FetchImage from "./fetchImage";
const SequentialImageRenderer = ({
  imageIds,
  delayMs = 1000,
  renderItem,
}: {
  imageIds: string[];
  delayMs?: number;
  renderItem: (id: string, index: number) => JSX.Element;
}) => {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (!imageIds || imageIds.length === 0) return;

    let index = 0;

    const interval = setInterval(() => {
      index++;
      if (index > imageIds.length) {
        clearInterval(interval);
      } else {
        setVisibleCount(index);
      }
    }, delayMs);

    return () => clearInterval(interval);
  }, [imageIds, delayMs]);

  return (
    <>
      {imageIds.slice(0, visibleCount).map((id, idx) => renderItem(id, idx))}
    </>
  );
};

export default SequentialImageRenderer;
