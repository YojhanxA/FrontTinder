import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";

export const ChatApp = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      fetch("http://localhost:3000/api/match", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.match) {
            setMatchId(data.match.id);
            setMessages(data.messages);
          }
        });
    }

    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("chat message", (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("chat message");
    };
  }, []);

  const handleInputChange = (event) => {
    setNewMessage(event.target.value);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true);

    const token = localStorage.getItem("token");
    if (newMessage.trim() !== "" && matchId) {
      fetch("http://localhost:3000/api/mensaje", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          matchId,
          message: newMessage,
        }),
      })
        .then((res) => res.json())
        .then(() => {
          setNewMessage("");
          setIsLoading(false);
        });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top shadow-sm">
        <div className="container">
          <span className="navbar-brand fw-bold">💬 Chat</span>
          <div>
            <button
              className="btn btn-outline-secondary me-2"
              onClick={() => navigate("/users")}
            >
              Volver
            </button>
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Salir
            </button>
          </div>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className="container pt-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-12">
            <div className="card border-primary shadow-sm mt-4">
              <div className="card-header bg-primary text-white">
                <h2 className="text-center">Chat Room</h2>
              </div>
              <div
                className="card-body chat-body"
                style={{ height: "400px", overflowY: "auto" }}
              >
                <ul className="list-group list-group-flush">
                  {messages.map((message, index) => (
                    <li key={index} className="list-group-item">
                      <div className="d-flex align-items-start mb-2">
                        <img
                          src="https://via.placeholder.com/40"
                          className="rounded-circle me-2"
                          alt="Avatar"
                          width="40"
                          height="40"
                        />
                        <div className="ms-2">
                          <strong>{message.senderName}</strong>
                          <span className="text-muted small ms-2">
                            {message.timestamp
                              ? new Date(message.timestamp).toLocaleTimeString()
                              : "Hora desconocida"}
                          </span>
                        </div>
                      </div>
                      <p className="mb-0 chat-bubble">{message.message}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="card-footer">
                <form onSubmit={onSubmit}>
                  <div className="input-group">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={handleInputChange}
                      placeholder="Escribe un mensaje..."
                      className="form-control"
                      disabled={isLoading || !isConnected}
                    />
                    <button
                      className="btn btn-primary"
                      type="submit"
                      disabled={isLoading || !isConnected}
                    >
                      Enviar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
