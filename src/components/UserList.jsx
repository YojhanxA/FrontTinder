import React, { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion"; // Import motion for animations

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

      // Obtener una foto según el género (Masculino/Femenino) de randomuser.me
      const fotosPromises = usuariosAPI.map(async (usuario) => {
        const generoFoto =
          usuario.genero?.toLowerCase() === "masculino" ? "male" : "female"; // randomuser.me uses 'male'/'female'

        try {
          const resFoto = await fetch(
            `https://randomuser.me/api/?gender=${generoFoto}` // Fetch a random user from API
          );
          const dataFoto = await resFoto.json();
          return dataFoto.results[0].picture.large; // Extract the large picture URL
        } catch (error) {
          console.error(`Error fetching photo for ${usuario.nombre}:`, error);
          return "https://via.placeholder.com/400x500.png?text=Sin+foto"; // Fallback image
        }
      });

      const fotos = await Promise.all(fotosPromises);

      const usuariosConFotos = usuariosAPI.map((usuario, i) => ({
        ...usuario,
        foto: fotos[i],
      }));

      setUsuarios(usuariosConFotos);
      setIndex(0); // Reset index when new users are fetched
    } catch (error) {
      console.error("Error al traer usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirect to login if no token is found
      return;
    }
    fetchUsuarios();
  }, [ciudad, token, navigate]); // Added navigate to dependency array for completeness

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
      if (data.match) {
        alert("¡Es un Match! 🎉 Ahora puedes chatear.");
      } else {
        // alert(data.message); // Commented out to avoid extra alerts on every swipe
      }
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

  return (
    <>
      <Navbar />
      <div className="container d-flex flex-column align-items-center justify-content-center min-vh-100 pt-5">
        <h2 className="display-5 text-center mb-4 text-white text-shadow-sm">Descubre personas</h2>

        <select
          className="form-select mb-4 text-center w-100 w-md-50"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          style={{ maxWidth: '300px' }}
        >
          {ciudadesDisponibles.map((ciudadItem) => (
            <option key={ciudadItem} value={ciudadItem}>
              {ciudadItem.charAt(0).toUpperCase() + ciudadItem.slice(1)}
            </option>
          ))}
        </select>

        {usuarios.length === 0 || index >= usuarios.length ? (
          <div className="text-center mt-5 text-white">
            <p className="lead">Se acabaron los usuarios para mostrar en esta ciudad.</p>
            <p>¡Intenta cambiar la ciudad o vuelve más tarde!</p>
          </div>
        ) : (
          <>
            <motion.div
              key={usuarios[index].id} // Key prop for re-rendering/animation
              initial={{ opacity: 0, scale: 0.8, rotate: 10 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotate: -10 }}
              transition={{ duration: 0.3 }}
              className="card shadow mb-4 user-card"
              style={{ width: "100%", maxWidth: "400px", height: "500px" }}
            >
              <img
                src={usuarios[index].foto}
                className="card-img-top object-fit-cover"
                alt={`Foto de ${usuarios[index].nombre || "usuario"}`}
              />
              <div className="card-img-overlay d-flex flex-column justify-content-end">
                <h5 className="card-title">
                  {usuarios[index].nombre}, {usuarios[index].edad}
                </h5>
                <p className="card-text">
                  {usuarios[index].ciudad}
                </p>
              </div>
            </motion.div>

            <div className="d-flex gap-4 swipe-buttons">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn swipe-button dislike"
                onClick={() => handleSwipe("dislike")}
              >
                <X size={32} />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="btn swipe-button like"
                onClick={() => handleSwipe("like")}
              >
                <Heart size={32} />
              </motion.button>
            </div>
          </>
        )}
      </div>
    </>
  );
};