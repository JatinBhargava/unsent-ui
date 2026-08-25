import { createTheme } from "@mui/material/styles";

/**
 * MUI is used alongside shadcn/ui here, so its theme is tuned to disappear
 * into the Tailwind design tokens rather than assert Material's own look:
 * inherited typeface, Unsent's paper palette, and shadcn's 12px radius.
 */
export const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1c1917" },
    secondary: { main: "#e11d48" },
    background: { default: "#f3f2ee", paper: "#fdfbf5" },
    text: { primary: "#1c1917", secondary: "#78716c" },
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: "inherit",
    button: { textTransform: "none", fontWeight: 500 },
  },
  components: {
    MuiTooltip: {
      defaultProps: { arrow: true },
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1c1917",
          fontSize: 11,
          fontWeight: 500,
          borderRadius: 8,
          padding: "6px 10px",
        },
        arrow: { color: "#1c1917" },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 3,
          borderRadius: 999,
          backgroundColor: "rgba(120, 113, 108, 0.15)",
        },
        bar: { borderRadius: 999 },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontSize: 11, letterSpacing: "0.08em", fontWeight: 600 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 999, alignItems: "center" },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: { borderColor: "rgba(120, 113, 108, 0.22)" },
      },
    },
  },
});
