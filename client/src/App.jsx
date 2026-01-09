import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  AdminDashboard,
  StoreDashboard,
  Error,
} from "../pages";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <Error />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/admin",
    element: <AdminDashboard />,
  },
  {
    path: "/store-owner",
    element: <StoreDashboard />,
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
