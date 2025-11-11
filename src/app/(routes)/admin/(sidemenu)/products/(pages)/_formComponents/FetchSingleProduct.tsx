"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import { AiOutlineLoading } from "react-icons/ai";
import { Span } from "next/dist/trace";

interface ProductT {
  productName: string;
  hasVariant: 1 | 0;
  originalPrice: string;
  specialPrice: string | null;
  options: {
    id: string;
    name: string;
    values: { files: { baseImage: { id: number; url: string } } }[];
  }[];
}

const FetchSingleProduct = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const [product, setProduct] = useState<ProductT>();
  const [imgUrl, setImgUrl] = useState("");
  const [variantUrl, setVariantUrl] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [specialPrice, setSpecialPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  useEffect(() => {
    const singleImage = async () => {
      setLoading(true); 
      try {
        const { data }: any = await clientSideFetch({
          url: `/products/show/${id}`,
          method: "get",
          // handleLoading: handleLoading,
          toast,
        });
  
        setProduct(data.data);
  
        let image = "";
        if (data.data.hasVariant === 1 && data.data.options[0].name === "Color") {
          image = data.data.options[0].values[0].files.baseImage.url;
        } else {
          image = data.data.files.baseImage.baseImageUrl;
        }
  
        let oriPrice = "";
        let spPrice = "";
  
        if (data.data.hasVariant === 1) {
          oriPrice = data.data.variants[0].originalPrice;
          spPrice = data.data.variants[0].specialPrice;
        } else {
          oriPrice = data.data.originalPrice;
          spPrice = data.data.specialPrice;
        }
  
        setOriginalPrice(oriPrice);
        setSpecialPrice(spPrice);
        console.log("image url", image);
        setImgUrl(image);
      } catch (err) {
        console.error("Error fetching product data:", err);
      } finally {
        setLoading(false); 
      }
    };
  
    singleImage();
  }, [id]);
  if (loading) {
    return (
      <div className="container">
        <div className="grid grid-cols-3 gap-2 items-center justify-center animate-pulse">
          {/* Image skeleton */}
          <div>
            <div className="h-[90px] w-[90px] bg-gray-200 rounded" />
          </div>
          
          {/* Product name skeleton */}
          <div>
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
          
          {/* Price skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-4 bg-gray-200 rounded w-20" />
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="container">
      <div className="grid grid-cols-3 gap-2 items-center justify-center">
        <div>
          {" "}
          <Image
            height={70}
            className={cn("h-[90px] w-[90px] object-contain border", className)}
            width={70}
            alt="thumbnail"
            src={imgUrl}
          />
        </div>
        <div className="font-medium">{product && product.productName}</div>
        <div>
          {specialPrice && specialPrice !== null ? (
            <del className="text-red-500 text-sm">$ {originalPrice}</del>
          ) : (
            <span>$ {originalPrice}</span>
          )}
          {specialPrice && <span className="ml-2">$ {specialPrice}</span>}
        </div>
      </div>
    </div>
  );
};

export default FetchSingleProduct;
