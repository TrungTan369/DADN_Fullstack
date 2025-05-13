import { io } from "socket.io-client";

// connect to backend
const socket = io("http://localhost:5000", {
    transports: ["websocket"], // để ổn định kết nối
    withCredentials: true,
  })

socket.on("connect", () => {
    console.log("Connected to socket server:", socket.id);
});


export default socket;
