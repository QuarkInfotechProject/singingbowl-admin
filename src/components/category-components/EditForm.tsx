// "use client";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { FaTimes } from "react-icons/fa";
// import Image from "next/image";
// import axios from "axios";
// import Tabs from "../mediaCenter_components/tabs";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
//   FormDescription,
// } from "@/components/ui/form";

// import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Checkbox } from "@/components/ui/checkbox";
// import * as z from "zod";
// import { useToast } from "@/components/ui/use-toast";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// import { CategoriesData } from "@/app/_types/category_Types/categoryShow";
// import { MdOutlineFileUpload } from "react-icons/md";
// import dynamic from "next/dynamic";
// const CkEditor = dynamic(
//   () => {
//     return import("@/components/ui/ckeditor");
//   },
//   { ssr: false }
// );
// const EditForm = ({
//   editFormData,
//   setRefetch,
//   setIsEditVisible,
//   formData,
//   setFormData,
// }: {
//   editFormData: CategoriesData | undefined;
//   setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
//   refetch: boolean;
//   setIsEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
//   setLoading: React.Dispatch<React.SetStateAction<boolean>>;
//   setFormData: (data: any) => void;
//   formData: any;
// }) => {
//   const { toast } = useToast();
//   const router = useRouter();
//   const [isloading, setIsLoading] = useState(false);
//   const [submitting, setSubmitting] = useState(false);
//   const [isSheetOpen, setIsSheetOpen] = useState(false);
//   const [isSheetOpens, setIsSheetOpens] = useState(false);

//   const [selectedRows, setSelectedRows] = useState<
//     { id: string; url: string }[]
//   >([]);
//   const [selectedPreviews, setSelectedPreviews] = useState<
//     { id: string; url: string }[]
//   >([]);
//   const [selectedRowsMulti, setSelectedRowsMulti] = useState<
//     { id: string; url: string }[]
//   >([]);
//   const [selectedPreviewMulti, setSelectedPreviewMulti] = useState<
//     { id: string; url: string }[]
//   >([]);

//   const formSchema = z.object({
//     name: z
//       .string()
//       .min(2, {
//         message: "Menu Title must be at least 2 characters.",
//       })
//       .default(`${editFormData?.name || ""}`),
//     url: z.string().default(`${editFormData?.slug || ""}`),
//     files: z.object({
//       logo: z.string().optional(),
//       banner: z.string().optional(),
//     }),
//     description: z.string().nullable(),
//     isDisplayed: z.boolean().default(false).optional(),
//     searchable: z.boolean().default(false).optional(),
//     status: z.boolean().default(false).optional(),
//     id: z.string().optional(),
//     filterPriceMin: z.string()
//       .min(1, { message: "Minimum price is required" })
//       .refine((val) => !isNaN(Number(val)), {
//         message: "Minimum price must be a valid number",
//       }),
//     filterPriceMax: z.string()
//       .min(1, { message: "Maximum price is required" })
//       .refine((val) => !isNaN(Number(val)), {
//         message: "Maximum price must be a valid number",
//       }),
//   }).superRefine((data, ctx) => {
//     // Validate price comparison
//     const minPrice = Number(data.filterPriceMin);
//     const maxPrice = Number(data.filterPriceMax);
//     if (minPrice > maxPrice) {
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Minimum price cannot be greater than maximum price",
//         path: ["filterPriceMin"],
//       });
//       ctx.addIssue({
//         code: z.ZodIssueCode.custom,
//         message: "Maximum price cannot be less than minimum price",
//         path: ["filterPriceMax"],
//       });
//     }
//   });

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       name: editFormData?.name || "",
//       url: editFormData?.slug || "",
//       files: {
//         logo: editFormData?.files?.logo?.id?.toString() || "",
//         banner: editFormData?.files?.banner?.id?.toString() || "",
//       },
//       description:editFormData?.description||"",
//       searchable: Boolean(editFormData?.searchable) || false,
//       isDisplayed: Boolean(editFormData?.isDisplayed) || false,
//       status: Boolean(editFormData?.active) || false,
//       id: editFormData?.id?.toString() || "",
//       filterPriceMin: editFormData?.filterPriceMin?.toString() || "",
//       filterPriceMax: editFormData?.filterPriceMax?.toString() || "",
//     },
//     mode: "onChange",
//   });

//   useEffect(() => {
//     // Reset form with new values when editFormData changes
//     if (editFormData) {
//       const defaultValues = {
//         name: editFormData.name || "",
//         url: editFormData.slug || "",
//         files: {
//           logo: editFormData.files?.logo?.id?.toString() || "",
//           banner: editFormData.files?.banner?.id?.toString() || "",
//         },
//         description:editFormData.description,
//         searchable: Boolean(editFormData.searchable) || false,
//         isDisplayed: Boolean(editFormData.isDisplayed) || false,
//         status: Boolean(editFormData.active) || false,
//         id: editFormData.id?.toString() || "",
//         filterPriceMin: editFormData.filterPriceMin?.toString() || "",
//         filterPriceMax: editFormData.filterPriceMax?.toString() || "",
//       };
      
//       form.reset(defaultValues);
      
//       // Also update the formData state to match
//       setFormData({
//         name: editFormData.name || "",
//         searchable: editFormData.searchable || 0,
//         status: editFormData.active || 0,
//         isDisplayed: editFormData.isDisplayed || 0,
//         id: editFormData.id || "",
//         url: editFormData.slug || "",
//         parentId: editFormData.parentId,
//         filterPriceMin: editFormData.filterPriceMin,
//         filterPriceMax: editFormData.filterPriceMax,
//         description:editFormData.description,
//         files: {
//           logo: editFormData.files?.logo?.id?.toString() || "",
//           banner: editFormData.files?.banner?.id?.toString() || "",
//         },
//       });

//       // Check if images are missing and handle accordingly
//       if ((!editFormData.files?.logo?.id || !editFormData.files?.logo?.url) || 
//           (!editFormData.files?.banner?.id || !editFormData.files?.banner?.url)) {
//       }
//     }
//   }, [editFormData, form, setFormData]);

//   useEffect(() => {
//     if (editFormData?.files.logo?.id && editFormData?.files.logo?.url) {
//       setSelectedPreviews([
//         {
//           id: editFormData.files.logo.id.toString(),
//           url: editFormData.files.logo.url,
//         },
//       ]);
//     } else {
//       // Clear logo selection if no valid image data
//       setSelectedPreviews([]);
//     }
//   }, [editFormData]);

//   useEffect(() => {
//     if (editFormData?.files.banner?.id && editFormData?.files.banner?.url) {
//       setSelectedPreviewMulti([
//         {
//           id: editFormData.files.banner.id.toString(),
//           url: editFormData.files.banner.url,
//         },
//       ]);
//     } else {
//       // Clear banner selection if no valid image data
//       setSelectedPreviewMulti([]);
//     }
//   }, [editFormData]);

//   const toggleCreateDialog = () => {
//     setIsSheetOpen(true);
//   };
//   const toggleCreateDialogs = () => {
//     setIsSheetOpens(true);
//   };

//   const handlePreviewSelect = (imageId: any, imagesUrl?: any) => {
//     setFormData((prevFormData: any) => ({
//       ...prevFormData,
//       files: {
//         ...prevFormData.files,
//         banner: imageId.id,
//       },
//     }));
//     setSelectedPreviewMulti([{ url: imageId.url, id: imageId.id }]);
//   };

//   const handlePreviewSelected = (imageId: any, imagesUrl?: any) => {
//     setFormData((prevFormData: any) => ({
//       ...prevFormData,
//       files: {
//         ...prevFormData.files,
//         logo: imageId.id,
//       },
//     }));
//     setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
//   };

//   const handleRemoveImage = (idToRemove: string) => {
//     const updatedRows = selectedRows.filter((row) => row.id !== idToRemove);
//     const updatedPreviews = selectedPreviews.filter(
//       (preview) => preview.id !== idToRemove
//     );

//     const selectedImage =
//       updatedRows.length > 0 ? updatedRows[updatedRows.length - 1] : null;
//     const logoId = selectedImage ? selectedImage.id : "";

//     setFormData((prevFormData: any) => ({
//       ...prevFormData,
//       files: {
//         ...prevFormData.files,
//         logo: logoId,
//       },
//     }));

//     setSelectedRows(updatedRows);
//     setSelectedPreviews(updatedPreviews);
//   };

//   const handleRemoveImageMulti = (idToRemove: string) => {
//     const updatedRows = selectedRowsMulti.filter(
//       (row) => row.id !== idToRemove
//     );
//     const updatedPreviews = selectedPreviewMulti.filter(
//       (preview) => preview.id !== idToRemove
//     );

//     const selectedImage =
//       updatedRows.length > 0 ? updatedRows[updatedRows.length - 1] : null;
//     const bannerId = selectedImage ? selectedImage.id : "";

//     setFormData((prevFormData: any) => ({
//       ...prevFormData,
//       files: {
//         ...prevFormData.files,
//         banner: bannerId,
//       },
//     }));

//     setSelectedRowsMulti(updatedRows);
//     setSelectedPreviewMulti(updatedPreviews);
//   };

//   useEffect(() => {
//     const unwatch = form.watch((watchedValues) => {
//       const additionalImagsIds = selectedPreviewMulti.map((item) => item.id);
//       const searchableValue = watchedValues.searchable ? 1 : 0;
//       const statusValue = watchedValues.status ? 1 : 0;
//       const isDisplayValue = watchedValues.isDisplayed ? 1 : 0;
//       setFormData((prevFormData: any) => ({
//         ...prevFormData,
//         id: watchedValues.id,
//         name: watchedValues.name,
//         searchable: searchableValue,
//         status: statusValue,
//         isDisplayed: isDisplayValue,
//         url: watchedValues.url,
//         filterPriceMin: watchedValues.filterPriceMin ? Number(watchedValues.filterPriceMin) : undefined,
//         filterPriceMax: watchedValues.filterPriceMax ? Number(watchedValues.filterPriceMax) : undefined,
//       }));
//     });

//     return () => {
//       unwatch.unsubscribe();
//     };
//   }, [form, setFormData, selectedPreviewMulti]);
//   const handleSubmit = async () => {
//     setIsLoading(true);
//     setSubmitting(true);

//     try {
//       // Validate the entire form before submission
//       const isValid = await form.trigger();
//       if (!isValid) {
//         setIsLoading(false);
//         setSubmitting(false);
//         return;
//       }

//       const res = await axios.post("/api/category", formData);
//       const data = res.data;
//       if (data && data.message) {
//         toast({
//           description: data.message,
//           variant: "default",

//           className: "bg-green-500 text-white",
//         });
//         setIsEditVisible(false);

//         setRefetch((prev: boolean) => !prev);
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         setIsLoading(false);
//         if (error.response?.status === 500) {
//           const validationErrors = error.response.data.errors[0].name;
//           const validationErrorsUrl = error.response.data.errors[0].url;
//           const validationErrorsUrlSame = error.response.data.message;
//           console.log("validation Errors???", validationErrorsUrlSame);
//           for (const fieldName in validationErrors) {
//             form.setError("name", {
//               type: "server",
//               message: validationErrors[fieldName],
//             });
//           }
//           for (const fieldUrl in validationErrorsUrl) {
//             form.setError("url", {
//               type: "server",
//               message: validationErrorsUrl[fieldUrl],
//             });
//           }
//         } else {
//           toast({
//             description: error.response?.data?.message || error.message,
//             variant: "destructive",
//           });
//         }
//       } else {
//         setIsLoading(false);
//         toast({
//           title: `Unexpected Error`,
//           description: `${error}`,
//           variant: "destructive",
//         });
//       }
//     }
//     setIsLoading(false);
//     setSubmitting(false);
//   };

//   const onDelete = async (id: number) => {
//     console.log();
//     const deleteData = {
//       id: id,
//     };

//     try {
//       const res = await fetch(`/api/category/category-del`, {
//         method: "POST",
//         body: JSON.stringify(deleteData),
//       });

//       if (res.ok) {
//         const data = await res.json();
//         router.push("/admin/category");

//         toast({
//           description: data.message,
//           variant: "default",
//           className: "bg-green-100 text-green-500 ",
//         });
//         setRefetch((prev) => !prev);
//       }
//     } catch (error) {
//       toast({
//         title: "Unexpected Error",
//         description: `${error}`,
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

 

//   return (
//     <Form {...form}>
//       <div className="">
//         <div className=" h-full w-96 mx-auto ">
//           <h1 className="text-left font-bold text-2xl mb-4 ">
//             Update Categories
//           </h1>
//           <div className="space-y-2  w-full my-auto ">
//             <FormField
//               control={form.control}
//               defaultValue={editFormData?.id?.toString()}
//               name="id"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormControl>
//                     <Input
//                       placeholder="Name"
//                       type="hidden"
//                       defaultValue={editFormData?.id}
//                       {...field}
//                       className="border-black   "
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md text-black dark:text-white">
//                     Name
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="Name"
//                       defaultValue={editFormData?.name}
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         form.clearErrors("name");
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               defaultValue={editFormData?.slug}
//               name="url"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md text-black dark:text-white">
//                     Url
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="url"
//                       defaultValue={editFormData?.slug}
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         form.clearErrors("url");
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="filterPriceMin"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md text-black dark:text-white">
//                     Min_Price
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="minprice"
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         form.clearErrors("filterPriceMin");
//                         // Trigger validation for both price fields
//                         form.trigger(["filterPriceMin", "filterPriceMax"]);
//                       }}
//                       onBlur={() => {
//                         form.trigger("filterPriceMin");
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="filterPriceMax"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel className="text-md text-black dark:text-white">
//                     Max_Price
//                   </FormLabel>
//                   <FormControl>
//                     <Input
//                       placeholder="maxprice"
//                       {...field}
//                       onChange={(e) => {
//                         field.onChange(e);
//                         form.clearErrors("filterPriceMax");
//                         // Trigger validation for both price fields
//                         form.trigger(["filterPriceMin", "filterPriceMax"]);
//                       }}
//                       onBlur={() => {
//                         form.trigger("filterPriceMax");
//                       }}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               defaultValue={editFormData?.files.logo.id?.toString() || ""}
//               name="files.logo"
//               render={({ field }) => (
//                 <FormItem className="mt-10">
//                   <FormLabel className="text-md">Logo </FormLabel>

//                   <br />
//                   <FormControl>
//                     <Dialog
//                       open={isSheetOpen}
//                       onOpenChange={setIsSheetOpen}
//                     >
//                       <DialogTrigger asChild>
//                         <Button
//                           className="flex flex-row gap-1"
//                           variant="outline"
//                           onClick={toggleCreateDialog}
//                         >
//                           {" "}
//                           <MdOutlineFileUpload /> Upload
//                         </Button>
//                       </DialogTrigger>
//                       {isSheetOpen && (
//                         <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
//                           <Tabs
//                             onLogoClick={handlePreviewSelected}
//                             setIsSheetOpen={setIsSheetOpen}
//                           />
//                         </DialogContent>
//                       )}
//                     </Dialog>
//                   </FormControl>
//                   <div
//                     className="border-2 border-gray-100    rounded-md p-2"
//                     style={{ width: "150px", height: "150px" }}
//                   >
//                     {selectedPreviews.length > 0 && (
//                       <div className="">
//                         <div>
//                           {selectedPreviews.map((selectedImages) => (
//                             <div
//                               key={selectedImages.id}
//                               className="mb-2 relative"
//                             >
//                               {selectedImages.id && selectedImages.url ? (
//                                 <Image
//                                   {...field}
//                                   src={selectedImages.url}
//                                   width={150}
//                                   height={150}
//                                   alt="Selected Preview"
//                                 />
//                               ) : (
//                                 <p></p>
//                               )}
//                               {selectedImages.id && selectedImages.url && (
//                                 <button
//                                   type="button"
//                                   onClick={() =>
//                                     handleRemoveImage(selectedImages.id)
//                                   }
//                                   className="absolute top-0 left-28 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
//                                 >
//                                   <FaTimes />
//                                 </button>
//                               )}
//                             </div>
//                           ))}
//                         </div>
//                       </div>
//                     )}
//                     {selectedPreviews.length === 0 && (
//                       <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                         <div className="text-center">
//                           <MdOutlineFileUpload className="mx-auto mb-2 text-2xl" />
//                           <p>No logo selected</p>
                         
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <FormDescription></FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="files.banner"
//               render={({ field }) => (
//                 <FormItem className="mt-10">
//                   <FormLabel className="text-md">Banner</FormLabel>
//                   <br />
//                   <FormControl>
//                     <Dialog
//                       open={isSheetOpens}
//                       onOpenChange={setIsSheetOpens}
//                     >
//                       <DialogTrigger asChild>
//                         <Button
//                           className="flex flex-row gap-1"
//                           variant="outline"
//                           onClick={toggleCreateDialogs}
//                         >
//                           <MdOutlineFileUpload /> Upload
//                         </Button>
//                       </DialogTrigger>
//                       {isSheetOpens && (
//                         <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
//                           <Tabs
//                             onLogoClick={handlePreviewSelect}
//                             setIsSheetOpen={setIsSheetOpens}
//                           />
//                         </DialogContent>
//                       )}
//                     </Dialog>
//                   </FormControl>
//                   <div
//                     className="border-2 border-gray-100 p-2  rounded-md"
//                     style={{ width: "150px", height: "150px" }}
//                   >
//                     {selectedPreviewMulti.length > 0 && (
//                       <div className="">
//                         {selectedPreviewMulti.map((selectedImage) => (
//                           <div key={selectedImage.id} className="mb-2 relative">
//                             {selectedImage.id && selectedImage.url ? (
//                               <Image
//                                 {...field}
//                                 src={selectedImage.url}
//                                 width={150}
//                                 height={150}
//                                 alt="Selected Preview"
//                               />
//                             ) : (
//                               <p></p>
//                             )}
//                             {selectedImage.id && selectedImage.url && (
//                               <button
//                                 type="button"
//                                 onClick={() =>
//                                   handleRemoveImageMulti(selectedImage.id)
//                                 }
//                                 className="absolute top-0 left-28 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
//                               >
//                                 <FaTimes />
//                               </button>
//                             )}
//                           </div>
//                         ))}
//                       </div>
//                     )}
//                     {selectedPreviewMulti.length === 0 && (
//                       <div className="flex items-center justify-center h-full text-gray-400 text-sm">
//                         <div className="text-center">
//                           <MdOutlineFileUpload className="mx-auto mb-2 text-2xl" />
//                           <p>No banner selected</p>
//                           {editFormData?.files?.banner?.id === null && (
//                             <p className="text-xs text-red-400 mt-1">Image data missing from API</p>
//                           )}
//                         </div>
//                       </div>
//                     )}
//                   </div>
//                   <FormDescription></FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex items-center flex-row gap-4 mt-4">
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className=" text-md">Status</FormLabel>
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         className="ml-4"
//                       />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="isDisplayed"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel className="text-md">
//                       Display{" "}
//                       <span className="text-xs text-gray-600">
//                         (Is displayed for public.)
//                       </span>
//                     </FormLabel>
//                     <FormControl>
//                       <Checkbox
//                         checked={field.value}
//                         onCheckedChange={field.onChange}
//                         className="ml-4"
//                       />
//                     </FormControl>
//                     {/* <FormDescription></FormDescription> */}
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//              <FormField
//                             control={form.control}
//                             name="description"
//                             render={({ field }) => (
//                               <FormItem className="mt-4  h-auto ">
//                                 <FormLabel className="text-lg">Description</FormLabel>
//                                 <FormControl>
//                                   <CkEditor
//                                     id="cat-description"
//                                     initialData={editFormData.description}
//                                     onChange={(content) => {
//                                       form.setValue("description", content);
//                                     }}
//                                   />
//                                 </FormControl>
//                                 <FormMessage />
//                               </FormItem>
//                             )}
//                           />
            
//             <div className="flex items-center flex-row gap-4 mt-4">
//               <Button
//                 onClick={handleSubmit}
//                 disabled={isloading}
//                 className="px-8 mt-2  text-white hover:text-white bg-[#5e72e4] hover:bg-[#465ad1]"
//               >
//                 {/* {isloading && (
//                   <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
//                 )} */}
//                 Update
//               </Button>
//               <AlertDialog>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>
//                       Are you sure you want to delete the data?
//                     </AlertDialogTitle>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white hover:text-white">
//                       Cancel
//                     </AlertDialogCancel>
//                     <AlertDialogAction
//                       className="bg-[#5e72e4] hover:bg-[#465ad1]"
//                       onClick={() => onDelete(editFormData?.id ?? 0)}
//                     >
//                       Continue
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>

//                 <AlertDialogTrigger>
//                   <Button
//                     type="button"
//                     // disabled={isloading}
//                     className="px-8 bg-red-500  hover:bg-red-600 mt-2 "
//                   >
//                     {/* {isloading && (
//                       <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
//                     )} */}
//                     Delete
//                   </Button>
//                 </AlertDialogTrigger>
//               </AlertDialog>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Form>
//   );
// };

// export default EditForm;
// Fixed version of the EditForm component with proper description field handling

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { FaTimes } from "react-icons/fa";
import Image from "next/image";
import axios from "axios";
import Tabs from "../mediaCenter_components/tabs";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { CategoriesData } from "@/app/_types/category_Types/categoryShow";
import { MdOutlineFileUpload } from "react-icons/md";
import dynamic from "next/dynamic";

const CkEditor = dynamic(
  () => {
    return import("@/components/ui/ckeditor");
  },
  { ssr: false }
);

const EditForm = ({
  editFormData,
  setRefetch,
  setIsEditVisible,
  formData,
  setFormData,
}: {
  editFormData: CategoriesData | undefined;
  setRefetch: React.Dispatch<React.SetStateAction<boolean>>;
  refetch: boolean;
  setIsEditVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setFormData: (data: any) => void;
  formData: any;
}) => {
  const { toast } = useToast();
  const router = useRouter();
  const [isloading, setIsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSheetOpens, setIsSheetOpens] = useState(false);
  
  // Add state for description to force CkEditor updates
  const [editorKey, setEditorKey] = useState(0);

  const [selectedRows, setSelectedRows] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedPreviews, setSelectedPreviews] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedRowsMulti, setSelectedRowsMulti] = useState<
    { id: string; url: string }[]
  >([]);
  const [selectedPreviewMulti, setSelectedPreviewMulti] = useState<
    { id: string; url: string }[]
  >([]);

  const formSchema = z.object({
    name: z
      .string()
      .min(2, {
        message: "Menu Title must be at least 2 characters.",
      })
      .default(`${editFormData?.name || ""}`),
    url: z.string().default(`${editFormData?.slug || ""}`),
    files: z.object({
      logo: z.string().optional(),
      banner: z.string().optional(),
    }),
    description: z.string().nullable().optional(),
    isDisplayed: z.boolean().default(false).optional(),
    searchable: z.boolean().default(false).optional(),
    status: z.boolean().default(false).optional(),
    id: z.string().optional(),
    filterPriceMin: z.string()
      .min(1, { message: "Minimum price is required" })
      .refine((val) => !isNaN(Number(val)), {
        message: "Minimum price must be a valid number",
      }),
    filterPriceMax: z.string()
      .min(1, { message: "Maximum price is required" })
      .refine((val) => !isNaN(Number(val)), {
        message: "Maximum price must be a valid number",
      }),
  }).superRefine((data, ctx) => {
    // Validate price comparison
    const minPrice = Number(data.filterPriceMin);
    const maxPrice = Number(data.filterPriceMax);
    if (minPrice > maxPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Minimum price cannot be greater than maximum price",
        path: ["filterPriceMin"],
      });
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Maximum price cannot be less than minimum price",
        path: ["filterPriceMax"],
      });
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: editFormData?.name || "",
      url: editFormData?.slug || "",
      files: {
        logo: editFormData?.files?.logo?.id?.toString() || "",
        banner: editFormData?.files?.banner?.id?.toString() || "",
      },
      description: editFormData?.description || "",
      searchable: Boolean(editFormData?.searchable) || false,
      isDisplayed: Boolean(editFormData?.isDisplayed) || false,
      status: Boolean(editFormData?.active) || false,
      id: editFormData?.id?.toString() || "",
      filterPriceMin: editFormData?.filterPriceMin?.toString() || "",
      filterPriceMax: editFormData?.filterPriceMax?.toString() || "",
    },
    mode: "onChange",
  });

  useEffect(() => {
    // Reset form with new values when editFormData changes
    if (editFormData) {
      const defaultValues = {
        name: editFormData.name || "",
        url: editFormData.slug || "",
        files: {
          logo: editFormData.files?.logo?.id?.toString() || "",
          banner: editFormData.files?.banner?.id?.toString() || "",
        },
        description: editFormData.description || "", // Ensure we handle null/undefined
        searchable: Boolean(editFormData.searchable) || false,
        isDisplayed: Boolean(editFormData.isDisplayed) || false,
        status: Boolean(editFormData.active) || false,
        id: editFormData.id?.toString() || "",
        filterPriceMin: editFormData.filterPriceMin?.toString() || "",
        filterPriceMax: editFormData.filterPriceMax?.toString() || "",
      };
      
      form.reset(defaultValues);
      
      // Force CkEditor to re-render with new data
      setEditorKey(prev => prev + 1);
      
      // Also update the formData state to match
      setFormData({
        name: editFormData.name || "",
        searchable: editFormData.searchable || 0,
        status: editFormData.active || 0,
        isDisplayed: editFormData.isDisplayed || 0,
        id: editFormData.id || "",
        url: editFormData.slug || "",
        parentId: editFormData.parentId,
        filterPriceMin: editFormData.filterPriceMin,
        filterPriceMax: editFormData.filterPriceMax,
        description: editFormData.description || "", // Ensure description is included
        files: {
          logo: editFormData.files?.logo?.id?.toString() || "",
          banner: editFormData.files?.banner?.id?.toString() || "",
        },
      });

      // Check if images are missing and handle accordingly
      if ((!editFormData.files?.logo?.id || !editFormData.files?.logo?.url) || 
          (!editFormData.files?.banner?.id || !editFormData.files?.banner?.url)) {
      }
    }
  }, [editFormData, form, setFormData]);

  useEffect(() => {
    if (editFormData?.files.logo?.id && editFormData?.files.logo?.url) {
      setSelectedPreviews([
        {
          id: editFormData.files.logo.id.toString(),
          url: editFormData.files.logo.url,
        },
      ]);
    } else {
      // Clear logo selection if no valid image data
      setSelectedPreviews([]);
    }
  }, [editFormData]);

  useEffect(() => {
    if (editFormData?.files.banner?.id && editFormData?.files.banner?.url) {
      setSelectedPreviewMulti([
        {
          id: editFormData.files.banner.id.toString(),
          url: editFormData.files.banner.url,
        },
      ]);
    } else {
      // Clear banner selection if no valid image data
      setSelectedPreviewMulti([]);
    }
  }, [editFormData]);

  const toggleCreateDialog = () => {
    setIsSheetOpen(true);
  };
  const toggleCreateDialogs = () => {
    setIsSheetOpens(true);
  };

  const handlePreviewSelect = (imageId: any, imagesUrl?: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        banner: imageId.id,
      },
    }));
    setSelectedPreviewMulti([{ url: imageId.url, id: imageId.id }]);
  };

  const handlePreviewSelected = (imageId: any, imagesUrl?: any) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        logo: imageId.id,
      },
    }));
    setSelectedPreviews([{ url: imageId.url, id: imageId.id }]);
  };

  const handleRemoveImage = (idToRemove: string) => {
    const updatedRows = selectedRows.filter((row) => row.id !== idToRemove);
    const updatedPreviews = selectedPreviews.filter(
      (preview) => preview.id !== idToRemove
    );

    const selectedImage =
      updatedRows.length > 0 ? updatedRows[updatedRows.length - 1] : null;
    const logoId = selectedImage ? selectedImage.id : "";

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        logo: logoId,
      },
    }));

    setSelectedRows(updatedRows);
    setSelectedPreviews(updatedPreviews);
  };

  const handleRemoveImageMulti = (idToRemove: string) => {
    const updatedRows = selectedRowsMulti.filter(
      (row) => row.id !== idToRemove
    );
    const updatedPreviews = selectedPreviewMulti.filter(
      (preview) => preview.id !== idToRemove
    );

    const selectedImage =
      updatedRows.length > 0 ? updatedRows[updatedRows.length - 1] : null;
    const bannerId = selectedImage ? selectedImage.id : "";

    setFormData((prevFormData: any) => ({
      ...prevFormData,
      files: {
        ...prevFormData.files,
        banner: bannerId,
      },
    }));

    setSelectedRowsMulti(updatedRows);
    setSelectedPreviewMulti(updatedPreviews);
  };

  useEffect(() => {
    const unwatch = form.watch((watchedValues) => {
      const additionalImagsIds = selectedPreviewMulti.map((item) => item.id);
      const searchableValue = watchedValues.searchable ? 1 : 0;
      const statusValue = watchedValues.status ? 1 : 0;
      const isDisplayValue = watchedValues.isDisplayed ? 1 : 0;
      setFormData((prevFormData: any) => ({
        ...prevFormData,
        id: watchedValues.id,
        name: watchedValues.name,
        searchable: searchableValue,
        status: statusValue,
        isDisplayed: isDisplayValue,
        url: watchedValues.url,
        description: watchedValues.description, // Include description in watch updates
        filterPriceMin: watchedValues.filterPriceMin ? Number(watchedValues.filterPriceMin) : undefined,
        filterPriceMax: watchedValues.filterPriceMax ? Number(watchedValues.filterPriceMax) : undefined,
      }));
    });

    return () => {
      unwatch.unsubscribe();
    };
  }, [form, setFormData, selectedPreviewMulti]);

  const handleSubmit = async () => {
    setIsLoading(true);
    setSubmitting(true);

    try {
      // Validate the entire form before submission
      const isValid = await form.trigger();
      if (!isValid) {
        setIsLoading(false);
        setSubmitting(false);
        return;
      }

      const res = await axios.post("/api/category", formData);
      const data = res.data;
      if (data && data.message) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white",
        });
        setIsEditVisible(false);
        setRefetch((prev: boolean) => !prev);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        if (error.response?.status === 500) {
          const validationErrors = error.response.data.errors[0].name;
          const validationErrorsUrl = error.response.data.errors[0].url;
          const validationErrorsUrlSame = error.response.data.message;
          console.log("validation Errors???", validationErrorsUrlSame);
          for (const fieldName in validationErrors) {
            form.setError("name", {
              type: "server",
              message: validationErrors[fieldName],
            });
          }
          for (const fieldUrl in validationErrorsUrl) {
            form.setError("url", {
              type: "server",
              message: validationErrorsUrl[fieldUrl],
            });
          }
        } else {
          toast({
            description: error.response?.data?.message || error.message,
            variant: "destructive",
          });
        }
      } else {
        setIsLoading(false);
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    }
    setIsLoading(false);
    setSubmitting(false);
  };

  const onDelete = async (id: number) => {
    console.log();
    const deleteData = {
      id: id,
    };

    try {
      const res = await fetch(`/api/category/category-del`, {
        method: "POST",
        body: JSON.stringify(deleteData),
      });

      if (res.ok) {
        const data = await res.json();
        router.push("/admin/category");

        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-100 text-green-500 ",
        });
        setRefetch((prev) => !prev);
      }
    } catch (error) {
      toast({
        title: "Unexpected Error",
        description: `${error}`,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <div className="">
        <div className=" h-full w-96 mx-auto ">
          <h1 className="text-left font-bold text-2xl mb-4 ">
            Update Categories
          </h1>
          <div className="space-y-2  w-full my-auto ">
            <FormField
              control={form.control}
              defaultValue={editFormData?.id?.toString()}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      type="hidden"
                      defaultValue={editFormData?.id}
                      {...field}
                      className="border-black   "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-black dark:text-white">
                    Name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name"
                      defaultValue={editFormData?.name}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("name");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue={editFormData?.slug}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-black dark:text-white">
                    Url
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="url"
                      defaultValue={editFormData?.slug}
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("url");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filterPriceMin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-black dark:text-white">
                    Min_Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="minprice"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("filterPriceMin");
                        // Trigger validation for both price fields
                        form.trigger(["filterPriceMin", "filterPriceMax"]);
                      }}
                      onBlur={() => {
                        form.trigger("filterPriceMin");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="filterPriceMax"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md text-black dark:text-white">
                    Max_Price
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="maxprice"
                      {...field}
                      onChange={(e) => {
                        field.onChange(e);
                        form.clearErrors("filterPriceMax");
                        // Trigger validation for both price fields
                        form.trigger(["filterPriceMin", "filterPriceMax"]);
                      }}
                      onBlur={() => {
                        form.trigger("filterPriceMax");
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              defaultValue={editFormData?.files.logo.id?.toString() || ""}
              name="files.logo"
              render={({ field }) => (
                <FormItem className="mt-10">
                  <FormLabel className="text-md">Logo </FormLabel>

                  <br />
                  <FormControl>
                    <Dialog
                      open={isSheetOpen}
                      onOpenChange={setIsSheetOpen}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="flex flex-row gap-1"
                          variant="outline"
                          onClick={toggleCreateDialog}
                        >
                          {" "}
                          <MdOutlineFileUpload /> Upload
                        </Button>
                      </DialogTrigger>
                      {isSheetOpen && (
                        <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                          <Tabs
                            onLogoClick={handlePreviewSelected}
                            setIsSheetOpen={setIsSheetOpen}
                          />
                        </DialogContent>
                      )}
                    </Dialog>
                  </FormControl>
                  <div
                    className="border-2 border-gray-100    rounded-md p-2"
                    style={{ width: "150px", height: "150px" }}
                  >
                    {selectedPreviews.length > 0 && (
                      <div className="">
                        <div>
                          {selectedPreviews.map((selectedImages) => (
                            <div
                              key={selectedImages.id}
                              className="mb-2 relative"
                            >
                              {selectedImages.id && selectedImages.url ? (
                                <Image
                                  {...field}
                                  src={selectedImages.url}
                                  width={150}
                                  height={150}
                                  alt="Selected Preview"
                                />
                              ) : (
                                <p></p>
                              )}
                              {selectedImages.id && selectedImages.url && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleRemoveImage(selectedImages.id)
                                  }
                                  className="absolute top-0 left-28 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
                                >
                                  <FaTimes />
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {selectedPreviews.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <div className="text-center">
                          <MdOutlineFileUpload className="mx-auto mb-2 text-2xl" />
                          <p>No logo selected</p>
                        </div>
                      </div>
                    )}
                  </div>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="files.banner"
              render={({ field }) => (
                <FormItem className="mt-10">
                  <FormLabel className="text-md">Banner</FormLabel>
                  <br />
                  <FormControl>
                    <Dialog
                      open={isSheetOpens}
                      onOpenChange={setIsSheetOpens}
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="flex flex-row gap-1"
                          variant="outline"
                          onClick={toggleCreateDialogs}
                        >
                          <MdOutlineFileUpload /> Upload
                        </Button>
                      </DialogTrigger>
                      {isSheetOpens && (
                        <DialogContent className="max-w-[1350px] mx-auto h-[600px]">
                          <Tabs
                            onLogoClick={handlePreviewSelect}
                            setIsSheetOpen={setIsSheetOpens}
                          />
                        </DialogContent>
                      )}
                    </Dialog>
                  </FormControl>
                  <div
                    className="border-2 border-gray-100 p-2  rounded-md"
                    style={{ width: "150px", height: "150px" }}
                  >
                    {selectedPreviewMulti.length > 0 && (
                      <div className="">
                        {selectedPreviewMulti.map((selectedImage) => (
                          <div key={selectedImage.id} className="mb-2 relative">
                            {selectedImage.id && selectedImage.url ? (
                              <Image
                                {...field}
                                src={selectedImage.url}
                                width={150}
                                height={150}
                                alt="Selected Preview"
                              />
                            ) : (
                              <p></p>
                            )}
                            {selectedImage.id && selectedImage.url && (
                              <button
                                type="button"
                                onClick={() =>
                                  handleRemoveImageMulti(selectedImage.id)
                                }
                                className="absolute top-0 left-28 bg-opacity-30 bg-white text-black rounded-full opacity-1 transition-opacity duration-300 group-hover:opacity-100"
                              >
                                <FaTimes />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                    {selectedPreviewMulti.length === 0 && (
                      <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        <div className="text-center">
                          <MdOutlineFileUpload className="mx-auto mb-2 text-2xl" />
                          <p>No banner selected</p>
                          {editFormData?.files?.banner?.id === null && (
                            <p className="text-xs text-red-400 mt-1">Image data missing from API</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center flex-row gap-4 mt-4">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className=" text-md">Status</FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="ml-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDisplayed"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-md">
                      Display{" "}
                      <span className="text-xs text-gray-600">
                        (Is displayed for public.)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="ml-4"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            {/* FIXED DESCRIPTION FIELD */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="mt-4 h-auto">
                  <FormLabel className="text-lg">Description</FormLabel>
                  <FormControl>
                    <CkEditor
                      key={editorKey} // Force re-render when data changes
                      id="cat-description"
                      initialData={editFormData?.description || ""} // Handle null/undefined
                      onChange={(content) => {
                        field.onChange(content); // Update react-hook-form
                        form.setValue("description", content); // Ensure form state is updated
                        
                        // Also update formData to keep everything in sync
                        setFormData((prevFormData: any) => ({
                          ...prevFormData,
                          description: content,
                        }));
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center flex-row gap-4 mt-4">
              <Button
                onClick={handleSubmit}
                disabled={isloading}
                className="px-8 mt-2  text-white hover:text-white bg-[#5e72e4] hover:bg-[#465ad1]"
              >
                Update
              </Button>
              <AlertDialog>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to delete the data?
                    </AlertDialogTitle>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="bg-red-500 hover:bg-red-600 text-white hover:text-white">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-[#5e72e4] hover:bg-[#465ad1]"
                      onClick={() => onDelete(editFormData?.id ?? 0)}
                    >
                      Continue
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>

                <AlertDialogTrigger>
                  <Button
                    type="button"
                    className="px-8 bg-red-500  hover:bg-red-600 mt-2 "
                  >
                    Delete
                  </Button>
                </AlertDialogTrigger>
              </AlertDialog>
            </div>
          </div>
        </div>
      </div>
    </Form>
  );
};

export default EditForm;