import React from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fetchUsers = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token found. Please login.");

  const response = await axios.get("http://localhost:3001/api/user/getAllUser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data.data;
};

const UserLists = () => {
  const { data: users, error, isLoading } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isLoading) return <p>Loading users...</p>;

 
  if (error) {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return <p style={{ color: "red" }}>{message}</p>;
  }

  return (
    <div>
      <h1>User List</h1>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name} - {user.email} - {user.role}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserLists;
