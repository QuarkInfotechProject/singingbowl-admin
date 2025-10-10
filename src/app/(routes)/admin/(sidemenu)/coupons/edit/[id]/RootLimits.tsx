"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { CouponData } from "@/app/_types/coupon-Types/couponShow";

const formSchema = z.object({
  usageLimitPerCoupon: z.string().optional(),
  usageLimitPerCustomer: z.string().optional(),
});

interface RootInventoryProps {
  setFormData: (data: any) => void;
  formData: any;
  editCouponsData: CouponData | undefined;
}

const RootLimits: React.FC<RootInventoryProps> = ({
  formData,
  setFormData,
  editCouponsData,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...formData,

      // ...JSON.parse(localStorage.getItem('formData') || '{}'),
    },
  });

  useEffect(() => {}, [formData]);

  useEffect(() => {
    const unwatch = form.watch((watchedValues) => {
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        ...watchedValues,
      }));
    });

    // Cleanup the subscription when the component unmounts
    return () => unwatch.unsubscribe();
  }, [form, setFormData]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // setFormData((prevFormData: any) => ({
    //   ...prevFormData,
    //     ...values,
    // inStock: inStockValue,

    // }));

    try {
      const response = await axios.post("/api/coupons/update", formData);

      if (response.status === 200) {
        router.push("/admin/coupons");
        // localStorage.removeItem('formData');
      } else {
        console.error("Error submitting data:", response.statusText);
      }
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // useEffect(()=>{
  //   if (form.formState.isSubmitSuccessful) {
  //     onSubmit(form.getValues());
  //   }
  // }, [form.formState.isSubmitSuccessful, form.getValues])

  return (
    <Form {...form}>
      <div className="h-full w-96 mx-auto">
        <h1 className="text-left font-bold text-2xl ">Usage Limits</h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="usageLimitPerCoupon"
            defaultValue={editCouponsData?.usageLimitPerCoupon}
            render={({ field }) => (
              <FormItem className="mt-6">
                <FormLabel className="text-md">
                  Usage Limit Per Coupon
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Usage Limit Per Coupon"
                    type="number"
                    defaultValue={editCouponsData?.usageLimitPerCoupon}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="usageLimitPerCustomer"
            defaultValue={editCouponsData?.usageLimitPerCustomer}
            render={({ field }) => (
              <FormItem className="mt-10">
                <FormLabel className="text-md">
                  Usage Limit Per Customer
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Usage Limit Per Customer"
                    defaultValue={editCouponsData?.usageLimitPerCustomer}
                    type="number"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Submit</Button>
        </form>
      </div>
    </Form>
  );
};

export default RootLimits;
