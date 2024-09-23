import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import { Dashboard } from "../pages/Dashboard";
import ProtectedRoute from "./ProtectedRoute";
import Accuracy from "../pages/Accuracy";

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
]);

function Router() {
  return <RouterProvider router={router} />;
}

export default Router;
