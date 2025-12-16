# Code Snippet Manager (MERN)

A personal vault to save, organize, search, and share code snippets. Built with MongoDB, Express, React, and Node.

## Features
- Auth (JWT) with protected routes
- Create, edit, delete snippets with syntax meta (language, tags, visibility)
- Public/private snippets plus forking
- Tag + language filters and free-text search
- Collections/folders for organization
- JavaScript sandbox preview using VM2
- Responsive React UI with loading/error states and toast-like inline feedback

## Stack
- Backend: Node.js, Express, Mongoose, JWT, express-validator, VM2
- Frontend: React (Vite), React Router, react-hook-form, Axios
- Database: MongoDB

## Getting Started

### Prerequisites
- Node 18+
- MongoDB running locally or connection string available

### Backend
```bash
cd backend
npm install
cp env.example .env   # adjust values
npm run dev           # starts on http://localhost:5000
```

Environment variables:
- `MONGO_URI` – Mongo connection string
- `JWT_SECRET` – secret for signing tokens
- `PORT` – optional API port (default 5000)
- `CLIENT_ORIGIN` – allowed CORS origin (default http://localhost:5173)

### Frontend
```bash
cd frontend
npm install
npm run dev           # starts on http://localhost:5173
```
Create a `.env` in `frontend` if you need a custom API URL:
```
VITE_API_URL=http://localhost:5000/api
```

## API Overview
- `POST /api/auth/register` – create account
- `POST /api/auth/login` – obtain JWT
- `GET /api/snippets` – list accessible snippets (filters: `language`, `tags`)
- `POST /api/snippets` – create snippet (auth)
- `GET /api/snippets/:id` – get snippet by id (private only for owner)
- `PUT /api/snippets/:id` – update (owner)
- `DELETE /api/snippets/:id` – delete (owner)
- `POST /api/snippets/:id/fork` – fork (public or own)
- `GET /api/snippets/:id/preview` – sandboxed JS preview
- `GET /api/search` – search with `q`, `language`, `tags`, `author`
- `GET /api/collections` / `POST /api/collections` – manage collections (auth)
- `POST /api/collections/:collectionId/snippets` – add snippet to collection
- `DELETE /api/collections/:collectionId/snippets/:snippetId` – remove snippet

## Notes & Validation
- Input validation uses `express-validator` per route.
- Centralized error handler returns JSON messages.
- Auth middleware protects write routes and populates `req.user`.
- Preview uses VM2 with 1s timeout and JS-only support for safety.

## Project Structure
- `backend/` – Express API
- `frontend/` – React UI (Vite)

## Running Tests
- No automated tests are included; add Jest/Vitest as desired.

## Deployment Tips
- Set environment vars on your host (Render/Heroku/etc).
- Serve `frontend` build via static hosting and point `VITE_API_URL` at the deployed API.

