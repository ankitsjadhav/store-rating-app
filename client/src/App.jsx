import { createBrowserRouter, RouterProvider } from "react-router-dom";
import {
  Home,
  Register,
  Login,
  AdminDashboard,
  StoreDashboard,
  Error,
} from "../pages";
import ChangePassword from "../pages/ChangePassword";

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
  {
    path: "/change-password",
    element: <ChangePassword />,
  },
]);
const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
