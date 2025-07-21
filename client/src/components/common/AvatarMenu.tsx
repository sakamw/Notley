import { IconButton, Avatar, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { useAuth } from "../../store/useStore";
import { useNavigate } from "react-router-dom";

interface AvatarMenuProps {
  user: {
    avatar?: string;
    firstName?: string;
    lastName?: string;
  } | null;
}

const AvatarMenu = ({ user }: AvatarMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logoutUser } = useAuth();
  const navigate = useNavigate();

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

  return (
    <>
      <IconButton onClick={handleOpen} size="small" sx={{ ml: 1 }}>
        <Avatar
          src={user?.avatar}
          alt={user?.firstName || "U"}
          sx={{ width: 32, height: 32 }}
        />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        PaperProps={{ sx: { mt: 1.5, minWidth: 180 } }}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem disabled>Change Avatar </MenuItem>
        <MenuItem disabled>Profile </MenuItem>
        <MenuItem onClick={handleLogout}>Logout </MenuItem>
      </Menu>
    </>
  );
};

export default AvatarMenu;
