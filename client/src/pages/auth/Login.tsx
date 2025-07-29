import { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../store/useStore";
import { useEffect } from "react";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("activated")) {
      toast.success("Email activated successfully!");
    }
  }, [location]);

  const { isPending, mutate } = useMutation({
    mutationKey: ["login-user"],
    mutationFn: async (loginDetails: {
      identifier: string;
      password: string;
    }) => {
      const response = await axiosInstance.post("/auth/login", loginDetails);
      return response.data;
    },
    onError: (err: unknown) => {
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
        const message =
          (err.response.data as { message?: string }).message || "Login failed";
        setFormError(message);
      } else {
        setFormError("Login failed");
      }
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("authToken", data.token);
      }
      setUser(data);
      toast.success("Welcome Back!");
      const from =
        (location.state as { from?: Location })?.from?.pathname || "/dashboard";
      navigate(from, { replace: true });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    mutate({ identifier, password });
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
          Sign In
        </Typography>
        <Typography variant="body2" align="center" color="text.primary" mb={3}>
          Welcome back to Notely
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          {formError && (
            <Typography color="error" fontSize={14} textAlign="center">
              {formError}
            </Typography>
          )}
          {formError ===
            "Account not activated. Please check your email for the activation link." && (
            <Typography color="error" mt={2}>
              {formError} <br />
              <RouterLink to="/resend-activation">
                Resend activation email
              </RouterLink>
            </Typography>
          )}
          <Typography variant="subtitle2" mb={0.5} color="text.primary">
            Email or Username
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your email address or username"
            required
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon color="primary" />
                  </InputAdornment>
                ),
              },
            }}
          />
          <Typography variant="subtitle2" mt={2} mb={0.5} color="text.primary">
            Password
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your password"
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword((s) => !s)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            mt={1}
          >
            <FormControlLabel
              control={<Checkbox />}
              label={
                <Typography variant="body2" color="text.primary">
                  Remember me
                </Typography>
              }
            />
            <Link
              component={RouterLink}
              to="/forgot-password"
              variant="body2"
              color="primary"
            >
              Forgot password?
            </Link>
          </Box>
          <Button
            fullWidth
            variant="contained"
            size="large"
            sx={{ mt: 3, mb: 2 }}
            type="submit"
            disabled={isPending}
          >
            {isPending ? "Signing In..." : "Sign In"}
          </Button>
          <Box display="flex" alignItems="center" mb={2}>
            <Box flex={1} height={1} bgcolor="#e0e0e0" />
            <Typography variant="body2" mx={1} color="text.primary">
              OR
            </Typography>
            <Box flex={1} height={1} bgcolor="#e0e0e0" />
          </Box>
          <Typography align="center" variant="body2" color="text.primary">
            Don&apos;t have an account?{" "}
            <Link component={RouterLink} to="/signup" color="primary">
              Sign up
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
      </Paper>
    </Box>
  );
}

export default Login;
