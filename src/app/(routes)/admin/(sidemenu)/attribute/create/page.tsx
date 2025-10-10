"use client";
import React, { useEffect, useState } from "react";
import RootAddAttributes from "./RootAttribute";
import { useRouter } from "next/navigation";
import RootAddValues from "./RootValues";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";

const AffiliateAddpage = () => {
  const [formData, setFormData] = useState({
    attributeSetId: "",
    name: "",
    categoryId: [],
    url: "",
    filterable: false,
    values: [],
  });
  const [activeSubTab, setActiveSubTab] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubTabClick = (subTabValue: string) => {
    setActiveSubTab(subTabValue);
  };
  const handleBack = () => {
    router.push("/admin/attribute");
  };
  return (
    <div className="flex flex-col gap-2 ">
      <div className="flex flex-row gap-2 items-center">
        <Button
          onClick={handleBack}
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
        <h1 className="text-xl font-bold">Add Attributes</h1>
      </div>
      <div className="flex justify-center items-center h-full  ">
        <RootAddAttributes formData={formData} setFormData={setFormData} />
        {/* <Tabs
        defaultValue="general"
        className="flex gap-8  w-full h-full mb-8 rounded-none"
      >
        <TabsList className=" w-60 h-40  mt-8 flex flex-col">
          <h1 className="text-lg font-medium text-center">
          Attributes Information
          </h1>
          <TabsTrigger
            value="general"
            className={`text-left mt-8 ml-8 w-52 hover:bg-slate-400 rounded-none  ${
              activeSubTab === 'general' ? 'border-l-4 border-slate-800' : ''
            }` }
            onClick={() => handleSubTabClick('general')}
          >
            General
          </TabsTrigger>
          <TabsTrigger
            value="values"
            className={`text-left ml-8 w-52 mt-4  hover:bg-slate-400 rounded-none  ${
              activeSubTab === 'values' ? 'border-l-4 border-slate-800' : ''
            } `}
            onClick={() => handleSubTabClick('values')}
          >
            Values
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mr-60 mb-8 mt-4">
          <div>
            <RootAddAttributes formData={formData} setFormData={setFormData} />
          </div>
        </TabsContent>
        <TabsContent value="values" className="  mb-8 mt-8 w-full mr-10">
          <RootAddValues formData={formData} setFormData={setFormData} />
        </TabsContent>
      </Tabs> */}
      </div>
    </div>
  );
};

export default AffiliateAddpage;
