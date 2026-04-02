import React from 'react'

const SkeltonAdmin = () => {
  return (
    <>
      {[1, 2, 3, 4, 5].map((i) => (
        <tr key={i} className="border-b border-slate-200 animate-pulse">
          <td className="p-4">
            <div className="h-4 w-6 bg-gray-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </td>

          <td className="p-4">
            <div className="h-4 w-32 bg-gray-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="h-4 w-48 bg-gray-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="h-4 w-10 bg-gray-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="h-4 w-16 bg-gray-200 rounded"></div>
          </td>

          <td className="p-4">
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
              <div className="h-8 w-8 bg-gray-200 rounded"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};


export default SkeltonAdmin
