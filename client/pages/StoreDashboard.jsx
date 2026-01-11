import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import customFetch from "../utils/customFetch";
import OwnerNavbar from "../components/StoreDashboard/OwnerNavbar";
import StoreCard from "../components/StoreDashboard/StoreCard";

import "react-toastify/dist/ReactToastify.css";

const StoreDashboard = () => {
  const [stores, setStores] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    if (
      !loggedUser ||
      (loggedUser.role !== "STORE_OWNER" && loggedUser.role !== "ADMIN")
    ) {
      navigate("/login");
    } else {
      setUser(loggedUser);
      fetchMyStores();
    }
  }, [navigate]);

  const fetchMyStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const { data } = await customFetch.get("/stores/my-dashboard", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStores(data.stores);
    } catch (error) {
      toast.error("Failed to fetch dashboard data");
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc")
      direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <ToastContainer position="top-center" />

      <OwnerNavbar navigate={navigate} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Monitor your store performance and customer feedback in real time.
            </p>
          </div>

          <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm text-sm text-gray-600 font-medium">
            Total Stores:{" "}
            <span className="text-gray-900 font-bold">{stores.length}</span>
          </div>
        </div>

        {user && (
          <div className="mt-2 mb-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Welcome back, {user.name.split(" ")[0]} 👋
            </h2>
          </div>
        )}

        {stores.map((store) => {
          const sortedRatings = [...(store.ratings || [])].sort((a, b) => {
            if (!sortConfig.key) return 0;

            const valA = sortConfig.key === "user" ? a.user?.name : a.value;
            const valB = sortConfig.key === "user" ? b.user?.name : b.value;

            if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1;
            if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1;
            return 0;
          });

          return (
            <StoreCard
              key={store.id}
              store={store}
              sortedRatings={sortedRatings}
              sortConfig={sortConfig}
              handleSort={handleSort}
            />
          );
        })}
      </main>
    </div>
  );
};

export default StoreDashboard;
