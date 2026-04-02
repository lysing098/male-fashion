import React from "react";

const Select = ({ label, options = [], value, onChange }) => {

  // console.log(options)
  return (
    <div className="my-3">
      {label && <label className="block font-medium ">{label}</label>}

      <select
        value={value}
        onChange={onChange}
        className="w-full border  px-3 py-1 capitalize"
      >

        {options.map((item) => (
          <option key={item.id || item} value={item.id || item} className="">
            {item.name || item}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
