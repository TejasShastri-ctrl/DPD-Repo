import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../Redux/Auth/AuthSlice";
import ProductionDashboard from "./ProductionDashboard";
import QADashboard from "./QADashboard";

function Home() {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/login", { replace: true });
  };

  console.log("Current User:", user);

  return (
  <main className="p-6">
    {user ? (
      user.role === "PRODUCTION" ? (
        <ProductionDashboard />
      ) : user.role === "QA" ? (
        <QADashboard />
      ) : (
        <>
          <p className="text-lg">
            Welcome, {user.username} ({user.role})
          </p>
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </>
      )
    ) : (
      <p className="text-red-600">No user is logged in.</p>
    )}
  </main>
);
}

export default Home;
