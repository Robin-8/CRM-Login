import React, { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { axiosInstance } from "../api/apiAxios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setLoginError(null);

    try {
      const response = await axiosInstance.post(`${BACKEND_URL}/admin/adminLogin`, data);
      console.log("Response:", response.data);

      const { token, message, id, email, name } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        alert("Login successful!");
        navigate('/admin')
      } else {
        setLoginError("Login failed: Authentication token was not received.");
      }
    } catch (error) {
      if (error.response) {
        const errorMessage =
          error.response.data.message || error.response.data.error;
        setLoginError(errorMessage || "Login failed. Please check credentials.");
      } else {
        setLoginError(
          "Network error. Could not connect to the server (Is the backend running?)."
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center justify-center gap-4 mt-10">
        <div className="flex flex-col shadow-2xl bg-white rounded-xl p-4 w-96">
          <label htmlFor="email">Enter Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            placeholder="Enter Email"
            className="border-2 border-black rounded-md p-2"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          <label htmlFor="password">Enter Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            placeholder="Enter Password"
            className="border-2 border-black rounded-md p-2"
          />
          {errors.password && (
            <p className="text-red-500">{errors.password.message}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`bg-blue-500 text-white p-2 rounded-md mt-4 ${
              isLoading ? "opacity-50" : ""
            }`}
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>

          {loginError && (
            <p className="text-red-500 mt-2 text-center">{loginError}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default AdminLogin;
