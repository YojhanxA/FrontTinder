import { io } from "socket.io-client";

const URL = "http://localhost:4000"; // Cambia esto a la URL de tu servidor

export const socket = io(URL);
