import React, { useState } from "react";
import {
  File,
  FileShowResponse,
} from "@/app/_types/media_Types/file_Types/fileTypes";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";
import FileCategorySelectorForm from "./file-category-selectFrom";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "../ui/use-toast";

interface Props {
  file: FileShowResponse;
}

const formSchema = z.object({
  id: z.number(),
  fileName: z.string(),
  alternativeText: z.string().optional(),
  title: z.string().optional(),
  caption: z.string().optional(),
  description: z.string().optional(),
  fileCategoryId: z.string().optional(),
});

function FileEditForm({ file, onOpenChange, fileId }: Props) {
  console.log("file dastra her", file);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alternativeText: file.alternativeText || "",
      caption: file.caption || "",
      description: file.description || "",
      fileName: file.filename || "",
      id: file.id,
      title: file.title || "",
      fileCategoryId: file.fileCategoryId?.toString() || null,
    },
  });
  const { isSubmitting } = form.formState;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);
  async function handleUpdate(values: z.infer<typeof formSchema>) {
    console.log("values of update data", values);
    try {
      await axios.post("/api/files/update", values);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [file.id] }),
        queryClient.invalidateQueries({ queryKey: ["file-selector"] }),
        queryClient.invalidateQueries({ queryKey: ["files"] }), // If you have a files list query
        // Invalidate any other related queries that might show this image
      ]);
      await queryClient.invalidateQueries({
        queryKey: [file.id],
      });
      toast({
        description: "File has been Updated successfully.",
        variant: "default",
        className: "bg-green-600 text-white",
      });
      onOpenChange(false);
    } catch (error) {
      toast({ description: "Failed to Updated file", variant: "destructive" });
    }
  }
  async function deleteFile() {
    try {
      setIsDeleting(true);
      await axios.post("/api/files/destroy", {
        id: [fileId],
      });
      await queryClient.invalidateQueries({
        queryKey: ["file-selector"],
      });
      onOpenChange(false);
      toast({
        description: "File has been deleted successfully.",
        variant: "default",
        className: "bg-green-600 text-white",
      });
    } catch (error) {
      setIsDeleting(false);
      toast({
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form>
        <FormField
          control={form.control}
          name="fileName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Filename</FormLabel>
              <FormControl>
                <Input placeholder="Filename" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="caption"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Caption</FormLabel>
              <FormControl>
                <Input placeholder="Caption" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="alternativeText"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alt</FormLabel>
              <FormControl>
                <Input placeholder="Alt" {...field} />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="fileCategoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <FileCategorySelectorForm
                  className="w-full"
                  fileCategoryId={field.value}
                  setCategory={field.onChange}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Write your file description here"
                  {...field}
                />
              </FormControl>
              <FormDescription />
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-row gap-4">
          <Button
            type="button"
            size="sm"
            className="mt-2 bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white"
            // loading={isSubmitting}
            onClick={form.handleSubmit(handleUpdate)}
          >
            Update
          </Button>
          <Button
            type="button"
            size="sm"
            className="mt-2 bg-red-500 text-white hover:bg-red-600 hover:text-white"
            // loading={isSubmitting}
            onClick={deleteFile}
          >
            Delete
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default FileEditForm;
