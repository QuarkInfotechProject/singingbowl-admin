"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { Trash } from "lucide-react";
import * as React from "react";
import { useEffect, useState } from "react";
import { useForm, useFieldArray, SubmitHandler } from "react-hook-form";
import { AiFillDelete, AiOutlineLoading } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "../_context/context";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
type Inputs = {
  id: string;
  attributeSetId: string;
  name: string;
  url: string;
  values: { 
    id: string | undefined; 
    value: string; 
  }[]; 
};


const AddValues = ({
  params,
  defaultValues,
}: {
  params: { id: string };
  defaultValues: Inputs | null;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const context = useGlobalContext();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<Inputs>({
    defaultValues: {
      attributeSetId: defaultValues?.attributeSetId ?? "",
      name: defaultValues?.name ?? "",
      url: defaultValues?.url ?? "",
      values: defaultValues?.values ?? [],
    },
    mode: "onBlur",
  });
  const { fields, append, remove } = useFieldArray({
    name: "values",
    control,
  });

  useEffect(() => {
    if (defaultValues?.values && fields.length === 0) {
      defaultValues.values.forEach((item) => {
        append(item);
      });
    }
  }, [defaultValues, fields, append]);

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsLoading(true);
  
    try {
      const payload: Inputs = {
        id: params.id,
        attributeSetId: data.attributeSetId,
        name: data.name,
        url: data.url,
        values: data.values.map(({ id, value }) => {
          if (id && id !== '') {
            return { id, value };
          }
          return { id: '', value }; // Set id to an empty string when it's not present
        }),
      };
  
      // Send the payload to the server
      const res = await axios.post("/api/attribute/update", payload);
      if (res.status === 200) {
        setIsLoading(false);
        toast({
          description: res.data.message,
          variant: "default",
          className: "bg-green-100 text-green-500 ",
        });
        router.push('/admin/attribute')
        context?.getData(1);
      }
    } catch (error) {
      setIsLoading(false);
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

  return (
    <Card className="w-full max-w-4xl mx-auto">
    <CardHeader>
      <CardTitle>Update Values</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex flex-col ">
       
        <form onSubmit={handleSubmit(onSubmit)} className="p-4">
          {fields.map((field, index) => {
            return (
              <div key={field.id}>
                <section className="flex flex-col" key={field.id}>
                  <div className="flex justify-between">
                    <div className="p-4  w-full">
                      <Input
                        placeholder="value"
                        {...register(`values.${index}.value`, {
                          required: true,
                        })}
                        className={
                          errors?.values?.[index]?.value ? "error" : ""
                        }
                      />
                    </div>
                    <div className="ml-4 mt-4 ">
                <AiFillDelete  onClick={() => remove(index)} className="text-red-500 cursor-pointer"/>
                </div>
                    {/* <div className="flex gap-2 p-4 border border-gray-500">
                      <Button
                        type="button"
                        onClick={() => remove(index)}
                        className="flex gap-2"
                      >
                        <AiFillDelete />
                      </Button>
                    </div> */}
                  </div>
                </section>
              </div>
            );
          })}

          <div className="flex justify-end gap-4 ">
            <Button
              type="button"
              className="  bg-green-500 hover:bg-green-600"
              onClick={() =>
                append({
                  id: "",
                  value: "",
                })
              }
            >
              Add Value
            </Button>

            <Button disabled={isLoading} type="submit" className="bg-[#5e72e4] w-fit text-white hover:bg-[#465ad1] hover:text-white">
          {isLoading && (
            <AiOutlineLoading className=" mr-2 animate-spin" size={20} />
          )}
          Update
        </Button>
          </div>
        </form>
      </div>
      </CardContent>
    </Card>
  );
};

export default AddValues;
