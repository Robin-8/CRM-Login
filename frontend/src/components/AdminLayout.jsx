import React from "react";

import { Outlet } from "react-router-dom";
import AdminNavbar from "../adminPages/AdminNavbar";


const AdminLayout = () => {
  return (
    <>
      <AdminNavbar/>
      <div className="container mt-4">
        <Outlet />
      </div>
    </>
  );
};

export default AdminLayout;
