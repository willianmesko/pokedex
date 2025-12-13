# 🧬 Pokédex – Full-Stack Application

A full-stack **Pokédex application** built with **Next.js**, **Prisma**, and **PostgreSQL**.

The project demonstrates a clean, production-like architecture with local data persistence, server-side operations, and a fully responsive UI. All core features run locally with a simple and reproducible setup, making the project easy to evaluate, extend, and explain in interviews.

---

## Setup

### Requirements

- **Node.js v22 or higher**
- **Docker** (Docker Desktop includes Docker Compose)

No local PostgreSQL installation is required.

---

### 1. Start PostgreSQL

```bash
npm run db:start
```

Starts a PostgreSQL container on a non-default port (e.g. 5433) to avoid conflicts with existing local databases.

### 2. Environment Variables

Create the environment file:

```bash
cp .env.example .env
```

Example:

```bash
DB_PORT=5433
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/pokedex
```

### 3. Install Dependencies & Prepare Database

```basg
npm run setup
```

This will:

    •	Install dependencies
    •	Generate the Prisma Client
    •	Run migrations
    •	Seed the database with Pokémon data

### 4. Development Server

```bash
npm run dev
```

Access the application at:

```bash
http://localhost:3000
```

## Tech Stack

| Technology  | Purpose              | Rationale                                             |
| ----------- | -------------------- | ----------------------------------------------------- |
| Next.js     | Full-stack framework | App Router, server actions, unified frontend/backend  |
| Prisma      | ORM                  | Type-safe queries, migrations, predictable data layer |
| PostgreSQL  | Database             | Relational model, strong consistency                  |
| Node.js 22+ | Runtime              | Required by latest Prisma version                     |
| Docker      | Infrastructure       | Local PostgreSQL without host conflicts               |
| TypeScript  | Type safety          | Compile-time validation and better DX                 |

---

## Demo

### Desktop

![Pokédex Desktop View](https://github.com/user-attachments/assets/97dcc1cc-2d9e-444a-a595-f3943d36c134)

### List & Detail

![Pokédex List View](https://github.com/user-attachments/assets/324e29a5-cd94-498f-8fc0-ef879b24e6af)

## Key Features

### Pokémon Listing

- Server-side pagination via Prisma
- Optimized database queries
- Deterministic ordering and limits

### Search & Filtering

- Search Pokémon by name
- Filter by Pokémon type
- Executed directly at the database level

### Sorting

- Sort by ID or name
- Ascending or descending order
- Fully compatible with pagination

### Pokémon Details

- Individual detail page per Pokémon
- Stats, types, and metadata
- Loaded entirely from the local database

---

## User Flow Overview

### 1. Application Load

Users land on a paginated list of Pokémon fetched from PostgreSQL.

The UI renders instantly with server-side data fetching, avoiding unnecessary client-side loading states.

### 2. Exploration & Search

Users can:

- Navigate pages
- Search Pokémon by name
- Filter by type
- Change sorting order

All interactions are handled through database-driven queries for consistency and performance.

### 3. Detail View

Selecting a Pokémon opens a dedicated details page showing:

- Base stats
- Types
- Physical attributes

No external API calls are made during normal usage.

---

## Data Ingestion Strategy

Pokémon data is ingested once using a dedicated script.

### Ingestion Behavior

- Fetches data from the public **PokéAPI**
- Normalizes responses into the local schema
- Persists data into PostgreSQL
- Idempotent (safe to re-run)

This ensures:

- No dependency on external APIs at runtime
- Predictable performance
- Fully offline-capable development

---

## Architecture Overview

The application follows a modular, feature-based architecture.

Next.js App

```
├── app/                 # Routes, layouts, API entrypoints
├── modules/
│   ├── pokedex/         # Feature module
│   │   ├── api/         # Route handlers
│   │   ├── components/ # UI components
│   │   ├── data/        # Data access logic
│   │   ├── dto/         # DTOs and contracts
│   │   ├── entities/    # Domain entities
│   │   ├── hooks/       # Feature-specific hooks
│   │   └── server/      # Server-only logic
│   └── shared/          # Cross-feature utilities
```

### Core Principles

- Feature-based modularization
- Clear separation of concerns
- Domain entities isolated from transport logic
- Shared utilities centralized and reusable

---

Development Notes:

    •	Docker is used only for infrastructure
    •	The application itself runs locally
    •	Prisma enforces Node.js v22+ compatibility
    •	If using nvm, activate the correct version:

```bash
nvm use
```

### Summary:

    •	Full-stack Next.js application
    •	Prisma + PostgreSQL
    •	Local data ingestion
    •	Server-side pagination, filtering, and sorting
    •	Responsive UI
    •	Modular architecture
    •	Simple and reproducible setup

## Development Note

This project was built with assistance from **Claude AI (Anthropic)**, used as a support tool for:

- Brainstorming product ideas and feature scope
- Improving developer productivity
- Refining architecture discussions
- Generating and polishing documentation (including this README)

All design decisions, implementation, and final code were reviewed and validated manually.
