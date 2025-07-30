import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#e7e4d8",
    },
    secondary: {
      main: "#ffb100",
    },
    error: { main: "#ff5c5c" },
    warning: { main: "#f1c40f" },
    info: { main: "#3498db" },
    success: { main: "#2ecc71" },
    background: {
      default: "#2a2a2a",
    },
  },
  typography: {
    fontFamily: ["Inter", "Roboto", "sans-serif"].join(","),
    button: { textTransform: "none", fontWeight: 600 },
  },
});
