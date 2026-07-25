# Hospital Appointment API

Prisma CRUD for a hospital appointment domain (Patient, Doctor, Appointment).

> A small update for pull request testing.

## Setup

```bash
createdb hospital_api
psql -d hospital_api -f prisma/init.sql

npm init -y
npm install prisma @prisma/client
npm install --save-dev typescript ts-node @types/node

cp .env.example .env
# edit .env if your local Postgres user/password differ

npx prisma generate
```

## Seed + Test

```bash
npx prisma db seed
npx ts-node src/test.ts
```

## Push to GitHub

```bash
git init
git add .
git commit -m "feat: hospital appointment API with Prisma CRUD"
git branch -M main
git remote add origin https://github.com/<your-username>/hospital-appointment-api.git
git push -u origin main

git checkout -b feature/prisma-crud
git push origin feature/prisma-crud
```

Then open a PR on GitHub: base `main` ← compare `feature/prisma-crud`.
