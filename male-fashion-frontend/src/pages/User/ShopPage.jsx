import React, { useEffect, useState } from "react";
import { FaAngleRight } from "react-icons/fa6";
import { FiChevronRight } from "react-icons/fi";
import { TfiAngleRight } from "react-icons/tfi";
import { Link, NavLink } from "react-router-dom";
import api from "../../utils/api";
import ProductUserSkelton from "../../components/Skelton/ProductUserSkelton";
import Pagination from "../../components/shared/Pagination";

const ShopPage = () => {
  const [openCat, setOpenCat] = useState(false);
  const [openBra, setOpenBra] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openSize, setOpenSize] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [products, setProducts] = useState([]);
  // const [search, setSearch] = useState("");
  const [meta, setMeata] = useState({});
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [filter, setFilter] = useState({
    search: "",
    category_id: [],
    brand_id: [],
    colors: [],
    sizes: [],
    sort: "",
  });
  const [loading, setLoading] = useState(true);

  const handleCategory = (id) => {
    setFilter((prev) => ({
      ...prev,
      category_id: prev.category_id.includes(id)
        ? prev.category_id.filter((c) => c !== id)
        : [...prev.category_id, id],
    }));
  };

  const handleBrand = (id) => {
    setFilter((prev) => ({
      ...prev,
      brand_id: prev.brand_id.includes(id)
        ? prev.brand_id.filter((b) => b !== id)
        : [...prev.brand_id, id],
    }));
  };

  const handleColor = (color) => {
    setFilter((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }));
  };

  const handleSize = (size) => {
    setFilter((prev) => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size],
    }));
  };

  const fetechData = async () => {
    setLoading(true);
    try {
      const res = await api.get("/product", {
        params: {
          ...filter,
          page,
        },
      });

      const productData = res.data?.products?.data || [];

      setProducts(productData);
      setCategories(res.data?.categories || []);
      setBrands(res.data?.brands || []);
      setMeata(res.data?.products);
      setLastPage(res.data.products.last_page);

      setColors(res.data?.all_color);
      setSizes(res.data?.all_size);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  // console.log(products);

  useEffect(() => {
    setPage(1);
  }, [filter]);

  useEffect(() => {
    fetechData();
  }, [page, filter]);

  return (
    <div>
      <div className="py-20 bg-orange-200/50 ">
        <p className="w-6xl container mx-auto text-2xl font-bold mb-3">Shop</p>
        <div className="w-6xl container mx-auto flex items-center justify-items-start gap-2">
          <NavLink to={"/"} className="flex items-center gap-2">
            <p>Home</p>
            <TfiAngleRight size={13} />
          </NavLink>

          <p className="text-gray-500/40">Shop</p>
        </div>
      </div>

      <div className="w-6xl container mx-auto my-10">
        <div className="grid grid-cols-3 gap-10">
          {/* Aside */}
          <aside className="col-span-1">
            {/* search */}
            <div>
              <input
                type="text"
                value={filter.search}
                onChange={(e) =>
                  setFilter({ ...filter, search: e.target.value })
                }
                placeholder="Search..."
                className="w-full border px-3 py-2 focus:outline-none"
              />
            </div>

            {/* category */}
            <div
              onClick={() => setOpenCat(!openCat)}
              className="my-5 flex justify-between items-center cursor-pointer text-lg font-semibold "
            >
              {"Categories"}

              <FiChevronRight
                className={`transition-transform ${openCat ? "rotate-90" : ""}`}
              />
            </div>

            {/* ITEMS */}
            {openCat && (
              <div className="mt-3 space-y-2">
                {categories.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`category-${item.id}`}
                      checked={filter.category_id.includes(item.id)}
                      onChange={() => handleCategory(item.id)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`category-${item.id}`}
                      className="capitalize cursor-pointer"
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* brands */}
            <div
              onClick={() => setOpenBra(!openBra)}
              className="my-5 flex justify-between items-center cursor-pointer text-lg font-semibold "
            >
              {"Brands"}

              <FiChevronRight
                className={`transition-transform ${openBra ? "rotate-90" : ""}`}
              />
            </div>

            {/* ITEMS */}
            {openBra && (
              <div className="mt-3  space-y-2">
                {brands.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      id={`brand-${item.id}`}
                      checked={filter.brand_id.includes(item.id)}
                      onChange={() => handleBrand(item.id)}
                      className="cursor-pointer"
                    />
                    <label
                      htmlFor={`brand-${item.id}`}
                      className="capitalize cursor-pointer"
                    >
                      {item.name}
                    </label>
                  </div>
                ))}
              </div>
            )}

            {/* size */}
            <div
              onClick={() => setOpenSize(!openSize)}
              className="my-5 flex justify-between items-center cursor-pointer text-lg font-semibold "
            >
              {"Sizes"}

              <FiChevronRight
                className={`transition-transform ${openSize ? "rotate-90" : ""}`}
              />
            </div>

            {/* ITEMS */}
            {openSize && (
              <div className="mt-3 flex items-center gap-2">
                {sizes.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSize(item)}
                    className={`uppercase py-1 px-5 border cursor-pointer
      ${filter.sizes.includes(item) ? "bg-black text-white" : ""}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}

            {/* color */}
            <div
              onClick={() => setOpenColor(!openColor)}
              className="my-5 flex justify-between items-center cursor-pointer text-lg font-semibold "
            >
              {"Colors"}

              <FiChevronRight
                className={`transition-transform ${openColor ? "rotate-90" : ""}`}
              />
            </div>

            {/* ITEMS */}
            {openColor && (
              <div className="mt-3 flex items-center gap-2">
                {colors.map((color, index) => (
                  <div
                    key={index}
                    onClick={() => handleColor(color)}
                    className={`w-8 h-8 rounded-full border p-1 cursor-pointer 
      ${filter.colors.includes(color) ? "border-black" : "border-gray-300"}`}
                  >
                    <div
                      className="w-full h-full rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                  </div>
                ))}
              </div>
            )}
          </aside>

          {/* Product */}
          <div className="col-span-2">
            {/* top bar */}
            <div className="flex items-center justify-between  mb-10">
              <div>
                {loading ? (
                  <p>Showing 0 – 0 of 0 results</p>
                ) : (
                  <p>
                    Showing {meta.from} – {meta.to} of {meta.total} results
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1">
                <p>Sort by price:</p>
                <select
                  value={filter.sort}
                  onChange={(e) =>
                    setFilter({ ...filter, sort: e.target.value })
                  }
                  className="border focus:outline-none"
                >
                  <option value="">Relevant</option>
                  <option value="high">High to Low</option>
                  <option value="low">Low to high</option>
                </select>
              </div>
            </div>
            {/* product */}
            <div className="grid grid-cols-3 gap-5">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <ProductUserSkelton key={index} />
                  ))
                : products.slice(0, 10).map((item) => (
                    <div className="" key={item.id}>
                      <Link
                        to={`/product/${item.id}`}
                        className="relative cursor-pointer"
                      >
                        {item.images?.[0] && (
                          <img
                            src={`http://127.0.0.1:8000/storage/${item.images[0].image}`}
                            alt={item.name}
                            className="w-full h-auto object-center"
                          />
                        )}

                        <p className="absolute top-3 left-0 bg-black text-white w-15 font-semibold text-center">
                          {item.discount > 0
                            ? `-${parseFloat(item.discount)}%`
                            : ""}
                        </p>
                      </Link>
                      <div className="py-2 px-1">
                        <p className="capitalize font-semibold">{item.name}</p>
                        <div className="flex items-center justify-between">
                          <p className="font-medium">
                            ${parseFloat(item.price)}
                          </p>
                          {/* color */}
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-2">
                              {item.colors?.slice(0, 3).map((color, index) => (
                                <span
                                  key={index}
                                  className="w-4 h-4 rounded-full "
                                  style={{ backgroundColor: color }}
                                ></span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
            </div>
            <div className="my-20 flex items-center justify-center">
              <Pagination meta={meta} page={page} setPage={setPage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopPage;
