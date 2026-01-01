import Select from "react-select";
import makeAnimated from "react-select/animated";
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

const animatedComponents = makeAnimated();

// Define proper types for the product objects
// Define proper types for the product objects
interface Product {
  id: string;
  uuid?: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const Productselect = ({ form, field }: { form: any; field: any }) => {
  const [selectedProduct, setSelectedProduct] = useState<SelectOption[]>([]);

  const renderProduct = (products: Product[]) => {
    if (!Array.isArray(products)) return [];
    return products
      .filter((p) => p && (p.uuid || p.id) && p.name)
      .map((currentProduct) => ({
        value: currentProduct.uuid ? String(currentProduct.uuid) : String(currentProduct.id), // Use UUID if available
        label: currentProduct.name,
      }));
  };

  // Get Products using React Query
  const { data, isLoading, error } = useQuery({
    queryKey: ["productselect"],
    queryFn: async () => {
      return await clientSideFetch({
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
    },
    retry: 2,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
  const products = data?.data.data.data || [];
  if (products.length > 0) {
    console.log("DEBUG: First Product Object keys:", Object.keys(products[0]));
    console.log("DEBUG: First Product Object full:", products[0]);
  }
  // Handle query error
  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      });
    }
  }, [error]);

  // Set default selected products when the products are fetched and `field.value` is available
  useEffect(() => {
    if (products.length > 0 && field.value && field.value.length > 0) {
      const defaultSelected = renderProduct(products).filter((option) =>
        field.value.includes(option.value)
      );
      setSelectedProduct(defaultSelected);
    } else if (!field.value || field.value.length === 0) {
      setSelectedProduct([]);
    }
  }, [products, field.value]);

  const handleProductChange = (selectedValue: SelectOption[] | null) => {
    if (selectedValue && selectedValue.length > 0) {
      const selectedProductIds = selectedValue
        .map((selected) => selected.value)
        .filter((val) => val !== undefined && val !== null); // Ensure no undefined values

      setSelectedProduct(selectedValue);
      form.setValue(field.name, selectedProductIds);
      form.trigger(field.name);
    } else {
      setSelectedProduct([]);
      form.setValue(field.name, []);
      form.trigger(field.name);
    }
  };

  return (
    <div>
      <Select
        {...field}
        closeMenuOnSelect={false}
        components={animatedComponents}
        options={renderProduct(products)}
        isMulti
        onChange={handleProductChange}
        value={selectedProduct}
        className="w-full"
        isLoading={isLoading}
        placeholder={isLoading ? "Loading products..." : "Select products..."}
        noOptionsMessage={() =>
          isLoading ? "Loading..." : "No products found"
        }
      />
    </div>
  );
};

export default Productselect;
