import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import { ArrowRightIcon, SparklesIcon } from "@heroicons/react/24/outline";
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
    if (loggedUser) {
      fetchStores();
    }
  }, []);

  useEffect(() => {
    if (!stores.length) return;
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

  const renderLandingPage = () => (
    <div className="flex flex-col lg:flex-row h-screen w-full overflow-hidden bg-slate-900">
      <div className="lg:w-[55%] relative flex flex-col justify-center p-12 lg:p-24 text-white">
        <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-br from-slate-900 via-slate-900 to-blue-900/20 opacity-50 pointer-events-none"></div>

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700 text-xs font-medium text-blue-300 mb-8 w-fit">
            <SparklesIcon className="w-3 h-3" /> FullStack Intern Challenge
          </div>

          <h1 className="text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight mb-6 text-white">
            Store<span className="text-blue-500">Finder</span>
          </h1>

          <div className="h-1 w-20 bg-blue-500 mb-8 rounded-full"></div>

          <p className="text-xl text-slate-400 font-light leading-relaxed">
            Discover the best local businesses in your area. Share your
            experience with ratings.
            <br className="hidden lg:block" />
            <br className="hidden lg:block" />
            Help the community find top rated services. A platform for users and
            store owners.
          </p>
        </div>
      </div>

      <div className="lg:w-[45%] bg-white flex flex-col justify-center items-center p-8 lg:p-16 relative shadow-2xl z-20">
        <div className="w-full max-w-md space-y-12">
          <div className="text-center">
            <div className="w-20 h-20 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl">
              <span className="text-3xl font-bold text-white">S</span>
            </div>
            <h2 className="text-4xl font-bold text-slate-900 tracking-tight">
              Welcome
            </h2>
            <p className="mt-3 text-lg text-slate-500">
              Please sign in to continue.
            </p>
          </div>

          <div className="space-y-5">
            <button
              onClick={() => navigate("/login")}
              className="group w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white text-lg font-medium py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
            >
              <span>Log In</span>
              <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => navigate("/register")}
              className="w-full flex items-center justify-center gap-2 bg-white border-2 border-slate-100 hover:border-slate-300 text-slate-600 hover:text-slate-900 font-medium py-4 rounded-xl transition-all duration-200"
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="font-sans text-gray-900">
      <ToastContainer position="top-center" />

      {!user ? (
        renderLandingPage()
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <Navbar user={user} navigate={navigate} />
          <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Store Dashboard
                </h1>
                <p className="text-gray-500 text-sm mt-1">
                  Welcome back,{" "}
                  <span className="font-semibold text-blue-600">
                    {user.name}
                  </span>
                </p>
              </div>
              <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm text-xs font-medium text-gray-600">
                Role:{" "}
                <span className="uppercase tracking-wide text-blue-600">
                  {user.role}
                </span>
              </div>
            </div>

            <SearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
            />

            <div className="mt-8">
              <StoreList
                filteredStores={filteredStores}
                user={user}
                ratingInput={ratingInput}
                setRatingInput={setRatingInput}
                handleRate={handleRate}
                searchQuery={searchQuery}
              />
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default Home;
