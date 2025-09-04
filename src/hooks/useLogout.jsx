import { useAuth } from "./useAuth.jsx";
import { useNavigate } from "react-router-dom";

export const useLogout = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Call backend logout endpoint
      await fetch(
        "http://localhost/skycamp/skycamp-backend/api/auth/logout.php",
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      // Clear local state and redirect
      logout();
      navigate("/login");
    }
  };

  return handleLogout;
};
