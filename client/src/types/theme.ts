import { createTheme, type Theme } from "@mui/material";

export const staticLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#3d82f5" },
    background: { default: "#f0f6ff", paper: "#fff" },
    text: { primary: "#191b2b", secondary: "#0172fa" },
  },
  typography: { fontFamily: '"Montserrat", sans-serif' },
  components: {
    MuiInputBase: {
      styleOverrides: {
        input: {
          color: "#191b2b",
          "&::placeholder": { color: "#a0a0a0", opacity: 1 },
        },
      },
    },
  },
});

// This will check for stored theme in the system and work with that theme in the notely-app
export function getPreferredTheme(THEME_KEY: string): "light" | "dark" {
  const stored = localStorage.getItem(THEME_KEY);
  if (stored === "light" || stored === "dark") return stored;
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  }
  return "light";
}

export function createDynamicTheme(themeMode: "light" | "dark"): Theme {
  return createTheme({
    palette: {
      mode: themeMode,
      primary: { main: "#3d82f5" },
      background: {
        default: themeMode === "dark" ? "#181a20" : "#f0f6ff",
        paper: themeMode === "dark" ? "#232c34" : "#fff",
      },
      text: {
        primary: themeMode === "dark" ? "#f8fafc" : "#191b2b",
        secondary: themeMode === "dark" ? "#60a5fa" : "#0172fa",
        disabled: themeMode === "dark" ? "#b0b8c1" : undefined,
      },
    },
    typography: { fontFamily: '"Montserrat", sans-serif' },
    components: {
      MuiInputBase: {
        styleOverrides: {
          input: {
            color: themeMode === "dark" ? "#f8fafc" : "#191b2b",
            "&::placeholder": {
              color: themeMode === "dark" ? "#b0b8c1" : "#a0a0a0",
              opacity: 1,
            },
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundColor: themeMode === "dark" ? "#232c34" : undefined,
            color: themeMode === "dark" ? "#f8fafc" : undefined,
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            color: themeMode === "dark" ? "#f8fafc" : undefined,
            backgroundColor: themeMode === "dark" ? undefined : undefined,
            "&.Mui-disabled": {
              color: themeMode === "dark" ? "#b0b8c1" : undefined,
            },
          },
        },
      },
      MuiTypography: {
        styleOverrides: {
          root: {
            color: themeMode === "dark" ? "#f8fafc" : undefined,
          },
        },
      },
    },
  });
}
