import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Login from "./userPages/Login.jsx";
import UpdateCustomer from "./userPages/UpdateCustomer.jsx";
import Register from "./userPages/Register.jsx";
import UserLists from "./userPages/UserLists.jsx";
import Home from "./components/Home.jsx";
import Layout from "./components/Layout.jsx";
import AdminLogin from "./adminPages/adminLogin.jsx";
import AdminRegister from "./adminPages/adminRegister.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashbord from "./adminPages/AdminDashbord.jsx";
import ErrorPage from "./components/ErrorPage.jsx";
import AdminCustUpdat from "./adminPages/adminCustUpdat.jsx";
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="updating/:id" element={<UpdateCustomer />} />
          <Route path="createCustomer" element={<Register />} />
          <Route path="getAllUser" element={<UserLists />} />
        </Route>
        // admin router
        <Route element={<AdminLayout />}>
          <Route path="adminLogin" element={<AdminLogin />} />
          <Route path="adminRegister" element={<AdminRegister />} />
          <Route path="admin" element={<AdminDashbord />} />
          <Route path="adminAllUsers" element={<AdminDashbord/>}/>
          <Route path="updatingcustomer/:id" element={<AdminCustUpdat/>} />
        </Route>
        <Route path="*" element={<ErrorPage/>}/>
      </Routes>
    </QueryClientProvider>
  </BrowserRouter>
);
