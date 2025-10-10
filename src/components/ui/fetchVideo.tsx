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
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [error, setError] = useState(false);

  const handleLoading = (bool: boolean) => {
    setLoading(bool);
  };

  console.log("id video", id);
  useEffect(() => {
    const singleImage = async () => {
      try {
        setError(false);
        const response = await clientSideFetch({
          url: `/files/show/${id}`,
          method: "get",
          toast,
          handleLoading: handleLoading,
        });

        // Check if response exists and has the expected structure
        if (
          response &&
          response.data &&
          response.data.data &&
          response.data.data.url
        ) {
          setImageUrl(response.data.data.url);
        } else {
          console.error("Invalid response structure:", response);
          setError(true);
          // toast({
          //   title: "Error",
          //   description: "Failed to load image",
          //   variant: "destructive",
          // });
        }
      } catch (err) {
        console.error("Error fetching image:", err);
        setError(true);
        // toast({
        //   title: "Error",
        //   description: "Failed to load image",
        //   variant: "destructive",
        // });
      }
    };

    singleImage();
  }, [id]);

  if (loading) {
    return (
      <div className="min-w-full flex items-center justify-between">
        <AiOutlineLoading className="text-2xl  mx-auto h-5 w-5 animate-spin" />
      </div>
    );
  }
  if (!imageUrl) {
    return null;
  }

  console.log("imageurl video", imageUrl);
  return (
    <div>
      {imageUrl?.endsWith(".mp4") ? (
        <video
          src={imageUrl}
          className={cn("h-[100px] w-[100px] object-contain", className)}
          height={110}
          width={110}
          autoPlay
          loop
          muted
          playsInline
        >
          <source src={imageUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      ) : (
        <Image
          height={110}
          className={cn("h-[100px] w-[100px] object-contain", className)}
          width={110}
          alt="thumbnail"
          src={imageUrl}
        />
      )}
    </div>
  );
};

export default FetchImage;
