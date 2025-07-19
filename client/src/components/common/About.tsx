import { Box, Typography, Container } from "@mui/material";

function About() {
  return (
    <Box
      id="about"
      py={10}
      bgcolor="background.paper"
      sx={{ scrollMarginTop: { xs: "56px", sm: "64px" } }}
    >
      <Container maxWidth="md">
        <Typography variant="h3" align="center" fontWeight={700} mb={4}>
          About Notely
        </Typography>
        <Typography
          variant="h6"
          align="center"
          sx={{ color: "#444444" }}
          mb={3}
        >
          Notely is built for thinkers, creators, and doers. Our mission is to
          help you capture, organize, and rediscover your ideas effortlessly—so
          you can focus on what matters most.
        </Typography>
        <Typography align="center" sx={{ color: "#444444" }}>
          Whether you’re a student, professional, or creative, Notely empowers
          you to take control of your notes and boost your productivity. We
          believe in privacy, simplicity, and the power of organized thoughts.
        </Typography>
      </Container>
    </Box>
  );
}

export default About;
