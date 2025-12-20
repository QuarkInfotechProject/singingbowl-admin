"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import Image from "next/image";
import { FaTimes } from "react-icons/fa";
import axios from "axios";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
interface BrandInfoProps {
  id: string;
}
interface Root {
  id: number;
  name: string;
  slug: string;
  status: number;
  files: RootFiles;
  meta: RootMeta;
}

interface RootFiles {
  logo: RootFilesLogo;
  banner: RootFilesBanner;
}

interface RootFilesLogo {
  id: number;
  logoUrl: string;
}

interface RootFilesBanner {
  id: number;
  bannerUrl: string;
}

interface RootMeta {
  metaTitle: string;
  metaDescription: string;
}
const ShowBrand: React.FC<BrandInfoProps> = ({ id }) => {
  const [brandData, setBrandData] = useState<Root>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchBrandData = async () => {
      try {
        setIsLoading(true);
        const response = await clientSideFetch({
          url: `/brand/show/${id}`,
          method: "get",
          debug: true,
          toast: toast,
          body: null,
        });
        if (response?.status === 200) {
          toast({
            description: response.data.message,
            className: "bg-green-500 font-medium text-white",
          });
          setBrandData(response.data.data);
          console.log(response.data.data);
        }
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Failed to fetch brand information.",
          variant: "destructive",
          className: "bg-red-500 text-white",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="w-full border p-4 rounded-lg">
        <div className="py-4">
          <div className="flex flex-row items-center gap-2">
            <Skeleton className="w-1/3 h-6" />
          </div>
        </div>
        <div className="space-y-6">
          {["Brand Name", "Status", "Meta Title", "Meta Description"].map(
            (title) => (
              <div className="card" key={title}>
                <Skeleton className="w-1/4 h-4 mb-2" />
                <Skeleton className="w-full h-5" />
              </div>
            )
          )}

          <div className="flex justify-between items-center">
            <div className="card flex flex-col space-y-3">
              <Skeleton className="w-full h-32" />
            </div>
            <div className="card flex flex-col space-y-3">
              <Skeleton className="w-full h-32" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {Object.keys(brandData || {}).length > 1 && (
        <>
          <div className="w-full border p-4 rounded-lg">
            <div className="py-4">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-xl underline font-bold text-black">
                  Brand Details:
                </h1>
              </div>
            </div>

            {/* Brand Information Cards */}
            <div className="space-y-6">
              <div className="card flex gap-x-2">
                <h3 className="text-base  font-bold text-black">Brand Name:</h3>
                <p>{brandData?.name}</p>
              </div>
              <div className="card flex gap-x-2">
                <h3 className="text-base  font-bold text-black">Slug:</h3>
                <p>{brandData?.slug}</p>
              </div>

              <div className="card flex gap-x-2 justify-start items-center">
                <h3 className="text-base  font-bold text-black">Status:</h3>
                <p className="flex justify-start items-center  gap-x-4">
                  <Checkbox className="p-0 m-0" checked={Boolean(brandData?.status)} />
                  <span className="text-base text-gray-400 font-medium">{brandData?.status === 1 ? "active" : "inactive"}</span>
                </p>
              </div>

              <div className="card">
                <h3 className="text-base  font-bold text-black">Meta Title:</h3>
                <p>{brandData?.meta.metaTitle}</p>
              </div>

              <div className="card">
                <h3 className="text-base  font-bold text-black">
                  Meta Description:
                </h3>
                <p>{brandData?.meta.metaDescription}</p>
              </div>

              <div className="flex justify-between items-center">
                <div className="card flex flex-col space-y-3">
                  <h3 className="text-base  font-bold text-black">
                    Logo Image:
                  </h3>
                  <div className="border h-24  w-24 overflow-hidden rounded-lg p-2 relative flex justify-center items-center">
                    {brandData?.files?.logo?.logoUrl ? (
                      <Image
                        src={brandData.files.logo.logoUrl}
                        alt="Logo"
                        objectFit="cover"
                        fill
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Logo
                      </div>
                    )}
                  </div>
                </div>

                <div className="card flex flex-col space-y-3">
                  <h3 className="text-base  font-bold text-black">
                    Banner Image:
                  </h3>
                  <div className="border h-24 w-24 overflow-hidden rounded-lg p-2 relative flex justify-center items-center">
                    {brandData?.files?.banner?.bannerUrl ? (
                      <Image
                        src={brandData.files.banner.bannerUrl}
                        alt="Banner"
                        objectFit="cover"
                        fill
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                        No Banner
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ShowBrand;
