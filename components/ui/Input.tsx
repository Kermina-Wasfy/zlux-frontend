"use client";

import React, { forwardRef } from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  rightIcon?: React.ReactNode;
  containerClassName?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, rightIcon, className = "", containerClassName = "", id, type = "text", ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className={`flex flex-col w-full ${containerClassName}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-primary text-[16px] md:text-[20px] font-[500] font-inter mb-2 tracking-wide"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center w-full">
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={`w-full h-[52px] px-4 overflow-hidden text-ellipsis whitespace-nowrap rounded-[8px] bg-transparent text-[#E5E4E2] font-inter text-[16px] placeholder:text-[#6D6D6D] placeholder:font-inter placeholder:text-[16px] placeholder:overflow-hidden placeholder:text-ellipsis border border-gold-deep transition-all duration-200 outline-none
              ${
                error
                  ? "border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/30"
                  : "border-[#453823]/80 hover:border-[#C5A059]/60 focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/30"
              }
              ${
                type === "date" || type === "time"
                  ? "[color-scheme:dark]"
                  : ""
              }
              ${rightIcon ? "pr-11" : ""}
              ${className}`}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3.5 flex items-center pointer-events-none text-[#8C8273]">
              {rightIcon}
            </div>
          )}
        </div>
        {error && (
          <span className="text-red-400 text-[12px] mt-1.5 font-inter transition-opacity animate-in fade-in duration-150">
            {error}
          </span>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
