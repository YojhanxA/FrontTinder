import { socket } from "../socket";

export const ConnetionManager = () => {
  const connect = () => {
    socket.connect();
  };

  const disconnect = () => {
    socket.disconnect();
  };

  return (
    <>
      <button className="btn btn-primary" onClick={connect}>
        Connect
      </button>
      <button className="btn btn-danger" onClick={disconnect}>
        Disconnect
      </button>
    </>
  );
};
