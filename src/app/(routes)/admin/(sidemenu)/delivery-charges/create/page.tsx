'use client';
import { zodResolver } from '@hookform/resolvers/zod';
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
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from 'axios';
import { useState } from 'react';
import countries from '@/data/countries.json';
import { Country } from '@/app/_types/delivery-Types/deliveryCharges';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  deliveryCharge: z.string().optional(),
  country: z.string().optional(),
  countryCode: z.string().optional(),
  chargeAbove20kg: z.string().optional(),
  chargeAbove45kg: z.string().optional(),
  chargeAbove100kg: z.string().optional(),
});

const AddDelivery = ({ setRefetch, setIsSheetOpen }: { setRefetch: any; setIsSheetOpen: any }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      description: '',
      deliveryCharge: '',
      country: '',
      countryCode: '',
      chargeAbove20kg: '',
      chargeAbove45kg: '',
      chargeAbove100kg: '',
    }
  });

  const handleCountryChange = (countryName: string) => {
    const selectedCountry = (countries as Country[]).find(c => c.name === countryName);
    if (selectedCountry) {
      form.setValue('country', selectedCountry.name);
      form.setValue('countryCode', selectedCountry.code);
    }
  };

  const onSubmit = async (submitedValues: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const payload = {
      ...submitedValues,
      additionalChargePerItem: 0,
      weightBasedCharge: 0,
    };
    try {
      const { data } = await axios.post('/api/delivery-charge/add', payload);
      if (data) {
        toast({ description: `${data.message}` });
        setRefetch(true);
        setIsLoading(false);
        setIsSheetOpen(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        toast({
          description: error.response?.data?.message || error.message,
          variant: 'destructive',
        });
      } else {
        setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <Form {...form}>
      <div className="w-full px-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Add Delivery Charge</h1>
          <p className="text-sm text-gray-500 mt-1">Configure delivery pricing for a specific region</p>
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
                  <Select onValueChange={handleCountryChange} defaultValue={field.value}>
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
                <FormLabel className="text-sm font-medium">Description <span className="text-red-500">*</span></FormLabel>
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
              disabled={isLoading}
              type="submit"
              className="w-full bg-[#5e72e4] hover:bg-[#465ad1] h-11"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Delivery Charge'
              )}
            </Button>
          </div>
        </form>
      </div>
    </Form>
  );
};

export default AddDelivery;
