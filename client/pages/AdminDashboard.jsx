import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import customFetch from "../utils/customFetch";
import AdminUsersSection from "./AdminUsersSection";
import Navbar from "../components/AdminDashboard/Navbar";
import StatsCards from "../components/AdminDashboard/StatsCards";
import StoreManagement from "../components/AdminDashboard/StoreManagement";
import "react-toastify/dist/ReactToastify.css";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalStores: 0,
    totalRatings: 0,
  });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [showStoreForm, setShowStoreForm] = useState(false);
  const [storeData, setStoreData] = useState({
    name: "",
    email: "",
    address: "",
    ownerEmail: "",
  });

  const inputClass =
    "w-full border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all";
  const thClass =
    "px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 select-none";

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      colorClass: "bg-purple-50 text-purple-600",
    },
    {
      label: "Total Stores",
      value: stats.totalStores,
      icon: "🏪",
      colorClass: "bg-green-50 text-green-600",
    },
    {
      label: "Total Ratings",
      value: stats.totalRatings,
      icon: "★",
      colorClass: "bg-yellow-50 text-yellow-600",
    },
  ];

  const tableColumns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "address", label: "Address" },
    { key: null, label: "Owner" },
    { key: "averageRating", label: "Rating" },
    { key: null, label: "Action" },
  ];

  const formFields = [
    { name: "name", placeholder: "Store Name", type: "text" },
    { name: "email", placeholder: "Store Email", type: "email" },
    {
      name: "address",
      placeholder: "Address (Max 400)",
      type: "text",
      maxLength: 400,
    },
    {
      name: "ownerEmail",
      placeholder: "Assign Owner (User Email)",
      type: "email",
    },
  ];

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "ADMIN") navigate("/login");
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = { headers: { Authorization: `Bearer ${token}` } };

      const [statsRes, storesRes] = await Promise.all([
        customFetch.get("/users/stats", config),
        customFetch.get("/stores", config),
      ]);

      setStats(
        statsRes.data.stats || {
          totalUsers: 0,
          totalStores: 0,
          totalRatings: 0,
        }
      );
      setStores(storesRes.data.stores);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
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
      setStoreData({ name: "", email: "", address: "", ownerEmail: "" });
      fetchData();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to create store");
    }
  };

  const handleDeleteStore = async (id) => {
    if (!window.confirm("Are you sure you want to delete this store?")) return;
    try {
      const token = localStorage.getItem("token");
      await customFetch.delete(`/stores/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Store deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete store");
    }
  };

  const handleSort = (key) => {
    if (!key) return;
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const sortedStores = useMemo(() => {
    if (!sortConfig.key) return stores;

    return [...stores].sort((a, b) => {
      let valA = a[sortConfig.key];
      let valB = b[sortConfig.key];

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
      if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [stores, sortConfig]);

  const renderSortArrow = (key) => {
    if (sortConfig.key !== key)
      return <span className="text-gray-300 ml-1">↕</span>;
    return (
      <span className="text-blue-600 ml-1">
        {sortConfig.direction === "asc" ? "↑" : "↓"}
      </span>
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <ToastContainer position="top-center" />

      <Navbar navigate={navigate} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Dashboard Overview
        </h1>

        <StatsCards statCards={statCards} />

        <StoreManagement
          showStoreForm={showStoreForm}
          setShowStoreForm={setShowStoreForm}
          formFields={formFields}
          inputClass={inputClass}
          storeData={storeData}
          setStoreData={setStoreData}
          handleCreateStore={handleCreateStore}
          tableColumns={tableColumns}
          thClass={thClass}
          sortedStores={sortedStores}
          handleSort={handleSort}
          renderSortArrow={renderSortArrow}
          handleDeleteStore={handleDeleteStore}
        />

        <AdminUsersSection users={[]} refresh={fetchData} />
      </main>
    </div>
  );
};

export default AdminDashboard;
