import React, { useEffect, useState } from "react";
import { FiPlusCircle } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import api from "../../../utils/api";
import SkeltonAdmin from "../../../components/Skelton/SkeltonAdmin";
import { LiaEditSolid } from "react-icons/lia";
import { LuTrash2 } from "react-icons/lu";
import ProductSkelton from "../../../components/Skelton/ProductSkelton";
import { toast } from "react-toastify";
import Pagination from "../../../components/shared/Pagination";

const Product = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [search, setSearch] = useState("");
  const [findCategory, setFindCategory] = useState("");
  const [findBrand, setFindBrand] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [meta, setMeta] = useState({});

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product", {
        params: { search, brand_id: findBrand, category_id: findCategory },
      });
      // console.log(res.data);
      setBrands(res.data?.brands);
      setCategories(res.data?.categories);
      setProducts(res.data?.products?.data || []);
      setLastPage(res.data?.products.last_page);
      setMeta(res.data?.products);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const remove = confirm("Are u sure to delete this item?");
      if (remove) {
        const res = await api.delete(`/product/${id}`);
        toast.success(res.data);
        fetchData();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete");
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, findBrand, findCategory, page]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Page</h1>

        {(user?.name === "admin" || user?.name === "editor") && (
          <NavLink
            to="/product/create"
            className="flex items-center gap-3 bg-red-500 py-2 px-3 rounded-md text-white font-bold"
          >
            <FiPlusCircle />
            <p>Create Product</p>
          </NavLink>
        )}
      </div>

      {/* Table */}
      <div className="mt-10 rounded-md border border-slate-200 overflow-hidden bg-white shadow-lg">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="border-b  border-slate-200">
              <th colSpan={10} className="p-4">
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

                  <div className="flex items-center gap-5">
                    <select
                      value={findCategory}
                      onChange={(e) => {
                        (setFindCategory(e.target.value), setPage(1));
                      }}
                      className="border rounded px-3 py-1 focus:outline-none"
                    >
                      <option value="">All Categoy</option>
                      {categories.map((c) => (
                        <option className="capitalize" key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>

                    <select
                      value={findBrand}
                      onChange={(e) => {
                        (setFindBrand(e.target.value), setPage(1));
                      }}
                      className="border rounded px-3 py-1 focus:outline-none"
                    >
                      <option value="">All Brand</option>
                      {brands.map((b) => (
                        <option className="capitalize" key={b.id} value={b.id}>
                          {b.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </th>
            </tr>
            <tr className="border-b border-slate-200 ">
              <th className="p-4">#</th>
              <th className="p-4">Product Name</th>
              <th className="p-4">Category</th>
              <th className="p-4">Brand</th>
              <th className="p-4">Price</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Color</th>
              <th className="p-4">Size</th>
              <th className="p-4">Image</th>
              {/* <th className="p-4">Action</th> */}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <ProductSkelton />
            ) : products.length > 0 ? (
              products.map((item, index) => (
                <tr key={item.id} className="border-b border-slate-200">
                  <td className="p-4 font-semibold">{index + 1}</td>

                  <td className="p-4 capitalize">{item.name}</td>

                  <td className="p-4 capitalize">
                    {item?.category?.name || "-"}
                  </td>

                  <td className="p-4 capitalize">{item?.brand?.name || "-"}</td>

                  <td className="p-4">${item.price}</td>

                  <td className="p-4">{item.discount}%</td>

                  <td className="p-4">
                    {item?.colors?.length ? item.colors.join(", ") : "-"}
                  </td>

                  <td className="p-4 capitalize">
                    {item?.sizes?.length ? item.sizes.join(", ") : "-"}
                  </td>

                  {/* Images */}
                  <td className="p-4">
                    <div className="flex gap-2 items-center flex-wrap max-w-[160px]">
                      {item?.images?.length > 0 ? (
                        item.images
                          ?.slice(0, 5)
                          .map((img) => (
                            <img
                              key={img.id}
                              src={`http://127.0.0.1:8000/storage/${img.image}`}
                              className="w-10 h-10 object-cover rounded border"
                              alt="product image"
                            />
                          ))
                      ) : (
                        <span className="text-gray-400 text-sm">No Image</span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="p-4">
                    <div className="flex gap-2 items-center">
                      <NavLink
                        to={`/product/update/${item.id}`}
                        className="px-2 py-2 border rounded hover:bg-gray-200 text-blue-500"
                      >
                        <LiaEditSolid size={18} />
                      </NavLink>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-2 py-2 border rounded hover:bg-gray-200 text-red-500"
                      >
                        <LuTrash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center p-6 text-gray-500">
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
    </div>
  );
};

export default Product;
