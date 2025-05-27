import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../Redux/Auth/AuthSlice";
import { useNavigate, Link } from "react-router-dom";

function LoginForm() {
  const [formData, setFormData] = useState({ username: "", password: "" });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUser(formData));
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left Info Panel */}
      <section className="md:w-1/2 flex flex-col justify-center items-center bg-white p-10 md:p-20 border-r border-gray-300 text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 tracking-wide">
          Fluid Mechanics
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Digital Product Definition
        </h2>
        <p className="text-gray-600 text-lg tracking-wide">TY Sem 2 Project</p>
      </section>

      {/* Right Login Panel */}
      <section className="md:w-1/2 flex justify-center items-center p-8 bg-white shadow-lg rounded-tr-lg rounded-br-lg">
        <form onSubmit={handleSubmit} className="w-full max-w-md" noValidate>
          <h2 className="text-3xl font-semibold text-gray-800 mb-8 text-center tracking-tight">
            Sign In
          </h2>

          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-5 rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            autoComplete="username"
            required
          />

          <input
            id="password"
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-3 mb-6 rounded-md border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            autoComplete="current-password"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            } focus:bg-blue-700 text-white font-semibold py-3 rounded-md transition duration-200 shadow-md focus:outline-none focus:ring-4 focus:ring-blue-300`}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>

          {error && (
            <p role="alert" className="mt-4 text-sm text-red-600 font-medium text-center">
              {error}
            </p>
          )}

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-blue-600 hover:underline focus:outline-none focus:ring-1 focus:ring-blue-400"
            >
              Sign up
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default LoginForm;
