import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  Stack,
} from "@mui/material";

function Contact() {
  return (
    <Box
      id="contact"
      py={10}
      bgcolor="background.default"
      sx={{ scrollMarginTop: { xs: "56px", sm: "64px" } }}
    >
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" fontWeight={700} mb={4}>
          Contact Us
        </Typography>
        <Typography align="center" sx={{ color: "#444444" }} mb={4}>
          Have questions or feedback? Fill out the form below and our team will
          get back to you soon.
        </Typography>
        <Box component="form" noValidate autoComplete="off">
          <Stack spacing={3}>
            <TextField label="Name" fullWidth required />
            <TextField label="Email" type="email" fullWidth required />
            <TextField
              label="Message"
              fullWidth
              required
              multiline
              minRows={4}
            />
            <Button
              variant="contained"
              size="large"
              type="submit"
              sx={{ alignSelf: "center", px: 6 }}
            >
              Send Message
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Contact;
