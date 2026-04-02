import React from "react";

const InputField = ({ label, value, error, type, placeholder,onChange }) => {
  return (
    <div className="my-3">
      <label className="capitalize  font-medium">{label}</label>
      <input
        type={type}
        min={1}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`border w-full px-2 py-1 focus:outline-none ${error ? "border-red-500" : ""}`}
      />
      {error&& <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;
