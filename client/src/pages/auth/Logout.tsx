import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/useStore";
import { Box, CircularProgress, Typography } from "@mui/material";
import axiosInstance from "../../api/axios";

const Logout = () => {
  const navigate = useNavigate();
  const { logoutUser } = useAuth();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await axiosInstance.post("/auth/logout");
      } catch (error) {
        console.error("Logout error:", error);
      } finally {
        localStorage.removeItem("authToken");
        logoutUser();
        navigate("/");
      }
    };

    performLogout();
  }, [logoutUser, navigate]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="50vh"
      gap={2}
    >
      <CircularProgress />
      <Typography variant="body1" color="text.secondary">
        Logging out...
      </Typography>
    </Box>
  );
};

export default Logout;
