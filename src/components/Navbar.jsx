// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
      <div className="container">
        <span className="navbar-brand fw-bold">💘 Tinder Clone</span>
        <div>
          <button
            className="btn btn-outline-primary me-2"
            onClick={() => navigate("/chat")}
          >
            Chat
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
