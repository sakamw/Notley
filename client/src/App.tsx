import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Header from "./pages/Header";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3d82f5",
    },
    background: {
      default: "#f0f6ff",
      paper: "#fff",
    },
    text: {
      primary: "#191b2b",
      secondary: "#0172fa",
    },
  },
  typography: {
    fontFamily: '"Times New Roman", serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
