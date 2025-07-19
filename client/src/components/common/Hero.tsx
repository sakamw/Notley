import { Box, Typography, Button, Container } from "@mui/material";
import { Description, ArrowForward } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

function Hero() {
  return (
    <Container
      maxWidth="lg"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        pt: { xs: "56px", sm: "64px" },
      }}
    >
      <Box
        sx={{
          width: "100%",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            p: 1.5,
            bgcolor: "primary.main",
            color: "primary.contrastText",
            borderRadius: "50%",
            mb: 3,
            display: "inline-flex",
          }}
        >
          <Description sx={{ fontSize: 32 }} />
        </Box>
        <Typography
          variant="h1"
          component="h1"
          sx={{
            mb: 3,
            maxWidth: "50em",
            fontSize: { xs: "2.5rem", md: "3.5rem" },
            fontWeight: 600,
            lineHeight: 1.2,
          }}
        >
          Capture Your Ideas, Organize Your Thoughts
        </Typography>
        <Typography
          variant="h6"
          component="p"
          sx={{
            mb: 4,
            maxWidth: "600px",
            color: "#444444",
            fontSize: "1.1rem",
            fontWeight: 400,
          }}
        >
          The intelligent note-taking app that helps you capture, organize, and
          find your ideas instantly. Perfect for students, professionals, and
          creative minds.
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            gap: 2,
            mb: 2,
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
            Get Started Free
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Hero;
