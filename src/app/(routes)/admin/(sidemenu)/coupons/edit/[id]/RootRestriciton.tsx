"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { AiOutlineLoading } from "react-icons/ai";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState, useEffect } from "react";
// import { DataT } from '@/_types/attributeType';

import SelectReactSelect, { ValueType } from "react-select";
import makeAnimated from "react-select/animated";
import Select from "react-select";
import { useRouter } from "next/navigation";

import { unwatchFile } from "fs";
import { CouponData } from "@/app/_types/coupon-Types/couponShow";
import { Product } from "@/app/_types/products_Type/productType";
import { ProductT } from "../../../products/(context)/types";

const animatedComponents = makeAnimated();

const formSchema = z.object({
  products: z.array(z.number()).optional(),
  excludeProducts: z.array(z.number()).optional(),
  minimumSpend: z.string(),
  categories: z.array(z.number()).optional(),
  excludeCategories: z.array(z.number()).optional(),
});

interface RootAdditionalProps {
  setFormData: (data: any) => void;
  formData: any;
  editCouponsData: CouponData | undefined;
}
const RootRestrictions: React.FC<RootAdditionalProps> = ({
  formData,
  setFormData,
  editCouponsData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedcatalogsSecond, setSelectedCatalogsSecond] = useState<
    { value: number; label: string }[]
  >([]);
  const [catalogDataSecond, setCatalogDataSecond] = useState<Product[]>([]);
  const [selectedcatalogs, setSelectedCatalogs] = useState<
    { value: number; label: string }[]
  >([]);
  const [catalogData, setCatalogData] = useState<Product[]>([]);

  useEffect(() => {
    const getcatalogs = async () => {
      try {
        const res = await fetch(`/api/products`, {
          method: "POST",
        });
        const data = await res.json();
        setCatalogData(data.data.data);
        setCatalogDataSecond(data.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    getcatalogs();
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,
    },
  });

  const renderTags = (catalog: Product[]): ValueType<Product, true>[] => {
    return catalog.map((product) => ({
      value: product.id,
      label: product.name,
    }));
  };

  const handleTagClick = (selectedOptions: ValueType<ProductT, true>) => {
    const selectedIds = Array.isArray(selectedOptions)
      ? selectedOptions.map((option) => option.value)
      : selectedOptions
      ? [selectedOptions.value]
      : [];
    setSelectedCatalogs(selectedOptions);

    form.setValue("products", selectedIds);
  };
  const renderTagsSecond = (catalog: Product[]): ValueType<Product, true>[] => {
    return catalog.map((product) => ({
      value: product.id,
      label: product.name,
    }));
  };

  const handleTagClickSecond = (
    selectedOptionss: ValueType<ProductT, true>
  ) => {
    const selectedIdss = Array.isArray(selectedOptionss)
      ? selectedOptionss.map((options) => options.value)
      : selectedOptionss
      ? [selectedOptionss.value]
      : [];
    setSelectedCatalogsSecond(selectedOptionss);

    form.setValue("excludeProducts", selectedIdss);
  };

  useEffect(() => {
    if (editCouponsData?.products) {
      const initialSelectedProducts = editCouponsData.products.map(
        (product: Product) => ({
          value: product.id,
          label: product.name,
        })
      );
      setSelectedCatalogs(initialSelectedProducts);
    }
  }, [editCouponsData?.products]);

  useEffect(() => {
    if (editCouponsData?.excludeProducts) {
      const initialSelectedExcludeProducts =
        editCouponsData.excludeProducts.map((product: Product) => ({
          value: product.id,
          label: product.name,
        }));
      setSelectedCatalogsSecond(initialSelectedExcludeProducts);
    }
  }, [editCouponsData?.excludeProducts]);

  
  useEffect(() => {
    const unwatch = form.watch((watchedValues) => {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        ...watchedValues,
      }));
    });

    return () => {
      unwatch.unsubscribe();
    };
  }, [form, setFormData]);

  const onSubmit = async (submittedValues: {
    categories?: number[];
    excludeCategories?: number[];
    products?: number[];
    excludeproducts?: number[];
    minimumSpend: string;
  }) => {
    setIsLoading(true);

    console.log("Form Values before submission:", form.getValues());

    try {
      const response = await axios.post("/api/coupons/update", formData);

      if (response.status === 200) {
        router.push("/admin/coupons");
      } else {
        console.error("Error submitting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="">
        <div className=" h-full w-96 mx-auto">
          <h1 className="text-left font-bold text-2xl ">Usage Restrictions</h1>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4  w-full my-auto "
          >
            <FormField
              control={form.control}
              name="minimumSpend"
              defaultValue={editCouponsData?.minimumSpend}
              render={({ field }) => (
                <FormItem className="mt-6">
                  <FormLabel className="text-md">Minimum Spend</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Minimum Spend"
                      type="number"
                      {...field}
                      defaultValue={editCouponsData?.minimumSpend}
                      className="border-black   "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="products"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Products</FormLabel>
                  <Select
                    {...field}
                    isMulti
                    components={animatedComponents}
                    options={renderTags(catalogData)?.map((catalog) => ({
                      value: catalog.value,
                      label: catalog.label,
                    }))}
                    onChange={handleTagClick}
                    value={selectedcatalogs}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="excludeProducts"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md">Exclude Products</FormLabel>
                  <Select
                    {...field}
                    isMulti
                    components={animatedComponents}
                    options={renderTagsSecond(catalogData)?.map((catalog) => ({
                      value: catalog.value,
                      label: catalog.label,
                    }))}
                    onChange={handleTagClickSecond}
                    value={selectedcatalogsSecond}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button disabled={isLoading} type="submit" className="">
              {isLoading && (
                <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
              )}
              Submit
            </Button>
          </form>
        </div>
      </div>
    </Form>
  );
};

export default RootRestrictions;
