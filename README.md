# Relational Data Shapes in React — Starter

The backend already returns a **nested Prisma include response** for each thread:
- `author: { name, avatarUrl }`
- `_count: { comments }`

But `client/src/components/ThreadItem.jsx` still assumes an **old flat shape** like `authorName` and `commentCount`.

**Your task:** update `ThreadItem.jsx` so it renders:
- author name from `thread.author?.name`
- avatar from `thread.author?.avatarUrl`
- reply count from `thread._count?.comments`
- safe fallback UI when `thread.author` is `null`

## Prerequisites
- Node.js 18+

## Setup
```bash
npm run setup
cp client/.env.development.example client/.env.development
cp server/.env.example server/.env
npm --prefix server run db:setup
```

## Run
```bash
npm run dev
```
- client: `http://localhost:5173`
- server: `http://localhost:3001`

## What you edit
Only:
- `client/src/components/ThreadItem.jsx`

Do **not** edit:
- `server/routes/threads.js`
- `client/src/components/ThreadList.jsx`
- `client/src/services/threads.service.js`

## Success looks like
- author names render for normal threads
- avatar images render for normal threads
- reply count badge renders from `_count.comments`
- threads with `author: null` show fallback UI instead of crashing
