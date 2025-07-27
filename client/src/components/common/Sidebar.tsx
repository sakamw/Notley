import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Typography,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import EditNoteIcon from "@mui/icons-material/EditNote";
import LabelIcon from "@mui/icons-material/Label";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { useNavigate } from "react-router-dom";

const navItems = [
  { label: "NOTES", icon: <DescriptionIcon />, route: "/dashboard" },
  { label: "DRAFTS", icon: <DraftsIcon />, route: "/drafts" },
  { label: "TRASH", icon: <DeleteIcon />, route: "/trash" },
  { label: "BOOKMARKS", icon: <BookmarkIcon />, route: "/bookmarks" },
];

const shortcuts = [
  { label: "Edit Notes", icon: <EditNoteIcon />, route: "/edit-notes" },
];

const tags = [
  { label: "reference", icon: <LabelIcon />, route: "/tags/reference" },
];

interface SidebarProps {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const Sidebar = ({ collapsed, setCollapsed }: SidebarProps) => {
  const navigate = useNavigate();
  return (
    <Box
      sx={{
        width: collapsed ? 64 : 220,
        bgcolor: "#2d3842",
        color: "#fff",
        height: "calc(100vh - 56px)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #1a222b",
        position: "fixed",
        top: 56,
        left: 0,
        zIndex: 1200,
        transition: "width 0.2s cubic-bezier(.4,0,.2,1)",
        overflow: "hidden",
      }}
    >
      <Box sx={{ flex: 1, minHeight: 0, overflowY: "auto" }}>
        <List sx={{ pt: 2 }}>
          {navItems.map((item) => (
            <Tooltip
              title={collapsed ? item.label : ""}
              placement="right"
              key={item.label}
            >
              <ListItemButton
                sx={{ py: 1.2 }}
                onClick={() => navigate(item.route)}
              >
                <ListItemIcon
                  sx={{
                    color: "#b0b8c1",
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: {
                        fontWeight: 600,
                        fontSize: 13,
                        display: { xs: "none", sm: "block" },
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
          <Divider sx={{ my: 2, bgcolor: "#313a44" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#b0b8c1",
              pl: collapsed ? 0 : 2,
              display: collapsed ? "none" : "block",
              fontSize: 11,
            }}
          >
            SHORTCUTS
          </Typography>
          {shortcuts.map((item) => (
            <Tooltip
              title={collapsed ? item.label : ""}
              placement="right"
              key={item.label}
            >
              <ListItemButton
                sx={{ py: 1 }}
                onClick={() => navigate(item.route)}
              >
                <ListItemIcon
                  sx={{
                    color: "#b0b8c1",
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: { fontSize: 13 },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
          <Divider sx={{ my: 2, bgcolor: "#313a44" }} />
          <Typography
            variant="caption"
            sx={{
              color: "#b0b8c1",
              pl: collapsed ? 0 : 2,
              display: collapsed ? "none" : "block",
              fontSize: 11,
            }}
          >
            TAGS
          </Typography>
          {tags.map((item) => (
            <Tooltip
              title={collapsed ? item.label : ""}
              placement="right"
              key={item.label}
            >
              <ListItemButton
                sx={{ py: 1 }}
                onClick={() => navigate(item.route)}
              >
                <ListItemIcon
                  sx={{
                    color: "#b0b8c1",
                    minWidth: 0,
                    mr: collapsed ? 0 : 2,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    slotProps={{
                      primary: { fontSize: 13 },
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>
      <Box
        sx={{
          p: 1,
          display: "flex",
          justifyContent: collapsed ? "center" : "flex-end",
          borderTop: "1px solid #1a222b",
          bgcolor: "#2d3842",
          flexShrink: 0,
          position: "static",
          width: "100%",
        }}
      >
        <IconButton
          onClick={() => setCollapsed(!collapsed)}
          sx={{ color: "#b0b8c1" }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  );
};

export default Sidebar;
