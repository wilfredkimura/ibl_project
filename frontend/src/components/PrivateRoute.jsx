import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.jsx";

const PrivateRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  if (!user || !token) return <Navigate to="/login" />;
  if (adminOnly && !user.is_admin) return <Navigate to="/" />;
  return children;
};

export default PrivateRoute;
