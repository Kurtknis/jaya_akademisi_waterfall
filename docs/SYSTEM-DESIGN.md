# System Design Document

## 1. System Architecture
Jaya Akademisi is designed as a decoupled two-tier client-server architecture.

```mermaid
flowchart LR
    subgraph Client["Frontend Client (Port 5173)"]
        UI["React 18 + TypeScript"]
        Router["React Router v6"]
        Store["Auth Context & State"]
        AxiosClient["Axios HTTP Client"]
    end

    subgraph Server["Backend Server (Port 5000)"]
        Flask["Flask 3.x Application"]
        AuthMiddleware["JWT / Token Auth & RBAC"]
        APIRoutes["REST API Blueprints"]
        ORM["Flask-SQLAlchemy (ORM)"]
    end

    subgraph Storage["Persistent Storage"]
        DB[("SQLite 3 Database<br/>backend/instance/jaya_akademisi.db")]
    end

    UI --> Router --> AxiosClient
    AxiosClient -->|"HTTP / JSON (Bearer Token)"| Flask
    Flask --> AuthMiddleware --> APIRoutes
    APIRoutes --> ORM --> DB
```

## 2. API Design Principles
- Standard RESTful conventions with JSON payloads.
- Status codes: `200 OK`, `201 Created`, `400 Bad Request`, `401 Unauthorized`, `403 Forbidden`, `404 Not Found`, `500 Server Error`.
- Authentication via HTTP Authorization header: `Bearer <token>`.
- Cross-Origin Resource Sharing (CORS) configured to permit requests from `http://localhost:5173`.
