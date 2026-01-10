import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customFetch.post("/auth/register", formData);
      toast.success("Registration successful! Redirecting...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Registration failed");
    }
  };

  const inputClass =
    "appearance-none block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all";
  const labelClass = "block text-sm font-medium text-gray-700";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <ToastContainer position="top-center" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="h-12 w-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            S
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Join StoreFinder today
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-xl sm:px-10 border border-gray-100">
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className={labelClass}>
                Full Name{" "}
                <span className="text-gray-400 text-xs">(Min 20 chars)</span>
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  type="text"
                  name="name"
                  required
                  minLength={20}
                  maxLength={60}
                  onChange={handleChange}
                  className={inputClass}
                  title="Name must be between 20 and 60 characters"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className={labelClass}>
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label htmlFor="password" className={labelClass}>
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  type="password"
                  name="password"
                  required
                  minLength={8}
                  maxLength={16}
                  pattern="(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,16}"
                  title="Must be 8-16 characters, contain at least one uppercase letter and one special character."
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">
                8-16 chars, 1 uppercase, 1 special char.
              </p>
            </div>

            <div>
              <label htmlFor="address" className={labelClass}>
                Address
              </label>
              <div className="mt-1">
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  required
                  maxLength={400}
                  onChange={handleChange}
                  className={inputClass}
                  title="Max 400 characters"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Register
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
