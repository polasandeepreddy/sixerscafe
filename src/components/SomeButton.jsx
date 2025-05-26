// src/components/SomeButton.jsx or .tsx
import React from 'react';
import { twMerge } from 'tailwind-merge';  // <--- Import here


function SomeButton({ isActive }) {
  const className = twMerge(
    'px-4 py-2 rounded',
    isActive ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
  );

  return <button className={className}>Click me</button>;
}

export default SomeButton;
