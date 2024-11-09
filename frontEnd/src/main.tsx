import { ThemeProvider } from "@emotion/react";
import { createTheme } from "@mui/material";
import axios from "axios";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import "./index.css";

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.withCredentials = true; // it will help to exchange cookies with bankend

const theme = createTheme({
  typography: {
    fontFamily: "Roboto Slab,serif",
    // allVariants: { color: "Black" },
  },
});
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
