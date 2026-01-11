import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://store-rating-app-lac-seven.vercel.app/api";

const customFetch = axios.create({
  baseURL: BASE_URL,
});

export default customFetch;
