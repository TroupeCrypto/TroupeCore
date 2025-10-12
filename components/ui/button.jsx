"use client";

import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary: "bg-indigo-600 text-white hover:bg-indigo-500",
        secondary: "bg-zinc-900 text-zinc-200 hover:bg-zinc-800 border border-zinc-800",
        ghost: "hover:bg-zinc-900",
        outline: "border border-zinc-800 hover:bg-zinc-900",
      },
      size: {
        sm: "h-8 px-3",
        md: "h-9 px-4",
        lg: "h-10 px-6",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export function Button({ className, variant, size, ...props }) {
  return <button className={twMerge(buttonVariants({ variant, size }), className)} {...props} />;
}
