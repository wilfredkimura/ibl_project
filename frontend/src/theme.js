import { createTheme, responsiveFontSizes } from "@mui/material/styles";

// New palette
const first = "#f0ece2";   // light background
const second = "#dfd3c3";  // surface / secondary
const third = "#c7b198";   // primary accent
const fourth = "#596e79";  // dark accent / text on light

let baseTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: third,
      dark: "#a4886e",
      contrastText: "#ffffff",
    },
    secondary: {
      main: fourth,
      contrastText: "#ffffff",
    },
    background: {
      default: first,
      paper: second,
    },
    text: {
      primary: fourth,
      secondary: "#415159",
    },
    info: { main: second },
  },
  typography: {
    // Priority order per request
    fontFamily: 'Helvetica, "Open Sans", Lato, Montserrat, Arial, sans-serif',
    h1: { fontFamily: 'Montserrat, Helvetica, "Open Sans", Lato, sans-serif', fontWeight: 700 },
    h2: { fontFamily: 'Montserrat, Helvetica, "Open Sans", Lato, sans-serif', fontWeight: 700 },
    h3: { fontFamily: 'Montserrat, Helvetica, "Open Sans", Lato, sans-serif', fontWeight: 600 },
    h4: { fontFamily: 'Montserrat, Helvetica, "Open Sans", Lato, sans-serif', fontWeight: 600 },
    h5: { fontFamily: 'Montserrat, Helvetica, "Open Sans", Lato, sans-serif', fontWeight: 600 },
    h6: { fontFamily: 'Montserrat, Helvetica, "Open Sans", Lato, sans-serif', fontWeight: 600 },
    body1: { fontFamily: 'Helvetica, "Open Sans", Lato, Montserrat, sans-serif', lineHeight: 1.7 },
    body2: { fontFamily: 'Helvetica, "Open Sans", Lato, Montserrat, sans-serif', lineHeight: 1.7 },
    button: { textTransform: "none", fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: first, color: fourth },
        a: { color: fourth },
      },
    },
    MuiAppBar: {
      defaultProps: { color: "primary" },
      styleOverrides: {
        root: { boxShadow: "none", borderBottom: "1px solid rgba(0,0,0,0.06)" },
      },
    },
    MuiButton: {
      defaultProps: { variant: "contained", disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 10,
          paddingInline: 16,
          paddingBlock: 10,
          '@media (max-width:600px)': { paddingInline: 12, paddingBlock: 8 },
        },
        containedPrimary: { backgroundColor: third, '&:hover': { backgroundColor: '#b89f83' } },
        containedSecondary: { backgroundColor: fourth, '&:hover': { backgroundColor: '#46575f' } },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: { root: { backgroundImage: "none" } },
    },
    MuiCard: {
      defaultProps: { elevation: 1 },
      styleOverrides: { root: { borderRadius: 12, overflow: "hidden" } },
    },
    MuiTabs: { styleOverrides: { indicator: { backgroundColor: third } } },
    MuiTab: { styleOverrides: { root: { '&.Mui-selected': { color: third } } } },
    MuiLink: { styleOverrides: { root: { textDecoration: "none" } } },
  },
});

export const theme = responsiveFontSizes(baseTheme);
