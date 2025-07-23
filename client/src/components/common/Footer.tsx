import {
  Box,
  Typography,
  Container,
  Link,
  IconButton,
  Divider,
  Stack,
} from "@mui/material";
import { Description, Twitter, GitHub, LinkedIn } from "@mui/icons-material";

function Footer() {
  return (
    <Box sx={{ bgcolor: "grey.50", py: 6 }}>
      <Container maxWidth="lg">
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={4}
          sx={{ mb: 4 }}
        >
          <Box flex={1} sx={{ mb: { xs: 2, md: 0 } }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <Description sx={{ color: "primary.main" }} />
              <Typography variant="h6" component="div">
                Notely
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              The intelligent note-taking app that helps you capture, organize,
              and find your ideas instantly.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <Twitter />
              </IconButton>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <GitHub />
              </IconButton>
              <IconButton size="small" sx={{ color: "text.secondary" }}>
                <LinkedIn />
              </IconButton>
            </Box>
          </Box>
          {/* Company Links */}
          <Box flex={1}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
              Company
            </Typography>
            <Stack spacing={1}>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                About
              </Link>
              <Link
                href="#"
                color="text.secondary"
                underline="hover"
                variant="body2"
              >
                Contact
              </Link>
            </Stack>
          </Box>
        </Stack>
        <Divider sx={{ my: 4 }} />
        <Box textAlign="center">
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Notely. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
