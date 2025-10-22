import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../api/apiAxios";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState(null);
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setRegisterError(null);

    try {
      const response = await axiosInstance.post(`${BACKEND_URL}/user/createCustomer`, data);
      console.log("Response:", response.data);

      const { token, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        alert("Registration successful!");
        navigate('/')
      } else {
        setRegisterError("Registration failed: No token received.");
      }
    } catch (error) {
      if (error.response) {
        const errMsg = error.response.data.message || "Registration failed.";
        setRegisterError(errMsg);
      } else {
        setRegisterError("Network error. Please check backend connection.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center justify-center h-96 mt-16">
        <div className="flex flex-col shadow-2xl bg-white rounded-xl gap-y-4 w-96 p-5">
          <label htmlFor="name">Enter Name</label>
          <input
            {...register("name", { required: "Name is required" })}
            id="name"
            placeholder="Enter Your Name"
            className="border border-gray-300 rounded-lg p-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <label htmlFor="email">Enter Email</label>
          <input
            {...register("email", { required: "Email is required" })}
            id="email"
            placeholder="Enter Your Email"
            className="border border-gray-300 rounded-lg p-2"
          />
          {errors.email && <p className="text-red-500">{errors.email.message}</p>}

          <label htmlFor="password">Password</label>
          <input
            {...register("password", { required: "Password is required" })}
            type="password"
            id="password"
            placeholder="Enter Your Password"
            className="border border-gray-300 rounded-lg p-2"
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            {...register("confirmPassword", { required: "Confirm Password is required" })}
            type="password"
            id="confirmPassword"
            placeholder="Confirm Your Password"
            className="border border-gray-300 rounded-lg p-2"
          />
          {errors.confirmPassword && <p className="text-red-500">{errors.confirmPassword.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-medium rounded-xl p-2"
          >
            {isLoading ? "Registering..." : "Sign Up"}
          </button>

          {registerError && <p className="text-red-500 mt-2 text-center">{registerError}</p>}
        </div>
      </div>
    </form>
  );
};

export default Register;
