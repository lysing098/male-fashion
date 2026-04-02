import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/User/HomePage";
import RootLayout from "./Layouts/RootLayout";
import AdminLayout from "./Layouts/AdminLayout";
import ProtectRoute from "./components/ProtectRoute";
import Dashboard from "./pages/admin/Dashboard";
import Carousel from "./pages/admin/Carousel";
import { ToastContainer } from "react-toastify";
import Category from "./pages/admin/Category";
import Brand from "./pages/admin/Brand";
import Product from "./pages/admin/Product/Product";
import Create from "./pages/admin/Product/Create";
import ShopPage from "./pages/User/ShopPage";
import BlogPage from "./pages/User/BlogPage";
import ContactPage from "./pages/User/ContactPage";
import NotFound from "./pages/User/NotFound";
import ProductDetail from "./pages/User/ProductDetail";
import { Provider } from "react-redux";
import { store } from "./store/store";
import Profile from "./pages/User/Profile";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <Provider store={store}>
      <BrowserRouter>
        <ToastContainer position="top-center" autoClose={2000} />
        <Routes>
          {/* user */}
          <Route element={<RootLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/profile" element={<Profile />} />

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* admin */}
          <Route
            element={
              <ProtectRoute
                user={user}
                allowedRoles={["admin", "editor", "viewer"]}
              />
            }
          >
            <Route element={<AdminLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="carousel" element={<Carousel />} />
              <Route path="category" element={<Category />} />
              <Route path="brand" element={<Brand />} />
              <Route path="product" element={<Product />} />
              <Route path="product/create" element={<Create />} />
              <Route path="product/update/:id" element={<Create />} />
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
