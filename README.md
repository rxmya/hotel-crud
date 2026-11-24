# StayFinder – Hotel Listing CRUD Application

A full stack application to create, view, update and delete hotel listings with image upload,
search, price filtering, pagination and a map view.

Built for the Namlatech Full Stack Developer assessment.

## Tech Stack

| Layer    | Technology |
|----------|------------|
| Frontend | React (Vite), Redux Toolkit, React Router, React Helmet (react-helmet-async), Leaflet + OpenStreetMap, plain CSS |
| Backend  | Node.js, Express, Multer (image upload) |
| Database | PostgreSQL with native SQL using the `pg` driver (no ORM) |

## Features

- Add and edit hotels with one reusable form (image upload with preview, title, description, latitude, longitude, price)
- Validation on the frontend, the backend and in the database (CHECK constraints)
- Card-based hotel list with edit and delete, and a success popup after delete
- Search by title, filter by price range, pagination (offset/limit)
- Detail page with an interactive map, plus "distance from me" using the browser Geolocation API
- Dynamic page titles and meta descriptions with React Helmet
- Responsive layout (mobile-first CSS)
- Can run without the backend: a mock API stores sample data in the browser

## Project Structure

```
hotel-crud/
├── frontend/
│   └── src/
│       ├── api/          # mockApi.js, httpApi.js and the switch (hotelApi.js)
│       ├── store/        # Redux store and hotels slice
│       ├── components/   # HotelForm, HotelCard, Pagination, HotelMap, Popup, Seo
│       ├── pages/        # List, Detail, Form (add + edit)
│       ├── utils/        # validation, formatting, geolocation helpers
│       └── styles/
└── backend/
    ├── db/               # schema.sql, seed.sql
    ├── scripts/          # setupDb.js
    ├── uploads/          # uploaded images (seed images included)
    └── src/              # server.js, db.js, upload.js, validateHotel.js, routes/
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### 1. Backend
```bash
cd backend
npm install
copy .env.example .env        # then put your PostgreSQL password in .env
# create a database named hotel_db (pgAdmin, or: CREATE DATABASE hotel_db;)
npm run db:setup              # creates the table and sample hotels
npm run dev                   # http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
copy .env.example .env
npm run dev                   # http://localhost:5173
```

In `frontend/.env`:
- `VITE_USE_MOCK_API=false`: uses the real backend
- `VITE_USE_MOCK_API=true`: frontend only, with sample data saved in the browser (no backend needed)

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/api/hotels?search=&minPrice=&maxPrice=&offset=0&limit=10` | List hotels (search, price filter, pagination) |
| GET    | `/api/hotels/:id` | Get one hotel |
| POST   | `/api/hotels` | Create a hotel (`multipart/form-data`, field `image`) |
| PUT    | `/api/hotels/:id` | Update a hotel (new image optional) |
| DELETE | `/api/hotels/:id?deleteImage=true` | Delete a hotel; `deleteImage=false` keeps the image file |

Validation errors return `400` with `{ "message": "Validation failed.", "errors": { "price": "..." } }`.

## Design Decisions

- **Mock/real API switch:** both API modules share the same functions and response shapes, so the
  UI was built before the backend existed, and switching is one environment variable.
- **Security:** parameterised SQL queries (prevents SQL injection), unique server-generated file names,
  image type and size limits, and validation repeated on the server.
- **Images:** stored as files in `uploads/`; the database stores only the path. Files are cleaned up
  when validation fails, an image is replaced, or a hotel is deleted.
- **Money:** `NUMERIC(10,2)` instead of FLOAT to avoid rounding errors.
- **Map:** Leaflet with OpenStreetMap (free, no API key needed).

## Possible Improvements

- Unit and API tests (Vitest, Jest, Supertest)
- Cloud image storage (e.g. AWS S3) instead of local disk
- Authentication for admin actions