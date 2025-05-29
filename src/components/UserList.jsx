import React, { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar"; // <-- Importa aquí
export const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [index, setIndex] = useState(0);
  const [ciudad, setCiudad] = useState("todos");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const ciudadesDisponibles = [
    "todos",
    "Bogotá",
    "Medellín",
    "Cali",
    "Barranquilla",
    "Cartagena",
  ];
  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/users?ciudad=${
          ciudadesDisponibles.includes(ciudad) ? ciudad : "todos"
        }`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const usuariosAPI = data.usuarios || [];

      // Obtener una foto según el género (Masculino/Femenino → male/female)
      const fotosPromises = usuariosAPI.map(async (usuario) => {
        const generoFoto =
          usuario.genero?.toLowerCase() === "masculino" ? "male" : "female";

        try {
          const resFoto = await fetch(
            `https://randomuser.me/api/?gender=${generoFoto}`
          );
          const dataFoto = await resFoto.json();
          return dataFoto.results[0].picture.large;
        } catch {
          return "https://via.placeholder.com/400x500.png?text=Sin+foto";
        }
      });

      const fotos = await Promise.all(fotosPromises);

      const usuariosConFotos = usuariosAPI.map((usuario, i) => ({
        ...usuario,
        foto: fotos[i],
      }));

      setUsuarios(usuariosConFotos);
      setIndex(0);
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, [ciudad]);

  const handleSwipe = async (accion) => {
    if (index >= usuarios.length) return;
    const destinoId = usuarios[index].id;

    try {
      const res = await fetch("http://localhost:3000/api/swipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ destinoId, accion }),
      });

      const data = await res.json();
      alert(data.message);
      setIndex((prev) => prev + 1);
    } catch (error) {
      console.error("Error en swipe:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading)
    return <div className="text-center mt-5">Cargando usuarios...</div>;
  if (usuarios.length === 0)
    return <div className="text-center mt-5">No hay usuarios disponibles.</div>;
  if (index >= usuarios.length)
    return (
      <div className="text-center mt-5">
        Se acabaron los usuarios para mostrar.
      </div>
    );

  const usuario = usuarios[index];
  return (
    <>
      <Navbar /> {/* <--- Esto es lo nuevo */}
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 pt-5">
        <h2 className="display-5 text-center mb-4">Descubre personas</h2>

        <select
          className="form-select mb-4 text-center w-100 w-md-50"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
        >
          {ciudadesDisponibles.map((ciudadItem) => (
            <option key={ciudadItem} value={ciudadItem}>
              {ciudadItem.charAt(0).toUpperCase() + ciudadItem.slice(1)}
            </option>
          ))}
        </select>

        {loading ? (
          <div className="text-center">Cargando usuarios...</div>
        ) : usuarios.length === 0 || index >= usuarios.length ? (
          <div className="text-center mt-5">
            Se acabaron los usuarios para mostrar.
          </div>
        ) : (
          <>
            <div
              className="card shadow mb-4"
              style={{ width: "100%", maxWidth: "400px", height: "500px" }}
            >
              <img
                src={usuarios[index].foto}
                className="card-img-top h-100 object-fit-cover"
                alt={`Foto de ${usuarios[index].nombre || "usuario"}`}
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end bg-gradient">
                <h5 className="card-title text-white fw-bold">
                  {usuarios[index].nombre}
                </h5>
                <p className="card-text text-white">
                  {usuarios[index].edad} años • {usuarios[index].ciudad}
                </p>
              </div>
            </div>

            <div className="d-flex gap-4">
              <button
                className="btn btn-outline-danger rounded-circle p-3"
                onClick={() => handleSwipe("dislike")}
              >
                <X size={32} />
              </button>
              <button
                className="btn btn-outline-success rounded-circle p-3"
                onClick={() => handleSwipe("like")}
              >
                <Heart size={32} />
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
