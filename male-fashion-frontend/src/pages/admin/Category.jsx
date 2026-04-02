import React, { useState, useEffect } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { LiaEditSolid } from "react-icons/lia";
import { LuTrash2 } from "react-icons/lu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import CreateButton from "../../components/shared/CreateButton";
import InputField from "../../components/shared/InputField";
import Select from "../../components/shared/Select";
import UploadImage from "../../components/shared/UploadImage";

import { toast } from "react-toastify";
import SkeltonAdmin from '../../components/Skelton/SkeltonAdmin.jsx'
import Pagination from "../../components/shared/Pagination.jsx";
import api from "../../utils/api.js";
import CategorySkeleton from "../../components/Skelton/CategorySkelton.jsx";
const Category = () => {
  const [visible, setVisible] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState({});

 
  const create = () => {
    setVisible(true);
    setEditCategory(null);
  };

  const update = (item) => {
    setVisible(true);
    setEditCategory(item);

    setName(item.name)

  };

  const closeModal = () => {

    setName("");

    setPreview(null);
    setVisible(false);
    setErrors({});
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/category", {
        params: {
          search,
          page,
        },
      });
      setCategories(res.data.categories.data);
      setLastPage(res.data.categories.last_page);
      setMeta(res.data.categories);
    //   console.log(res.data?.categories?.data)
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // onSubmit
  const onSubmit = async () => {
    const formData = new FormData();

    formData.append("name", name);


    if (editCategory) {
      // update
      try {
        formData.append('_method','PUT')
        const res = await api.post(
          `/category/${editCategory.id}`,
          formData,
         
        );
        closeModal();
        console.log(res.data);
        toast.success("Update successfully");
        fetchData();
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        }
        toast.error("Failed to update!");
        console.log(error.response.data || error.message);
      }
    } else {
      // create
      try {
        const res = await api.post("/category", formData
        );
        closeModal();
        console.log(res.data);
        fetchData();
        toast.success("Created successfully");
      } catch (error) {
        if (error.response?.status === 422) {
          setErrors(error.response.data.errors);
        }
        console.log(error.response.data || error.message);
        toast.error("Failed to create!");
      }
    }
  };

  const handleDelete = async (id) => {
    const remove = confirm("Are u sure to delete this item?");
    if (remove) {
      try {
        await api.delete(`/category/${id}`);
        toast.success("Delete successfuly");
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, page]);

  
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Category Page</h1>

        <div className="flex items-center gap-5">
          {/* pdf */}
          <div className="relative group inline-block">
            <img
              src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/pdf.svg"
              alt="pdf"
              className="border border-gray-300 p-2 rounded-md cursor-pointer hover:bg-black/40"
            />

            {/* Tooltip */}
            <div
              className="
    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    opacity-0 group-hover:opacity-100
    bg-black text-white text-xs px-2 py-1 rounded
    text-center
    transition
    pointer-events-none
    whitespace-nowrap
  "
            >
              Pdf
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
            </div>
          </div>

          {/* excel */}
          <div className="relative group inline-block">
            <img
              src="https://dreamspos.dreamstechnologies.com/html/template/assets/img/icons/excel.svg"
              alt="excel"
              className="border border-gray-300 p-2 rounded-md cursor-pointer hover:bg-black/40"
            />

            {/* Tooltip */}
            <div
              className="
    absolute bottom-full left-1/2 -translate-x-1/2 mb-2
    opacity-0 group-hover:opacity-100
    bg-black text-white text-xs px-2 py-1 rounded
    text-center
    transition
    pointer-events-none
    whitespace-nowrap
  "
            >
              Excel
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
            </div>
          </div>

          {/* Create */}
          <CreateButton
            roles={["admin", "editor"]}
            
            name={"Category"}
            onClick={create}
          />
        </div>
      </div>

      <div className="mt-10 rounded-md border-t border-l border-r border-slate-200 overflow-hidden bg-white shadow-lg">
        <table className="w-full text-left table-auto min-w-max">
          <thead className="cursor-pointer ">
            <tr className="border-b  border-slate-200">
              <th colSpan={7} className="p-4">
                <div className="flex items-center justify-between gap-4">
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    placeholder="Search"
                    className="border rounded px-3 py-1 focus:outline-none"
                  />

                  
                </div>
              </th>
            </tr>

            <tr>
              <th className="p-4 border-y border-slate-200">
                <p className="leading-none">#</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">Category Name</p>
              </th>
              
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <CategorySkeleton />
            ) : categories.length ? (
              categories.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-4 py-3">
                    <p className="block font-semibold text-slate-800">
                      {index + 1}
                    </p>
                  </td>
                 

                  <td className="p-4 py-3">
                    <p className="capitalize max-w-[600px]">
                      {item.name}
                    </p>
                  </td>

                 

                  <td className="p-4 py-3 flex gap-2">
                    <button
                      onClick={() => update(item)}
                      className="cursor-pointer px-2 py-2 border rounded hover:bg-gray-200 text-blue-500"
                    >
                      <LiaEditSolid size={19} />
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="cursor-pointer px-2 py-2 border rounded hover:bg-gray-200 text-red-500"
                    >
                      <LuTrash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center p-6 text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end p-4 ">
          <Pagination meta={meta} page={page} setPage={setPage} />
        </div>
      </div>

      {/* Moddal */}
      {visible && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          onClick={closeModal}
        >
          {/* Modal Box */}
          <div
            className="bg-white rounded-md shadow-lg w-[600px] p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-bold mb-4">
              {editCategory ? "Update Category" : "Create Category"}
            </h2>

            <InputField
              label="Category Name"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.collection?.[0]}
              type="text"
            />

            

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={closeModal}
                className="px-4 py-1 text-white bg-red-500 rounded cursor-pointer"
              >
                Cancel
              </button>

              <button
                onClick={onSubmit}
                type="button"
                className="px-4 py-1 bg-blue-500 text-white rounded cursor-pointer"
              >
                {editCategory ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
