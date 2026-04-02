import React from "react";
import { FiPlusCircle } from "react-icons/fi";
const CreateButton = ({ roles = [],name,onClick}) => {
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user || !roles.includes(user.role)) {
    return null;
  }
  return (
    <button onClick={onClick}  className="flex items-center gap-3 bg-red-500 py-2 px-3 rounded-md text-white font-bold cursor-pointer">
      <FiPlusCircle />
      <p>Create {name}</p>
    </button>
  );
};

export default CreateButton;
