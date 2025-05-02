import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatApp } from "./ChatApp";
import { Login } from "./components/Login";

// Renderizamos el componente de rutas
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatApp />} />
      </Routes>
    </Router>
  </StrictMode>
);
