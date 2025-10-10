"use client"
import { Skeleton } from "@/components/ui/skeleton";
const loadding = () => {
  return (
    <div>
      <div className="space-y-8">
          {/* Header */}
          <div className="flex justify-between">
            <div className="flex flex-row items-center gap-2">
              <Skeleton className="h-8 w-8 rounded" />
              <Skeleton className="h-7 w-32" />
            </div>
          </div>

          {/* Hidden UUID field skeleton */}
          <div className="grid grid-cols-[30%_69%] gap-4 items-start justify-end ">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* General Section Grid */}
          <div className="grid grid-cols-[65%_34%] gap-4">
            {/* Left side - General */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" /> {/* Textarea field */}
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Right side - GeneralSide */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Variant Checkbox Section */}
          <div className="p-5 py-10 w-3/4 bg-violet-100 rounded">
            <div className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
              <Skeleton className="h-4 w-4" /> {/* Checkbox */}
              <div className="space-y-1">
                <Skeleton className="h-5 w-96" /> {/* Label */}
                <Skeleton className="h-16 w-full" /> {/* Description */}
              </div>
            </div>
          </div>

          {/* Dialog Content Skeleton */}
          <div className="space-y-4">
            {/* Variant Options */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>

            {/* Images Section */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <Skeleton key={i} className="aspect-square w-full" />
              ))}
            </div>

            {/* Pricing Section */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-1/3" />
              <div className="grid grid-cols-3 gap-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Meta and Attributes Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" /> {/* Section title */}
              <Skeleton className="h-32 w-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" /> {/* Section title */}
              <Skeleton className="h-32 w-full" />
            </div>
          </div>

          {/* Related Products Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" /> {/* Section title */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>

          {/* Others Section */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-32 w-full" />
          </div>

          {/* Submit Button */}
          <Skeleton className="h-10 w-24" />
        </div>
    </div>
  )
}

export default loadding
