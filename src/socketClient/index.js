import { io } from "socket.io-client";

const URL = "http://localhost:3002";
const socket = io.connect(URL, { 
  transports: ['websocket'],
  autoConnect: false   
});

export default socket;