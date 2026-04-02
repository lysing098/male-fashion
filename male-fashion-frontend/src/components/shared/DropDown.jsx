import { useState } from "react";
import { FiChevronRight } from "react-icons/fi";

export default function DropDown({ name, value = [] ,onSelect}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b pb-3 mb-4">

      {/* HEADER */}
      <div
        onClick={() => setOpen(!open)}
        className="flex justify-between items-center cursor-pointer text-lg font-semibold "
      >
        {name}

        <FiChevronRight
          className={`transition-transform ${
            open ? "rotate-90" : ""
          }`}
        />
      </div>

      {/* ITEMS */}
      {open && (
        <div className="mt-2 pl-4 space-y-2">
          {value.map((item) => (
            <div
              key={item.id}
              onClick={()=>onSelect?.(item.id)}
              className="text-gray-500 hover:text-black cursor-pointer capitalize"
            >
              {item.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
