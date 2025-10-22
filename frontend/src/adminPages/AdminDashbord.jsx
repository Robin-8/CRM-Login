import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  const response = await axios.get(
    "http://localhost:3001/api/admin/adminAllUsers",
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );

  return response.data.data;
};
const deleteUser = async (userId) => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  const response = await axios.patch(
    `http://localhost:3001/api/admin/delete/${userId}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  return response.data;
};

const AdminDashbord = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch users
  const {
    data: users,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  // Delete mutation
  const { mutate: mutateDelete, isLoading: isDeleting } = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => {
      alert(err.response?.data?.message || "Failed to delete user.");
    },
  });

  if (isLoading)
    return <p className="text-center mt-10 text-gray-600">Loading users...</p>;

  if (error)
    return (
      <p className="text-center mt-10 text-red-500">
        {error.response?.data?.message ||
          error.message ||
          "Something went wrong"}
      </p>
    );

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Admin Dashboard
      </h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-lg shadow-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
            <tr>
              <th className="py-3 px-6 text-left">#</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr
                key={user._id}
                className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="py-3 px-6">{index + 1}</td>
                <td className="py-3 px-6">{user.name}</td>
                <td className="py-3 px-6">{user.email}</td>
                <td className="py-3 px-6 capitalize">{user.role}</td>
                <td className="py-3 px-6">
                  <button
                    onClick={() => {
                      if (
                        window.confirm(`Are you sure to delete ${user.name}?`)
                      ) {
                        mutateDelete(user._id);
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                    disabled={isDeleting}
                  >
                    Delete
                  </button>

                  <button
                    onClick={() => navigate(`/updatingcustomer/${user._id}`)}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashbord;
