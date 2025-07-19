import { AppBar, Toolbar, Typography, Box, Button, Stack } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function scrollToSection(id: string) {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function HeaderPublic() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => scrollToSection(id), 100);
    }
  }, [location]);

  return (
    <AppBar
      position="fixed"
      color="transparent"
      elevation={scrolled ? 2 : 0}
      sx={{
        borderBottom: ".1rem solid #e0e0e0",
        zIndex: 1000,
        bgcolor: scrolled ? "background.paper" : "transparent",
        transition: "background-color 0.3s, box-shadow 0.3s",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 1, sm: 4 } }}>
        {/* Logo */}
        <Typography
          variant="h6"
          fontWeight={700}
          color="text.primary"
          component={RouterLink}
          to="/"
          sx={{ textDecoration: "none" }}
        >
          NOTELY
        </Typography>
        {/* Navigation Links */}
        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Button
            variant="text"
            onClick={() => scrollToSection("features")}
            sx={{ color: "text.primary", fontWeight: 500, fontSize: 16 }}
          >
            Features
          </Button>
          <Button
            variant="text"
            onClick={() => scrollToSection("about")}
            sx={{ color: "text.primary", fontWeight: 500, fontSize: 16 }}
          >
            About
          </Button>
          <Button
            variant="text"
            onClick={() => scrollToSection("contact")}
            sx={{ color: "text.primary", fontWeight: 500, fontSize: 16 }}
          >
            Contact
          </Button>
        </Stack>
        {/* Auth Buttons */}
        <Box>
          <Button
            component={RouterLink}
            to="/login"
            color="inherit"
            sx={{
              fontWeight: 500,
              mr: 1,
              display: { xs: "none", sm: "inline-flex" },
            }}
          >
            Sign In
          </Button>
          <Button
            component={RouterLink}
            to="/signup"
            variant="contained"
            sx={{ fontWeight: 500, borderRadius: 2 }}
          >
            Get Started
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default HeaderPublic;
