import { twMerge } from 'tailwind-merge';

function MyButton({ isPrimary }) {
  const btnClass = twMerge(
    "px-4 py-2 rounded",
    isPrimary ? "bg-blue-600 text-white" : "bg-gray-200 text-black"
  );

  return <button className={btnClass}>Click me</button>;
}
