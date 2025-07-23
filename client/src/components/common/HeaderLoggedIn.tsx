import {
  AppBar,
  Toolbar,
  Box,
  Button,
  Stack,
  IconButton,
  useMediaQuery,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useAuth, useSidebar } from "../../store/useStore";
import AvatarMenu from "./AvatarMenu";
import Sidebar from "./Sidebar";
import DrawerMenu from "./Drawer";
import { useState } from "react";
import NoteSearch from "../entries/NoteSearch";

function HeaderLoggedIn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <>
      {/* Sidebar only on md+ screens */}
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          setCollapsed={setSidebarCollapsed}
        />
      )}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#2d3842",
          borderBottom: "1px solid #232c34",
          zIndex: 1000,
          height: 56,
          left: 0,
          width: "100vw",
        }}
      >
        <Toolbar
          sx={{
            minHeight: 56,
            px: 2,
            display: "flex",
            justifyContent: "space-between",
            transition: "padding-left 0.2s cubic-bezier(.4,0,.2,1)",
            pl: { xs: 0, sm: `${sidebarWidth}px` },
          }}
        >
          {/* Logo and Welcome */}
          <Box sx={{ display: "flex", alignItems: "center", minWidth: 48 }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={() => setDrawerOpen(true)}
                sx={{ mr: 1, ml: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <img
                src="/logo.jpg"
                alt="Logo"
                style={{
                  height: 32,
                  marginRight: 12,
                  verticalAlign: "middle",
                  borderRadius: 2,
                }}
              />
            </Box>
            <Box
              sx={{
                color: "#fff",
                fontWeight: 500,
                fontSize: 18,
                ml: 1,
                display: { xs: "none", sm: "block" },
              }}
            >
              {user?.firstName ? `Welcome back, ${user.firstName}` : ""}
            </Box>
          </Box>
          {/* Search Bar */}
          <Box
            sx={{
              flex: 1,
              display: { xs: "none", sm: "flex" },
              justifyContent: "center",
              mx: 2,
            }}
          >
            <NoteSearch />
          </Box>
          {/* Right Side: New Note Button & Avatar */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box sx={{ display: { xs: "none", sm: "block" } }}>
              <Button
                variant="contained"
                startIcon={<NoteAddIcon sx={{ fontSize: 22 }} />}
                sx={{
                  bgcolor: "#3d82f5",
                  color: "#fff",
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 1.5,
                  boxShadow: "none",
                  minWidth: 110,
                  px: 2.5,
                  fontSize: 16,
                  height: 40,
                  "& .MuiButton-startIcon": {
                    mr: 1,
                  },
                  "&:hover": { bgcolor: "#2563eb" },
                }}
                onClick={() => navigate("/notes/new")}
              >
                New note
              </Button>
            </Box>
            <Box
              sx={{
                "& .MuiAvatar-root": {
                  width: { xs: 32, sm: 40 },
                  height: { xs: 32, sm: 40 },
                },
              }}
            >
              <AvatarMenu />
            </Box>
          </Stack>
        </Toolbar>
      </AppBar>
      {/* Drawer for mobile */}
      {isMobile && (
        <DrawerMenu open={drawerOpen} onClose={() => setDrawerOpen(false)} />
      )}
    </>
  );
}

export default HeaderLoggedIn;
