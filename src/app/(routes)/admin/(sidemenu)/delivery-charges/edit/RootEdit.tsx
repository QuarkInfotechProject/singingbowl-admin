'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { DeliveryCharge, Country } from '@/app/_types/delivery-Types/deliveryCharges';
import { Skeleton } from '@/components/ui/skeleton';
import countries from '@/data/countries.json';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().optional(),
  deliveryCharge: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  chargeAbove20kg: z.string().optional(),
  chargeAbove45kg: z.string().optional(),
  chargeAbove100kg: z.string().optional(),
});

const RootDeliveryUpdate = ({
  setIsSheetOpens,
  dataId,
  setRefetch,
  deliveryData
}: {
  setIsSheetOpens: any;
  dataId: number;
  setRefetch: any;
  deliveryData: DeliveryCharge | undefined;
}) => {
  const { toast } = useToast();
  const [isLoading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  const { setValue } = form;

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = (countries as Country[]).find(c => c.name === countryName);
    if (selectedCountry) {
      setValue('country', selectedCountry.name);
      setValue('countryCode', selectedCountry.code);
    }
  };

  useEffect(() => {
    if (deliveryData) {
      setValue('description', deliveryData.description || '');
      setValue('deliveryCharge', deliveryData.deliveryCharge || '');
      setValue('country', deliveryData.country || '');
      setValue('chargeAbove20kg', deliveryData.chargeAbove20kg || '');
      setValue('chargeAbove45kg', deliveryData.chargeAbove45kg || '');
      setValue('chargeAbove100kg', deliveryData.chargeAbove100kg || '');

      if (deliveryData.country) {
        const selectedCountry = (countries as Country[]).find(c => c.name === deliveryData.country);
        if (selectedCountry) {
          setValue('countryCode', selectedCountry.code);
        }
      }
      setLoading(false);
    }
  }, [deliveryData, setValue]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const newData = {
      id: dataId,
      description: data.description,
      deliveryCharge: data.deliveryCharge,
      additionalChargePerItem: 0,
      weightBasedCharge: 0,
      country: data.country,
      countryCode: data.countryCode,
      chargeAbove20kg: data.chargeAbove20kg,
      chargeAbove45kg: data.chargeAbove45kg,
      chargeAbove100kg: data.chargeAbove100kg,
    };

    try {
      const res = await fetch(`/api/delivery-charge/update`, {
        method: 'POST',
        body: JSON.stringify(newData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (res.status === 200) {
        toast({
          title: 'Update Successful',
          description: 'Delivery charge has been updated successfully.',
        });
        setIsSheetOpens(false);
        setRefetch(true);
      } else {
        toast({
          title: 'Update Failed',
          description: 'There was an issue updating the delivery charge.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while updating.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full px-2">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-64 mt-2" />
        </div>
        <div className="space-y-8">
          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="w-full px-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Update Delivery Charge</h1>
          <p className="text-sm text-gray-500 mt-1">Modify delivery pricing configuration</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-h-[550px] overflow-y-auto pr-4"
        >
          {/* Country & Base Charge - Top Row */}
          <div className="grid grid-cols-2 gap-8">
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Country / Region</FormLabel>
                  <Select onValueChange={handleCountryChange} value={field.value || ''}>
                    <FormControl>
                      <SelectTrigger className="focus:ring-0 focus:ring-offset-0 focus-visible:ring-0">
                        <SelectValue placeholder="Select a country" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className="max-h-[200px]">
                      {(countries as Country[]).map((country) => (
                        <SelectItem key={country.code} value={country.name}>
                          {country.name} ({country.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">Leave empty for global pricing</p>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="deliveryCharge"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">Base Delivery Fee</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type='number'
                        min={0}
                        step="0.01"
                        placeholder="0.00"
                        {...field}
                        className="pl-7 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus:border-gray-300"
                      />
                    </div>
                  </FormControl>
                  <p className="text-xs text-gray-500 mt-1">For orders under 20kg</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Weight-Based Charges - Second Row */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">Weight-Based Charges</h2>
              <p className="text-xs text-gray-500 mt-1">Additional charges for heavier shipments</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="chargeAbove20kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">20kg+</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type='number'
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          className="pl-7 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chargeAbove45kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">45kg+</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type='number'
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          className="pl-7 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="chargeAbove100kg"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">100kg+</span>
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                        <Input
                          type='number'
                          min={0}
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          className="pl-7 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus:border-gray-300"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Description - Bottom */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium">Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="e.g., Standard Delivery, Express Shipping..."
                    {...field}
                    className="resize-none h-20 focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus:border-gray-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              disabled={isSubmitting}
              type="submit"
              className="w-full bg-[#5e72e4] hover:bg-[#465ad1] h-11"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                'Update Delivery Charge'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default RootDeliveryUpdate;
