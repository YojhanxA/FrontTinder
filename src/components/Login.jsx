import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.ok) {
        localStorage.setItem("token", data.token);
        alert("Login exitoso!");
        navigate("/users");
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      console.error("Error de red:", err);
      setError("Error de red o servidor.");
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="mb-4 text-center fw-bold">Iniciar Sesión</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="ejemplo@mail.com"
            />
          </div>

          <div className="mb-4">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100 mb-3"
            disabled={loading}
          >
            {loading ? "Cargando..." : "Ingresar"}
          </button>
        </form>

        <hr className="my-4" />

        <button
          type="button"
          className="btn btn-outline-secondary w-100"
          onClick={() => navigate("/register")}
        >
          Registrarse
        </button>
      </div>
    </div>
  );
};