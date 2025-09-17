import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// Brown & Beige palette matching index.css
const primaryMain = "#A0522D"; // Sienna
const accent = "#8B4513"; // SaddleBrown
const beige = "#F5F5DC"; // Background
const darkText = "#3D2B1F"; // Text
const hoverTan = "#D2B48C"; // Hover/tint

let baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: primaryMain,
      dark: accent,
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: accent,
      contrastText: "#FFFFFF",
    },
    background: {
      default: beige,
      paper: "#FFFFFF",
    },
    text: {
      primary: darkText,
      secondary: "rgba(61,43,31,0.72)",
    },
    info: { main: hoverTan },
  },
  typography: {
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    h1: { fontWeight: 500, letterSpacing: "-0.5px" },
    h2: { fontWeight: 500, letterSpacing: "-0.25px" },
    h3: { fontWeight: 500 },
    h4: { fontWeight: 500 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none", fontWeight: 600 },
    body1: { lineHeight: 1.7 },
    body2: { lineHeight: 1.7 },
  },
  shape: {
    borderRadius: 10,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: beige,
          color: darkText,
        },
      },
    },
    MuiAppBar: {
      defaultProps: { color: "primary" },
      styleOverrides: {
        root: {
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        },
      },
    },
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
          paddingBlock: 10,
          '@media (max-width:600px)': {
            paddingInline: 12,
            paddingBlock: 8,
          },
        },
      },
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: { root: { borderRadius: 12, overflow: "hidden" } },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined", fullWidth: true },
    },
    MuiLink: {
      styleOverrides: {
        root: { textDecoration: "none" },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: primaryMain },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            color: primaryMain,
          },
          '@media (max-width:600px)': {
            minWidth: 90,
            paddingInline: 8,
          },
        },
      },
    },
  },
  typography: {
    fontFamily: '"Ubuntu Mono", monospace',
  },
});

export const theme = responsiveFontSizes(baseTheme);
