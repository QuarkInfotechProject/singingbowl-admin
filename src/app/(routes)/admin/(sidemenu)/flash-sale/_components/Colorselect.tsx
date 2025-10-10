import Select from "react-select";
import makeAnimated from "react-select/animated";
import React, { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

// Define proper types for the product objects
interface Product {
  id: string;
  name: string;
}

interface SelectOption {
  value: string;
  label: string;
}

const animatedComponents = makeAnimated();

const Colorselect = ({ form, field }: { form: any; field: any }) => {
  const [Colors, setColors] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<SelectOption | null>(null);

  // Function to transform the fetched colors into Select options
  const renderProduct = (Colors: Product[]) => {
    return Colors.map((currentProduct) => ({
      value: currentProduct.id,
      label: currentProduct.name,
    }));
  };

  // Fetch Colors on mount and when dynamically updated
  useEffect(() => {
    const getColors = async () => {
      try {
        const response = await clientSideFetch({
          url: `/colors`,
          method: "post",
          debug: true,
          toast: toast,
        });

        if (response?.status === 200) {
          setColors(response.data.data);
        }
      } catch (error) {
        console.error("Failed to fetch Colors:", error);
        toast({
          title: "Error",
          description: "Failed to load Colors. Please try again.",
          variant: "destructive",
        });
      }
    };

    getColors();
  }, []); // Initial fetch when the component mounts

  // Dynamically update the selected product after Colors are fetched
  useEffect(() => {
    if (Colors.length > 0 && field.value) {
      const defaultOption = Colors.find((color) => color.id === field.value);

      if (defaultOption) {
        setSelectedProduct({
          value: defaultOption.id,
          label: defaultOption.name,
        });
      }
    }
  }, [Colors, field.value]); 

  const handleProductChange = (selectedValue: SelectOption | null) => {
    if (selectedValue) {
      setSelectedProduct(selectedValue);
      form.setValue(field.name, selectedValue.value); 
      form.trigger(field.name); 
    } else {
      setSelectedProduct(null);
      form.setValue(field.name, null); 
      form.trigger(field.name); 
    }
  };

  return (
    <div>
      <Select
        {...field}
        closeMenuOnSelect={true} 
        components={animatedComponents}
        options={renderProduct(Colors)} 
        onChange={handleProductChange} 
        value={selectedProduct} 
        className="w-full"
        isMulti={false} 
      />
    </div>
  );
};

export default Colorselect;
