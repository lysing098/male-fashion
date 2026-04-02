import React, { useEffect, useState } from "react";
import CreateButton from "../../components/shared/CreateButton";
import InputField from "../../components/shared/InputField";
import UploadImage from "../../components/shared/UploadImage";
import api from "../../utils/api";
import { LiaEditSolid } from "react-icons/lia";
import { LuTrash2 } from "react-icons/lu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { toast } from "react-toastify";
import BrandSkelton from "../../components/Skelton/BrandSkelton ";
import Pagination from "../../components/shared/Pagination";

const Brand = () => {
  const [visible, setVisible] = useState(false);
  const [editBrand, setEditBrand] = useState(null);
  const [errors, setErrors] = useState({});
  const [brand, setBrand] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState({});

  //   Field  brand
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  //   handle preview image
  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const closeModal = () => {
    setVisible(false);
    setName("");
    setPreview(null);
    setErrors({});
  };

  const create = () => {
    setVisible(true);
    setEditBrand(null);
  };

  const update = (item) => {
    setVisible(true);
    setEditBrand(item.id);
    setName(item.name);
    setImage(null);
    setPreview(`http://127.0.0.1:8000/storage/${item.logo}`);
  };

  const handleDelete = async (id) => {
    const remove = confirm("Are u sure delete this?");
    if (remove) {
      try {
        await api.delete(`/brand/${id}`);
        toast.success("Delete successfully");
        fetchData();
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete!");
      }
    }
  };

  //   handleSubmit
  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (image) {
      formData.append("logo", image);
    }

    if (editBrand) {
      // update
      try {
        formData.append("_method", "PUT");
        const res = await api.post(`/brand/${editBrand}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        fetchData();
        toast.success("Update successfully");
        closeModal();
      } catch (error) {
        if (error?.response.status === 422) {
          setErrors(error.response.data.errors);
        }
        toast.error("Failed to Update!");
        console.log(error.response.data.errors);
      }
    } else {
      // create
      try {
        const res = await api.post("/brand", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        fetchData();
        toast.success("Create successfully");
        closeModal();
      } catch (error) {
        if (error?.response.status === 422) {
          setErrors(error.response.data.errors);
        }
        toast.error("Failed to Create!");
        console.log(error);
      }
    }
  };

  //   fetchData
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/brand", { params: { search, page } });
      // console.log(res.data?.brands.data);
      setBrand(res.data?.brands.data);
      setMeta(res.data.brands);
      setLastPage(res.data.brands.last_page);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, search]);

  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      {/* top bar */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Brand Page</h1>

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
            user={user}
            name={"Brand"}
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
                <p className="leading-none">Brand Name</p>
              </th>
              <th className="p-4 border-b border-slate-200">
                <p className="leading-none">logo</p>
              </th>
              <th className="p-4 border-b border-slate-200"></th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <BrandSkelton />
            ) : brand.length ? (
              brand.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-4 py-3">
                    <p className="block font-semibold text-slate-800">
                      {index + 1}
                    </p>
                  </td>

                  <td className="p-4 py-3">
                    <p className="capitalize">{item.name}</p>
                  </td>

                  <td className="p-4 py-3">
                    <img
                      src={`http://127.0.0.1:8000/storage/${item.logo}`}
                      className="h-10 rounded"
                    />
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
                <td colSpan={4} className="text-center p-6 text-gray-500">
                  No brand found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex justify-end p-4 ">
          <Pagination meta={meta} page={page} setPage={setPage} />
        </div>
      </div>

      {visible && (
        <div
          className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          onClick={closeModal}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-md shadow-lg w-[600px] p-6"
          >
            <h2 className="text-xl font-bold mb-4">
              {editBrand ? "Update Brand" : "Create Brand"}
            </h2>

            <InputField
              label="Brand Name"
              placeholder="Enter Brand Name"
              value={name}
              error={errors.name?.[0]}
              type="text"
              onChange={(e) => setName(e.target.value)}
            />

            <UploadImage
              preview={preview}
              error={errors.logo?.[0]}
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
                onClick={handleSubmit}
                type="button"
                className="px-4 py-1 bg-blue-500 text-white rounded cursor-pointer"
              >
                {editBrand ? "Update" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Brand;
