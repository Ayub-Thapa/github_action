# Simple CRUD App (Dockerized)

This project contains:
- `backend`: Node.js + Express REST API with file-based persistence (`data.json`)
- `frontend`: Static HTML/CSS/JS app served by Nginx

## Run with Docker

```bash
docker compose up --build
```

Open:
- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api/items

## API Endpoints

- `GET /api/items`
- `GET /api/items/:id`
- `POST /api/items`
- `PUT /api/items/:id`
- `DELETE /api/items/:id`

Example payload:

```json
{
  "title": "Task name",
  "description": "Task details"
}
```
