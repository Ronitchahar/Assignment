import "dotenv/config";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwt from "jsonwebtoken";
import { verifyToken } from "./middleware/auth.js";

const app = express();
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

// Demo users - log in as either to test chat in two windows.
const USERS = [
  { userId: 1, name: "Ada", email: "ada@threadbase.dev", password: "password" },
  { userId: 2, name: "Linus", email: "linus@threadbase.dev", password: "password" },
];

// POST /auth/login -> { accessToken, user }
app.post("/auth/login", (req, res) => {
  const { email, password } = req.body ?? {};
  const found = USERS.find((u) => u.email === email && u.password === password);
  if (!found) return res.status(401).json({ error: "Invalid credentials" });

  const accessToken = jwt.sign(
    { userId: found.userId, name: found.name },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.json({ accessToken, user: { userId: found.userId, name: found.name } });
});

// A normal protected route (unchanged, uses the HTTP verifyToken).
app.get("/api/me", verifyToken, (req, res) => res.json({ user: req.user }));

// Wrap Express in an HTTP server so Socket.io can share the same port.
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:5173", credentials: true },
});

// Authenticate each Socket.io connection using the JWT from the handshake.
io.use((socket, next) => {
  const token = socket.handshake.auth?.token;
  if (!token) {
    const error = new Error("Authentication required");
    error.data = { code: "NO_TOKEN" };
    return next(error);
  }

  try {
    socket.data.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    const error = new Error("Invalid or expired token");
    error.data = { code: "INVALID_TOKEN" };
    next(error);
  }
});

// Keep chat messages scoped to the requested room.
io.on("connection", (socket) => {
  socket.on("room:join", (roomId) => {
    if (typeof roomId !== "string" || !roomId.trim() || roomId.length > 100) {
      return;
    }
    socket.join(roomId);
  });

  socket.on("chat:message", (payload) => {
    const { roomId, text } = payload ?? {};
    if (
      typeof roomId !== "string" ||
      !roomId.trim() ||
      roomId.length > 100 ||
      typeof text !== "string" ||
      !text.trim()
    ) {
      return;
    }

    // Only allow messages to rooms the socket has joined.
    if (!socket.rooms.has(roomId)) return;

    const message = {
      id: `${Date.now()}-${socket.id}-${Math.random().toString(36).slice(2, 8)}`,
      user: socket.data.user.name ?? `User ${socket.data.user.userId}`,
      text: text.trim().slice(0, 2000),
    };

    io.to(roomId).emit("chat:message", message);
  });
});

const PORT = process.env.PORT ?? 3001;
httpServer.listen(PORT, () => {
  console.log(`Server on http://localhost:${PORT}`);
  console.log("  POST /auth/login");
  console.log("  GET  /api/me");
  console.log("  Socket.io: ready");
});
