import React from "react";

const CategorySkeleton = () => {
  return (
    <>
      {[...Array(5)].map((_, index) => (
        <tr key={index} className="border-b border-slate-200 animate-pulse">
          {/* # Column */}
          <td className="p-4 py-3">
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
          </td>

          {/* Category Name */}
          <td className="p-4 py-3">
            <div className="h-4 w-40 bg-gray-200 rounded"></div>
          </td>

          {/* Action Buttons */}
          <td className="p-4 py-3 flex gap-2">
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
            <div className="h-8 w-8 bg-gray-200 rounded"></div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default CategorySkeleton;
