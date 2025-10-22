import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../api/apiAxios";

const BACKEND_URL = import.meta.env.VITE_BASE_URL;

const UpdateCustomer = () => {
  const { id } = useParams();
  const [updateError, setUpdateError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();


  const {
    data: userData,
    isLoading,
    error: fetchError,
  } = useQuery({
    queryKey: ["user", id],
    queryFn: async () => {
      const response = await axiosInstance.get(`${BACKEND_URL}/user/${id}`);
      return response.data;
    },
    onSuccess: (data) => {
   
      reset({
        name: data?.name || "",
        email: data?.email || "",
        password: "",
        confirmPassword: "",
      });
    },
    onError: () => setUpdateError("Failed to load user data"),
  });

 
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setUpdateError(null);

    if (data.password !== data.confirmPassword) {
      setUpdateError("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    const updatePayload = {
      name: data.name,
      email: data.email,
      password: data.password || undefined,
    };

    try {
      const response = await axiosInstance.patch(
        `${BACKEND_URL}/user/updating/${id}`,
        updatePayload,
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("✅ Updated user:", response.data);
      alert("User updated successfully!");
    } catch (err) {
      console.error(err);
      setUpdateError(err.response?.data?.message || "Update failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading)
    return <p className="text-center mt-10">Loading user data...</p>;

  if (fetchError)
    return <p className="text-center mt-10 text-red-500">{updateError}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col items-center justify-center h-full mt-10">
        <div className="flex flex-col shadow-2xl bg-white rounded-xl gap-y-4 w-96 p-5">
          <h2 className="text-center text-2xl font-semibold mb-3">
            Update User
          </h2>

          
          <label htmlFor="name" className="font-medium">
            Name
          </label>
          <input
            {...register("name", { required: "Name is required" })}
            id="name"
            placeholder="Enter your name"
            className="border border-gray-300 rounded-lg p-2"
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          
          <label htmlFor="email" className="font-medium">
            Email
          </label>
          <input
            {...register("email", { required: "Email is required" })}
            id="email"
            placeholder="Enter your email"
            className="border border-gray-300 rounded-lg p-2"
          />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          
          <label htmlFor="password" className="font-medium">
            Password
          </label>
          <input
            {...register("password")}
            type="password"
            id="password"
            placeholder="Enter new password (optional)"
            className="border border-gray-300 rounded-lg p-2"
          />

          
          <label htmlFor="confirmPassword" className="font-medium">
            Confirm Password
          </label>
          <input
            {...register("confirmPassword")}
            type="password"
            id="confirmPassword"
            placeholder="Confirm password"
            className="border border-gray-300 rounded-lg p-2"
          />

          
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 hover:bg-blue-600 transition text-white font-medium rounded-xl p-2"
          >
            {isSubmitting ? "Updating..." : "Update"}
          </button>

          {updateError && (
            <p className="text-red-500 mt-2 text-center">{updateError}</p>
          )}
        </div>
      </div>
    </form>
  );
};

export default UpdateCustomer;
