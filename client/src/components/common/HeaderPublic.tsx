import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Link,
  Stack,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function HeaderPublic() {
  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0" }}
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
          NoteMaster
        </Typography>
        {/* Navigation Links */}
        <Stack
          direction="row"
          spacing={3}
          sx={{ display: { xs: "none", md: "flex" } }}
        >
          <Link
            component={RouterLink}
            to="#features"
            color="text.primary"
            underline="none"
            fontWeight={500}
            sx={{ fontSize: 16 }}
          >
            Features
          </Link>
          <Link
            component={RouterLink}
            to="#pricing"
            color="text.primary"
            underline="none"
            fontWeight={500}
            sx={{ fontSize: 16 }}
          >
            Pricing
          </Link>
          <Link
            component={RouterLink}
            to="#about"
            color="text.primary"
            underline="none"
            fontWeight={500}
            sx={{ fontSize: 16 }}
          >
            About
          </Link>
          <Link
            component={RouterLink}
            to="#contact"
            color="text.primary"
            underline="none"
            fontWeight={500}
            sx={{ fontSize: 16 }}
          >
            Contact
          </Link>
        </Stack>
        {/* Auth Buttons */}
        <Box>
          <Button
            component={RouterLink}
            to="/"
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
