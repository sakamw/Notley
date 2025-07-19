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
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
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
        <Box component="form" noValidate>
          <Typography variant="subtitle2" mb={0.5} color="text.primary">
            Email or Username
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your email address or username"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon color="primary" />
                </InputAdornment>
              ),
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
            InputProps={{
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
          >
            Sign In
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
