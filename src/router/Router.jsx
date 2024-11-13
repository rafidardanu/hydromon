/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/prop-types */
import { useEffect } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  useNavigate,
} from "react-router-dom";
import { isTokenExpired, removeAuthToken } from "../utils/auth";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ContactAdmin from "../pages/ContactAdmin";
import Dashboard from "../pages/Dashboard";
import Accuracy from "../pages/Accuracy";
import History from "../pages/History";
import Employee from "../pages/Employee";

const AuthWrapper = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem("token");
      if (token && isTokenExpired(token)) {
        handleLogout();
      }
    };

    checkTokenExpiration();
    const intervalId = setInterval(checkTokenExpiration, 60000); // cek setiap 60 dtk

    return () => clearInterval(intervalId);
  }, [navigate]);

  const handleLogout = () => {
    removeAuthToken();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return <>{children}</>;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isAuthenticated = localStorage.getItem("token");

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthWrapper>{children}</AuthWrapper>;
};

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
    element: (
      <ProtectedRoute allowedRoles={["admin"]}>
        <Register />
      </ProtectedRoute>
    ),
  },
  {
    path: "/contact-admin",
    element: <ContactAdmin />,
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
