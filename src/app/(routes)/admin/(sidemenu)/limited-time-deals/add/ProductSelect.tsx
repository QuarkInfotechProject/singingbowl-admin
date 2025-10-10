import Select from "react-select";
import makeAnimated from "react-select/animated";
const animatedComponents = makeAnimated();
interface Product {
  id: string;
  name: string;
}
interface SelectOption {
  value: string;
  label: string;
}
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
const Productselect = ({ form, field }: { form: any; field: any }) => {
  // const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<
    SelectOption[] | undefined
  >([]);

  const renderProduct = (products: Product[]) => {
    return products.map((currentProduct) => ({
      value: currentProduct.id,
      label: currentProduct.name,
    }));
  };

const { data, isLoading } = useQuery({
    queryKey: ["limitedTimeDeal"],
    queryFn: async () => {
      const res = await clientSideFetch({
        url: "/products?per_page=1000000000",
        method: "post",
        body: {
          status: "1",
          name: "",
          sku: "",
          sortBy: "date",
          sortDirection: "desc",
        },
        toast:toast,
      });
      if (res?.status === 200) {
        return res.data || [];
      }
    },
  });
  const products = data?.data?.data || [];
  useEffect(() => {
    if (products.length > 0 && field.value && field.value.length > 0) {
      const defaultSelected = renderProduct(products).filter((option) =>
        field.value.includes(option.value)
      );
      setSelectedProduct(defaultSelected);
    }
  }, [products, field.value]);

  const handleProductChange = (selectedValue: SelectOption[] | null) => {
    if (selectedValue && selectedValue.length > 0) {
      const selectedProductIds = selectedValue.map(
        (selected) => selected.value
      );
      setSelectedProduct(selectedValue);
      form.setValue(field.name, selectedProductIds[0]);
      console.log(selectedProductIds);
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
        isLoading={isLoading}
        onChange={handleProductChange}
        value={selectedProduct}
        className="w-full"
      />
    </div>
  );
};

export default Productselect;
