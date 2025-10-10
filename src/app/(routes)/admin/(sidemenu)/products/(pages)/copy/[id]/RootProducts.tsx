"use client";
import { useState } from "react";
import { z } from "zod";
import { formSchema } from "./page";
import { UseFormReturn } from "react-hook-form";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import AllProducts from "../../_formComponents/AllProducts";
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import FetchSingleProduct from "../../_formComponents/FetchSingleProduct";

// this component is separated to Encapsulate products and its related logic in separate file
const RootProducts = ({
  form,
  defaultProduct
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
  defaultProduct:any[]
}) => {
  const [toUpdate, setToUpdate] = useState<
    "related-product" | "up-sell-product" | "cross-sell-product"
  >("related-product");
  const [uploadedProducts, setUploadedProducts] = useState<string[]>([]);
  const [localProductIds, setLocalProductIds] = useState<string[]>([]);
  const [localProductThumbnails, setLocalProductThumbnails] = useState<
    string[]
  >([]);

  const crossSells = form.getValues("crossSells") || [];
  const relatedProducts = form.getValues("relatedProducts") || [];
  // const upSells = form.getValues("upSells") || [];

  const handleRemove = (
    id: string,
    toRemove: "related-product" | "up-sell-product" | "cross-sell-product"
  ) => {
    if (toRemove === "related-product") {
      const updatedIds = relatedProducts.filter((idx) => idx !== id);
      form.setValue("relatedProducts", updatedIds);
    } else if (toRemove === "cross-sell-product") {
      const updatedIds = crossSells.filter((idx) => idx !== id);
      form.setValue("crossSells", updatedIds);
    } else if (toRemove === "up-sell-product") {
      const updatedIds = upSells.filter((idx) => idx !== id);
      // form.setValue("upSells", updatedIds);
    } else {
      return;
    }
  };

  // form.watch("upSells");
  form.watch("relatedProducts");
  form.watch("crossSells");
  return (
    <div>
      <Dialog
        onOpenChange={() => {
          setLocalProductIds([]);
          setLocalProductThumbnails([]);
        }}
      >
        <AllProducts
          form={form}
          toUpdate={toUpdate}
          uploadedProducts={uploadedProducts}
          setLocalProductIds={setLocalProductIds}
          setLocalProductThumbnails={setLocalProductThumbnails}
          localProductIds={localProductIds}
          localProductThumbnails={localProductThumbnails}
          defaultProduct={defaultProduct}
        />

        <div className="p-4 bg-white rounded my-8">
          <p className="font-medium">Related Products</p>
          <p className="text-sm text-foreground/60 mb-3">
            Related products are frequently bought together with the original
            purchase but are not necessarily complementary
          </p>
          <div className="flex flex-col gap-2">
            {relatedProducts &&
              relatedProducts.map((id) => {
                return (
                  <div
                    className="max-w-[1200px] items-center justify-between flex gap-2 px-4 py-2 border rounded"
                    key={id}
                  >
                    
                    <FetchSingleProduct id={id} />
                 
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white"
                      size="sm"
                      type="button"
                      onClick={(e) => handleRemove(id, "related-product")}
                      // className="absolute top-1 right-1 bg-gray-500 text-white rounded-full p-2 h-5 w-5 grid place-content-center"
                      title="remove"
                    >
                      <Trash className="h-4 w-4 mr-3" />
                      Delete
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            className="font-normal mt-4"
            type="button"
            variant={"secondary"}
            size={"sm"}
            asChild
          >
            <DialogTrigger
              onClick={() => {
                setToUpdate("related-product");
                setUploadedProducts(form.getValues("relatedProducts") || []);
              }}
            >
              Add Related Products
            </DialogTrigger>
          </Button>
        </div>
        {/* related products end */}

        {/* cross sell product starts */}
        {/* <div className="p-4 bg-white rounded my-8">
          <p className="font-medium">Related Products</p>
          <p className="text-sm text-foreground/60 mb-4">
            Related products complement the customer's original purchase,
            enhancing its use or experience.
          </p>
          <div className="flex flex-col gap-2">
            {crossSells &&
              crossSells.map((id) => {
                return (
                  <div
                    className="max-w-[1200px] items-center justify-between py-2 flex gap-2 px-4  border rounded"
                    key={id}
                  >
                    <FetchSingleProduct id={id} />
                    
                    <Button
                      className="bg-red-500 mt-4 hover:bg-red-600 text-white"
                      size="sm"
                      type="button"
                      onClick={(e) => handleRemove(id, "cross-sell-product")}
                      title="remove"
                    >
                      <Trash className="h-4 w-4 mr-3" />
                      Delete
                    </Button>
                  </div>
                );
              })}
          </div>

          <Button
            className="font-normal mt-4"
            type="button"
            variant={"secondary"}
            size={"sm"}
            asChild
          >
            <DialogTrigger
              onClick={() => {
                setToUpdate("cross-sell-product");
                setUploadedProducts(form.getValues("crossSells") || []);
              }}
            >
              Add Related Products
            </DialogTrigger>
          </Button>
        </div> */}
      </Dialog>
    </div>
  );
};

export default RootProducts;
