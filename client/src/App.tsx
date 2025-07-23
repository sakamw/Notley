import { ThemeProvider, CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
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
import Dashboard from "./pages/Dashboard";
import Trash from "./pages/Trash";
import Bookmarks from "./pages/Bookmarks";
import Drafts from "./pages/Drafts";
import TagNotes from "./pages/TagNotes";
import NoteView from "./pages/entries/NoteView";
import ResetPassword from "./pages/auth/ResetPassword";
import ActivateAccount from "./pages/auth/ActivateAccount";
import ResendActivation from "./pages/auth/ResendActivation";
import ProfilePage from "./pages/auth/ProfilePage";
import { useEffect, useMemo, useState } from "react";
import {
  staticLightTheme,
  getPreferredTheme,
  createDynamicTheme,
} from "./types/theme";

const THEME_KEY = "notely_theme";

function ThemedAppContent() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [themeMode, setThemeMode] = useState(getPreferredTheme(THEME_KEY));

  useEffect(() => {
    const handler = () => setThemeMode(getPreferredTheme(THEME_KEY));
    window.addEventListener("notely-theme-change", handler);
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", handler);
    return () => {
      window.removeEventListener("notely-theme-change", handler);
      window
        .matchMedia("(prefers-color-scheme: dark)")
        .removeEventListener("change", handler);
    };
  }, []);

  const dynamicTheme = useMemo(
    () => createDynamicTheme(themeMode),
    [themeMode]
  );

  const alwaysLightRoutes = [
    "/",
    "/login",
    "/signup",
    "/forgot-password",
    "/resend-activation",
  ];
  const isAlwaysLight =
    alwaysLightRoutes.includes(location.pathname) ||
    /^\/reset-password\//.test(location.pathname) ||
    /^\/activate\//.test(location.pathname);

  const theme =
    !isAlwaysLight && isAuthenticated ? dynamicTheme : staticLightTheme;

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-center" />
      <AppContent />
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
        <Route path="/reset-password/:id/:token" element={<ResetPassword />} />
        <Route path="/activate/:id/:token" element={<ActivateAccount />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/trash" element={<Trash />} />
        <Route path="/bookmarks" element={<Bookmarks />} />
        <Route path="/drafts" element={<Drafts />} />
        <Route path="/tags/:tag" element={<TagNotes />} />
        <Route path="/notes/new" element={<NewNote />} />
        <Route path="/edit-notes" element={<EditNotes />} />
        <Route path="/edit-note/:id" element={<EditNote />} />
        <Route path="/note/:id" element={<NoteView />} />
        <Route path="/resend-activation" element={<ResendActivation />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      {!isAuthenticated &&
        ![
          "/login",
          "/signup",
          "/forgot-password",
          "/activate/:id/:token",
        ].includes(location.pathname) && <Footer />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ThemedAppContent />
    </BrowserRouter>
  );
}

export default App;
