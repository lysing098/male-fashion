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
const Carousel = () => {
  const [visible, setVisible] = useState(false);
  const [editCar, setEditCar] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [formStatus, setFormStatus] = useState("active");
  const [carousels, setCarousels] = useState([]);
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [order, setOrder] = useState("");
  const [description, setDescription] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [preview, setPreview] = useState(null);
  const statusOption = ["active", "inactive"];
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState({});
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

 
  const create = () => {
    setVisible(true);
    setEditCar(null);
  };

  const update = (item) => {
    setVisible(true);
    setEditCar(item);

    setTitle(item.title);
    setName(item.collection);
    setOrder(item.order);
    setFormStatus(item.status);
    setDescription(item.description);

    setPreview(`http://127.0.0.1:8000/storage/${item.image}`);
  };

  const closeModal = () => {
    setTitle("");
    setImage(null);
    setName("");
    setOrder("");
    setFormStatus("active");
    setDescription("");
    setPreview(null);
    setVisible(false);
    setErrors({});
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/carousel", {
        params: {
          search,
          status: filterStatus,
          page,
        },
      });
      setCarousels(res.data.carousels.data);
      setLastPage(res.data.carousels.last_page);
      setMeta(res.data.carousels);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  // onSubmit
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("collection", name);
    formData.append("order", order);
    formData.append("description", description);
    formData.append("status", formStatus);
    if (image) {
      formData.append("image", image);
    }

    if (editCar) {
      // update
      try {
        const res = await api.post(
          `/carousel/${editCar.id}?_method=PUT`,
          formData,
          { headers: { "Content-Type": "multipart/form-data" } },
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
        const res = await api.post("/carousel", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
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
        await api.delete(`/carousel/${id}`);
        toast.success("Delete successfuly");
        fetchData();
      } catch (error) {
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, filterStatus, page]);

  
  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Carousel Page</h1>

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
            
            name={"Carousel"}
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

                  <select
                    value={filterStatus}
                    onChange={(e) => {
                      (setFilterStatus(e.target.value), setPage(1));
                    }}
                    className="border rounded px-3 py-1 focus:outline-none"
                  >
                    <option value="">All Status</option>
                    {statusOption.map((s) => (
                      <option className="capitalize" key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </th>
            </tr>

            <tr>
              <th className="p-4 border-y border-slate-200">
                <p className="leading-none">#</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">Carousel Name</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">Collection Name</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">Description</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">Order</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">Status</p>
              </th>
              <th className="border-b border-slate-200"></th>
              {/* <th class="p-4 border-b border-slate-200">
              <p class="leading-none">Image</p>
            </th> */}
              {/* <th class="p-4 border-b border-slate-200">
              <p class="leading-none">Action</p>
            </th> */}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <SkeltonAdmin />
            ) : carousels.length ? (
              carousels.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-4 py-3">
                    <p className="block font-semibold text-slate-800">
                      {index + 1}
                    </p>
                  </td>
                  <td className="p-4 py-3 align-middle">
                    <div className="flex items-center gap-3">
                      <img
                        src={`http://127.0.0.1:8000/storage/${item.image}`}
                        className="w-auto h-10 object-cover rounded"
                      />

                      <p className="capitalize">{item.title}</p>
                    </div>
                  </td>

                  <td className="p-4 py-3">
                    <p className="capitalize max-w-[600px]">
                      {item.collection}
                    </p>
                  </td>

                  <td className="p-4 py-3">
                    <p className="line-clamp-1 max-w-[500px]">
                      {item.description}
                    </p>
                  </td>
                  <td className="p-4 py-3">
                    <p className="">{item.order}</p>
                  </td>
                  <td className="p-4 py-3">
                    <p className="capitalize">{item.status}</p>
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
              {editCar ? "Update Carousel" : "Create Carousel"}
            </h2>

            <InputField
              label="Collection Name"
              placeholder="Enter collection name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.collection?.[0]}
              type="text"
            />

            <InputField
              label="Title"
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter Title"
              value={title}
              error={errors.title?.[0]}
              type="text"
            />
            <InputField
              label="Order"
              onChange={(e) => setOrder(e.target.value)}
              placeholder="Enter Order"
              value={order}
              error={errors.order?.[0]}
              type="number"
            />
            <Select
              value={formStatus}
              options={statusOption}
              label="Status"
              error={errors.status?.[0]}
              onChange={(e) => setFormStatus(e.target.value)}
            />
            <InputField
              label="Description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter Description"
              value={description}
              error={errors.description?.[0]}
              type="text"
            />
            <UploadImage
              preview={preview}
              error={errors.image?.[0]}
              onChange={handleImage}
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
                {editCar ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carousel;
