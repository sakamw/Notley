import {
  AppBar,
  Toolbar,
  Box,
  Button,
  InputBase,
  Stack,
  alpha,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import { useNavigate } from "react-router-dom";
import { useAuth, useSidebar } from "../../store/useStore";
import AvatarMenu from "./AvatarMenu";
import Sidebar from "./Sidebar";

function HeaderLoggedIn() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { sidebarCollapsed, setSidebarCollapsed } = useSidebar();
  const sidebarWidth = sidebarCollapsed ? 64 : 220;

  return (
    <>
      <Sidebar
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
      />
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
            <Box
              sx={{
                bgcolor: alpha("#232c34", 0.9),
                borderRadius: 1.5,
                px: 2,
                py: 0.5,
                display: "flex",
                alignItems: "center",
                minWidth: 320,
                maxWidth: 480,
                width: "100%",
              }}
            >
              <SearchIcon sx={{ color: "#b0b8c1", mr: 1 }} />
              <InputBase
                placeholder="Search notes"
                sx={{ color: "#fff", flex: 1, fontSize: 16 }}
                inputProps={{ "aria-label": "search notes" }}
              />
            </Box>
          </Box>
          {/* Right Side: New Note Button & Avatar */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Button
              variant="contained"
              startIcon={<NoteAddIcon />}
              sx={{
                bgcolor: "#3d82f5",
                color: "#fff",
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 1.5,
                boxShadow: "none",
                "&:hover": { bgcolor: "#2563eb" },
                minWidth: 110,
                px: 2.5,
              }}
              onClick={() => navigate("/notes/new")}
            >
              New note
            </Button>
            <AvatarMenu />
          </Stack>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default HeaderLoggedIn;
