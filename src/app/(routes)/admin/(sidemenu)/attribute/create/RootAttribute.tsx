// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { AiOutlineLoading } from "react-icons/ai";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import * as z from "zod";
// import axios from "axios";
// import { useState, useEffect } from "react";
// import { DataT } from "@/_types/attributeType";
// // import { CategoryT } from '@/_types/categories';
// import { OptionsType } from "react-select";
// import SelectReactSelect from "react-select";
// import makeAnimated from "react-select/animated";
// import { useRouter } from "next/navigation";
// import { useGlobalContext } from "../_context/context";
// import { useToast } from "@/components/ui/use-toast";

// const animatedComponents = makeAnimated();

// const formSchema = z.object({
//   name: z
//     .string({
//       required_error: "Name is required",
//     })
//     .trim()
//     .min(1, { message: "Name is required" }),
//   // .min(2, { message: 'Name must be at least 2 characters long' }),

//   attributeSetId: z
//     .number({
//       required_error: "Attribute Set is required", // Shows when no selection is made
//       invalid_type_error: "Please select an Attribute Set", // Shows when invalid type is provided
//     })
//     .min(1, { message: "Please select an attribute set" }),

//   url: z
//     .string({
//       required_error: "URL is required",
//     })
//     .trim()
//     .min(1, { message: "URL is required" }),
//   // .min(2, { message: 'URL must be at least 2 characters long' })
// });

// interface RootAttributeProps {
//   setFormData: (data: any) => void;
//   formData: any;
// }

// const RootAddAttributes: React.FC<RootAttributeProps> = ({
//   formData,
//   setFormData,
// }) => {
//   const router = useRouter();
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedAttributeSet, setSelectedAttributeSet] = useState<
//     number | null
//   >(null);
//   const [attributeData, setAttributeData] = useState<DataT[]>([]);
//   const [categoryData, setCategoryData] = useState<CategoryT[]>([]);
//   const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
//   const context = useGlobalContext();
//   const { toast } = useToast();
//   useEffect(() => {
//     const fetchAttributeData = async () => {
//       try {
//         const res = await fetch(`/api/attribute-sets`, {
//           method: "GET",
//         });
//         console.log("data", res);
//         const data = await res.json();
//         setAttributeData(data.data.data);
//         console.log("get data", data.data.data);
//       } catch (error) {}
//     };

//     fetchAttributeData();
//   }, []);

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       filterable: true,
//       ...formData,
//     },
//   });

//   const handleAttributeSetClick = (item: DataT) => {
//     const newValue = selectedAttributeSet === item.id ? null : item.id;
//     form.setValue("attributeSetId", newValue !== null ? newValue : 0);
//     setSelectedAttributeSet(newValue);
//   };

//   useEffect(() => {
//     const unwatch = form.watch((watchedValues) => {
//       setFormData((prevFormData: any) => ({
//         ...prevFormData,
//         ...watchedValues,
//       }));
//     });

//     return () => {
//       unwatch.unsubscribe();
//     };
//   }, [form, setFormData]);

//   const onSubmit = async (submittedValues: {
//     attributeSetId: number;

//     name: string;
//     url: string;
//   }) => {
//     setIsLoading(true);

//     console.log("attributes", formData);
//     try {
//       const response = await axios.post("/api/attribute/add", formData);
//       console.log("---Response----", response);
//       if (response.status === 200) {
//         console.log("Success");
//         router.push("/admin/attribute");
//         toast({
//           description: response.data.message,
//           variant: "default",
//           className: "bg-green-100 text-green-500 ",
//         });
//         context?.getData(1);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.log("hrere is error ", error);
//         toast({
//           description: error.response?.data?.message || error.message,
//           variant: "destructive",
//         });
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Form {...form}>
//       <div className="">
//         <div className=" h-full w-96 mx-auto">
//           {/* <h1 className="font-bold ">Add Attribute</h1> */}
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-2  w-full my-auto "
//           >
//             <FormField
//               control={form.control}
//               name="attributeSetId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md">Attribute Set</FormLabel>
//                   <Select
//                     onValueChange={(selectedValue) => {
//                       field.onChange(Number(selectedValue));
//                       setSelectedAttributeSet(Number(selectedValue));
//                     }}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select an attribute set" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {attributeData.map((item: DataT) => (
//                         <SelectItem
//                           key={item.id}
//                           value={String(item.id)}
//                           onClick={() => handleAttributeSetClick(item)}
//                         >
//                           {item.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md">Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Name" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="url"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md">Url</FormLabel>
//                   <FormControl>
//                     <Input placeholder="Url" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <Button
//               disabled={isLoading}
//               type="submit"
//               className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white"
//             >
//               Submit
//             </Button>
//           </form>
//         </div>
//       </div>
//     </Form>
//   );
// };

// export default RootAddAttributes;

import React, { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { AiFillDelete, AiOutlinePlus } from "react-icons/ai";
import axios from "axios";
import { useRouter } from "next/navigation";
import * as z from "zod";
import { useGlobalContext } from "../_context/context";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import CategoriesSelect from "../../products/(pages)/_formComponents/(general)/CategoriesSelect";

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  attributeSetId: z
    .number()
    .min(1, { message: "Please select an attribute set" }),
  values: z.array(z.string()).optional(),
  category_ids:z.array(z.number())
});

const AttributeForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAttributeSet, setSelectedAttributeSet] = useState<
    number | null
  >(null);
  const [attributeData, setAttributeData] = useState<DataT[]>([]);
  const { toast } = useToast();
  const context = useGlobalContext();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      attributeSetId: 0,
      values: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "values",
  });

  useEffect(() => {
    const fetchAttributeData = async () => {
      try {
        const res = await fetch("/api/attribute-sets?perPage=10000");
        const data = await res.json();
        setAttributeData(data.data.data);
      } catch (error) {
        toast({
          description: "Failed to fetch attribute sets",
          variant: "destructive",
        });
      }
    };
    fetchAttributeData();
  }, [toast]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("data", data);
    setIsLoading(true);
    try {
      const response = await axios.post("/api/attribute/add", data);
      console.log("response of create", response);
      if (response.status === 200) {
        toast({
          description: response.data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        router.push("/admin/attribute");
        context?.getData(1);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.log("erroror", error);
        toast({
          description: error.response?.data?.error || "Something went wrong",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="min-h-screen bg-gray-50 p-8">
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-1">
        {/* <CardTitle className="text-2xl font-bold text-center">
          Add New Attribute
        </CardTitle> */}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="attributeSetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Attribute Set
                    </FormLabel>
                    <Select
                      onValueChange={(value) => {
                        field.onChange(Number(value));
                        setSelectedAttributeSet(Number(value));
                      }}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full ">
                          <SelectValue placeholder="Select an attribute set" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="h-[400px]">
                        {attributeData.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter attribute name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category_ids"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel className="text-sm font-medium">Category</FormLabel>
                   <CategoriesSelect field={field}/>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Attribute Values</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append("")}
                  className="flex items-center gap-2"
                >
                  <AiOutlinePlus className="h-4 w-4" />
                  Add Value
                </Button>
              </div>

              <div className="space-y-3">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-center gap-3">
                    <FormField
                      control={form.control}
                      name={`values.${index}`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder={`Value ${index + 1}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* {fields.length > 1 && ( */}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="h-10 w-10 text-red-500 hover:text-red-600"
                    >
                      <AiFillDelete className="h-5 w-5" />
                    </Button>
                    {/* )} */}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <Button
                type="submit"
                className={cn(
                  "bg-blue-600 text-white hover:bg-blue-700",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
                disabled={isLoading}
              >
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
    // </div>
  );
};

export default AttributeForm;
