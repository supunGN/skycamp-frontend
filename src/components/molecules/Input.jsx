"use client";

import * as React from "react";
import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const isPasswordType = type === "password";
  const inputType = isPasswordType && showPassword ? "text" : type;

  return (
    <div className="relative">
      <input
        type={inputType}
        className={twMerge(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isPasswordType ? "pr-10" : "", // Add padding-right for the icon
          className
        )}
        ref={ref}
        {...props}
      />
      {isPasswordType && (
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? (
            <EyeSlashIcon className="h-5 w-5" aria-hidden="true" />
          ) : (
            <EyeIcon className="h-5 w-5" aria-hidden="true" />
          )}
        </button>
      )}
    </div>
  );
});
Input.displayName = "Input";

export { Input };
