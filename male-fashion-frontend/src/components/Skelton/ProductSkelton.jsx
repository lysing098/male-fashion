import React from 'react'

const ProductSkelton = () => {
  return (
    <>
      {[...Array(5)].map((_, rowIndex) => (
        <tr key={rowIndex} className="border-b border-slate-200 animate-pulse">
          {/* # */}
          <td className="p-4">
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
          </td>

          {/* Product Name */}
          <td className="p-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </td>

          {/* Category */}
          <td className="p-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </td>

          {/* Brand */}
          <td className="p-4">
            <div className="h-4 w-24 bg-gray-200 rounded"></div>
          </td>

          {/* Price */}
          <td className="p-4">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </td>

          {/* Discount */}
          <td className="p-4">
            <div className="h-4 w-12 bg-gray-200 rounded"></div>
          </td>

          {/* Color */}
          <td className="p-4">
            <div className="h-4 w-28 bg-gray-200 rounded"></div>
          </td>

          {/* Size */}
          <td className="p-4">
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </td>

          {/* Image */}
          <td className="p-4">
            <div className="flex gap-2">
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
              <div className="h-10 w-10 bg-gray-200 rounded"></div>
            </div>
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
  )
}

export default ProductSkelton
