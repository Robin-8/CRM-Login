import React, { useState } from "react";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          <Link
            to="/dashbord"
            className="text-2xl font-bold text-gray-800 hover:text-blue-600"
          >
           CRM
          </Link>

          
          <div className="flex lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="text-gray-800 hover:text-blue-600 focus:outline-none"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>

          
          <div className="hidden lg:flex space-x-6">
            <Link
              to="/admin"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              AdminHome
            </Link>
            <Link
              to="/adminRegister"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              AdminRegister
            </Link>
            <Link
              to="/adminLogin"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/adminAllUsers"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Users
            </Link>
          </div>

          
          <div className="hidden lg:flex">
            <input
              type="text"
              placeholder="Search..."
              className="px-3 py-1 border rounded-l-md focus:outline-none"
            />
            <button className="bg-blue-600 text-white px-3 py-1 rounded-r-md">
              Search
            </button>
          </div>
        </div>
      </div>

      
      {isOpen && (
        <div className="lg:hidden bg-white shadow-md px-4 py-3 space-y-2">
          <Link
            to="/"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/adminRegister"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Register
          </Link>
          <Link
            to="/adminLogin"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            to="/adminAllUsers"
            className="block text-gray-700 hover:text-blue-600 font-medium"
            onClick={() => setIsOpen(false)}
          >
            Users
          </Link>
        </div>
      )}
    </nav>
  );
};

export default AdminNavbar;
