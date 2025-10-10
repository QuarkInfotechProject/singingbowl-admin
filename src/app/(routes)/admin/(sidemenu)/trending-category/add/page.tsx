"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CategoriesSelect from "../../products/(pages)/_formComponents/(general)/CategoriesSelect";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { queryClient } from "@/lib/context/ReactQueryContext";

const formSchema = z.object({
  isActive: z.boolean().default(true),
  categoriesId: z.array(z.number()).optional(),
});
interface AddTrendingCategoryPageProps {
  setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddTrendingCategorypage: React.FC<AddTrendingCategoryPageProps> = ({
  setIsDialogOpen,
}) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoriesId: [],
      isActive: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      const newData = {
        isActive: values.isActive ? "1" : "0",
        categoriesId: values.categoriesId?.[0] ?? null,
      };
      const response = await clientSideFetch({
        url: "/trending-categories/create",
        method: "post",
        body: newData,
        toast: "skip",
      });

      if (response?.status === 200) {
        queryClient.invalidateQueries({ queryKey: ["trendingCategories"] });
        setIsDialogOpen(false);
        toast({
          title: `${response.data.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        form.reset();
        router.push("/admin/trending-category");
      } else {
        toast({
          title: "There was an error processing your request",
          className: "bg-red-500 text-white font-semibold",
        });
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "An error occurred",
        className: "bg-red-500 text-white font-semibold",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl  rounded-md ">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="categoriesId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Category</FormLabel>
                <FormControl>
                  <CategoriesSelect field={field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="isActive"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isSubmitting}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
};

export default AddTrendingCategorypage;
