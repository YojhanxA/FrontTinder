export const ConnectionState = ({ isConnected }) => {
  const status = isConnected ? "Connected" : "Disconnect";
  const badgeStatus = isConnected ? "bg-success" : "bg-danger";

  return (
    <span className={`badge rounded-pill ${badgeStatus}`}>{` ${status} `}</span>
  );
};
