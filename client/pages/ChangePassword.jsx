import { useState } from "react";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await customFetch.patch("/users/update-password", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Password updated! Please login again.");
      setTimeout(() => {
        localStorage.clear();
        navigate("/login");
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <ToastContainer position="top-center" />
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md border-t-4 border-blue-600">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          Change Password
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Old Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              required
              onChange={(e) =>
                setFormData({ ...formData, oldPassword: e.target.value })
              }
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">New Password</label>
            <input
              type="password"
              className="w-full border p-2 rounded"
              required
              minLength={8}
              onChange={(e) =>
                setFormData({ ...formData, newPassword: e.target.value })
              }
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
          >
            Update Password
          </button>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-full mt-2 text-gray-500 hover:text-gray-700"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
};
export default ChangePassword;
