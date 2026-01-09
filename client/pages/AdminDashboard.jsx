import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });

  const [filters, setFilters] = useState({
    name: "",
    email: "",
    role: "",
  });

  const [showStoreForm, setShowStoreForm] = useState(false);
  const [storeData, setStoreData] = useState({
    name: "",
    email: "",
    address: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") {
      navigate("/login");
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [usersRes, statsRes] = await Promise.all([
        customFetch.get("/users", config),
        customFetch.get("/users/stats", config),
      ]);

      setUsers(usersRes.data.users);
      setStats(statsRes.data.stats);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch dashboard data");
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const token = localStorage.getItem("token");
      await customFetch.patch(
        `/users/${userId}/role`,
        { role: newRole },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Role updated");
      fetchData();
    } catch (error) {
      toast.error("Failed to update role");
    }
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await customFetch.post("/stores", storeData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Store created successfully");
      setShowStoreForm(false);
      setStoreData({ name: "", email: "", address: "" });
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to create store");
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchName = user.name
      .toLowerCase()
      .includes(filters.name.toLowerCase());
    const matchEmail = user.email
      .toLowerCase()
      .includes(filters.email.toLowerCase());
    const matchRole = filters.role ? user.role === filters.role : true;
    return matchName && matchEmail && matchRole;
  });

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" />

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <div className="space-x-4">
          <button
            onClick={() => setShowStoreForm(!showStoreForm)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {showStoreForm ? "Close Form" : "+ Add Store"}
          </button>
          <button
            onClick={() => navigate("/change-password")}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Change Password
          </button>
          <button
            onClick={() => {
              localStorage.clear();
              navigate("/login");
            }}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded shadow border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">
            Total Users
          </h3>
          <p className="text-3xl font-bold text-gray-800">{stats.totalUsers}</p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">
            Total Stores
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalStores}
          </p>
        </div>
        <div className="bg-white p-6 rounded shadow border-l-4 border-purple-500">
          <h3 className="text-gray-500 text-sm font-bold uppercase">
            Total Ratings
          </h3>
          <p className="text-3xl font-bold text-gray-800">
            {stats.totalRatings}
          </p>
        </div>
      </div>

      {showStoreForm && (
        <form
          onSubmit={handleCreateStore}
          className="bg-white p-6 rounded shadow-md mb-8 max-w-lg mx-auto border-l-4 border-green-500"
        >
          <h3 className="font-bold text-xl mb-4">Create New Store</h3>
          <input
            className="w-full border p-2 mb-2 rounded"
            placeholder="Store Name"
            value={storeData.name}
            onChange={(e) =>
              setStoreData({ ...storeData, name: e.target.value })
            }
            required
          />
          <input
            className="w-full border p-2 mb-2 rounded"
            placeholder="Store Email"
            type="email"
            value={storeData.email}
            onChange={(e) =>
              setStoreData({ ...storeData, email: e.target.value })
            }
            required
          />
          <input
            className="w-full border p-2 mb-4 rounded"
            placeholder="Store Address"
            value={storeData.address}
            onChange={(e) =>
              setStoreData({ ...storeData, address: e.target.value })
            }
            required
          />
          <button className="bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700">
            Create Store
          </button>
        </form>
      )}

      <div className="bg-white p-4 rounded shadow mb-4 flex flex-col md:flex-row gap-4">
        <input
          type="text"
          placeholder="Filter by Name"
          className="border p-2 rounded flex-1"
          value={filters.name}
          onChange={(e) => setFilters({ ...filters, name: e.target.value })}
        />
        <input
          type="text"
          placeholder="Filter by Email"
          className="border p-2 rounded flex-1"
          value={filters.email}
          onChange={(e) => setFilters({ ...filters, email: e.target.value })}
        />
        <select
          className="border p-2 rounded flex-1 bg-white"
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
        >
          <option value="">All Roles</option>
          <option value="USER">User</option>
          <option value="STORE_OWNER">Store Owner</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Current Role</th>
              <th className="py-3 px-6 text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-6">{user.name}</td>
                <td className="py-4 px-6">{user.email}</td>
                <td className="py-4 px-6">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "STORE_OWNER"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {user.role}
                  </span>
                </td>
                <td className="py-4 px-6">
                  {user.role !== "ADMIN" && (
                    <select
                      className="border p-1 rounded bg-white cursor-pointer"
                      onChange={(e) =>
                        handleRoleChange(user.id, e.target.value)
                      }
                      value={user.role}
                    >
                      <option value="USER">User</option>
                      <option value="STORE_OWNER">Store Owner</option>
                    </select>
                  )}
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No users found matching filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default AdminDashboard;
