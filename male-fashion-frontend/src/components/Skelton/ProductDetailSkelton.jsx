import React from "react";

const ProductDetailSkelton = () => {
  return (
    <div className="w-6xl container mx-auto my-10 grid grid-cols-2 gap-10 animate-pulse">
      {/* Image Skeleton */}
      <div className="flex gap-5">
        <div className="flex flex-col gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-25 h-25 bg-gray-300 rounded"></div>
          ))}
        </div>
        <div className="w-full h-[600px] bg-gray-300 rounded"></div>
      </div>

      {/* Detail Skeleton */}
      <div className="space-y-5">
        <div className="h-6 bg-gray-300 w-40 rounded"></div>
        <div className="h-6 bg-gray-300 w-60 rounded"></div>
        <div className="h-4 bg-gray-300 w-80 rounded"></div>
        <div className="h-4 bg-gray-300 w-20 rounded"></div>

        <div className="flex gap-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-8 w-12 bg-gray-300 rounded"></div>
          ))}
        </div>

        <div className="h-4 bg-gray-300 w-20 rounded"></div>
        <div className="flex gap-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-8 w-8 bg-gray-300 rounded-full"></div>
          ))}
        </div>

        <div className="h-10 bg-gray-300 w-full rounded"></div>
      </div>
    </div>
  );
};

export default ProductDetailSkelton;
