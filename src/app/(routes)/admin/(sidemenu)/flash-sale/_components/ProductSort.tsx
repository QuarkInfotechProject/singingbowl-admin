"use client";

import React, { useEffect, useState, useCallback } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

interface Product {
  id: string;  // The product ID is a UUID string
  name: string;
}

interface SelectOption {
  value: string;  // Value is also a string (UUID)
  label: string;
}

interface ProductSortProps {
  fetchUrl: string;
  updateUrl: string;
  showDragOrder?: boolean;
  isDrag?: boolean;
  productIds: string[];  // productIds should be an array of UUID strings
  onOrderChange?: (newOrder: string[]) => void;
  onProductRemove?: (productId: string) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

const ProductSort = ({
  fetchUrl,
  updateUrl,
  showDragOrder = false,
  isDrag = false,
  onOrderChange,
  onProductRemove,
  productIds,
  onSelectionChange,
}: ProductSortProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const renderProduct = useCallback(
    (products: Product[], productIds: string[]) => {
      const uniqueProductIds = Array.from(new Set(productIds));
      const filteredProducts = products.filter((p) => uniqueProductIds.includes(p.id));
      return filteredProducts.map((p) => ({
        value: p.id,
        label: p.name,
      }));
    },
    []
  );

  // Fetch products
  const { data, isLoading, error } = useQuery({
    queryKey: ["productselect", fetchUrl],
    queryFn: async () => {
      return await clientSideFetch({
        url: fetchUrl,
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
    },
    retry: 2,
    staleTime: 5 * 60 * 1000,
  });

  const products = data?.data?.data?.data || [];
  const allProductOptions = renderProduct(products, productIds);
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Update backend
  const updateInBackend = async (newOrder: string[] = [], action: "update" = "update") => {
    setIsUpdating(true);
    try {
      const response = await clientSideFetch({
        url: updateUrl,
        method: "post",
        body: { products: newOrder },
        toast: "skip",
      });
      if (response?.status === 200) {
        toast({
          title: "Success",
          description: `Products ${action === "update" ? "updated" : "reordered"} successfully`,
        });

        onSelectionChange?.(newOrder);
      } else {
        throw new Error(response?.data?.message || "Update failed");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${action} products. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle checkbox change
  const handleCheckboxChange = (productId: string, checked: boolean) => {
    setSelectedIds((prevSelected) => {
      let newSelected;
      if (checked) {
        newSelected = prevSelected.includes(productId)
          ? prevSelected
          : [...prevSelected, productId];
      } else {
        newSelected = prevSelected.filter((id) => id !== productId);
      }
      return newSelected;
    });
  };

  const handleManualUpdate = async () => {
    await updateInBackend(selectedIds, "update");
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-2">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {!showDragOrder ? (
        <div className="text-sm text-gray-500 p-4 border-2 border-dashed border-gray-200 rounded-md text-center">
          Component is hidden. Set <code>showDragOrder=true</code> to display.
        </div>
      ) : (
        <>
          {/* Checkbox Mode */}
          {!isDrag && (
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <h4 className="text-base font-semibold text-gray-700">Select Products:</h4>
                <button
                  onClick={handleManualUpdate}
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg"
                  disabled={isUpdating}
                >
                  {isUpdating ? "Updating..." : "Update Selection"}
                </button>
              </div>

              <div className="space-y-2">
                {allProductOptions.length > 0 ? (
                  allProductOptions.map((product) => {
                    const isSelected = selectedIds.includes(product.value);

                    return (
                      <div
                        key={product.value}
                        className={`flex items-center space-x-3 p-2 rounded cursor-pointer transition-colors ${
                          isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                        }`}
                        onClick={() =>
                          handleCheckboxChange(product.value, !isSelected)
                        }
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={(e) => {
                            e.stopPropagation();
                            handleCheckboxChange(product.value, e.target.checked);
                          }}
                          disabled={isUpdating}
                          className="w-4 h-4 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-900 flex-1 select-none">
                          {product.label}
                        </span>
                        {isSelected && (
                          <span className="inline-flex items-center justify-center w-6 h-6 text-xs font-medium text-white bg-blue-600 rounded-full">
                            {selectedIds.indexOf(product.value) + 1}
                          </span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No products available
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSort;
