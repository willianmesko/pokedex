# 🧬 Pokédex – Full-Stack Application

A **Pokédex application** built with **Next.js**, **Prisma**, and **PostgreSQL**.  
This project demonstrates a complete end-to-end architecture with local data persistence, server-side operations, and a responsive UI — all running with a simple setup.

---

## 🎥 Demo

### 🖥️ Desktop View

![Pokédex Desktop View](https://github.com/user-attachments/assets/97dcc1cc-2d9e-444a-a595-f3943d36c134)

### 📋 List View

![Pokédex List View](https://github.com/user-attachments/assets/324e29a5-cd94-498f-8fc0-ef879b24e6af)

### 📄 Detail View

![Pokédex Detail View](https://github.com/user-attachments/assets/a0b1c075-c3ff-4923-9a6c-94419b73fe13)

### 📱 Mobile Views

![Pokédex Mobile View](https://github.com/user-attachments/assets/f9f4a257-aabc-402b-960b-e04383c228c1)
![Pokédex Mobile Detail](https://github.com/user-attachments/assets/918c931e-28cb-4f8d-9264-2ce6d1e18104)

---

## ✅ Requirements

- **Node.js v22 or higher**  
  Required due to the latest version of **Prisma**, which depends on Node.js 22 features.
- **Docker** (Docker Desktop includes Docker Compose)

> ⚠️ **Important**  
> No local PostgreSQL installation is required — the database runs in Docker.

---

## 🚀 Quick Start

### 1️⃣ Start PostgreSQL with Docker

```bash
npm run db:start

This will start a PostgreSQL container exposed on a non-default port (e.g. 5433) to avoid conflicts with local PostgreSQL installations.

⸻

2️⃣ Create the .env file

cp .env.example .env

.env.example:

DB_PORT=5433
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/pokedex

You can change the port if needed, but it must match the Docker Compose configuration.

⸻

3️⃣ Install dependencies, run migrations, and seed data

npm run setup

This command will:
	•	Install dependencies
	•	Generate the Prisma Client
	•	Run database migrations
	•	Ingest Pokémon data into the database

⸻

4️⃣ Start the application

npm run dev


⸻

5️⃣ Access the app

Open your browser:

👉 http://localhost:3000

⸻

ℹ️ Notes
	•	Node.js v22+ is enforced to ensure Prisma compatibility
	•	If you use nvm:

nvm use

	•	Docker is used only for infrastructure (PostgreSQL) to keep the setup simple and reliable

⸻

🧱 Architecture & Stack

Next.js (Full Stack)

The application uses Next.js for:
	•	Frontend: React components with responsive layouts
	•	Backend: API routes for server-side logic
	•	SSR: Server-side data fetching and rendering
	•	Routing: Unified routing and layout composition

Frontend and backend live in the same codebase, simplifying development and type sharing.

⸻

Prisma & PostgreSQL

Prisma is used as the ORM and data access layer.
	•	Pokémon data stored locally in PostgreSQL
	•	Pagination, filtering, sorting, and search executed at the database level
	•	Prisma migrations applied automatically

This guarantees fast queries and predictable behavior.

⸻

Data Ingestion Script

A dedicated ingestion script that:
	•	Fetches data from the public PokéAPI
	•	Normalizes the data into the local schema
	•	Persists Pokémon into PostgreSQL
	•	Is idempotent (safe to re-run)

This avoids hitting external APIs during normal usage.

⸻

🧩 Features

📋 Pokémon List
	•	Server-side pagination via Prisma
	•	Optimized database queries

🔍 Search
	•	Search Pokémon by name
	•	Executed directly in PostgreSQL

🧪 Filters
	•	Filter by Pokémon type
	•	Works with pagination and sorting

🔃 Sorting
	•	Sort by ID or name
	•	Ascending or descending

📄 Pokémon Details Page
	•	Stats, types, and metadata
	•	Loaded entirely from the local database

⸻

📱 Responsive Design

Fully responsive across:
	•	Desktop
	•	Tablet
	•	Mobile

Layouts adapt naturally to different screen sizes.

⸻

🎨 Styling

Styled with Tyrant CSS, providing:
	•	Lightweight styling
	•	Predictable class-based layouts
	•	Fast iteration
	•	Clear separation between structure and style

⸻

🎯 Design Philosophy

This project avoids over-engineering.

Principles:
	•	Clear separation of concerns
	•	Simple, readable architecture
	•	One-command setup
	•	Production-like patterns
	•	Easy to explain in interviews and code reviews

⸻

📦 Project Structure

.
├── next/
├── app/
│   ├── api/pokedex/
│   │   └── route.ts
│   ├── generated/
│   └── pokedex/
├── modules/
│   ├── pokedex/
│   │   ├── api/
│   │   ├── components/
│   │   ├── data/
│   │   ├── dto/
│   │   ├── entities/
│   │   ├── hooks/
│   │   ├── server/
│   │   ├── validation/
│   │   └── constants.ts
│   └── shared/
│       ├── components/
│       ├── errors/
│       ├── hooks/
│       ├── lib/
│       ├── providers/
│       └── utils/
├── docs/
│   ├── screenshots/
│   └── videos/
├── globals.css
├── layout.tsx
└── page.tsx


⸻

🏗️ Architecture Patterns

Modular Structure
	•	Feature-based modules
	•	Clean separation of layers
	•	Domain entities and DTOs
	•	Dedicated hooks per feature

Layer Separation
	•	Entities
	•	Data
	•	DTO
	•	API
	•	Components
	•	Hooks
	•	Server

This ensures scalability, testability, and maintainability.

⸻

🤖 Development Process

Built with assistance from Claude AI (Anthropic) for:
	•	Architecture brainstorming
	•	Code structure and best practices
	•	Documentation generation

⸻

🧠 Summary
	•	Full-stack Next.js application
	•	Prisma + PostgreSQL
	•	Local data ingestion
	•	Database-driven pagination, search, filters, and sorting
	•	Responsive UI
	•	Modular architecture
	•	Simple and reproducible setup
	•	AI-assisted development workflow

⸻


```
