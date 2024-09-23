import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import Accuracy from "../pages/Accuracy";
import History from "../pages/History";
import Employee from "../pages/Employee";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/accuracy",
    element: (
      <ProtectedRoute>
        <Accuracy />
      </ProtectedRoute>
    ),
  },
  {
    path: "/history",
    element: (
      <ProtectedRoute>
        <History />
      </ProtectedRoute>
    ),
  },
  {
    path: "/employee",
    element: (
      <ProtectedRoute>
        <Employee />
      </ProtectedRoute>
    ),
  },
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
