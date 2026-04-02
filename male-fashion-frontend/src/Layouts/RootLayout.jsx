import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../components/Header";


const RootLayout = () => {
  return (
    <div className="flex flex-col h-screen ">
      <div className="">
        <Header />
      </div>
      <div className="flex-1 ">
        <Outlet />
      </div>
      <div>footer</div>
    </div>
  );
};

export default RootLayout;
