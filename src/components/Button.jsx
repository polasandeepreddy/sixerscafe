import React from "react";
import { cva } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

const buttonStyles = cva(
  "px-4 py-2 font-semibold rounded",
  {
    variants: {
      variant: {
        primary: "bg-blue-600 text-white",
        secondary: "bg-gray-200 text-black",
      },
      size: {
        small: "text-sm",
        large: "text-lg",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "small",
    },
  }
);

export function Button({ variant, size, className = "", children }) {
  const classes = twMerge(buttonStyles({ variant, size }), className);
  return <button className={classes}>{children}</button>;
}
