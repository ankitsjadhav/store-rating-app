import { useEffect, useState } from "react";
import customFetch from "../utils/customFetch";
import { toast, ToastContainer } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

const Home = () => {
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [ratingInput, setRatingInput] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("user"));
    setUser(loggedUser);
    fetchStores();
  }, []);

  useEffect(() => {
    const lowerQuery = searchQuery.toLowerCase();
    const filtered = stores.filter(
      (store) =>
        store.name.toLowerCase().includes(lowerQuery) ||
        store.address.toLowerCase().includes(lowerQuery)
    );
    setFilteredStores(filtered);
  }, [searchQuery, stores]);

  const fetchStores = async () => {
    try {
      const token = localStorage.getItem("token");
      const config = token
        ? { headers: { Authorization: `Bearer ${token}` } }
        : {};

      const { data } = await customFetch.get("/stores", config);
      setStores(data.stores);
      setFilteredStores(data.stores);
    } catch (error) {
      console.error(error);
    }
  };

  const handleRate = async (storeId) => {
    if (!user) return navigate("/login");

    const value = parseInt(ratingInput[storeId]);
    if (!value || value < 1 || value > 5)
      return toast.warning("Please select a rating (1-5)");

    try {
      const token = localStorage.getItem("token");
      await customFetch.post(
        `/stores/${storeId}/rate`,
        { value },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.success("Rating submitted!");
      fetchStores();
    } catch (error) {
      toast.error(error?.response?.data?.msg || "Failed to rate");
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <ToastContainer position="top-center" />

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 max-w-4xl mx-auto gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Top Rated Stores</h1>
        <div className="w-full md:w-1/3">
          <input
            type="text"
            placeholder="Search by Name or Address..."
            className="w-full p-2 border border-gray-300 rounded shadow-sm focus:outline-none focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {!user ? (
          <button
            onClick={() => navigate("/login")}
            className="bg-blue-600 text-white px-4 py-2 rounded shrink-0"
          >
            Login to Rate
          </button>
        ) : (
          <div className="flex gap-4 items-center shrink-0">
            <span className="font-semibold hidden md:block">
              Hello, {user.name}
            </span>
            {user.role === "ADMIN" && (
              <button
                onClick={() => navigate("/admin")}
                className="text-blue-600 underline"
              >
                Admin Panel
              </button>
            )}
            {user.role === "STORE_OWNER" && (
              <button
                onClick={() => navigate("/store-owner")}
                className="text-blue-600 underline"
              >
                My Stores
              </button>
            )}
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
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 max-w-4xl mx-auto">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
          >
            <div className="flex flex-col md:flex-row justify-between items-start">
              <div className="mb-4 md:mb-0">
                <h2 className="text-2xl font-bold text-gray-800">
                  {store.name}
                </h2>
                <p className="text-gray-500">{store.address}</p>
                <div className="mt-2 flex items-center">
                  <span className="text-yellow-500 text-xl">★</span>
                  <span className="ml-1 font-bold text-lg">
                    {store.averageRating.toFixed(1)}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">/ 5</span>
                </div>
              </div>

              {user && (
                <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded w-full md:w-auto justify-end">
                  <select
                    className="border p-1 rounded"
                    value={ratingInput[store.id] || ""}
                    onChange={(e) =>
                      setRatingInput({
                        ...ratingInput,
                        [store.id]: e.target.value,
                      })
                    }
                  >
                    <option value="">Rate</option>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <option key={star} value={star}>
                        {star} Stars
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => handleRate(store.id)}
                    className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                  >
                    Submit
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}

        {filteredStores.length === 0 && (
          <p className="text-center text-gray-500 mt-10">
            No stores found matching "{searchQuery}".
          </p>
        )}
      </div>
    </div>
  );
};
export default Home;
