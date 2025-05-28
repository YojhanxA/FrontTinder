import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
      const res = await fetch("http://localhost:3000/api/login", {
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
        alert("Registro exitoso, parcero!");
        navigate("/users");
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
          <div className="mb-3">
            <label className="form-label">Nombre completo</label>
            <input
              type="text"
              className="form-control"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Tu nombre"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Ciudad</label>
            <input
              type="text"
              className="form-control"
              name="ciudad"
              value={form.ciudad}
              onChange={handleChange}
              placeholder="Ciudad"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Edad</label>
            <input
              type="number"
              className="form-control"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              placeholder="18"
              min={18}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Género</label>
            <input
              type="text"
              className="form-control"
              name="genero"
              value={form.genero}
              onChange={handleChange}
              placeholder="M, F, Otro"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Preferencia de género</label>
            <input
              type="text"
              className="form-control"
              name="preferencias.genero"
              onChange={handleChange}
              placeholder="M, F, Otro"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Ubicación</label>
            <input
              type="text"
              className="form-control"
              name="ubicacion"
              value={form.ubicacion}
              onChange={handleChange}
              placeholder="Tu ubicación actual"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Correo electrónico</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="ejemplo@mail.com"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
            />
          </div>

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
