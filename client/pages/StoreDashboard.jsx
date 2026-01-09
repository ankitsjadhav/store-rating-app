import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StoreDashboard = () => {
  const [stores, setStores] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || (user.role !== "STORE_OWNER" && user.role !== "ADMIN")) {
      navigate("/login");
    }
    fetchMyStores();
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

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Store Dashboard</h1>
        <button
          onClick={() => {
            localStorage.clear();
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <div className="space-y-8">
        {stores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{store.name}</h2>
              <div className="text-right">
                <span className="block text-sm text-gray-500">
                  Average Rating
                </span>
                <span className="text-xl font-bold text-blue-600">
                  {store.averageRating.toFixed(1)} ★
                </span>
              </div>
            </div>

            <h3 className="font-semibold text-gray-700 mb-2 border-b pb-1">
              Customer Ratings
            </h3>
            {store.ratings && store.ratings.length > 0 ? (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="bg-gray-100 text-gray-600">
                    <th className="p-2">Customer</th>
                    <th className="p-2">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {store.ratings.map((rating, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-2">
                        {rating.user?.name || "Anonymous"}
                      </td>
                      <td className="p-2 text-yellow-600 font-bold">
                        {rating.value} ★
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-400 italic">No ratings yet.</p>
            )}
          </div>
        ))}

        {stores.length === 0 && (
          <p className="text-center text-gray-500">No stores found.</p>
        )}
      </div>
    </div>
  );
};
export default StoreDashboard;
