function getButtonClass(isActive) {
  return twMerge("px-4 py-2 rounded", isActive ? "bg-blue-500" : "bg-gray-500");
}

console.log(getButtonClass(true)); // "px-4 py-2 rounded bg-blue-500"
console.log(getButtonClass(false)); // "px-4 py-2 rounded bg-gray-500"