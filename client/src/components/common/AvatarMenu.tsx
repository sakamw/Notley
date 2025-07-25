import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { useState, useRef } from "react";
import { useAuth } from "../../store/useStore";
import { useNavigate } from "react-router-dom";
import {
  uploadImageToCloudinary,
  updateUserAvatarUrl,
} from "../../utils/uploads";
import Snackbar from "@mui/material/Snackbar";

const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user, logoutUser, setUser } = useAuth();
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("authToken");
    logoutUser();
    navigate("/");
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      // Persisting avatar
      const updatedUser = await updateUserAvatarUrl(url);
      setUser(updatedUser);
      setSnackbarOpen(true);
    } catch (e) {
      console.error(e);
      alert("Failed to upload avatar. Please try again.");
    } finally {
      setUploading(false);
      handleClose();
    }
  };

  const handleChangeAvatarClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
        <Avatar
          src={user?.avatar}
          alt={user?.firstName || "U"}
          sx={{ width: 32, height: 32 }}
        >
          {!user?.avatar && (user?.firstName?.[0] || "U")}
        </Avatar>
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1.5, minWidth: 180 } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleChangeAvatarClick} disabled={uploading}>
          {uploading ? <CircularProgress size={20} /> : "Change Avatar"}
        </MenuItem>
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <MenuItem
          onClick={() => {
            handleClose();
            navigate("/profile");
          }}
        >
          Account Setting
        </MenuItem>
        <MenuItem onClick={handleLogout}>Logout </MenuItem>
      </Menu>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message="Image updated successfully"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      />
    </>
  );
};

export default AvatarMenu;
