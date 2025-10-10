"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import axios from "axios";

const formSchema = z.object({
  originalPrice: z.string().nonempty("Original Price is required"),
  specialPrice: z.string().optional(),
  specialPriceStart: z.string().optional(),
  specialPriceEnd: z.string().optional(),
  quantity: z.string().min(1, "Quantity is required"),
  inStock: z.boolean(),
  status: z.boolean()
}).superRefine((data, ctx) => {
  const hasSpecialPrice = data.specialPrice && data.specialPrice.trim() !== '';
  const hasStartDate = data.specialPriceStart && data.specialPriceStart.trim() !== '';
  const hasEndDate = data.specialPriceEnd && data.specialPriceEnd.trim() !== '';
  if (!hasSpecialPrice && !hasStartDate && !hasEndDate) {
    return;
  }
  if (hasSpecialPrice) {
    if (!hasStartDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialPriceStart"],
        message: "Start date is required when special price is set"
      });
    }
    if (!hasEndDate) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["specialPriceEnd"],
        message: "End date is required when special price is set"
      });
    }
  }
  if ((hasStartDate || hasEndDate) && !hasSpecialPrice) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["specialPrice"],
      message: "Special price is required when dates are provided"
    });
  }
});
const RootEdit = ({
  IdData,
  setQuickEdits,
  defaultValue,
  setIsSheetOpen,
}: any) => {
  const router = useRouter();
  const { toast } = useToast();

  const formatToBackendDate = (datetimeLocalValue: string) => {
    const date = new Date(datetimeLocalValue);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:00`;
  };

  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  const nextDay = new Date(currentDate);
  nextDay.setDate(currentDate.getDate() + 5);
  nextDay.setHours(12, 0, 0, 0);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      originalPrice: defaultValue?.originalPrice || "",
      specialPrice: defaultValue?.specialPrice || "",
      specialPriceStart: defaultValue?.specialPriceStart || " ",
      specialPriceEnd: defaultValue?.specialPriceEnd || "",
      quantity: defaultValue?.quantity?.toString() || " ",
      inStock: defaultValue?.inStock == 1 ? true : false,
      status: defaultValue?.status || false,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const newData = {
        uuid: IdData,
        ...data,
        inStock: data.inStock ? "1" : "0",
        status: data?.status ? "1" : "0",
        specialPrice: data?.specialPrice|| "",
        specialPriceStart: data?.specialPriceStart || " ",
        specialPriceEnd: data?.specialPriceEnd || "",
      };
      const response = await axios.post("/api/products/quick-update", newData);

      if (response.status === 200) {
        toast({
          description: `${response?.data?.message}`,
          className: "bg-green-500 text-white font-semibold",
        });
        setQuickEdits(true);
      }
      setIsSheetOpen(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.data?.errors) {
        const errors = error.response.data.errors;

        for (const field in errors) {
          if (Object.hasOwnProperty.call(errors, field)) {
            toast({
              description: `${errors[field]}`,
              className: "bg-red-500 text-white font-semibold",
            });
          }
        }
      } else {
        toast({
          description: "An error occurred while submitting the form.",
          className: "bg-red-500 text-white font-semibold",
        });
      }
    }
  };
  console.log("Default Value of Quick Edits", defaultValue);
  return (
    <div>
      <Card>
        <CardHeader className="text-start">
          <CardTitle className="text-xl font-bold text-primary">
            Quick Edit
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {/* Original Price */}
              <FormField
                control={form.control}
                name="originalPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">
                      Original Price:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="Original Price"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Special Price */}
              <FormField
                control={form.control}
                name="specialPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">
                      Special Price:
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Special Price" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Special Price Start */}
              <FormField
                control={form.control}
                name="specialPriceStart"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">
                      Special Price Start:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Special Price Start"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Special Price End */}
              <FormField
                control={form.control}
                name="specialPriceEnd"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">
                      Special Price End:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="datetime-local"
                        placeholder="Special Price End"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-semibold text-primary">
                      Quantity:
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        placeholder="Quantity"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-evenly">
                <FormField
                  control={form.control}
                  name="inStock"
                  render={({ field }) => (
                    <FormItem className="flex justify-center items-center space-x-5">
                      <FormLabel className="font-semibold text-primary">
                        In Stock:
                      </FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="inStock"
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? true : false)
                              }
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem className="flex justify-center items-center space-x-5">
                      <FormLabel className="font-semibold text-primary">
                        Status:
                      </FormLabel>
                      <FormControl>
                        <Controller
                          control={form.control}
                          name="status"
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onCheckedChange={(checked) =>
                                field.onChange(checked ? true : false)
                              }
                            />
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RootEdit;
