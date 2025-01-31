import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

const Navbar = () => {
  const { token, logout, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return null; // Don't show navbar while checking authentication
  }

  return (
    <nav className="bg-white shadow-md p-4 flex justify-between">
      <h1 className="text-2xl font-bold text-blue-600">Auth System</h1>
      <ul className="flex space-x-4">
        {!token ? (
          <>
            <li>
              <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
            </li>
            <li>
              <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/dashboard" className="text-blue-500 hover:underline">Dashboard</Link>
            </li>
            <li>
              <button onClick={logout} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
