"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#0ea5e9" },
    secondary: { main: "#f97316" },
    background: { default: "#f8fafc", paper: "#fff" },
    error: { main: "#ef4444" }
  },
  shape: { borderRadius: 14 },
  typography: {
    fontFamily: '"Inter","Roboto","Helvetica","Arial",sans-serif',
    h1: { fontWeight: 700 },
    h2: { fontWeight: 700 },
    button: { textTransform: "none", fontWeight: 600 }
  }
});

export default theme;