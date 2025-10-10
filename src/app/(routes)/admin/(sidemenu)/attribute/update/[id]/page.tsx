"use client";

import { useEffect, useState } from "react";
import AddForm from "../../_components/Addgroup";
import AddValues from "../../_components/AddValues";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/ui/loading";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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
};

const UpdateAffiliate: React.FC<UpdateProps> = ({ params }) => {
  const [activeComponent, setActiveComponent] = useState("AddForm");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [tag, setTag] = useState<UpdateInputs | null>(null);
  const router = useRouter();

  const handelBack = () => {
    router.push("/admin/attribute");
  };

  useEffect(() => {
    setIsLoading(true);

    const handleOpen = async () => {
      try {
        const res = await axios.get(`/api/attribute/specific/${params.id}`);
        if (res.status === 200) {
          setTag(res.data.data);
          setIsLoading(false);
        }
        console.log("the response recived on update is : ", res);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          toast({
            description: error.response?.data?.message || error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: `Unexpected Error`,
            description: `${error}`,
            variant: "destructive",
          });
          setIsLoading(false);
        }
      }
    };

    handleOpen();
  }, []);

  return (
    <div className="flex flex-col gap-4 p-4 ">
      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={handelBack}
          variant="outline"
          size="xs"
          className="flex items-center justify-center p-1"
        >
          <IoIosArrowBack className="h-4 w-4" />
        </Button>
        {/* <Button onClick={handleBack} variant="outline" className="flex items-center">
        <IoIosArrowBack className="mr-2 h-4 w-4" />
        Back to Attribute
      </Button> */}
        <h1 className="text-xl font-bold">Update Attributes</h1>
      </div>
      <AddForm params={params} />
      {/* <Tabs
        defaultValue="AddForm"
        className="flex gap-8  w-full h-full mb-8 rounded-none"
      >
        <TabsList className=" w-60 h-40  mt-8 flex flex-col">
          <h1 className="text-lg font-medium text-center">
            Additional Information
          </h1>
          <TabsTrigger
            value="AddForm"
            className={`text-left mt-8 ml-8 w-52 hover:bg-slate-400 rounded-none  ${
              activeComponent === "AddForm" ? 'border-l-4 border-slate-800' : ''
            }` }
            onClick={() => setActiveComponent("AddForm")}
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="AddValues"
            className={`text-left ml-8 w-52 mt-4  hover:bg-slate-400 rounded-none  ${
  activeComponent === "AddValues" ? 'border-l-4 border-slate-800' : ''
            } `}
            onClick={() => setActiveComponent("AddValues")}
          >
            Values
          </TabsTrigger>
        </TabsList>

        <TabsContent value="AddForm" className="mr-60 mb-8 mt-4">
          <div>
          <AddForm params={params} />
            
          </div>
        </TabsContent>
        <TabsContent value="AddValues" className="  mb-8 mt-8 w-full mr-10">
        <AddValues params={params} defaultValues={tag} />
        
        </TabsContent>
      </Tabs> */}

      {/* <div className="flex  p-6 gap-10 ">
   
      <div className="w-[350px] h-auto text-center flex flex-col border bg-gray-50 rounded-lg shadow-lg">
        <div className="text-lg w-full h-[60px] flex items-center justify-center font-bold bg-gray-100 rounded-t-lg">
          Attribute Information
        </div>
  
        <div className="flex flex-col gap-4 p-4">
          <div
            className={`relative p-4 cursor-pointer text-lg hover:font-bold rounded-md transition-all ${
              activeComponent === "AddForm"
                ? "bg-blue-100 border-l-4 border-blue-500"
                : "bg-white hover:bg-gray-200"
            }`}
            onClick={() => setActiveComponent("AddForm")}
          >
            General
          </div>
  
          <div
            className={`relative p-4 cursor-pointer text-lg hover:font-bold rounded-md transition-all ${
              activeComponent === "AddValues"
                ? "bg-blue-100 border-l-4 border-blue-500"
                : "bg-white hover:bg-gray-200"
            }`}
            onClick={() => setActiveComponent("AddValues")}
          >
            Values
          </div>
        </div>
      </div>
  
      
      <div className="w-full flex flex-col items-start p-4 bg-gray-50 rounded-lg shadow-lg">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="w-full">
            {activeComponent === "AddForm" && <AddForm params={params} />}
            {activeComponent === "AddValues" && <AddValues params={params} defaultValues={tag} />}
          </div>
        )}
      </div>
    </div> */}
    </div>
  );
};

export default UpdateAffiliate;
