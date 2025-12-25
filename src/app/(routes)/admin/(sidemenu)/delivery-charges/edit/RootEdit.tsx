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
import * as z from 'zod';
import { useToast } from '@/components/ui/use-toast';
import { DeliveryCharge } from '@/app/_types/delivery-Types/deliveryCharges';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

const formSchema = z.object({
  description: z.string().optional(),
  standardRate: z.string().optional(),
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

  useEffect(() => {
    if (deliveryData) {
      setValue('description', deliveryData.description || '');
      setValue('standardRate', deliveryData.deliveryCharge || '');
      setLoading(false);
    }
  }, [deliveryData, setValue]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    const newData = {
      id: dataId,
      description: data.description,
      deliveryCharge: data.standardRate,
      additionalChargePerItem: 0,
      weightBasedCharge: 0,
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
        <div className="space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <div className="w-full px-2">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Update Delivery Charge</h1>
          <p className="text-sm text-gray-500 mt-1">Modify standard delivery pricing for all countries</p>
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
                  <FormLabel className="text-sm font-medium">Delivery Charge</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type='number'
                        min={0}
                        step="0.1"
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
