import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import customFetch from "../utils/customFetch";

import Navbar from "../components/Home/Navbar";
import SearchBar from "../components/Home/SearchBar";
import StoreList from "../components/Home/StoreList";

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
      return toast.warning("Please select a rating (1–5)");

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
    <div className="bg-gray-50 min-h-screen font-sans text-gray-900">
      <ToastContainer position="top-center" />

      <Navbar user={user} navigate={navigate} />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

        <StoreList
          filteredStores={filteredStores}
          user={user}
          ratingInput={ratingInput}
          setRatingInput={setRatingInput}
          handleRate={handleRate}
          searchQuery={searchQuery}
        />
      </main>
    </div>
  );
};

export default Home;
