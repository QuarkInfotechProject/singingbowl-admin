import React, { Suspense, use } from 'react';
import RootLayout from './RootLayout';
import { Button } from '@/components/ui/button';
import { IoIosArrowBack } from 'react-icons/io';
import { serverSideFetch } from '@/app/_utils/serverSideFetch';
interface BrandData {
  id: string;
  name: string;
  description: string;
}

// Define the page props to include dynamic route parameters
interface PageProps {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
}
async function fetchData(id: string): Promise<BrandData> {
  try {
    const response = await serverSideFetch({
      url: `/brand/show/${id}`,
      method: 'get',
      debug: true, 
    });
      return response as BrandData;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch brand data: ${error.message}`);
    }
    throw new Error('Failed to fetch brand data');
  }
}
interface DataDisplayProps {
  dataPromise: Promise<BrandData>;
}

const DataDisplay: React.FC<DataDisplayProps> = ({ dataPromise }) => {
  const data = use(dataPromise); 

  return (
    <div>
      <RootLayout data={data} />
    </div>
  );
};
const Page: React.FC<PageProps> = ({ params }): JSX.Element => {
  const { id } = params;
  const dataPromise = fetchData(id);

  return (
    <div>
      <Suspense
        fallback={
          <div className="w-full border p-4 rounded-lg animate-pulse">
            {/* Header */}
            <div className="py-4">
              <div className="flex flex-row items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center justify-center p-1"
                  disabled
                >
                  <IoIosArrowBack className="h-4 w-4" />
                </Button>
                <div className="h-7 w-32 bg-gray-200 rounded"></div>
              </div>
            </div>

            <div className="mt-4 space-y-6">
              {/* Name and Slug Row */}
              <div className="flex justify-between items-center gap-x-5">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Status and Meta Title Row */}
              <div className="flex justify-between items-center gap-x-5">
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded"></div>
                </div>
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-24 bg-gray-200 rounded"></div>
                  <div className="h-10 w-full bg-gray-200 rounded"></div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-24 w-full bg-gray-200 rounded"></div>
              </div>

              {/* Meta Description */}
              <div className="space-y-2">
                <div className="h-5 w-32 bg-gray-200 rounded"></div>
                <div className="h-24 w-full bg-gray-200 rounded"></div>
              </div>

              {/* Image Upload Section */}
              <div className="flex justify-between items-start">
                {/* Logo Image */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-24 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-[150px] w-[150px] bg-gray-200 rounded-md"></div>
                </div>

                {/* Banner Image */}
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-5 w-28 bg-gray-200 rounded"></div>
                    <div className="h-8 w-20 bg-gray-200 rounded"></div>
                  </div>
                  <div className="h-[150px] w-[150px] bg-gray-200 rounded-md"></div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
        }
      >
        <DataDisplay dataPromise={dataPromise} />
      </Suspense>
    </div>
  );
};

// Add proper page configuration
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default Page;
