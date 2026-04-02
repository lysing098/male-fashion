import React, { useEffect, useState } from "react";
import { FaArrowLeftLong } from "react-icons/fa6";
import { Navigate, NavLink, useNavigate, useParams } from "react-router-dom";
import InputField from "../../../components/shared/InputField";
import Select from "../../../components/shared/Select";
import api from "../../../utils/api";
import { FiChevronRight, FiPlusCircle } from "react-icons/fi";
import { MdCancel } from "react-icons/md";
import { toast } from "react-toastify";

const Create = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [openIn, setOpenIn] = useState(true);
  const [openImage, setOpenImage] = useState(true);
  const [openColSize, setOpenColSize] = useState(true);

  // form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [description, setDescription] = useState("");
  const [colors, setColors] = useState([""]);
  const [sizes, setSizes] = useState([""]);

  // images
  const [images, setImages] = useState([]);

  // ================= COLORS =================

  const addColor = () => {
    setColors((prev) => [...prev, ""]);
  };

  const handleColorChange = (value, index) => {
    const updated = [...colors];
    updated[index] = value;
    setColors(updated);
  };

  const removeColor = (index) => {
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= SIZES =================
  const addSize = () => {
    setSizes((prev) => [...prev, ""]);
  };

  const updateSize = (value, index) => {
    const update = [...sizes];
    update[index] = value;
    setSizes(update);
  };

  const removeSize = (index) => {
    setSizes((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= IMAGES =================

  const handleImage = (e) => {
    const files = Array.from(e.target.files);

    const imageObjects = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...imageObjects]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  // ================= FETCH =================

  const fetechData = async () => {
    try {
      const res = await api.get("/product");

      const categoryData = res.data?.categories || [];
      const brandData = res.data?.brands || [];

      setCategories(categoryData);
      setBrands(brandData);

      // ✅ Set default selected ID
      if (categoryData.length > 0) {
        setCategory(categoryData[0].id);
      }

      if (brandData.length > 0) {
        setBrand(brandData[0].id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetechDataId = async () => {
    try {
      const res = await api.get(`/product/${id}`);
      const product = res.data?.product;

      setName(product.name);
      setCategory(product?.category_id);
      setBrand(product?.brand_id);
      setPrice(product.price);
      setDiscount(product.discount);
      setDescription(product.description);
      setColors(product.colors);
      setSizes(product.sizes);
      setImages(
        product.images.map((img) => ({
          id:img.id,
          file: null,
          preview: `http://127.0.0.1:8000/storage/${img.image}`,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  // ================= submit =================
  const onSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category_id", category);
    formData.append("brand_id", brand);
    formData.append("price", price);
    formData.append("discount", discount);
    formData.append("description", description);
    colors.forEach((color, index) => {
      formData.append(`colors[${index}]`, color);
    });
    sizes.forEach((size, index) => {
      formData.append(`sizes[${index}]`, size);
    });
    images.forEach((img, index) => {
      if(img.id){
        formData.append('old_images[]',img.id)
      }
      if (img.file) {
        formData.append("images[]", img.file);
      }
    });

    try {
      if (id) {
        // update
        formData.append("_method", "PUT");
        const res = await api.post(`/product/${id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        toast.success("Updated sucess");
      } else {
        // create
        const res = await api.post("/product", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        console.log(res.data);
        toast.success("Created sucess");
      }
      navigate("/product");
    } catch (error) {
      console.log(error);
      if (error?.response.status === 422) {
        setError(error.response.data.errors);
        console.log(error.response.data.errors);
      }
      toast.error(error.response?.data?.message || "Something went wrong");

    }
  };
  useEffect(() => {
    fetechData();
    if (id) {
      fetechDataId();
    }
  }, [id]);

  return (
    <div>
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">
          {id ? "Update" : "Create"} Product
        </h1>

        <NavLink
          to="/product"
          className="flex items-center gap-3 bg-[#092c4c] py-2 px-3 rounded-md text-white font-semibold"
        >
          <FaArrowLeftLong />
          <p>Back to Product</p>
        </NavLink>
      </div>

      {/* ================= PRODUCT INFORMATION ================= */}
      <div
        onClick={() => setOpenIn(!openIn)}
        className="flex justify-between items-center cursor-pointer mt-10 rounded-md border border-slate-200 bg-white shadow-lg p-4"
      >
        Product Information
        <FiChevronRight
          className={`transition-transform ${openIn ? "rotate-90" : ""}`}
        />
      </div>

      {openIn && (
        <div className="grid grid-cols-2 gap-5 bg-white shadow-lg p-4">
          <div>
            <InputField
              label="Product Name"
              value={name}
              error={error.name?.[0]}
              type="text"
              placeholder="Enter Product Name"
              onChange={(e) => setName(e.target.value)}
            />

            <Select
              label="Brand"
              options={brands}
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
            />

            <InputField
              label="Discount"
              value={discount}
              error={error.discount?.[0]}
              type="number"
              placeholder="Enter Product Discount"
              onChange={(e) => setDiscount(e.target.value)}
            />
          </div>

          <div>
            <Select
              label="Category"
              options={categories}
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <InputField
              label="Price"
              value={price}
              error={error.price?.[0]}
              type="number"
              placeholder="Enter Product Price"
              onChange={(e) => setPrice(e.target.value)}
            />

            <InputField
              label="Description"
              value={description}
              error={error.description?.[0]}
              type="text"
              placeholder="Enter Product Description"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* ================= COLOR & SIZE ================= */}
      <div
        onClick={() => setOpenColSize(!openColSize)}
        className="flex justify-between items-center cursor-pointer mt-10 rounded-md border border-slate-200 bg-white shadow-lg p-4"
      >
        Color & Size
        <FiChevronRight
          className={`transition-transform ${openColSize ? "rotate-90" : ""}`}
        />
      </div>

      {openColSize && (
        <div className="bg-white shadow-lg p-4 grid grid-cols-2 gap-5">
          {/* COLORS */}
          <div>
            <div
              onClick={addColor}
              className="flex items-center justify-between cursor-pointer"
            >
              Add New Color
              <FiPlusCircle />
            </div>

            <div className="mt-4 space-y-3">
              {colors.map((color, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={color}
                    onChange={(e) => handleColorChange(e.target.value, index)}
                    placeholder="Enter color name"
                    className="border border-slate-300 px-3 py-1 rounded w-full"
                  />

                  {colors.length > 1 && (
                    <MdCancel
                      onClick={() => removeColor(index)}
                      className="text-red-500 text-2xl cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* SIZES (you can build like colors later) */}
          <div>
            <div
              onClick={addSize}
              className="flex items-center justify-between cursor-pointer"
            >
              Add New Size
              <FiPlusCircle />
            </div>

            <div className="mt-4 space-y-3">
              {sizes.map((size, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => updateSize(e.target.value, index)}
                    placeholder="Enter size name"
                    className="border border-slate-300 px-3 py-1 rounded w-full"
                  />

                  {sizes.length > 1 && (
                    <MdCancel
                      onClick={() => removeSize(index)}
                      className="text-red-500 text-2xl cursor-pointer"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= IMAGES ================= */}
      <div
        onClick={() => setOpenImage(!openImage)}
        className="flex justify-between items-center cursor-pointer mt-10 rounded-md border border-slate-200 bg-white shadow-lg p-4"
      >
        Images
        <FiChevronRight
          className={`transition-transform ${openImage ? "rotate-90" : ""}`}
        />
      </div>

      {openImage && (
        <div className="bg-white shadow-lg p-4">
          <div className="flex items-center gap-3 flex-wrap">
            {/* Upload Box */}
            <label className="w-1/6 h-40 flex flex-col items-center justify-center border-2 border-slate-200 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition">
              <p className="text-sm text-gray-500">Click to upload</p>

              <input
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleImage}
              />
            </label>

            {/* Preview Images */}
            {images.map((img, index) => (
              <div
                key={index}
                className="w-1/6 h-40 border border-slate-200 rounded-lg overflow-hidden relative"
              >
                <img
                  src={img.preview}
                  alt=""
                  className="w-full h-full object-contain"
                />

                <MdCancel
                  onClick={() => removeImage(index)}
                  className="text-red-500 absolute top-2 right-2 text-2xl cursor-pointer"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBMIT */}
      <div className="flex justify-end gap-2 mt-10">
        <button
          type="button"
          className="px-4 py-2 bg-blue-500 text-white rounded"
          onClick={onSubmit}
        >
          {id ? "Update" : "Add"} Product
        </button>
      </div>
    </div>
  );
};

export default Create;
