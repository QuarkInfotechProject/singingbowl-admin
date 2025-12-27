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
import axios from 'axios';
import { useState } from 'react';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  standardRate: z.string().min(1, 'Standard rate is required'),
});

const AddDelivery = ({ setRefetch, setIsSheetOpen }: { setRefetch: any; setIsSheetOpen: any }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      description: '',
      standardRate: '',
    }
  });

  const onSubmit = async (submitedValues: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    const payload = {
      description: submitedValues.description,
      deliveryCharge: submitedValues.standardRate,
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
          <p className="text-sm text-gray-500 mt-1">Configure standard delivery pricing for all countries</p>
        </div>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 max-h-[550px] overflow-y-auto pr-4"
        >
          {/* Standard Rate Section */}
          <div className="space-y-4">
            <div className="pb-2 border-b border-gray-200">
              <h2 className="text-sm font-semibold text-gray-700">Standard Rate</h2>
              <p className="text-xs text-gray-500 mt-1">This rate applies to all countries globally</p>
            </div>

            <FormField
              control={form.control}
              name="standardRate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium">
                    Delivery Charge <span className="text-red-500">*</span>
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
                  <p className="text-xs text-gray-500 mt-1">Enter amount in dollars (e.g., 5.8)</p>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Description */}
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
