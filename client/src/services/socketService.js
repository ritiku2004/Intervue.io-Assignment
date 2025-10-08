import { io } from 'socket.io-client';

const URL = 'http://localhost:5001'; // Your backend URL
export const socket = io(URL, {
  autoConnect: false, // Don't connect immediately
});