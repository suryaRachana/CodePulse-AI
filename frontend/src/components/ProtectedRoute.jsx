import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  return children ? children : <Outlet />;
}

export default ProtectedRoute;
