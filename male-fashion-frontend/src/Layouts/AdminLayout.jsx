import React, { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineHome, AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { TbBrand4Chan } from "react-icons/tb";
import { RiSlideshow3Line } from "react-icons/ri";
import { MdOutlineCategory, MdOutlineColorLens } from "react-icons/md";
import { BsBox } from "react-icons/bs";
import api from "../utils/api.js";

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);     // desktop collapse
  const [isMobileOpen, setIsMobileOpen] = useState(false);   // mobile drawer

  const routeTitles = {
    "/dashboard": "Dashboard",
    "/carousel": "Carousel",
    "/category": "Category",
    "/brand": "Brand",
    "/product": "Product",
    "/product/create": "Product",
    
  };

  const logout = async () => {
    try {
      await api.post("/logout");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      navigate("/");
    } catch (err) {
      console.error(err);
    }
  };

  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: AiOutlineHome },
    { name: "Carousel",  path: "/carousel",  icon: RiSlideshow3Line  },
    { name: "Category",  path: "/category",  icon: MdOutlineCategory  },
    { name: "Brand",  path: "/brand",  icon: TbBrand4Chan  },
    { name: "Product",  path: "/product",  icon: BsBox  },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="bg-white shadow px-4 py-3.5 flex items-center justify-between md:hidden">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="text-gray-700 focus:outline-none"
          aria-label="Open menu"
        >
          <AiOutlineMenu size={24} />
        </button>

        <h2 className="text-lg font-semibold text-gray-800">
          {routeTitles[location.pathname] || "Admin"}
        </h2>

        <button
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Logout
        </button>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar – Desktop + Mobile Drawer */}
        <aside
          className={`
            fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
            md:static md:translate-x-0 md:shadow-lg md:transition-all md:duration-300
            ${isCollapsed ? "md:w-20" : "md:w-64"}
            ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          `}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between px-5 py-5 border-b md:px-6">
            {/* Logo – hidden when collapsed on desktop */}
            {(!isCollapsed || isMobileOpen) && (
              <NavLink to="/" onClick={() => setIsMobileOpen(false)}>
                <img
                  src="https://preview.colorlib.com/theme/malefashion/img/logo.png"
                  alt="Logo"
                  className="w-36 sm:w-40 cursor-pointer"
                />
              </NavLink>
            )}

            {/* Close button on mobile / Collapse button on desktop */}
            <button
              onClick={() => {
                if (window.innerWidth < 768) {
                  setIsMobileOpen(false);
                } else {
                  setIsCollapsed(!isCollapsed);
                }
              }}
              className="p-2 rounded hover:bg-gray-100 text-gray-700"
              aria-label={isMobileOpen ? "Close menu" : "Toggle sidebar"}
            >
              {isMobileOpen ? <AiOutlineClose size={22} /> : "☰"}
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-3 py-5 md:px-4 md:py-6 space-y-1.5 ">
            {menu.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileOpen(false)} // close on mobile click
                  className={({ isActive }) =>
                    `group relative flex items-center gap-3.5 px-4 py-3 rounded-xl transition-colors text-sm md:text-base
                    ${
                      isActive
                        ? "bg-indigo-600 text-white font-medium shadow-sm"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <Icon size={22} className="flex-shrink-0" />

                  {(!isCollapsed || isMobileOpen) && <span>{item.name}</span>}

                  {/* Tooltip – only when collapsed on desktop */}
                  {isCollapsed && !isMobileOpen && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-2 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                      {item.name}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        {/* Overlay when mobile sidebar is open */}
        {isMobileOpen && (
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Desktop Header */}
          <header className="hidden md:flex bg-white shadow px-6 py-5 items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-800">
              {routeTitles[location.pathname] || "Admin Panel"}
            </h2>

            <button
              onClick={logout}
              className="px-4 py-2 text-red-600 hover:text-red-700 font-medium hover:bg-red-50 rounded-lg transition"
            >
              Logout
            </button>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-5 sm:p-6 md:p-8 overflow-y-auto bg-[##F7F7F7]">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;