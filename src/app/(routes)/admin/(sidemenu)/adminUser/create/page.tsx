"use client";
import React, { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { IoArrowBackCircleSharp, IoEye, IoEyeOff } from "react-icons/io5";
import { Checkbox } from "@/components/ui/checkbox";
import { useRouter } from "next/navigation";
import { FaStarOfLife } from "react-icons/fa";

import { Button } from "@/components/ui/button";
import Select from "react-select";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Group } from "@/app/_types/group-Types/groupType";
import { AiOutlineLoading } from "react-icons/ai";

const formSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, { message: "Name is required" }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .min(2, { message: "Email is required" })
    .email("Invalid email address"),
  password: z
    .string({
      required_error: "Password is required",
    })
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?()_+])(?=.*[a-z]).{8,}$/,
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one symbol"
    ),
  groupId: z.number({
    required_error: "Group is required",
  }),
});

const AdminUserAdd = ({ setRefetch, setIsSheetOpen }: any) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [group, setGroup] = useState<Group[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const handleBack = () => {
    setIsSheetOpen(false);
  };

  useEffect(() => {
    const fetchGroupData = async () => {
      try {
        const res = await fetch(`/api/group`, {
          method: "GET",
        });

        const data = await res.json();
        setGroup(data.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchGroupData();
  }, []);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const formData = { ...values };
    setIsLoading(true);

    try {
      const { data } = await axios.post(
        "/api/adminUser/adminUserCreate",
        formData
      );

      toast({
        description: data.message,
        variant: "default",
        className: "bg-green-500 text-white font-semibold ",
      });

      // router.push('/admin/adminUser');

      setRefetch(true);
      setIsSheetOpen(false);

      form.reset();
    } catch (error) {
      setIsLoading(false);

      if (axios.isAxiosError(error)) {
        toast({
          description: error?.response?.data?.error,
          variant: "destructive",
        });
      } else {
        toast({
          title: `Unexpected Error`,
          description: `${error}`,
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full   dark:bg-gray-900 select-none ">
      <Form {...form}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Add Admin User
        </h1>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-lg text-gray-700  dark:text-gray-300 flex">
                  Name
                  <FaStarOfLife className="ml-1 text-[6px] text-red-500" />
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Name"
                    {...field}
                    className="select-none"
                  />
                </FormControl>
                <FormMessage className="text-sm">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-lg  text-gray-700 dark:text-gray-300 flex">
                  Email
                  <FaStarOfLife className="ml-1 text-[6px] text-red-500" />
                </FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
                </FormControl>
                <FormMessage className="text-sm">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel className="text-lg  text-gray-700 dark:text-gray-300 flex">
                   Password{" "}
                  <FaStarOfLife className="ml-1 text-[6px] text-red-500" />
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      {...field}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      {showPassword ? (
                        <IoEye
                          className="text-gray-400 cursor-pointer"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <IoEyeOff
                          className="text-gray-400 cursor-pointer"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-sm">
                  {fieldState.error?.message}
                </FormMessage>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="groupId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg text-gray-700 dark:text-gray-300 flex">
                  Group{" "}
                  <FaStarOfLife className="ml-1 text-[6px] text-red-500" />
                </FormLabel>
                <FormControl>
                  <Select
                    options={group?.map((role: Group) => ({
                      value: role.id,
                      label: role.name,
                    }))}
                    onChange={(selectedOption) =>
                      field.onChange(selectedOption?.value)
                    }
                    className="basic-multi-select  "
                    classNamePrefix="select"
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "36px",
                        border: "1px solid #d1d5db",
                        borderRadius: "0.375rem",
                      }),
                      menuPortal: (base) => ({
                        ...base,
                        zIndex: 9999,
                      }),
                      menu: (base) => ({
                        ...base,
                        marginTop: "4px",
                        marginBottom: "4px",
                        borderRadius: "0.375rem",
                        overflow: "hidden", // Ensures the inner scrollbar doesn't affect rounded corners
                      }),
                      menuList: (base) => ({
                        ...base,
                        maxHeight: "120px",
                        overflowY: "auto",
                        "&::-webkit-scrollbar": {
                          width: "8px",
                        },
                        "&::-webkit-scrollbar-thumb": {
                          backgroundColor: "#d1d5db",
                          borderRadius: "4px",
                        },
                        "&::-webkit-scrollbar-track": {
                          backgroundColor: "#f3f4f6",
                        },
                      }),
                      option: (base) => ({
                        ...base,
                        fontSize: "0.875rem",
                        padding: "8px 12px",
                      }),
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              className="bg-red-500 hover:bg-red-600"
              onClick={handleBack}
            >
              Cancel
            </Button>
            <Button type="submit" className="bg-[#5e72e4] hover:bg-[#465ad1]">
              {isLoading && <AiOutlineLoading className="animate-spin mr-2" />}
              Submit
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default AdminUserAdd;
