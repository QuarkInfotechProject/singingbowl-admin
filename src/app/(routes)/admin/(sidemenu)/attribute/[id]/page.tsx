"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { Table, TableCell, TableHead, TableRow } from "@/components/ui/table";
import Loading from "../../category/Loading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { IoArrowBackCircleSharp } from "react-icons/io5";
import { Button } from "@/components/ui/button";
import { IoIosArrowBack } from "react-icons/io";
import { useRouter } from "next/navigation";

type Tag = {
  id: number;
  attributeSetId: number;
  name: string;
  url: string;
  values: [
    {
      id: number;
      value: string;
    }
  ];
};

const TagView = ({ params }: { params: { id: string } }) => {
  const { toast } = useToast();
  const [tag, setTag] = useState<Tag | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleOpen = async () => {
      try {
        const res = await axios.get(`/api/attribute/specific/${params.id}`);
        if (res.status === 200) {
          setTag(res.data.data);
        }
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
        }
      }
    };

    handleOpen();
  }, []);
  const handleBack =()=>{
    router.push('/admin/attribute')
  }
  return (
    <div className="p-4 space-y-6">
    {/* Back Button */}
    <div className="flex flex-row gap-8 items-center mb-4">
    <Button onClick={handleBack} variant="outline" className="flex items-center ">
          <IoIosArrowBack  className="mr-2 h-4 w-4"/>
          Back to Attribute
        </Button>
      {tag && (
        <span className="text-xl font-semibold">
          Additional Details of <span className="font-bold">{tag.name}</span>
        </span>
      )}
    </div>

    {/* Card for Attribute Set, Name, and URL */}
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {/* Attribute Set */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-lg">Attribute Set</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md">{tag?.attributeSetId}</p>
        </CardContent>
      </Card>

      {/* Name */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-lg">Name</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md">{tag?.name}</p>
        </CardContent>
      </Card>

      {/* URL */}
      <Card className="shadow-md border">
        <CardHeader>
          <CardTitle className="text-lg">URL</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-md">{tag?.url}</p>
        </CardContent>
      </Card>
    </div>

    {/* Card for Values */}
    <Card className="shadow-md border">
      <CardHeader>
        <CardTitle className="text-lg">Values</CardTitle>
        <CardDescription>
          The following are the values associated with this tag.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg font-semibold text-center">
              View Values
            </AccordionTrigger>
            <AccordionContent className="flex flex-wrap gap-4">
              {tag?.values.map((value, index) => (
                <div
                  key={index}
                  className="w-[350px] text-center p-4 flex justify-between border items-center rounded-lg shadow-sm"
                >
                  <Label className="capitalize font-semibold text-lg">
                    Value {index + 1}
                  </Label>
                  <span className="text-lg">{value.value}</span>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>

    {!tag && <Loading />}
  </div>
  );
};

export default TagView;
