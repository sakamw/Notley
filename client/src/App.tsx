import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Header from "./pages/Header";
import Footer from "./components/common/Footer";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NewNote from "./pages/entries/NewNote";
import EditNotes from "./pages/entries/EditNotes";
import EditNote from "./pages/entries/EditNote";
import { useAuth } from "./store/useStore";
import { useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Trash from "./pages/Trash";
import Bookmarks from "./pages/Bookmarks";
import Drafts from "./pages/Drafts";
import TagNotes from "./pages/TagNotes";
import NoteView from "./pages/entries/NoteView";

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
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#191b2b",
          "&::placeholder": {
            color: "#a0a0a0",
            opacity: 1,
          },
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-center" />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ThemeProvider>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/tags/:tag" element={<TagNotes />} />
        <Route path="/notes/new" element={<NewNote />} />
        <Route path="/edit-notes" element={<EditNotes />} />
        <Route path="/edit-note/:id" element={<EditNote />} />
        <Route path="/note/:id" element={<NoteView />} />
      </Routes>
      {!isAuthenticated &&
        !["/login", "/signup"].includes(location.pathname) && <Footer />}
    </>
  );
}

export default App;
