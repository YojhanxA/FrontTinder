import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ChatApp } from "./ChatApp";
import { Login } from "./components/Login";
import { UserList } from "./components/UserList";
import { Register } from "./components/Register";

// Renderizamos el componente de rutas
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/chat" element={<ChatApp />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  </StrictMode>
);
