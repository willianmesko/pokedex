````markdown
# 🧬 Pokédex – Full-Stack Application

A **production-ready Pokédex application** built with **Next.js**, **Prisma**, and **PostgreSQL**. This project demonstrates a complete end-to-end architecture with local data persistence, server-side operations, and a responsive UI—all running with a single Docker command.

---

## ✅ Requirements

- **Docker** (Docker Desktop includes Docker Compose)

That's it. No Node.js, npm, or PostgreSQL installation needed.

---

## 🚀 Quick Start

### 1️⃣ Create the `.env` file

```bash
cp .env.example .env
```
````

The `.env.example` contains:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/pokedex
```

⚠️ **Important**: The hostname is `db` (the Docker Compose service name), not `localhost`.

### 2️⃣ Start the application

```bash
docker compose up
```

### 3️⃣ Access the app

Open your browser and navigate to:

👉 **http://localhost:3000**

---

## 🧱 Architecture & Stack

### Next.js (Full Stack)

The application uses **Next.js** to handle:

- **Frontend**: React components with responsive layouts
- **Backend**: API routes for server-side logic
- **SSR**: Server-side data fetching and rendering
- **Routing**: Unified routing and layout composition

By using Next.js, the frontend and backend live in the same codebase, which simplifies development, deployment, and type sharing.

### Prisma & PostgreSQL

**Prisma** is used as the ORM and data access layer.

- All Pokémon data is stored locally in PostgreSQL
- Pagination, filtering, sorting, and search are performed directly at the database level
- Prisma migrations are applied automatically when the app starts via Docker

This ensures fast queries, predictable behavior, and no dependency on external APIs at runtime.

### Data Ingestion Script

The project includes a dedicated **ingestion script** responsible for populating the database.

This script:

- Fetches Pokémon data from the public [PokéAPI](https://pokeapi.co/)
- Normalizes the data into the local schema
- Persists all Pokémon into the database
- Can be safely re-run (idempotent behavior)

This approach avoids hitting external APIs during normal app usage and provides a stable, production-like setup.

---

## 🧩 Features

### 📋 Pokémon List

- Paginated results with server-side pagination via Prisma
- Optimized database queries

### 🔍 Search

- Search Pokémon by name
- Executed directly in the local database

### 🧪 Filters

- Filter Pokémon by type
- Combined with pagination and sorting

### 🔃 Sorting

- Sort by ID or name
- Ascending or descending order

### 📄 Pokémon Details Page

- Detailed view for each Pokémon
- Stats, types, and metadata
- Data loaded from the local database

All of these features operate entirely on the **local Prisma database**, not directly on PokéAPI.

---

## 📱 Responsive Design

The application is fully **responsive** and works well on:

- Desktop
- Tablet
- Mobile devices

The layout adapts naturally across screen sizes, ensuring a good user experience on all devices.

---

## 🎨 Styling

The UI is styled using **Tyrant CSS**.

This approach provides:

- Lightweight styling
- Predictable class-based layouts
- Fast iteration without heavy abstractions
- Clear separation between structure and styling

---

## 🎯 Design Philosophy

This project intentionally avoids over-engineering.

Key principles:

- Clear separation of concerns
- Simple, readable architecture
- One-command setup via Docker
- Realistic production patterns
- Easy to explain in code reviews and interviews

---

## 📦 Project Structure

```
.
├── prisma/              # Database schema and migrations
├── src/
│   ├── app/            # Next.js app directory (pages, layouts, API routes)
│   ├── components/     # React components
│   └── lib/            # Utilities and shared logic
├── scripts/            # Data ingestion scripts
├── docker-compose.yml  # Docker services configuration
├── .env.example        # Environment variables template
└── README.md
```

---

## 🧠 Summary

- Full-stack Next.js application
- Prisma + PostgreSQL for data persistence
- Pokémon data ingested via a dedicated script
- Pagination, search, filters, and sorting handled at the database level
- Responsive UI with Tyrant CSS
- Simple, reproducible setup using Docker

This project demonstrates how to build a clean, maintainable, and scalable application without unnecessary complexity.

---

## 📝 License

MIT

```

```
