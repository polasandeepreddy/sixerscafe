import type React from "react"

interface SkeletonLoaderProps {
  rows?: number
  columns?: number
  className?: string
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ rows = 5, columns = 8, className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="h-8 bg-gray-200 rounded mb-4 w-1/4"></div>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="bg-gray-100 p-4 border-b border-gray-200">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        </div>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {Array.from({ length: columns }).map((_, i) => (
                <th key={i} className="px-6 py-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: rows }).map((_, rowIndex) => (
              <tr key={rowIndex} className="border-b border-gray-100">
                {Array.from({ length: columns }).map((_, colIndex) => (
                  <td key={colIndex} className="px-6 py-4">
                    <div
                      className={`h-4 bg-gray-200 rounded ${
                        colIndex === 0
                          ? "w-24"
                          : colIndex === 1
                            ? "w-20"
                            : colIndex === 2
                              ? "w-32"
                              : colIndex === 3
                                ? "w-40"
                                : colIndex === 4
                                  ? "w-16"
                                  : colIndex === 5
                                    ? "w-20"
                                    : colIndex === 6
                                      ? "w-24"
                                      : "w-28"
                      }`}
                    ></div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default SkeletonLoader
