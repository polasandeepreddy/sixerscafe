import { twMerge } from "tailwind-merge";

const buttonClass = twMerge("px-4 py-2 rounded", "bg-blue-500", "hover:bg-blue-700");

console.log(buttonClass); // "px-4 py-2 rounded bg-blue-500 hover:bg-blue-700"