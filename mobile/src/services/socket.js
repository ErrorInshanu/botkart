import { io } from 'socket.io-client';

const BASE_URL = 'https://botkart.onrender.com';

let socket = null;

export const connectSocket = () => {
  if (socket?.connected) return socket;

  socket = io(BASE_URL, {
    transports: ['polling'],
    upgrade: false,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  socket.on('connect', () => console.log('[Socket] Connected:', socket.id));
  socket.on('disconnect', () => console.log('[Socket] Disconnected'));
  socket.on('connect_error', (err) => console.log('[Socket] Error:', err.message));

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};