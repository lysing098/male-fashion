import React, { useEffect, useState } from "react";
import { GoSearch } from "react-icons/go";
import { IoMdHeartEmpty } from "react-icons/io";
import { SlHandbag } from "react-icons/sl";
import { FiUser } from "react-icons/fi";
import { Link, NavLink, useNavigate } from "react-router-dom";
import api from "../utils/api.js";
import { toast } from "react-toastify";
import { IoClose } from "react-icons/io5";
import { MdDelete } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { updateCartItem, updateQty } from "../features/cartSlice.js";

const Header = () => {
  const menu = [
    { name: "Home", link: "/" },
    { name: "Shop", link: "/shop" },
    { name: "Blog", link: "/blog" },
    { name: "Contact Us", link: "/contact" },
  ];

  const [auth, setAuth] = useState(false);
  const [mode, setMode] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //handleShopPage
  const handleShopPage = () => {
    setOpen(false);
    navigate("/shop");
  };

  // cart item
  const cartItems = useSelector((state) => state.cart.cart);
  const totalCart = useSelector((state) => state.cart.total);
  console.log(cartItems);
  const handleSearch = () => {
    setOpenSearch(!openSearch);
  };

  // handle cart
  const handleOpenCart = () => {
    setOpen(!open);
  };

  // Login state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register state
  const [name, setName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("access_token");

  // ----- LOGIN -----
  async function login(e) {
    e.preventDefault();
    try {
      const res = await api.post("/login", { email, password });
      localStorage.setItem("access_token", res.data.access_token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setAuth(false);
      toast.success("Login successful!");
    } catch (err) {
      if (err.response) {
        toast.error(err.response.data.error || "Failed to login!");
      } else {
        toast.error("Server error. Try again!");
      }
    }
  }

  // ----- REGISTER -----
  async function register(e) {
    e.preventDefault();
    try {
      await api.post("/register", {
        name,
        email: regEmail,
        password: regPassword,
      });
      toast.success("Registration successful! You can now login.");
      setMode("login");
      setName("");
      setRegEmail("");
      setRegPassword("");
    } catch (err) {
      if (err.response) {
        if (err.response.status === 422 && err.response.data.errors) {
          const messages = Object.values(err.response.data.errors)
            .flat()
            .join("\n");
          toast.error(messages);
        } else {
          toast.error(err.response.data.message || "Registration failed");
        }
      } else {
        toast.error("Server error. Try again!");
      }
    }
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    // Cleanup when component unmounts
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  return (
    <div className="container mx-auto my-5 w-6xl flex items-center justify-between">
      {/* Logo */}
      <NavLink to="/">
        <img
          src="https://preview.colorlib.com/theme/malefashion/img/logo.png"
          alt="Logo"
        />
      </NavLink>

      {/* Menu */}
      <div className="flex items-center gap-10 font-semibold">
        {menu.map((item, index) => (
          <NavLink
            key={index}
            to={item.link}
            className={({ isActive }) =>
              `relative inline-block pb-1 text-[18px] cursor-pointer
               after:absolute after:bottom-0 after:h-[2px] after:bg-red-400
               after:transition-all after:duration-300
               ${isActive ? "after:left-0 after:w-full" : "after:left-1/2 after:w-0 hover:after:left-0 hover:after:w-full"}`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Icons */}
      <div className="flex items-center gap-5 font-semibold">
        <GoSearch size={22} className="cursor-pointer" onClick={handleSearch} />
        <IoMdHeartEmpty size={22} className="cursor-pointer" />
        <FiUser
          size={22}
          className="cursor-pointer"
          onClick={() => {
            if (!token) {
              setAuth(true);
              setMode("login");
            } else {
              if (["admin", "editor", "viewer"].includes(user.role)) {
                window.location.href = "/dashboard";
              } else {
                window.location.href = "/profile";
              }
            }
          }}
        />
        <div
          onClick={handleOpenCart}
          className="flex items-center gap-2 cursor-pointer"
        >
          <SlHandbag size={20} />
          <p>${totalCart === 0 ? "0.00" : totalCart}</p>
        </div>
      </div>

      {/* Cart Modal */}
      <div
        className={`fixed inset-0 z-50 flex justify-end transition-all duration-300 ${
          open ? "visible" : "invisible"
        }`}
      >
        {/* Overlay */}
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />

        {/* Slide Panel */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`relative bg-white w-full max-w-md h-full shadow-lg 
    transform transition-transform duration-300 flex flex-col
    ${open ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* top bar */}
          <div className="py-5 px-5 border-b border-gray-300 flex justify-end">
            <IoClose
              size={25}
              className="cursor-pointer"
              onClick={() => setOpen(false)}
            />
          </div>

          {/* ================= CART CONTENT ================= */}
          {cartItems.length > 0 ? (
            <>
              {/* SCROLL AREA */}
              <div className="flex-1 overflow-y-auto">
                {cartItems.map((item) => {
                  const itemTotal = item.price * item.quantity;

                  return (
                    <div
                      className="p-5"
                      key={`${item.id}-${item.size}-${item.color}`}
                    >
                      <div className="grid grid-cols-3 gap-5">
                        <img
                          src={`http://127.0.0.1:8000/storage/${item.image}`}
                          alt="Product"
                        />
                        <div className="col-span-2">
                          <div className="flex items-center justify-between">
                            <p className="capitalize">{item.name}</p>
                            <MdDelete className="cursor-pointer" />
                          </div>
                          <p className="capitalize">
                            Category: {item?.category}
                          </p>
                          <p className="capitalize">Brand: {item?.brand}</p>

                          <div className="flex items-center justify-between mt-2">
                            {/* Color */}
                            <div>
                              <p>Color</p>
                              <select
                                className="border px-1.5 py-1 capitalize"
                                value={item.color}
                                onChange={(e) =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      oldSize: item.size,
                                      oldColor: item.color,
                                      newSize: item.size,
                                      newColor: e.target.value,
                                    }),
                                  )
                                }
                              >
                                {item?.colors.map((color, index) => (
                                  <option key={index} value={color}>
                                    {color}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Size */}
                            <div>
                              <p>Size</p>
                              <select
                                className="border px-1.5 py-1 capitalize"
                                value={item.size}
                                onChange={(e) =>
                                  dispatch(
                                    updateCartItem({
                                      id: item.id,
                                      oldSize: item.size,
                                      oldColor: item.color,
                                      newSize: e.target.value,
                                      newColor: item.color,
                                    }),
                                  )
                                }
                              >
                                {item?.sizes.map((size, index) => (
                                  <option key={index} value={size}>
                                    {size}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Quantity */}
                            <div>
                              <p>Quantity</p>
                              <div className="flex items-center gap-3">
                                <p
                                  className="w-7 py-1 border text-center cursor-pointer"
                                  onClick={() =>
                                    dispatch(
                                      updateQty({
                                        id: item.id,
                                        color: item.color,
                                        size: item.size,
                                        type: "decrease",
                                      }),
                                    )
                                  }
                                >
                                  -
                                </p>
                                <p>{item.quantity}</p>
                                <p
                                  className="w-7 py-1 border text-center cursor-pointer"
                                  onClick={() =>
                                    dispatch(
                                      updateQty({
                                        id: item.id,
                                        color: item.color,
                                        size: item.size,
                                        type: "increase",
                                      }),
                                    )
                                  }
                                >
                                  +
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Item Bottom */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <IoMdHeartEmpty />
                          <p>Move to wishlist</p>
                        </div>
                        <p className="text-red-500 font-medium">
                          US ${itemTotal}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ================= BOTTOM SUMMARY ================= */}
              <div className="border-t border-gray-300 p-5 space-y-3">
                {(() => {
                  const subtotal = Number(cartItems.reduce(
                    (total, item) => total + item.price * item.quantity,
                    0,
                  )).toFixed(2);

                  const shipping = 5;
                  const total = subtotal + shipping;

                  return (
                    <>
                      <div className="flex justify-between">
                        <p>Subtotal</p>
                        <p>US ${subtotal}</p>
                      </div>

                      <div className="flex justify-between">
                        <p>Shipping</p>
                        <p>US ${shipping}</p>
                      </div>

                      <div className="flex justify-between font-bold text-lg">
                        <p>Total</p>
                        <p>US ${Number(total).toFixed(2)}</p>
                      </div>

                      <button className="w-full bg-black text-white font-bold text-lg py-2 cursor-pointer">
                        Checkout
                      </button>
                    </>
                  );
                })()}
              </div>
            </>
          ) : (
            <div className="px-10 flex items-center justify-center h-full">
              <div className="flex flex-col text-center gap-5">
                <h1 className="text-3xl font-bold">Your bag is empty</h1>
                <p>
                  Check out our latest arrivals stay up-to-date with latest
                  styles
                </p>
                <p className="text-md font-medium">Start shopping</p>
                <p
                  onClick={handleShopPage}
                  className="bg-black text-white font-bold text-lg text-center py-2 cursor-pointer"
                >
                  Shop Page
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Auth Modal */}
      {auth && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="absolute inset-0" onClick={() => setAuth(false)} />

          <div className="relative bg-white w-full max-w-md p-8 rounded-xl shadow-lg z-10">
            {mode === "login" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                <form onSubmit={login}>
                  <label>Email</label>
                  <input
                    type="text"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full border focus:outline-none mt-1 px-3 py-1 mb-3"
                  />
                  <label>Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border focus:outline-none mt-1 px-3 py-1"
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold mt-5 py-1.5"
                  >
                    Login
                  </button>
                </form>
                <p className="mt-2 text-center">
                  Don't have an account?{" "}
                  <span
                    className="cursor-pointer text-red-400 hover:underline"
                    onClick={() => setMode("register")}
                  >
                    Register
                  </span>
                </p>
              </div>
            )}

            {mode === "register" && (
              <div>
                <h2 className="text-2xl font-bold mb-6 text-center">
                  Register
                </h2>
                <form onSubmit={register}>
                  <label>Username</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter username"
                    className="w-full border focus:outline-none mt-1 px-3 py-1 mb-3"
                  />
                  <label>Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Enter email"
                    className="w-full border focus:outline-none mt-1 px-3 py-1 mb-3"
                  />
                  <label>Password</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full border focus:outline-none mt-1 px-3 py-1"
                  />
                  <button
                    type="submit"
                    className="w-full bg-black text-white font-semibold mt-5 py-1.5"
                  >
                    Register
                  </button>
                </form>
                <p className="mt-2 text-center">
                  Already have an account?{" "}
                  <span
                    className="cursor-pointer text-red-400 hover:underline"
                    onClick={() => setMode("login")}
                  >
                    Login
                  </span>
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Header;
