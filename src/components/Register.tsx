import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

type FormState = {
  ciudad: string;
  nombre: string;
  edad: string;
  genero: string;
  preferencias: {
    genero: string[];
    edad: number[];
  };
  ubicacion: string;
  email: string;
  password: string;
};

export const Register = () => {
  const navigate = useNavigate();

  const ciudadesDisponibles = [
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
  ];
  const generosDisponibles = ["Femenino", "Masculino"];
  const [form, setForm] = useState<FormState>({
    ciudad: "",
    nombre: "",
    edad: "",
    genero: "",
    preferencias: {
      genero: [],
      edad: [18, 99],
    },
    ubicacion: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "preferencias.genero") {
      setForm((prev) => ({
        ...prev,
        preferencias: {
          ...prev.preferencias,
          genero: [value],
        },
      }));
    } else if (name === "preferencias.edadMin") {
      setForm((prev) => ({
        ...prev,
        preferencias: {
          ...prev.preferencias,
          edad: [Number(value), prev.preferencias.edad[1]],
        },
      }));
    } else if (name === "preferencias.edadMax") {
      setForm((prev) => ({
        ...prev,
        preferencias: {
          ...prev.preferencias,
          edad: [prev.preferencias.edad[0], Number(value)],
        },
      }));
    } else if (name === "edad") {
      setForm((prev) => ({
        ...prev,
        edad: value,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://localhost:3000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          edad: Number(form.edad),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        alert("Registro exitoso, parce!");
        navigate("/login");
      } else {
        setError(data.message || "Error al registrarse");
      }
    } catch (err) {
      console.error(err);
      setError("Error de red o servidor");
    }

    setLoading(false);
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow" style={{ width: "400px" }}>
        <h2 className="mb-3 text-center">Regístrate</h2>

        <form onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              required
            />
          </div>

          {/* Ciudad */}
          <div className="mb-3">
            <label className="form-label">Ciudad</label>
            <select
              className="form-control"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una ciudad</option>
              {ciudadesDisponibles.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </div>

          {/* Edad */}
          <div className="mb-3">
            <label className="form-label">Edad</label>
            <input
              type="number"
              className="form-control"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              min={18}
              required
            />
          </div>

          {/* Género */}
          <div className="mb-3">
            <label className="form-label">Género</label>
            <select
              className="form-control"
              name="genero"
              value={form.genero}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione su género</option>
              {generosDisponibles.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Preferencia de género */}
          <div className="mb-3">
            <label className="form-label">Preferencia de género</label>
            <select
              className="form-control"
              name="preferencias.genero"
              value={form.preferencias.genero[0] || ""}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una preferencia</option>
              {generosDisponibles.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Rango de edad preferido */}
          <div className="mb-3">
            <label className="form-label">Rango de edad preferido</label>
            <div className="d-flex gap-2">
              <input
                type="number"
                className="form-control"
                name="preferencias.edadMin"
                value={form.preferencias.edad[0]}
                onChange={handleChange}
                placeholder="Edad mínima"
                min={18}
                required
              />
              <input
                type="number"
                className="form-control"
                name="preferencias.edadMax"
                value={form.preferencias.edad[1]}
                onChange={handleChange}
                placeholder="Edad máxima"
                max={99}
                required
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <select
              className="form-control"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              required
            >
              <option value="">Seleccione una ubicación</option>
              {ciudadesDisponibles.map((ciudad) => (
                <option key={ciudad} value={ciudad}>
                  {ciudad}
                </option>
              ))}
            </select>
          </div>

          {/* Email */}
          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Error */}
          {error && <div className="alert alert-danger">{error}</div>}

          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrarme"}
          </button>
        </form>
      </div>
    </div>
  );
};
