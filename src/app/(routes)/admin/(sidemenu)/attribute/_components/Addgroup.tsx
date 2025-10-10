import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Loader2, Trash2 } from "lucide-react";
import { useGlobalContext } from "../_context/context";
import { useGlobalContext as useAttributeContext } from "../../attribute-sets/_context/context";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CategoriesSelect from "../../products/(pages)/_formComponents/(general)/CategoriesSelect";

// Define the Zod schema for form validation
const attributeFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  attributeSetId: z.coerce
    .number()
    .min(1, { message: "Please select an attribute set" }),

  values: z
    .array(
      z.object({
        id: z.string().optional().or(z.literal("")),
        value: z.string().min(1, "Value is required"),
      })
    )
    .min(1, "At least one value is required"),
  category_ids: z.array(z.number()).optional(),
  is_enabled:z.number().optional(),
  sort_order:z.number().optional()
});

// Infer the TypeScript type from the schema
type AttributeFormValues = z.infer<typeof attributeFormSchema>;

const UnifiedAttributeForm = ({
  params,
  defaultValues,
}: {
  params: { id: string };
  defaultValues?: AttributeFormValues | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [tag, setTag] = useState<AttributeFormValues>();
  const { toast } = useToast();
  const router = useRouter();
  const context = useGlobalContext();
  const attributeContext = useAttributeContext();

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeFormSchema),
    defaultValues: defaultValues || {
      attributeSetId: 0,
      name: "",
      values: [],
      category_ids: [],
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get(`/api/attribute/specific/${params.id}`);
        if (res.status === 200) {
          const data = res.data.data || res.data;
          setTag(data);
          form.setValue("attributeSetId", Number(data.attributeSetId) || 0);
          form.setValue("name", data.name || "");
          form.setValue("category_ids", data.category_ids);
          form.setValue("is_enabled",data.is_enabled)
          form.setValue("sort_order",data.sort_order)
          if (data.values?.length > 0) {
            form.setValue(
              "values",
              data.values.map((value: any) => ({
                id: value.id?.toString() || "",
                value: value.value || "",
              }))
            );
          } else {
            form.setValue("values", [{ id: "", value: "" }]);
          }
          if (data.category_ids?.length > 0) {
            form.setValue(
              "category_ids",
              data.category_ids.map((id: any) => Number(id))
            );
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            description: error.response?.data?.message || error.message,
            variant: "destructive",
          });
        }
      }
      setIsLoading(false);
    };

    fetchData();
  }, [params.id]);

  const onSubmit = async (data: AttributeFormValues) => {
    setIsLoading(true);
    try {
      const payload = {
        ...data,
        id: Number(params.id),
        values: data.values.map((item) => item.value),
        
      };

      const res = await axios.post("/api/attribute/update", payload);
      if (res.status === 200) {
        toast({
          description: res.data.message || "Attribute updated successfully",
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.push("/admin/attribute");
        context?.getData(1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast({
          description:
            error.response?.data?.error ||
            error.response?.data?.message ||
            error.message,
          variant: "destructive",
        });
      } else {
        toast({
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
  };

  const findDefaultName = () => {
    if (!tag?.attributeSetId) return undefined;

    // Handle attributeSetId as number
    return attributeContext?.state.data.find(
      (attribute) => Number(attribute.id) === Number(tag.attributeSetId)
    )?.name;
  };

  const handleAddValue = () => {
    const currentValues = form.getValues("values") || [];
    form.setValue("values", [...currentValues, { id: "", value: "" }], {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const handleRemoveValue = (index: number) => {
    const currentValues = form.getValues("values");
    if (currentValues.length > 1) {
      form.setValue(
        "values",
        currentValues.filter((_, i) => i !== index),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    }
  };

  if (isLoading && !tag) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader>
          <Skeleton className="h-8 w-48" />
        </CardHeader>
        <CardContent className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader></CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Attribute Set Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="attributeSetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="capitalize">Attribute Sets</FormLabel>
                    <Select
                      disabled={attributeContext?.state.loading}
                      defaultValue={findDefaultName()}
                      onValueChange={(value) => {
                        const selectedAttribute =
                          attributeContext?.state.data.find(
                            (attribute) => attribute.name === value
                          );
                        // Convert the ID to a number for the form schema
                        field.onChange(
                          parseInt(selectedAttribute?.id.toString(), 10) || 0
                        );
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Attribute Set" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {attributeContext?.state.data.map((attribute) => (
                          <SelectItem key={attribute.id} value={attribute.name}>
                            {attribute.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Name Field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* URL Field - optional based on the API example */}
            <FormField
              control={form.control}
              name="category_ids"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <CategoriesSelect field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Values Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Attribute Values</h3>
                <Button
                  variant="outline"
                  type="button"
                  onClick={handleAddValue}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Value
                </Button>
              </div>

              <div className="space-y-3">
                {form.watch("values")?.map((_, index) => (
                  <FormField
                    key={index}
                    control={form.control}
                    name={`values.${index}.value`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center gap-2">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Value ${index + 1}`}
                            />
                          </FormControl>
                          {form.watch("values").length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleRemoveValue(index)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
                {form.watch("values")?.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No values added. Click "Add Value" to create one.
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UnifiedAttributeForm;
