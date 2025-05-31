import { useEffect, useState } from "react";
import { socket } from "./socket";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Import jwtDecode

export const ChatApp = () => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [matchId, setMatchId] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null); // State to store current user's ID
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setCurrentUserId(decodedToken.userId); // Assuming 'userId' is in your token payload
      } catch (error) {
        console.error("Error decoding token:", error);
        // Handle invalid token, e.g., redirect to login
        navigate("/login");
        return;
      }

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
    } else {
      navigate("/login"); // Redirect if no token
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
      <nav className="navbar navbar-expand-lg navbar-light fixed-top shadow-sm">
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

      {/* Main Content */}
      <div className="container pt-5 mt-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-12">
            <div className="card shadow mt-4">
              <div className="card-header">
                <h2 className="text-center mb-0">Chat Room</h2>
              </div>
              <div
                className="card-body chat-body"
                style={{ height: "400px", overflowY: "auto" }}
              >
                <ul className="list-group list-group-flush">
                  {messages.map((message, index) => {
                    const isSent = message.senderId === currentUserId; // Assuming message has senderId
                    return (
                      <li key={index} className="list-group-item">
                        <div className={`chat-bubble-container ${isSent ? "sent" : "received"}`}>
                          <div className={`chat-bubble-content ${isSent ? "sent" : "received"}`}>
                            <div className={`chat-bubble-info ${isSent ? "sent" : "received"}`}>
                              <img
                                src={
                                  message.senderGender?.toLowerCase() === "masculino"
                                    ? "https://randomuser.me/api/portraits/men/75.jpg"
                                    : "https://randomuser.me/api/portraits/women/75.jpg"
                                }
                                className="avatar"
                                alt="Avatar"
                              />
                              <span className="name">
                                {message.senderName || "Usuario"}
                              </span>
                              <span className="timestamp">
                                {message.timestamp
                                  ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                                  : "Hora desconocida"}
                              </span>
                            </div>
                            <p className={`chat-bubble ${isSent ? "sent" : "received"} mb-0`}>
                              {message.message}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
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