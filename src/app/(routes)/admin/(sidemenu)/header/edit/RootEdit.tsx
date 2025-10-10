import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/components/ui/use-toast';
import axios from 'axios';
import dynamic from 'next/dynamic';

const QuillEditorComponent = dynamic(() => import('./quillEditor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

const formSchema = z.object({
    id:z.string().optional(),
  link: z.string().optional(),
  text: z.string().optional(),
});

const HeaderEditForm = ({ setRefetch, editContentData, setIsSheetOpens,fileId }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [editorContent, setEditorContent] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      link: editContentData?.link || '',
      text: editContentData?.text || '',
      id: fileId|| '',
    },
  });

  useEffect(() => {
    if (editContentData) {
      form.setValue('link', editContentData.link || '');
      form.setValue('text', editContentData.text || '');
      form.setValue('id', fileId|| '');
      setEditorContent(editContentData.text || '');
    }
  }, [editContentData, form]);

  const handleSubmit = async () => {
    const values = form.getValues();
    setIsLoading(true);
    try {
      const { data } = await axios.post('/api/header', { ...values, text: editorContent,id:fileId });
      if (data) {
        toast({ description: `${data.message}` });
        setRefetch(true);
        setIsSheetOpens(false);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMsg = error?.response?.data?.error;
        const errorPassword = error.response?.data.errors?.link;
        const errorPasswords = error.response?.data.errors?.text;
        
        if (errorMsg) {
          form.setError('link', { type: 'manual', message: errorPassword || "" });
          form.setError('text', { type: 'manual', message: errorPasswords || "" });
          toast({
            description: errorMsg,
            variant: 'destructive',
          });
        }
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: 'destructive',
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditorChange = (newContent: string) => {
    setEditorContent(newContent);
    form.setValue('text', newContent);
  };

  return (
    <Form {...form}>
      <div className="h-full w-full p-6">
        <h1 className="text-left font-bold text-2xl mb-6">Edit Header</h1>
        <form  className="space-y-8">
          <FormField
            control={form.control}
            name="link"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-md text-black dark:text-white">
                  Link
                </FormLabel>
                <FormControl>
                  <Input placeholder="Link" {...field} />
                </FormControl>
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
                    editData={editorContent}
                    onDataChange={handleEditorChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button onClick={()=>handleSubmit()} disabled={isLoading} className='bg-[#5e72e4] hover:bg-[#465ad1]'>
            {isLoading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </Form>
  );
};

export default HeaderEditForm;