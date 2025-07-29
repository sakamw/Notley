import { Box, Typography, Button, Container } from "@mui/material";
import { ArrowForward } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

function Hero() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        pt: { xs: "5.6rem", sm: "6.4rem" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: { xs: 360, md: 420 },
          pt: { xs: 6, md: 8 },
        }}
      >
        <img
          src="/logo.jpg"
          alt="Notely Logo"
          style={{
            width: 180,
            height: 180,
            objectFit: "contain",
            borderRadius: 16,
            marginBottom: 32,
            maxWidth: "100%",
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3.5rem", lg: "4rem" },
            mb: 2,
            lineHeight: 1.15,
            textAlign: "center",
          }}
        >
          Notely helps you to easily and efficiently organize your notes
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
            mb: 3,
            color: "text.secondary",
            maxWidth: 600,
            textAlign: "center",
          }}
        >
          Jot down your thoughts, ideas, and tasks in one place. Enjoy markdown
          support, live preview, and easy publishing.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            component={RouterLink}
            to="/signup"
            size="large"
            endIcon={<ArrowForward />}
            sx={{ px: 4, py: 1.5 }}
          >
            Get Started
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Hero;
