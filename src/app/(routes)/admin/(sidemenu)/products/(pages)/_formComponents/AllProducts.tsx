"use client";
import {
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from "react";
import { useQuery } from "@tanstack/react-query";

import { Folder, Search } from "lucide-react";

import {
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { useToast } from "@/components/ui/use-toast";
import { z } from "zod";
import { UseFormReturn } from "react-hook-form";
import { formSchema } from "../add/page";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ProductT {
  id: string;
  name: string;
  originalPrice: string;
  specialPrice: string;
  variantCount: number;
  files:
    | string
    | [
        {
          imageUrl: string;
        }
      ];
}

interface CategoryT {
  id: number;
  name: string;
  url: string;
}

const AllProducts = ({
  form,
  toUpdate,
  uploadedProducts,
  localProductIds,
  setLocalProductIds,
  setLocalProductThumbnails,
  localProductThumbnails,
  defaultProduct,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  toUpdate: "related-product" | "up-sell-product" | "cross-sell-product";
  uploadedProducts: string[];
  localProductIds: string[];
  localProductThumbnails: string[];
  setLocalProductIds: Dispatch<SetStateAction<string[]>>;
  setLocalProductThumbnails: Dispatch<SetStateAction<string[]>>;
  defaultProduct: any[];
}) => {
  const toast = useToast();
  const [categories, setCategories] = useState<CategoryT[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const total = 8;

  // Determine if we should fetch from API
  const shouldFetch =
    !defaultProduct ||
    !Array.isArray(defaultProduct) ||
    defaultProduct.length === 0;

  // Fetch products using React Query
  const {
    data: fetchedProducts,
    isLoading: isProductsLoading,
    error,
  } = useQuery({
    queryKey: ["products", "all"],
    queryFn: async () => {
      try {
        const response = await clientSideFetch({
          url: "/products?per_page=1000000",
          method: "post",
          body: {
            status: "1",
            name: "",
            sku: "",
            sortBy: "created_at",
            sortDirection: "asc",
          },
          toast: "skip",
        });

        // Handle undefined or null response
        if (!response) {
          console.error("clientSideFetch returned undefined");
          return [];
        }

        const { data } = response as any;
        return Array.isArray(data?.data?.data) ? data.data.data : [];
      } catch (err) {
        console.error("Error fetching products:", err);
        return [];
      }
    },
    enabled: shouldFetch,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  // Use defaultProduct if available, otherwise use fetched data
  const products = useMemo(() => {
    if (!shouldFetch && Array.isArray(defaultProduct)) {
      return defaultProduct;
    }
    return Array.isArray(fetchedProducts) ? fetchedProducts : [];
  }, [defaultProduct, fetchedProducts, shouldFetch]);

  // Filter products based on search query
  const filteredProducts = useMemo(() => {
    const safeProducts = Array.isArray(products) ? products : [];

    if (!searchQuery.trim()) {
      return safeProducts;
    }

    return safeProducts.filter((product: ProductT) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Loading state
  const isLoading = shouldFetch && isProductsLoading;

  // Handle error from React Query
  useEffect(() => {
    if (error) {
      toast.toast({
        title: "Error",
        description: "Failed to fetch products. Please try again.",
        variant: "destructive",
      });
    }
  }, [error, toast]);

  // Helper function to get image URL from files
  const getImageUrl = (files: ProductT["files"]): string => {
    if (typeof files === "string") {
      return files;
    }
    if (Array.isArray(files) && files.length > 0 && files[0]?.imageUrl) {
      return files[0].imageUrl;
    }
    return "";
  };

  const handleProducts = (id: string, thumbnailUrl: string) => {
    const existsThumbnail = localProductThumbnails.includes(thumbnailUrl);
    const existsId = localProductIds.includes(id);
    if (existsId && existsThumbnail) {
      return;
    } else {
      setLocalProductThumbnails([...localProductThumbnails, thumbnailUrl]);
      setLocalProductIds([...localProductIds, id]);
    }
  };

  const handleConfirmUpload = (
    toUpdate: "related-product" | "up-sell-product" | "cross-sell-product"
  ) => {
    if (toUpdate === "related-product") {
      const currentProductIds = form.getValues("relatedProducts") || [];
      const updatedProductIds = [...currentProductIds, ...localProductIds];
      form.setValue("relatedProducts", updatedProductIds);
    } else if (toUpdate === "cross-sell-product") {
      const currentProductIds = form.getValues("crossSells") || [];
      const updatedProductIds = [...currentProductIds, ...localProductIds];
      form.setValue("crossSells", updatedProductIds);
    } else {
      return;
    }
  };

  const handleRemove = (url: string) => {
    const index = localProductThumbnails.indexOf(url);
    const updatedIds = localProductIds.filter((_, idx) => idx !== index);
    setLocalProductIds(updatedIds);
    const updatedThumbnails = localProductThumbnails.filter(
      (_, idx) => idx !== index
    );
    setLocalProductThumbnails(updatedThumbnails);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  return (
    <div>
      <DialogContent className="sm:max-w-[1000px] h-[90vh] w-[90vw] max-w-[90vw] overflow-hidden flex flex-col">
        <DialogHeader className="bg-gray-100 p-4 flex-shrink-0 rounded-md border-b">
          <DialogTitle>
            Select{" "}
            {toUpdate === "cross-sell-product"
              ? "Cross Sell"
              : toUpdate === "related-product"
              ? "Related "
              : "Up Sell"}{" "}
            Product
          </DialogTitle>

          {/* Search Box */}
          <div className="mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search products by name..."
                className="pl-10 pr-10"
              />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {searchQuery && (
              <p className="text-sm text-gray-600 mt-2">
                Found{" "}
                {Array.isArray(filteredProducts) ? filteredProducts.length : 0}{" "}
                product(s) matching "{searchQuery}"
              </p>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden flex flex-col gap-4 px-4">
          {isLoading ? (
            <div className="flex-1 overflow-hidden flex items-center justify-center">
              <div className="grid gap-4 grid-cols-5 w-full max-w-6xl">
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
                <Skeleton className="h-[120px] w-full" />
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-y-auto">
              <div
                className={`grid gap-2 p-4 ${
                  Array.isArray(filteredProducts) && filteredProducts.length > 0
                    ? "grid-cols-6 "
                    : ""
                }`}
              >
                {Array.isArray(filteredProducts) &&
                filteredProducts.length > 0 ? (
                  filteredProducts.map((item: ProductT) => {
                    const imageUrl = getImageUrl(item.files);
                    const isDisabled =
                      uploadedProducts?.includes(item.id.toString()) ||
                      uploadedProducts?.length + localProductIds.length >=
                        total ||
                      localProductIds.includes(item.id.toString());

                    return (
                      <div
                        className="flex flex-col group hover:shadow-lg transition-all duration-200 bg-white rounded-lg border border-gray-200 overflow-hidden"
                        key={item.id}
                      >
                        <div className="relative aspect-square">
                          <Image
                            onClick={() =>
                              !isDisabled &&
                              handleProducts(item.id.toString(), imageUrl)
                            }
                            src={imageUrl || "/images/placeholder.png"}
                            className={`w-full h-full cursor-pointer object-contain p-3 transition-transform duration-200 group-hover:scale-105 ${
                              isDisabled && "opacity-50 pointer-events-none"
                            }`}
                            height={200}
                            width={200}
                            alt={item.name}
                          />

                          <div
                            className={`${
                              uploadedProducts?.includes(item.id.toString())
                                ? "flex"
                                : "hidden"
                            } pointer-events-none rounded-lg bg-green-600/90 text-white items-center justify-center absolute inset-0 backdrop-blur-sm`}
                          >
                            <span className="font-medium whitespace-nowrap">
                              ✓ Uploaded
                            </span>
                          </div>

                          {localProductIds.includes(item.id.toString()) && (
                            <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                              <span className="w-4 h-4 text-xs flex items-center justify-center font-bold">
                                ✓
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="p-3 flex-1 flex flex-col justify-between">
                          <p
                            title={item.name}
                            className="text-sm font-medium text-gray-800 line-clamp-2 leading-tight mb-2"
                          >
                            {item.name}
                          </p>
                          <div className="flex flex-col items-center space-y-1">
                            {item.specialPrice && item.specialPrice !== null ? (
                              <>
                                <del className="text-red-500 whitespace-nowrap text-xs">
                                  Rs. {item.originalPrice}
                                </del>
                                <span className="text-green-600 whitespace-nowrap font-semibold text-sm">
                                  Rs. {item.specialPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-gray-700 whitespace-nowrap font-semibold text-sm">
                                Rs. {item.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full flex items-center justify-center flex-col py-6">
                    <Image
                      alt="not-found"
                      height={300}
                      width={300}
                      src={"/images/404.png"}
                      className="opacity-50"
                    />
                    <p className="text-xl font-medium text-gray-600 mt-4">
                      {searchQuery
                        ? `No products found matching "${searchQuery}"`
                        : "No Products Available"}
                    </p>
                    {searchQuery && (
                      <Button
                        onClick={clearSearch}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        Clear search
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white border-t px-4 py-3 flex-shrink-0">
          <div className="flex gap-6 items-center">
            <div className="flex-1">
              <p className="mb-3 font-medium text-lg">
                Selected Products:{" "}
                <span
                  className={`font-normal ${
                    localProductIds.length + uploadedProducts.length ===
                      total && "text-green-600"
                  }`}
                >
                  {localProductIds.length + uploadedProducts.length}/{total}
                </span>
              </p>
              <div className="bg-gray-50 min-h-[90px] p-3 rounded-lg border-2 border-dashed border-gray-300">
                {localProductThumbnails.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto">
                    {localProductThumbnails.map((url, index) => {
                      return (
                        <div
                          key={index}
                          className="relative flex-shrink-0 group"
                        >
                          <Image
                            className="h-[70px] w-[70px] object-contain rounded-lg border shadow-sm"
                            src={url}
                            height={70}
                            width={70}
                            alt="ProductThumbnail"
                          />
                          <button
                            type="button"
                            onClick={(e) => handleRemove(url)}
                            className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 h-6 w-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
                            title="Remove product"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    <p className="text-sm">
                      Selected products will appear here
                    </p>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-3 min-w-[140px]">
              <Button
                type="button"
                asChild
                onClick={() => handleConfirmUpload(toUpdate)}
                disabled={localProductThumbnails.length === 0}
                size="default"
                className="bg-blue-600 hover:bg-blue-700"
              >
                <DialogClose>Confirm Selection</DialogClose>
              </Button>
              <Button asChild variant={"outline"} size="default">
                <DialogClose>Cancel</DialogClose>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </div>
  );
};

export default AllProducts;
