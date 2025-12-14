import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
    return (
        <div className="w-full p-6">
            {/* Header Skeleton */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <Skeleton className="h-8 w-32 mb-2" />
                    <Skeleton className="h-4 w-64" />
                </div>
                <div className="flex gap-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-28" />
                </div>
            </div>

            {/* Gallery Grid Skeleton */}
            <div className="bg-white rounded-lg border p-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                    {Array(12)
                        .fill(null)
                        .map((_, index) => (
                            <div key={index} className="space-y-2">
                                <Skeleton className="aspect-square rounded-lg" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-8" />
                            </div>
                        ))}
                </div>
            </div>
        </div>
    );
};

export default Loading;
