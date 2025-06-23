import {  verifyTokenFromSocketAuth } from '../utils/auth.mjs';
import pool from "../db/index.mjs"

function getSessionIdFromHeaders(headers) {
  return headers['session-id'];
}

function initChatHandler(io) {
  console.log("Chat handler initialized...");

  io.on('connection', async (socket) => {
    console.log("Incoming socket connection...");

    const user = verifyTokenFromSocketAuth(socket.handshake.auth);
    if (!user) {
      console.log('Unauthorized socket connection');
      return socket.disconnect();
    }

    console.log('Authorized socket connection from user:', user.userId);

    const sessionId = socket.handshake.auth.sessionId;
    if (!sessionId) {
      console.log("No session ID provided");
      return;
    }

    const room = sessionId;
    console.log(`Received sessionId:${sessionId}`)
    socket.join(room);
    console.log(`User joined room: ${room}`);

    // Receive message from client
    socket.on('chat-message', async ({ sender_id,sender_role, message }) => {
      const timestamp = new Date();

      // 1. Save message to PostgreSQL
      await pool.query(
        `INSERT INTO messages (session_id, sender_id, sender_role, message, timestamp)
         VALUES ($1, $2, $3, $4, $5)`,
        [parseInt(sessionId), sender_id,sender_role, message, timestamp]
      );

      // 2. Emit message to all in room
      io.to(room).emit('chat-message', {
        sender_id: user.userId,
        sender_role,
        message,
        timestamp,
      });
    });
  });
}

export default initChatHandler;