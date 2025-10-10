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
import { Badge } from "@/components/ui/badge";
interface FlashInfoProps {
  id: string;
}

const ShowFlash: React.FC<FlashInfoProps> = ({ id }) => {
  const [FlashData, setFlashData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const fetchFlashData = async () => {
      try {
        setIsLoading(true);
        const response = await clientSideFetch({
          url: `/flash-sale/show/${id}`,
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
          setFlashData(response.data.data);
        }
      } catch (error) {
        toast({
          title: "Error fetching data",
          description: "Failed to fetch Flash information.",
          variant: "destructive",
          className: "bg-red-500 text-white",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchFlashData();
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
          {[
            "Flash Name",
            "Flash Slug",
            "Status",
            "Flash Description",
            "Meta Title",
            "Meta Description",
          ].map((title) => (
            <div className="card" key={title}>
              <Skeleton className="w-1/4 h-4 mb-2" />
              <Skeleton className="w-full h-5" />
            </div>
          ))}

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
      {Object.keys(FlashData || {}).length > 1 && (
        <>
          <div className="w-full border p-4 rounded-lg">
            <div className="py-4">
              <div className="flex flex-row items-center gap-2">
                <h1 className="text-xl font-bold">Flash Details :</h1>
              </div>
            </div>

            {/* Flash Information Cards */}
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-base font-semibold">Flash Name :</h3>
                <p>{FlashData?.campaign_name}</p>
              </div>

              {/* <div className="card">
                <h3 className="text-base font-medium">Flash Slug</h3>
                <p>{FlashData?.slug}</p>
              </div> */}
              <div className="flex justify-between items-center">
                <div className="card flex space-x-2 justify-center items-center">
                  <h3 className="text-base font-semibold">Theme Color :</h3>
                  <Badge
                    style={{ background: `${FlashData?.theme_color.hex_code}` }}
                  >
                    {" "}
                    <p>{FlashData?.theme_color.hex_code}</p>
                  </Badge>
                </div>
                <div className="card flex space-x-2 justify-center items-center">
                  <h3 className="text-base font-semibold">Text Color :</h3>

                  <Badge
                    style={{ background: `${FlashData?.text_color.hex_code}` }}
                  >
                    {" "}
                    <p>{FlashData?.text_color.hex_code}</p>
                  </Badge>
                </div>
              </div>
              <div className="flex justify-between items-center space-x-2">
                <div className="card">
                  <h3 className="text-base font-semibold">Start Date :</h3>
                  <p>{FlashData?.start_date}</p>
                </div>
                <div className="card">
                  <h3 className="text-base font-semibold">End Date :</h3>
                  <p>{FlashData?.end_date}</p>
                </div>
              </div>

              {/* <div className="card flex">
                <h3 className="text-base font-semibold">Status :</h3>
                <p>
                  <Checkbox checked={Boolean(FlashData?.status)} />
                </p>
              </div> */}

              {/* <div className="card">
                <h3 className="text-base font-medium">Flash Description</h3>
                <p>{FlashData?.description}</p>
              </div>

              <div className="card">
                <h3 className="text-base font-medium">Meta Title</h3>
                <p>{FlashData?.meta.metaTitle}</p>
              </div>

              <div className="card">
                <h3 className="text-base font-medium">Meta Description</h3>
                <p>{FlashData?.meta.metaDescription}</p>
              </div> */}

              <div className="flex justify-between items-center">
              <div className="card flex flex-col justify-center items-center space-y-3">
              <h3 className="text-base font-semibold">
                    Mobile Logo Image :
                  </h3>
                  <div className="border rounded-lg p-2 relative flex justify-center items-center w-24 h-24">
                    <Image
                      src={FlashData?.files?.mobileBanner.url}
                      alt="logo images"
                      layout="intrinsic"
                      width={100}
                      height={100}
                    />
                  </div>
                </div>

                <div className="card flex flex-col justify-center items-center space-y-3">
                  <h3 className="text-base font-semibold">
                    Desktop Banner Image :
                  </h3>

                  <div className="border rounded-lg p-2 relative flex justify-center items-center">
                    <Image
                      src={FlashData?.files?.desktopBanner.url}
                      alt="logo images"
                      layout="intrinsic"
                      width={100}
                      height={100}
                    />
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

export default ShowFlash;
