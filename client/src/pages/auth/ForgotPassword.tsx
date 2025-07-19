import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import { Link as RouterLink } from "react-router-dom";

function ForgotPassword() {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      px={2}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          width: { xs: "100%", sm: 370 },
          maxWidth: 1,
        }}
      >
        <Typography
          variant="h5"
          fontWeight={700}
          align="center"
          mb={1}
          color="text.primary"
        >
          Reset Password
        </Typography>
        <Typography variant="body2" align="center" color="text.primary" mb={3}>
          Enter your email to receive reset instructions
        </Typography>
        <Box component="form" noValidate>
          <Typography variant="subtitle2" mb={0.5} color="text.primary">
            Email Address
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your email address"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
          >
            Send Reset Instructions
          </Button>
          <Box mt={2}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              color="text.secondary"
            >
              &larr; Back to Sign In
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
