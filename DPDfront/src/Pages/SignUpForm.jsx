import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../Redux/Auth/AuthSlice";

function SignupForm() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    role: "PRODUCTION",
  });
  const [error, setError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user && !loading) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const result = await dispatch(signupUser(formData));

    if (signupUser.rejected.match(result)) {
      setError(result.payload || "Signup failed");
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-gray-100 to-gray-200">
      {/* Left Panel */}
      <section className="md:w-1/2 flex flex-col justify-center items-center bg-white p-10 md:p-20 border-r border-gray-300 text-center">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-4 tracking-wide">
          Fluid Mechanics
        </h1>
        <h2 className="text-3xl font-semibold text-gray-800 mb-2">
          Digital Product Definition
        </h2>
        <p className="text-gray-600 text-lg tracking-wide">TY Sem 2 Project</p>
      </section>

      {/* Right Signup Panel */}
      <section className="md:w-1/2 flex justify-center items-center p-8 bg-white shadow-lg rounded-tr-lg rounded-br-lg">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-6"
          noValidate
        >
          <h3 className="text-2xl font-semibold text-center">Create an account</h3>

          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-md"
            required
          />

          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          >
            <option value="PRODUCTION">Production</option>
            <option value="QA">QA</option>
            <option value="PARENT">Parent</option>
          </select>

          {error && <p className="text-red-600 text-sm text-center">{error}</p>}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold"
          >
            Sign Up
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}

export default SignupForm;
