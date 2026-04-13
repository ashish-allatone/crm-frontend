import { Navigate } from "react-router-dom";
import { hasPermission } from "../pages/permissionUtil";

const ProtectedRoute = ({ children, module, action }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  if (module && action && !hasPermission(module, action)) {
    return <h3>Access Denied ❌</h3>;
  }

  return children;
};

export default ProtectedRoute;