"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { AiOutlineLoading } from "react-icons/ai";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";

interface FormInputT {
  email: string;
  password: string;
}

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}
const RootLogin = ({ className, ...props }: UserAuthFormProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputT>();

  function togglePasswordVisibility() {
    setShowPassword(!showPassword);
  }
  const loginUser = async (formData: FormInputT) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/login", formData);
      if (data) {
        toast({
          description: data.message,
          variant: "default",
          className: "bg-green-500 text-white font-semibold ",
        });
        router.push("/admin");
        setIsLoading(false);
      }
    } catch (error) {
      console.log(error);
      if (axios.isAxiosError(error)) {
        setIsLoading(false);
        toast({
          description: error.response?.data.error || error.message,
          variant: "destructive",
        });
      }
    }
  };

  const onSubmit: SubmitHandler<FormInputT> = async (formData) => {
    loginUser(formData);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid space-y-3 gap-2">
          <div className="grid space-y-2 ">
            <Label className="sr-only" htmlFor="email">
              Email
            </Label>
            <Input
              {...register("email", { required: "Email is required" })}
              id="email"
              placeholder="Enter Email."
              className={`${errors.email && "border-red-500"}`}
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-red-400 text-sm">Password is required</p>
            )}
          </div>
          <div className="grid gap-1 relative">
            <Label className="sr-only" htmlFor="password">
              Password
            </Label>
            <div className="relative">
              <Input
                {...register("password", { required: "Password is required" })}
                id="password"
                className={`pr-10 ${errors.password && "border-red-500"}`}
                placeholder="Enter Password "
                type={showPassword ? "text" : "password"}
                disabled={isLoading}
              />
              {/* <div className="absolute bottom-56 right-44 "> */}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
              >
                {showPassword ? (
                  <AiFillEye className="h-10" />
                ) : (
                  <AiFillEyeInvisible className="h-10" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-400 text-sm">Password is required</p>
            )}
          </div>
          <Button
            disabled={isLoading}
            type="submit"
            className="bg-blue-500 hover:bg-blue-600"
          >
            {isLoading && (
              <AiOutlineLoading className="mr-2 h-4 w-4 animate-spin" />
            )}
            Login
          </Button>
        </div>
      </form>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
      </div>
    </div>
  );
};
export default RootLogin;
