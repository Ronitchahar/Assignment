# Threadbase - Live Chat with Socket.io (Starter)

Add a real-time chat feature to Threadbase using Socket.io: wrap the HTTP server,
authenticate sockets with JWT, use a room to scope the thread's messages, and wire a
React `useSocket` hook. Two windows on the same thread should see each other's messages
instantly.

## Setup

```bash
# Terminal 1 - the Express + Socket.io server
cd server && cp .env.example .env && npm install && npm start

# Terminal 2 - the React app
cd client && cp .env.development.example .env.development && npm install && npm run dev
```

`socket.io` and `socket.io-client` are included in the package dependencies. Run `npm install` in both folders to install them.

## What you will do

1. Install dependencies with `npm install` in `server` and `client`.
2. The server wraps Express with `createServer`, attaches Socket.io with CORS, authenticates
   JWTs from `socket.handshake.auth.token`, joins rooms, and broadcasts validated messages.
3. The React `useSocket` hook connects with `auth: { token }`, joins the room after connecting,
   listens for `chat:message`, and cleans up listeners and the connection on unmount.

`client/src/components/ChatRoom.jsx` is already wired to `useSocket` - once the hook works,
the UI works.

## Testing your work

- Open the app, log in as **Ada**. Open a second browser window (or incognito), log in as **Linus**.
- Type in one window and press Send. The message should appear in **both** windows in well under a second.
- Log in credentials: `ada@threadbase.dev` / `password` and `linus@threadbase.dev` / `password`.

## What is already done

- The Express server with `/auth/login` (issues a JWT) and an HTTP `verifyToken` route.
- The React app: login page, auth context (holds the `token`), and `ChatRoom.jsx`.
