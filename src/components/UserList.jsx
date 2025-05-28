import React, { useEffect, useState } from "react";
import { Heart, X } from "lucide-react";
import { useNavigate } from "react-router-dom"; // para redirigir después de cerrar sesión

export const UserList = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [index, setIndex] = useState(0);
  const [ciudad, setCiudad] = useState("todos");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const fetchUsuarios = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/api/users?ciudad=${ciudad}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      const usuariosAPI = data.usuarios || [];

      const resFotos = await fetch(
        `https://randomuser.me/api/?results=${usuariosAPI.length}`
      );
      const dataFotos = await resFotos.json();
      const fotos = dataFotos.results.map((u) => u.picture.large);

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
    navigate("/login"); // redirige al login o página de inicio
  };

  if (loading)
    return (
      <p className="text-center mt-10 text-gray-500 font-semibold">
        Cargando usuarios...
      </p>
    );

  if (usuarios.length === 0)
    return (
      <p className="text-center mt-10 text-gray-600 font-semibold">
        No hay usuarios disponibles.
      </p>
    );

  if (index >= usuarios.length)
    return (
      <p className="text-center mt-10 text-gray-600 font-semibold">
        Se acabaron los usuarios para mostrar.
      </p>
    );

  const usuario = usuarios[index];

  return (
    <>
      {/* Barra superior */}
      <nav className="bg-white shadow-md w-full px-6 py-4 flex justify-between items-center fixed top-0 left-0 z-50">
        <h1 className="text-xl font-bold text-indigo-600">💘 Tinder Clone</h1>
        <div className="flex space-x-6">
          <button
            onClick={() => navigate("/chat")}
            className="text-gray-700 font-medium hover:text-indigo-500 transition"
          >
            Chat
          </button>
          <button
            onClick={handleLogout}
            className="text-red-500 font-medium hover:text-red-700 transition"
          >
            Salir
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="pt-24 flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4 py-10">
        <h2 className="text-4xl font-extrabold text-center text-gray-900 mb-6">
          Descubre personas
        </h2>

        <input
          id="ciudad"
          type="text"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="w-full max-w-md mb-6 border border-gray-300 rounded-xl px-5 py-3 text-lg text-center focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Filtrar por ciudad..."
        />

        <div className="w-full max-w-md flex flex-col items-center">
          <div className="relative w-full h-[500px] bg-white rounded-3xl shadow-2xl overflow-hidden mb-6">
            <img
              src={usuario.foto}
              alt={`Foto de ${usuario.nombre || "usuario"}`}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 w-full bg-gradient-to-t from-black via-black/70 to-transparent p-6 text-black">
              <h3 className="text-2xl font-bold">{usuario.nombre}</h3>
              <p className="text-lg">
                {usuario.edad} años • {usuario.ciudad}
              </p>
            </div>
          </div>

          <div className="flex gap-8">
            <button
              onClick={() => handleSwipe("dislike")}
              className="w-20 h-20 bg-white border-4 border-red-500 text-red-500 rounded-full shadow-lg flex items-center justify-center hover:bg-red-100 transition"
            >
              <X size={36} />
            </button>
            <button
              onClick={() => handleSwipe("like")}
              className="w-20 h-20 bg-white border-4 border-green-500 text-green-500 rounded-full shadow-lg flex items-center justify-center hover:bg-green-100 transition"
            >
              <Heart size={36} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
