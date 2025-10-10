"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "./use-toast";
import { AiOutlineLoading } from "react-icons/ai";

const FetchImage = ({
  id,
  height = 100,
  width = 100,
  className,
}: {
  id: string;
  height?: number;
  width?: number;
  className?: string;
}) => {
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;

    const fetchImage = async () => {
      setLoading(true);
      setError(false);

      try {
        const { data }: any = await clientSideFetch({
          url: `/files/show/${id}`,
          method: "get",
          toast,
        });

        if (isMounted && data?.data?.thumbnailUrl) {
          setImageUrl(data.data.thumbnailUrl);
        } else if (isMounted) {
          setError(true);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
          toast({
            title: "Failed to fetch image",
            description: "Please try again later.",
            variant: "destructive",
          });
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchImage();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-w-full flex items-center justify-center">
        <AiOutlineLoading className="text-2xl text-green-700 animate-spin" />
      </div>
    );
  }

  if (error || !imageUrl) {
    return (
      <div
        className={cn(
          "flex items-center justify-center h-[100px] w-[100px] text-sm text-gray-500 border rounded bg-gray-100",
          className
        )}
      >
        Image not available
      </div>
    );
  }

  return (
    <Image
      height={height}
      width={width}
      alt="Thumbnail"
      src={imageUrl}
      className={cn("object-contain", className)}
    />
  );
};

export default FetchImage;
