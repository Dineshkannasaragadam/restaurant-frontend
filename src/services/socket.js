/**
 * Socket.io Client Service
 * Real-time order tracking
 */

import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

let socket = null;

export const initSocket = (token) => {
  if (socket?.connected) return socket;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
  });

  socket.on('connect', () => console.log('Socket connected:', socket.id));
  socket.on('disconnect', (reason) => console.log('Socket disconnected:', reason));
  socket.on('connect_error', (err) => console.warn('Socket error:', err.message));

  return socket;
};

export const disconnectSocket = () => {
  if (socket) { socket.disconnect(); socket = null; }
};

export const getSocket = () => socket;

export const trackOrder = (orderId) => {
  if (socket) socket.emit('track:order', orderId);
};

export const stopTrackingOrder = (orderId) => {
  if (socket) socket.emit('leave:order', orderId);
};

export const onOrderUpdate = (callback) => {
  if (socket) socket.on('order:updated', callback);
  return () => { if (socket) socket.off('order:updated', callback); };
};

export const onNewOrder = (callback) => {
  if (socket) socket.on('order:new', callback);
  return () => { if (socket) socket.off('order:new', callback); };
};
