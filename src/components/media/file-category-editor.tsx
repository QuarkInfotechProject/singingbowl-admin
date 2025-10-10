import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MediaCategory } from "@/app/_types/media_Types/fileCategory_Types/fileCategoryTypes";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { IconLoader2 } from "@tabler/icons-react";
import { queryClient } from "@/lib/context/ReactQueryContext";

const formSchema = z.object({
  id: z.number().optional(),
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, { message: "Name is required" }),
  url: z
    .string({
      required_error: "Url is required",
    })
    .min(2, { message: "Url is required" }),
});

interface Props {
  initialData?: MediaCategory;
  edit?: boolean;
  onSuccess?: () => void;
}

function FileCategoryEditor({ initialData, edit, onSuccess }: Props) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting } = form.formState;
  const { toast } = useToast();

  async function handleSubmit(data: z.infer<typeof formSchema>) {
    try {
      await axios.post(
        edit ? "/api/file-categories/update" : "/api/file-categories/create",
        data
      );
      await queryClient.invalidateQueries({
        queryKey: ["media-categories"],
      });
      onSuccess?.();
      toast({
        description: "File category has been created successfully.",
        variant: "default",
        className: "bg-green-600 text-white",
      });
    } catch (error: any) {
      // console.log(error)
      toast({
        description: "Url has been already taken.",
        variant: "destructive",
        // className: "bg-green-600 text-white",
      });
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4 lg:gap-8"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Url</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="bg-[#5e72e4] text-white hover:bg-[#465ad1] hover:text-white"
          disabled={isSubmitting}
        >
          {/* {isSubmitting ? <IconLoader2 className="animate-spin" /> : edit ? "Update" : "Su"} */}
          Submit
        </Button>
      </form>
    </Form>
  );
}

export default FileCategoryEditor;
