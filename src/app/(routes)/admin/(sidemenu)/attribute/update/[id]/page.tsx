"use client";

import { useEffect, useState } from "react";
import AddForm from "../../_components/Addgroup";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface UpdateProps {
  params: { id: string };
}

type UpdateInputs = {
  id: string;
  attributeSetId: string;
  name: string;
  url: string;
  values: {
    id: string | undefined;
    value: string;
  }[];
  category_ids?: number[];
  is_enabled?: number;
  sort_order?: number;
};

const UpdateAffiliate: React.FC<UpdateProps> = ({ params }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<UpdateInputs | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  const handelBack = () => {
    router.push("/admin/attribute");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await axios.get(`/api/attribute/specific/${params.id}`);
        console.log("Response received:", res);

        if (res.status === 200) {
          const fetchedData = res.data.data || res.data;
          setData(fetchedData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        if (axios.isAxiosError(error)) {
          toast({
            description: error.response?.data?.message || error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Unexpected Error",
            description: `${error}`,
            variant: "destructive",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [params.id, toast]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-row gap-2 items-center">
          <Button
            onClick={handelBack}
            variant="outline"
            className="flex items-center justify-center p-1"
          >
            <IoIosArrowBack className="h-4 w-4" />
          </Button>
          <h1 className="text-xl font-bold">Update Attributes</h1>
        </div>
        <Card className="w-full max-w-4xl">
          <CardContent className="space-y-6 pt-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={handelBack}
          variant="outline"
          className="flex items-center justify-center p-1"
        >
          <IoIosArrowBack className="h-4 w-4" />
        </Button>
        <h1 className="text-xl font-bold">Update Attributes</h1>
      </div>
      <AddForm params={params} initialData={data} />
    </div>
  );
};

export default UpdateAffiliate;
