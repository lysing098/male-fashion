import React from "react";

const BrandSkelton = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-slate-200 animate-pulse">
          {/* # */}
          <td className="p-4">
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
          </td>

          {/* Brand Name */}
          <td className="p-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </td>

          {/* Logo */}
          <td className="p-4">
            <div className="h-10 w-20 bg-gray-200 rounded"></div>
          </td>

          {/* Actions */}
          <td className="p-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

export default BrandSkelton;
