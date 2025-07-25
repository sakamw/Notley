import { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Snackbar,
  Alert,
  Link,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success",
  );

  const { isPending, mutate } = useMutation({
    mutationKey: ["forgot-password"],
    mutationFn: async (payload: { email: string }) => {
      const response = await axiosInstance.post(
        "/auth/forgot-password",
        payload,
      );
      return response.data;
    },
    onError: () => {
      setSnackbarMsg("Failed to send reset instructions. Please try again.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
    },
    onSuccess: (data) => {
      setSnackbarMsg(data.message || "A reset link has been sent.");
      setSnackbarSeverity("success");
      setOpenSnackbar(true);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setSnackbarMsg("Please enter your email address.");
      setSnackbarSeverity("error");
      setOpenSnackbar(true);
      return;
    }
    mutate({ email });
  };

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
          Enter your email to receive reset link
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            fullWidth
            margin="dense"
            label="Email Address"
            placeholder="Enter your email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Sending..." : "Send Reset link"}
          </Button>
          <Box mt={2}>
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              color="text.secondary"
            >
              &larr; Back to Sign In
            </Link>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbarSeverity}
            onClose={() => setOpenSnackbar(false)}
          >
            {snackbarMsg}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}

export default ForgotPassword;
