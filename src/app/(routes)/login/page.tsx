import { Metadata } from "next";

import RootLogin from "./RootLogin";

export const metadata: Metadata = {
  title: "Ecommerce Admin Panel",
  description: "Authentication forms built using the components.",
};

const login = () => {
  return (
    <>
      <div className="container relative h-[70vh]  md:h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        {/* Left side with image background */}
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          {/* Background image */}
          <div
            className="absolute inset-0  rounded-r-2xl bg-zinc-950"
            style={{
              backgroundImage: "url('/Singing Bowl logo.png')",
              backgroundSize: "75%",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          />
          <div className="relative z-20 mt-6"></div>
        </div>

        {/* Right side login form */}
        <div className="flex items-center justify-center p-6 lg:p-8 min-h-screen">
          <div className="w-full max-w-lg space-y-4 rounded-lg bg-white p-8 shadow-lg">
            {/* Title */}
            <h2 className="text-2xl font-bold text-center">Singing Bowl Admin</h2>

            {/* Form Heading */}
            <div className="text-center space-y-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome Back!
              </h1>
              <p className="text-sm text-gray-600">
                Enter your email and password below
              </p>
            </div>

            {/* Login Form */}
            <RootLogin />
          </div>
        </div>
      </div>
    </>
  );
};

export default login;
