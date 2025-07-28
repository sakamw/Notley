import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
  Button,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LabelIcon from "@mui/icons-material/Label";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "Notes", icon: <DescriptionIcon />, route: "/dashboard" },
  { label: "Drafts", icon: <DraftsIcon />, route: "/drafts" },
  { label: "Trash", icon: <DeleteIcon />, route: "/trash" },
  { label: "Bookmarks", icon: <BookmarkIcon />, route: "/bookmarks" },
];

const shortcuts = [
  { label: "Edit Notes", icon: <EditNoteIcon />, route: "/edit-notes" },
];

const tags = [
  { label: "Reference", icon: <LabelIcon />, route: "/tags/reference" },
];

interface DrawerMenuProps {
  open: boolean;
  onClose: () => void;
}

const DrawerMenu: React.FC<DrawerMenuProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const handleNav = (route: string) => {
    navigate(route);
    onClose();
  };
  return (
    <Drawer anchor="left" open={open} onClose={onClose} sx={{ zIndex: 2000 }}>
      <Box sx={{ width: { xs: 180, sm: 200 }, pt: 2 }} role="presentation">
        <Button
          variant="contained"
          startIcon={<NoteAddIcon />}
          sx={{
            bgcolor: "#3d82f5",
            color: "#fff",
            textTransform: "none",
            fontWeight: 600,
            borderRadius: 2,
            mb: 2,
            py: 0.7,
            fontSize: 15,
            minWidth: 0,
            width: "90%",
            mx: "auto",
            boxShadow: "none",
            height: 38,
            "&:hover": { bgcolor: "#2563eb" },
          }}
          onClick={() => handleNav("/notes/new")}
        >
          New Note
        </Button>
        <List>
          {navItems.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleNav(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ pl: 2, color: "#888" }}>
          SHORTCUTS
        </Typography>
        <List>
          {shortcuts.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleNav(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
        <Divider sx={{ my: 1 }} />
        <Typography variant="caption" sx={{ pl: 2, color: "#888" }}>
          TAGS
        </Typography>
        <List>
          {tags.map((item) => (
            <ListItemButton
              key={item.label}
              onClick={() => handleNav(item.route)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default DrawerMenu;
