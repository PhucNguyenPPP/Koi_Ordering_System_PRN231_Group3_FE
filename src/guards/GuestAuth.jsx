import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

export default function GuestAuth({ children }) {
  const { isAuthenticated, user } = useAuth();
  if (isAuthenticated) {
    if (user && user?.roleName == "Customer") {
      return <Navigate to="/" />;
    } else if (user && user?.roleName == "KoiFarmManager") {
      return <Navigate to="/home-koi-farm-manager" />;
    } else if (user && user?.roleName == "StorageManager") {
      return <Navigate to="/home-storage-manager" />;
    } else if (user && user?.roleName == "Admin") {
      return <Navigate to="/home-admin" />;
    }
    return <Navigate to="/" />;
  }

  return <>{children}</>;
}
