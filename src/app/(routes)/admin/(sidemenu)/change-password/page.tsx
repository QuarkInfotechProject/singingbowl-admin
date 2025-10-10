
import React from 'react';
import AdminChangePassword from "./adminChangePassword";
const CPassword = () => {
  return (
    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[450px]">
      <div className="p-4 space-y-4 grid gap-4 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold tracking-tight">
          Change Password
        </h1>
        <p className="text-sm text-muted-foreground">
          Password must contain 1 capital alphabet, 1 small alphabet, 1 number,
          1 special character, and be at least 8 characters long
        </p>
        < AdminChangePassword />
      </div>
    </div>
  );
};

export default CPassword;
