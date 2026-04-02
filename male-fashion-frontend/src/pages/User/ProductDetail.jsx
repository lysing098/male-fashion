import React, { useEffect, useState } from "react";
import { TfiAngleRight } from "react-icons/tfi";
import { Link, NavLink, useParams } from "react-router-dom";
import api from "../../utils/api.js";
import ProductDetailSkelton from "../../components/Skelton/ProductDetailSkelton.jsx";
import { useDispatch } from "react-redux";
import { addToCart } from "../../features/cartSlice.js";
import { toast } from "react-toastify";
import { SiZerodha } from "react-icons/si";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState([]);
  const [products, setProducts] = useState([]);
  const [images, setImages] = useState([]);
  const [active, setActive] = useState();
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [qty, setQty] = useState(1);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notSelect, setNotSelect] = useState({ size: false, color: false });
  const priceDiscount = (product.price * product.discount) / 100;
  const finalPrice = product.price - priceDiscount;

  // handle add to cart
  const handleAddCart = () => {
    const sizeError = selectedSize === null;
    const colorError = selectedColor === null;

    setNotSelect({ size: sizeError, color: colorError });

    if (sizeError || colorError) return;

    dispatch(
      addToCart({
        id: product.id,
        name: product.name,
        discount: product.discount,
        category: product?.category?.name,
        brand: product?.brand?.name,
        price: finalPrice,
        image: active?.image,
        size: product.sizes[selectedSize],
        sizes: product.sizes,
        color: product.colors[selectedColor],
        colors: product.colors,
        quantity: qty,
      }),
    );

    toast.success("Add to cart");
  };

  // handle select size & color
  const handleSize = (index) => {
    setSelectedSize(index);
    // Only clear size error
    setNotSelect((prev) => ({ ...prev, size: false }));
  };

  const handleColor = (index) => {
    setSelectedColor(index);
    // Only clear color error
    setNotSelect((prev) => ({ ...prev, color: false }));
  };

  // qty
  const increaseQty = () => {
    setQty((prev) => (prev += 1));
  };
  const decreaseQty = () => {
    setQty((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // fetectdata
  const fetechData = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/product/${id}`);

      setProduct(res.data?.product);
      setImages(res.data?.product?.images);
      setCategory(res.data?.product?.category?.name);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const relatedProduct = async () => {
    try {
      const product = await api.get("/product");
      setProducts(product.data?.products?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // side effect
  useEffect(() => {
    if (images.length > 0) {
      setActive(images[0]);
    }
  }, [images]);
  useEffect(() => {
    fetechData();
    relatedProduct();
  }, [id]);

  if (loading) return <ProductDetailSkelton />;
  return (
    <div>
      {/* breandcrumb */}
      <div className="py-20 bg-orange-200/50 ">
        <p className="w-6xl container mx-auto text-2xl font-bold mb-3">
          Product Detail
        </p>
        <div className="w-6xl container mx-auto flex items-center justify-items-start gap-2">
          <Link to={"/shop"} className="flex items-center gap-2">
            <p>Shop</p>
            <TfiAngleRight size={13} />
          </Link>

          <p className="text-gray-500/40 capitalize">{product.name}</p>
        </div>
      </div>

      {/* product detail */}
      <div className="w-6xl container mx-auto my-10 grid grid-cols-2 gap-10">
        {/* image */}
        <div className="flex gap-5">
          {/* Thumbnails */}
          <div className="flex flex-col gap-3">
            {images.slice(0, 5).map((img, index) => (
              <img
                key={index}
                onClick={() => setActive(img)}
                src={`http://127.0.0.1:8000/storage/${img.image}`}
                alt=""
                className={`w-25 h-25 object-cover cursor-pointer border-1 ${
                  img.image === active?.image
                    ? "border-black"
                    : "border-transparent"
                }`}
              />
            ))}
          </div>

          {/* Main Image */}
          {active && (
            <img
              src={`http://127.0.0.1:8000/storage/${active.image}`}
              alt=""
              className="w-full h-[600px] object-cover mb-4"
            />
          )}
        </div>

        {/* detail */}
        <div className="">
          <div>
            <div className="flex items-center gap-2 font-medium">
              <p className="text-red-500 font-bold">
                US ${finalPrice.toFixed(2)}
              </p>
              {Number(product.discount) === 0 ? (
                ""
              ) : (
                <div className="flex items-center gap-2 ">
                  <p className="font-bold">-{Number(product.discount)}%</p>
                  <p className="line-through text-gray-600">${product.price}</p>
                </div>
              )}
            </div>
          </div>
          <p className="capitalize my-5 font-medium">{product.name}</p>
          <p className="mt-3 mb-5">{product.description}</p>

          {/* size */}
          <div className="flex flex-col gap-3 my-5">
            <p className="font-bold">Size</p>
            <div className="flex items-center gap-5">
              {product.sizes?.map((item, index) => (
                <p
                  key={index}
                  onClick={() => handleSize(index)}
                  className={`uppercase py-1 px-5 border cursor-pointer ${selectedSize === index ? "bg-black text-white" : ""}`}
                >
                  {item}
                </p>
              ))}
            </div>
          </div>

          {/* product color */}
          <div className="flex flex-col gap-3 my-5">
            <p className="font-bold">Color</p>
            <div className="flex items-center gap-5">
              {product?.colors?.map((item, index) => (
                <div
                  key={index}
                  className={`w-8 h-8  rounded-full border cursor-pointer p-1 ${selectedColor === index ? "border-black" : "border-gray-300"}`}
                  onClick={() => handleColor(index)}
                >
                  <div
                    className="w-full h-full rounded-full "
                    style={{ backgroundColor: item }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          {/* quantity */}
          <div className="flex flex-col gap-3 my-5">
            <p className="font-bold">Quantity</p>
            <div className="flex items-center gap-3">
              <p
                className="w-10 py-1 bg-black/20 text-center cursor-pointer"
                onClick={decreaseQty}
              >
                -
              </p>
              <p className="w-10 py-1 bg-black/20 text-center ">{qty}</p>
              <p
                className="w-10 py-1 bg-black/20 text-center cursor-pointer"
                onClick={increaseQty}
              >
                +
              </p>
            </div>
          </div>

          {/* size */}
          {notSelect.size && (
            <p className="bg-black/20 text-center w-full py-2 cursor-pointer">
              Please select a size
            </p>
          )}

          {/* color */}
          {notSelect.color && (
            <p className="mt-2 bg-black/20 text-center w-full py-2 cursor-pointer">
              Please select a color
            </p>
          )}

          {/* add to cart */}
          <div
            onClick={handleAddCart}
            className="my-5 text-center font-bold text-white bg-black py-2 w-full cursor-pointer"
          >
            Add to bag
          </div>
        </div>
      </div>

      {/* related product */}
      <div className="my-20 w-6xl container mx-auto">
        <h1 className="font-bold text-xl">Related Products</h1>
        <div className="grid grid-cols-4 gap-5">
          {products
            .filter(
              (i) => i?.category?.name === category && i.id !== product.id,
            )
            .slice(0, 4)
            .map((item) => (
              <div className="" key={item.id}>
                <NavLink
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
                    {item.discount > 0 ? `-${parseFloat(item.discount)}%` : ""}
                  </p>
                </NavLink>
                <div className="py-2 px-1">
                  <p className="capitalize font-semibold">{item.name}</p>
                  <div className="flex items-center justify-between">
                    <p className="font-medium">${parseFloat(item.price)}</p>
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
      </div>
    </div>
  );
};

export default ProductDetail;
