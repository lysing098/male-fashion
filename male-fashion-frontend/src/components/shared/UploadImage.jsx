import React from "react";

const UploadImage = ({ preview, onChange, error }) => {
  return (
    <>
      <label
        className={`
          flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer
          transition
          ${error ? "border-red-500 bg-red-50" : "border-slate-200  hover:border-blue-500 hover:bg-blue-50"}
        `}
      >
        {!preview ? (
          <div className="flex flex-col items-center">
            <svg
              className={`w-10 h-10 ${error ? "text-red-500" : "text-gray-400"}`}
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5V6.75A2.25 2.25 0 015.25 4.5h13.5A2.25 2.25 0 0121 6.75v9.75M3 16.5l4.72-4.72a2.25 2.25 0 013.18 0L15 16.5M3 16.5v.75A2.25 2.25 0 005.25 19.5h13.5A2.25 2.25 0 0021 17.25v-.75M12 11.25h.008v.008H12v-.008z"
              />
            </svg>

            <p className={`mt-2 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
              Click to upload or drag & drop
            </p>

            <p className="text-xs text-gray-400">PNG, JPG, WEBP</p>
          </div>
        ) : (
          <img
            src={preview}
            className="object-contain w-full h-full rounded-lg"
          />
        )}

        <input
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onChange}
        />
      </label>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </>
  );
};

export default UploadImage;
