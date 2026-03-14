# Ceylon Travo - Server (Express + Prisma + MySQL)

This server provides CRUD APIs for locations and packages plus simple admin authentication using JWT. It uses Prisma as the ORM and MySQL as the database.

## Setup

1. Copy `.env.example` to `.env` and set the `DATABASE_URL` and `JWT_SECRET`:

```
DATABASE_URL="mysql://USER:PASSWORD@HOST:3306/ceylon_travo"
JWT_SECRET="your_jwt_secret_here"
PORT=4000
```

2. Install dependencies:

```bash
cd server
npm install
```

3. Generate Prisma client:

```bash
npx prisma generate
```

4. Create the database and run migrations (create DB first in MySQL):

```bash
npx prisma migrate dev --name init
```

5. Seed the database with sample data:

```bash
node --loader ts-node/esm prisma/seed.ts
```

(If you prefer, compile first via `npm run build` then run `node dist/prisma/seed.js`.)

6. Start the server in development:

```bash
npm run dev
```

Server will run at `http://localhost:4000` (or the `PORT` you set).

## Endpoints

- `GET /api/locations`
- `POST /api/locations`
- `PUT /api/locations/:id`
- `DELETE /api/locations/:id`

- `GET /api/packages`
- `POST /api/packages`
- `PUT /api/packages/:id`
- `DELETE /api/packages/:id`

- `POST /api/auth/login` — body `{ username, password }` returns `{ token }`

- `POST /api/upload` — multipart/form-data `file` field; returns `{ url }` for the uploaded image (image max 15MB)

## Notes
- The seed script creates a default admin with username `admin` and password `admin123` (hashed).
- Adjust `DATABASE_URL` to point to your MySQL server before running migrations and seeding.
