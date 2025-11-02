"use client";
import React, { useEffect, useState, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Tabs from "@/components/mediaCenter_components/tabs";
import { FaTimes } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import QuillEditorComponent from "./quillEditor";

import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { MdOutlineFileUpload } from "react-icons/md";

const formSchema = z.object({
  link: z.string().optional(),
  text: z.string().optional(),
});

const RootCreate = ({
  setRefetch,
  setIsSheetOpenss,
}: {
  setRefetch: any;
  setIsSheetOpenss: any;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editorData, setEditorData] = useState("");
  const [editorValue, setEditorValue] = useState();
  const [isSheetsOpen, setIsSheetsOpen] = useState(false);

  const [tags, setTags] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const [selectedPreview, setSelectedPreview] = useState<
    { id: string; url: string }[]
  >([]);

  const [formData, setFormData] = useState();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: "",
      text: "",
    },
  });

  const handleRemoveImage = (idToRemove: string) => {
    const updatedPreviews = selectedPreview.filter(
      (preview) => preview.id !== idToRemove
    );

    const LogoId =
      updatedPreviews.length > 0
        ? updatedPreviews[updatedPreviews.length - 1].id
        : "";
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      desktopImage: LogoId,
    }));
    setSelectedPreview(updatedPreviews);
  };

  const handleSubmit = async () => {
    const values = form.getValues();
    const fromData = {
      ...values,
      link: values.link,
      text: values.text,
    };
    setIsLoading(true);

    try {
      const { data } = await axios.post("/api/header/add", fromData);
      if (data) {
        toast({ description: `${data.message}` });
        setRefetch(true);
        setIsSheetOpenss(false);
        setIsSheetsOpen(false);
        // router.push('/admin/blog');
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors?.link;
        const errorPasswords = error.response?.data.errors?.text;
        if (errorMsg) {
          form.setError("link", {
            type: "manual",
            message: errorPassword || "",
          });
          form.setError("text", {
            type: "manual",
            message: errorPasswords || "",
          });

          setIsLoading(false);
          toast({
            description: errorMsg,
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
  };

  const toggleCreateDialog = () => {
    setIsSheetsOpen(true);
  };

  const handlePreviewSelecte = (imageId) => {
    setFormData((prevFormData: any) => ({
      ...prevFormData,

      featuredImage: imageId.id,
    }));

    setSelectedPreview([{ url: imageId.url, id: imageId.id }]);
    // setIsSheetsOpen(false);
  };
  const handleEditorChange = (newData: string) => {
    setEditorData(newData);
    form.setValue("text", newData);
  };

  useEffect(() => {
    setEditorValue(form.getValues("text") || "");
  }, []);

  return (
    <Form {...form}>
      <div className="h-full  w-full p-6">
        <h1 className="text-left font-bold text-2xl mb-6 ">Add In The Press</h1>
        <form className="space-y-8">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md text-black dark:text-white">
                  Link
                </FormLabel>
                <FormControl>
                  <Input placeholder="http://Singingbowl" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="text"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md text-black dark:text-white">
                  Text
                </FormLabel>
                <FormControl>
                  <QuillEditorComponent
                    editData={form.getValues("text")}
                    onDataChange={handleEditorChange}
                    {...field}
                  />
                </FormControl>

                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="button"
            onClick={handleSubmit}
            className="bg-[#5e72e4] hover:bg-[#465ad1]"
          >
            {" "}
            Submit
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default RootCreate;
