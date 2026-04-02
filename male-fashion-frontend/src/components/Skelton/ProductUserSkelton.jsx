import React from 'react'

const ProductUserSkelton = () => {
  return (
    <div className="animate-pulse">
      {/* Image */}
      <div className="relative">
        <div className="w-full aspect-[3/4] bg-gray-200"></div>

        {/* Discount badge */}
        <div className="absolute top-3 left-0 w-12 h-6 bg-gray-300"></div>
      </div>

      <div className="py-2 px-1 space-y-3">
        {/* Name */}
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>

        {/* Price + colors */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-16"></div>

          <div className="flex gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
            <div className="w-4 h-4 bg-gray-200 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductUserSkelton
