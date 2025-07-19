import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Snackbar,
  Alert,
  IconButton,
  useTheme,
  Paper,
  Link,
} from "@mui/material";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface User {
  firstName: string;
  lastName: string;
  email: string;
  username: string;
  password: string;
}

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confPass, setConfPass] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();

  const { isPending, mutate } = useMutation({
    mutationKey: ["signup-user"],
    mutationFn: async (newUser: User) => {
      try {
        const response = await axiosInstance.post("/auth/register", newUser);
        return response.data;
      } catch (err: unknown) {
        if (
          err &&
          typeof err === "object" &&
          "response" in err &&
          err.response &&
          typeof err.response === "object" &&
          "data" in err.response &&
          err.response.data &&
          typeof err.response.data === "object" &&
          "message" in err.response.data
        ) {
          throw new Error(
            (err.response.data as { message?: string }).message ||
              "Signup failed"
          );
        } else {
          throw new Error("Signup failed");
        }
      }
    },
    onError: (error: unknown) => {
      if (error instanceof Error && error.message) {
        setError(error.message);
      } else {
        setError("Signup failed");
      }
      setOpenSnackbar(true);
    },
    onSuccess: (data) => {
      setError("");
      setSuccess(data.message || "Signup successful!");
      setOpenSnackbar(true);
      setTimeout(() => {
        setSuccess("Redirecting you to login page...");
        setOpenSnackbar(true);
        setTimeout(() => {
          setOpenSnackbar(false);
          navigate("/login");
        }, 1500);
      }, 1500);
    },
  });

  function handleSignUp() {
    setError("");
    setSuccess("");
    if (
      !firstName ||
      !lastName ||
      !email ||
      !username ||
      !password ||
      !confPass
    ) {
      setError("Please fill in all fields.");
      setOpenSnackbar(true);
      return;
    }
    if (password !== confPass) {
      setError("Passwords and confirm password should match");
      setOpenSnackbar(true);
      return;
    }
    const newUser = { firstName, lastName, email, username, password };
    mutate(newUser);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSignUp();
  }

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor={theme.palette.background.default}
      px={2}
      sx={{ mt: { xs: "5.6rem", sm: "6.4rem" } }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 4,
          width: { xs: "100%", sm: 370, md: 420 },
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
          Sign Up
        </Typography>
        <Typography variant="body2" align="center" color="text.primary" mb={3}>
          Create your Notely account
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Username"
            fullWidth
            margin="dense"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            sx={{ mt: 2 }}
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowPassword((s) => !s)}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <TextField
            label="Confirm Password"
            type={showConfPassword ? "text" : "password"}
            fullWidth
            margin="dense"
            required
            value={confPass}
            onChange={(e) => setConfPass(e.target.value)}
            sx={{ mt: 2 }}
            InputProps={{
              endAdornment: (
                <IconButton
                  onClick={() => setShowConfPassword((s) => !s)}
                  edge="end"
                >
                  {showConfPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, mb: 2 }}
            disabled={isPending}
          >
            {isPending ? "Signing Up..." : "Sign Up"}
          </Button>
          <Typography align="center" variant="body2" color="text.primary">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login" color="primary">
              Sign in
            </Link>
          </Typography>
          <Box mt={2}>
            <Link
              component={RouterLink}
              to="/"
              variant="body2"
              color="text.secondary"
            >
              &larr; Back to Home
            </Link>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          {error ? (
            <Alert severity="error" onClose={() => setOpenSnackbar(false)}>
              {error}
            </Alert>
          ) : (
            <Alert severity="success" onClose={() => setOpenSnackbar(false)}>
              {success}
            </Alert>
          )}
        </Snackbar>
      </Paper>
    </Box>
  );
};

export default Signup;
