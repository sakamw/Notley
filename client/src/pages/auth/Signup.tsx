import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  InputAdornment,
  IconButton,
  Link,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useState } from "react";
import { Link as RouterLink } from "react-router-dom";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
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
        <Box component="form" noValidate>
          <Typography variant="subtitle2" mb={0.5} color="text.primary">
            First Name
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your first name"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle2" mt={2} mb={0.5} color="text.primary">
            Last Name
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your last name"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle2" mt={2} mb={0.5} color="text.primary">
            Username
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Choose a username"
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircleIcon color="primary" />
                </InputAdornment>
              ),
            }}
          />
          <Typography variant="subtitle2" mt={2} mb={0.5} color="text.primary">
            Email Address
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Enter your email address"
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
          <Typography variant="subtitle2" mt={2} mb={0.5} color="text.primary">
            Confirm Password
          </Typography>
          <TextField
            fullWidth
            margin="dense"
            placeholder="Confirm your password"
            type={showConfirm ? "text" : "password"}
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
                    onClick={() => setShowConfirm((s) => !s)}
                    edge="end"
                  >
                    {showConfirm ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
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
            Sign Up
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
      </Paper>
    </Box>
  );
}

export default Signup;
