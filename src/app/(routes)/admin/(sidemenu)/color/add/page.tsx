"use client";
import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
const colorSchema = z.object({
  name: z.string().min(1, "Color name is required"),
  hex_code: z
    .string()
    .min(1, "Hex code is required")
    .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex code format"),
  status: z.boolean(),
});

type ColorFormData = z.infer<typeof colorSchema>;
interface PageProps {
  setIsAddColorOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setRefetch:React.Dispatch<React.SetStateAction<boolean>>;
}

const Page: React.FC<PageProps> = ({ setIsAddColorOpen,setRefetch }) => {
  const [updateLoadding, setUpdateLoadding] = useState<boolean>(false);
  const router = useRouter();
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ColorFormData>({
    resolver: zodResolver(colorSchema),
    defaultValues: {
      name: "",
      hex_code: "",
      status: false,
    },
  });

  const onSubmit = async (formData: ColorFormData) => {
    const apiData = {
      ...formData,
    };
    try {
      setUpdateLoadding(true);
      const response = await clientSideFetch({
        url: "/colors/create",
        method: "post",
        debug: true,
        toast: toast,
        body: apiData,
      });
      if (response?.status === 200) {
        toast({
          description: response.data.message.message,
          className: "bg-green-500 text-white font-semibold",
        });
        router.push("/admin/color");
        setIsAddColorOpen(false);
        setRefetch(true)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUpdateLoadding(false);
    }
  };

  return (
    <>
      <div className="p-4">
        <Card className="w-auto">
          <CardHeader>
            <CardTitle>Add COLOR</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="name">Color Name</Label>
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="name"
                      placeholder="Enter color name"
                    />
                  )}
                />
                {errors.name && (
                  <p className="text-red-500">{errors.name.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="hex_code">Hex Code</Label>
                <Controller
                  name="hex_code"
                  control={control}
                  render={({ field }) => (
                    <Input
                      {...field}
                      id="hex_code"
                      placeholder="Enter hex code"
                    />
                  )}
                />
                {errors.hex_code && (
                  <p className="text-red-500">{errors.hex_code.message}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Controller
                  name="status"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="status"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="status">Status</Label>
                {errors.status && (
                  <p className="text-red-500">{errors.status.message}</p>
                )}
              </div>

              <Button
                disabled={updateLoadding}
                type="submit"
                className="w-fit bg-blue-500  hover:bg-blue-600"
              >
                {updateLoadding ? "Loadding.." : "Add Color"}{" "}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default Page;
