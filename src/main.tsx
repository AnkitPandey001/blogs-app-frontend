import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

createRoot(document.getElementById("root")!).render(
 
 <BrowserRouter>
     <ThemeProvider theme={theme}>
      <App />
      <ToastContainer/>
    </ThemeProvider>
  </BrowserRouter>
);
