# 🧬 Pokédex – Full-Stack Application

A **Pokédex application** built with **Next.js**, **Prisma**, and **PostgreSQL**. This project demonstrates a complete end-to-end architecture with local data persistence, server-side operations, and a responsive UI—all running with a single Docker command.

---

## 🎥 Demo

### Screenshots

<p align="center">
  <img src="./docs/screenshots/home.png" alt="Home Page" width="800">
  <br>
  <em>Home Page - Pokémon List with Filters</em>
</p>

<p align="center">
  <img src="./docs/screenshots/details.png" alt="Pokémon Details" width="800">
  <br>
  <em>Pokémon Details Page</em>
</p>

<p align="center">
  <img src="./docs/screenshots/search.png" alt="Search Functionality" width="800">
  <br>
  <em>Search and Filter Features</em>
</p>

### Videos

<p align="center">
  <a href="./docs/videos/demo.mp4">
    <img src="./docs/screenshots/video-thumbnail.png" alt="Watch Demo Video" width="800">
  </a>
  <br>
  <em>Full Application Demo (Click to watch)</em>
</p>

> 💡 **Note**: Add your screenshots to `./docs/screenshots/` and videos to `./docs/videos/` directories.

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
├── next/                      # Next.js configuration
├── app/
│   ├── api/pokedex/          # API routes
│   │   └── route.ts          # Pokédex API endpoint
│   ├── generated/            # Generated types/files
│   └── pokedex/              # Pokédex page
├── modules/
│   ├── pokedex/
│   │   ├── api/              # API layer
│   │   ├── components/       # React components
│   │   ├── data/             # Data access layer
│   │   ├── dto/              # Data Transfer Objects
│   │   ├── entities/         # Domain entities
│   │   ├── hooks/            # React hooks
│   │   ├── server/           # Server-side logic
│   │   └── validation/       # Validation schemas
│   │   └── constants.ts      # Module constants
│   └── shared/
│       ├── components/       # Shared UI components
│       ├── errors/           # Error handling
│       ├── hooks/            # Shared hooks
│       ├── lib/              # Utility libraries
│       ├── providers/        # Context providers
│       └── utils/            # Helper functions
├── docs/
│   ├── screenshots/          # Application screenshots
│   └── videos/               # Demo videos
├── favicon.ico
├── globals.css               # Global styles
├── layout.tsx                # Root layout
└── page.tsx                  # Home page
```

---

## 🏗️ Architecture Patterns

### Modular Structure

The project follows a **feature-based modular architecture**:

- **`modules/pokedex/`**: Contains all Pokédex-specific logic

  - Clear separation between layers (API, data, components, validation)
  - Domain entities and DTOs for type safety
  - Dedicated hooks for state management

- **`modules/shared/`**: Reusable cross-cutting concerns
  - Shared components, utilities, and providers
  - Error handling and common hooks
  - Infrastructure code used across features

### Layer Separation

Each module follows clean architecture principles:

- **Entities**: Core domain models
- **Data**: Database access and queries
- **DTO**: Data transfer and validation
- **API**: HTTP interface
- **Components**: UI presentation
- **Hooks**: State and side effects
- **Server**: Server-side operations

This structure ensures:

- Easy testing and mocking
- Clear dependencies
- Scalable codebase as features grow

---

## 🤖 Development Process

This project was built with the assistance of **Claude AI** (Anthropic) for:

- **Brainstorming**: Architecture decisions and design patterns
- **Productivity**: Code structure and best practices
- **Documentation**: Generating this README and project documentation

Claude AI helped streamline the development process by providing:

- Clean code suggestions
- Architecture guidance
- Quick iterations on implementation details
- Comprehensive documentation

---

## 🧠 Summary

- Full-stack Next.js application
- Prisma + PostgreSQL for data persistence
- Pokémon data ingested via a dedicated script
- Pagination, search, filters, and sorting handled at the database level
- Responsive UI with Tyrant CSS
- Modular, feature-based architecture
- Simple, reproducible setup using Docker
- Built with AI-assisted development workflow

This project demonstrates how to build a clean, maintainable, and scalable application without unnecessary complexity.

---

## 📝 License

MIT
