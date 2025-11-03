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
  category_ids: z.array(z.number()).optional().default([]),
  is_enabled: z.union([z.number(), z.boolean()]).optional(),
  sort_order: z.number().optional(),
});

type AttributeFormValues = z.infer<typeof attributeFormSchema>;

const UnifiedAttributeForm = ({
  params,
  initialData,
}: {
  params: { id: string };
  initialData?: any;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const context = useGlobalContext();
  const attributeContext = useAttributeContext();

  const form = useForm<AttributeFormValues>({
    resolver: zodResolver(attributeFormSchema),
    mode: "onBlur",
    defaultValues: {
      attributeSetId: 0,
      name: "",
      values: [{ id: "", value: "" }],
      category_ids: [],
    },
  });

  // Set form values when initialData is provided
  useEffect(() => {
    if (initialData) {
      form.reset({
        attributeSetId: Number(initialData.attributeSetId) || 0,
        name: initialData.name || "",
        category_ids: initialData.category_ids || [],
        is_enabled: initialData.is_enabled,
        sort_order: initialData.sort_order,
        values:
          initialData.values?.length > 0
            ? initialData.values.map((value: any) => ({
                id: value.id?.toString() || "",
                value: value.value || "",
              }))
            : [{ id: "", value: "" }],
      });
    }
  }, [initialData, form]);

  const onSubmit = async (data: AttributeFormValues) => {
    console.log("✅ onSubmit called with data:", data);
    setIsSubmitting(true);

    try {
      console.log("📝 Form data before submission:", data);

      const payload = {
        id: params.id,
        attributeSetId: data.attributeSetId.toString(),
        name: data.name,
        values: data.values.map((item) => ({
          id: item.id || "",
          value: item.value,
        })),
        category_ids: data.category_ids || [],
        is_enabled: data.is_enabled,
        sort_order: data.sort_order,
      };

      console.log("📦 Payload being sent:", JSON.stringify(payload, null, 2));

      const res = await axios.post("/api/attribute/update", payload);

      console.log("✅ Response from server:", res);

      if (res.status === 200) {
        console.log("✅ Success! Status 200");
        toast({
          description: res.data.message || "Attribute updated successfully",
          variant: "default",
          className: "bg-green-500 text-white",
        });

        if (context?.getData) {
          console.log("Calling context.getData");
          context.getData(1);
        }

        console.log("Redirecting to /admin/attribute");
        router.push("/admin/attribute");
      }
    } catch (error) {
      console.error("❌ Error submitting form:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message;
        console.error("❌ API Error:", errorMessage);
        console.error("❌ Full error response:", error.response?.data);
        toast({
          description: errorMessage || "Failed to update attribute",
          variant: "destructive",
        });
      } else {
        console.error("❌ Non-axios error:", error);
        toast({
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      console.log("🔚 Setting isSubmitting to false");
      setIsSubmitting(false);
    }
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

  if (!initialData) {
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
          <form
            onSubmit={(e) => {
              console.log("🔵 Form submit event triggered");
              e.preventDefault();
              const isValid = form.formState.isValid;
              console.log("📋 Form is valid:", isValid);
              console.log("📋 Form errors:", form.formState.errors);
              if (!isValid) {
                console.log("❌ Form validation failed");
                return;
              }
              form.handleSubmit(onSubmit)(e);
            }}
            className="space-y-6"
          >
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
                      value={(field.value || 0).toString()}
                      onValueChange={(value) => {
                        const numValue = parseInt(value, 10);
                        field.onChange(numValue);
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select Attribute Set" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {attributeContext?.state.data?.map((attribute: any) => (
                          <SelectItem
                            key={attribute.id}
                            value={attribute.id.toString()}
                          >
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

            {/* Category Field */}
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
            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  const values = form.getValues();
                 
                  // Try to trigger validation
                  form.trigger().then((isValid) => {
                    console.log("After trigger - Is Valid:", isValid);
                  });
                }}
              >
                Debug
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {isSubmitting ? "Updating..." : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UnifiedAttributeForm;
