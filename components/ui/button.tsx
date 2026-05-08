import * as React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "ghost";
};

const variantClass = {
  default: "bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-300 disabled:text-slate-500",
  outline: "border border-slate-300 bg-white text-slate-900 hover:bg-slate-50",
  ghost: "bg-transparent text-slate-700 hover:bg-slate-100",
};

export function Button({ className = "", variant = "default", type = "button", ...props }: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition disabled:pointer-events-none disabled:opacity-60 ${variantClass[variant]} ${className}`}
      {...props}
    />
  );
}
