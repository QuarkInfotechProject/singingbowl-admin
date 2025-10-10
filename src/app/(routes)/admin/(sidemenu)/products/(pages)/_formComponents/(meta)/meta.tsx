"use client";
import { useState } from "react";
import { z } from "zod";
import { formSchema } from "../../add/page";
import { UseFormReturn } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

import { FaTimes } from "react-icons/fa";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Meta = ({
  form,
}: {
  form: UseFormReturn<z.infer<typeof formSchema>>;
}) => {
  const [inputValue, setInputValue] = useState("");
  const keywords = form.watch("meta.keywords") || [];

  const handleRemoveTag = (tag) => {
    const updatedKeywords = keywords.filter((t) => t !== tag);
    form.setValue("meta.keywords", updatedKeywords);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      const value = inputValue.trim();
      if (value && !keywords.includes(value)) {
        const updatedKeywords = [...keywords, value];
        form.setValue("meta.keywords", updatedKeywords);
        setInputValue("");
      }
    }
  };

  return (
    <div className="bg-white rounded p-5">
      <Card className="bg-gray-50">
        <CardHeader>
          <CardTitle>Meta Information</CardTitle>
        </CardHeader>
        <CardContent>
          <FormField
            control={form.control}
            name="meta.metaTitle"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row gap-4 items-start  ">
                  <div className="flex w-24 mt-3 ">
                    <FormLabel className="font-normal">Meta Title</FormLabel>
                  </div>
                  <div className="w-96">
                    <FormControl>
                      <Input placeholder="Meta Title" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal mt-2" />
                  </div>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="meta.keywords"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-row  mt-4 gap-4 items-start ">
                  <div className="flex  mt-3">
                    <FormLabel className="font-normal">Meta Keywords</FormLabel>
                  </div>
                  
                  <div className="w-96">
                    <FormControl>
                      <div className="flex items-center flex-wrap border border-gray-300 rounded p-2">
                        {keywords.map((tag) => (
                          <div
                            key={tag}
                            className="flex items-center text-sm bg-gray-200 rounded-sm px-2 py-1 m-1"
                          >
                            <span>{tag}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 text-xs text-black font-thin"
                            >
                              <FaTimes />
                            </button>
                          </div>
                        ))}
                        <input
                          type="text"
                          className="flex-grow focus:outline-none text-sm font-[0.875rem] placeholder:text-muted-foreground"
                          placeholder="Meta Keywords"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                        />
                      </div>
                    </FormControl>
                    <FormMessage className="font-normal mt-2" />
                    <FormDescription className="mt-1 text-sm">
                      Press "enter" key to add the keyword.
                    </FormDescription>
                  </div>
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="meta.metaDescription"
            render={({ field }) => (
              <FormItem>
                <div className=" mt-2 gap-4 items-start justify-end">
                  <div className="mb-4 mt-10">
                    <FormLabel className="font-normal">
                      Meta Description
                    </FormLabel>
                    <FormDescription className="mt-1 text-sm">
                      Enter a concise description of the meta. This will be
                      displayed below the meta title on your website's detail
                      page.
                    </FormDescription>
                  </div>
                  <div>
                    <FormControl>
                      {/* <Editor
                    initialData={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                    isLoading={false}
                  /> */}
                      <Textarea className="h-40" {...field} />
                    </FormControl>
                    <FormMessage className="font-normal mt-2" />
                  </div>
                </div>
              </FormItem>
            )}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Meta;
