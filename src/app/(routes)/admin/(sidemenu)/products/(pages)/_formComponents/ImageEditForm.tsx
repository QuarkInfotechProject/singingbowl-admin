"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/components/ui/use-toast";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
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
} from "@/components/ui/select"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clientSideFetch } from "@/app/_utils/clientSideFetch";

interface CategoryT {
  id: number;
  name: string;
  url: string;
}

const formSchema = z.object({
  id: z.string().min(1, {
    message: "Image Id is required",
  }),
  fileName: z.string().min(1, {
    message: "File Name is required",
  }),
  alternativeText: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  fileCategoryId: z.string().optional(),
});

interface ImageT {
  id: number;
  fileName: string;
  width: number;
  height: number;
  imageUrl: string;
  thumbnailUrl: string;
}

export default function ImageEditForm({ id, setIsImageEditPopover, updateImage }: 
  { id: string, setIsImageEditPopover: Dispatch<SetStateAction<boolean>>;updateImage:(imageObj:any)=>void })
   {

  const { toast } = useToast();

  const imageEditForm = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: "",
      fileName: "",
      alternativeText: "",
      title: "",
      caption: "",
      description: "",
      fileCategoryId: "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false)

  const watchedFileName = useWatch({
    control:imageEditForm.control,
    name:"fileName"
  })

  useEffect(()=>{
    if(imageEditForm.getValues("fileName").length === 0){
      setIsDisabled(true)
    }else{
      setIsDisabled(false)
    }
  },[watchedFileName])

  const handleLoading = (bool: boolean) => {
    setLoading(bool);
  };


  const getSingleImage = async (id: string) => {
    const res = await clientSideFetch({
      url: `/files/show/${id}`,
      method: "get",
      handleLoading: handleLoading,
      toast: toast,
    });
    if (res && res.status === 200) {
      const imageData = res.data.data;
      imageEditForm.setValue("id", id);
      imageEditForm.setValue("fileName", imageData.filename || "");
      imageEditForm.setValue("alternativeText", imageData.alternativeText || "");
      imageEditForm.setValue("title", imageData.title || "");
      imageEditForm.setValue("caption", imageData.caption || "");
      imageEditForm.setValue("description", imageData.description || "");
      imageEditForm.setValue("fileCategoryId", imageData.fileCategoryId || "");
    }
  };


  useEffect(() => {
    getSingleImage(id);
  }, [id]);

  const [categories, setCategories] = useState<CategoryT[]>([])
  const [categoryLoading, setCategoryLoading] = useState(false)
 
  const handleIsCategoryLoading = (bool:boolean) =>{
    setCategoryLoading(bool)
  }
  
  useEffect(() => {
    const allCategories = async () => {
      const { data }: any = await clientSideFetch({
        url: "/file-categories",
        method: "get",
        toast:toast,
        handleLoading: handleIsCategoryLoading,
      });
      setCategories(data.data);
    };
    allCategories();
  }, []);
  

  const handleSubmit = async() => {
    const values = imageEditForm.getValues();
    const formData = {
      id: values.id,
       fileName: values.fileName, 
       caption: values.caption, 
       description: values.description, 
       title: values.title, 
       alternativeText: values.alternativeText, 
      fileCategoryId:values.fileCategoryId?.toString(),
    };
    const res = await clientSideFetch({
      url:"/files/update",
      method:"post",
      body:formData,
      handleLoading:handleLoading,
      toast:toast,
      debug:true
    })
    if( res && res.status === 200){
      toast({description:"Image Information Updated"})
      updateImage({
        id: parseInt(formData.id),
        fileName: formData.fileName,
        title: formData.title,
        caption: formData.caption,
        description: formData.description,
        alternativeText: formData.alternativeText,
        fileCategoryId: formData.fileCategoryId
      });
      setIsImageEditPopover(false)
    }
  }
  return (
    <div className="">
      {/* <h3 className="text-lg text-center font-medium">Edit Image Information</h3> */}
      <Form {...imageEditForm}>
        <form id="edit-image-form"
          // onSubmit={imageEditForm.handleSubmit(onSubmit)}
          className="space-y-3">
          <div className="hidden">
            <FormField
              control={imageEditForm.control}
              name="id"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Image Id</FormLabel>
                  <FormControl>
                    <Input disabled readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={imageEditForm.control}
            name="fileName"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormLabel>File Name</FormLabel>
                <FormControl>
                  <Input disabled={loading} {...field} />
                </FormControl>
                {isDisabled && !loading && <p className="text-red-500 text-sm">Required *</p>}
                {/* <FormMessage /> */}
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={imageEditForm.control}
              name="alternativeText"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Alt Text</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imageEditForm.control}
              name="fileCategoryId"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>File Category</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value} disabled={loading} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a file category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories && categories.length>0 && categories.map((item)=>{
                    return <SelectItem value={`${item.id}`}>{item.name}</SelectItem>
                  })}
                </SelectContent>
              </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormField
              control={imageEditForm.control}
              name="title"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={imageEditForm.control}
              name="caption"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel>Caption</FormLabel>
                  <FormControl>
                    <Input disabled={loading} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={imageEditForm.control}
            name="description"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <FormControl>
                  <Textarea
                  disabled={loading}
                    placeholder="Image Description"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button disabled={isDisabled} onClick={handleSubmit} className="w-fit" size={"sm"} type="button">
            Save
          </Button>
        </form>
      </Form>
    </div>
  );
}
