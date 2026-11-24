# Jaya Akademisi — University Learning Management System (LMS)
### Universitas Pembangunan Jaya (UPJ)

![Jaya Akademisi Banner](https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=1200&auto=format&fit=crop&q=80)

**Jaya Akademisi** is a modern, Coursera-inspired Learning Management System (LMS) engineered for **Universitas Pembangunan Jaya (UPJ)**. Built following the classical **Waterfall SDLC methodology**, the platform delivers online education, modular syllabi, interactive lesson consumption, real-time progress computation, and assignment grading within a lightweight, local-first architecture.

---

## 🌟 Key Features

- **Local-First & Lightweight**: Operates on standard localhost using **SQLite 3** (`backend/instance/jaya_akademisi.db`) with zero external cloud dependencies or Docker requirements.
- **Three User Roles (RBAC)**:
  - 🛡️ **Administrator**: Oversee platform metrics, user directory, account status, and course categories.
  - 👨‍🏫 **Faculty Lecturer**: Author courses, construct modular syllabi (lessons, video embeds, reading materials, resource links), and grade student assignments with constructive feedback.
  - 🎓 **Student Learner**: Discover courses with category filtering, one-click enrollment, interactive classroom navigation, lesson completion tracking, and assignment submission.
- **Coursera-Inspired UI**: Built with React 18, TypeScript, and Tailwind CSS using an institutional academic palette (deep navy `#0B2545`, brand blue `#0056D2`, slate `#F8FAFC`).
- **Dynamic Learning Progress**: Real-time progress percentages calculated dynamically from verified database records.
- **Complete Waterfall Documentation**: 17 structured Markdown specifications with Mermaid ERD, Use Case, and DFD diagrams.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons, Axios, React Router v6.
- **Backend**: Python 3.12, Flask, Flask-SQLAlchemy, Flask-CORS, PyJWT, Werkzeug.
- **Database**: SQLite 3 (`backend/instance/jaya_akademisi.db`) with `PRAGMA foreign_keys = ON;`.
- **Target Network**:
  - **Frontend**: `http://localhost:5173`
  - **Backend API**: `http://localhost:5000`

---

## 🔑 Demonstration Accounts

All demonstration accounts are pre-seeded with realistic data:

| Role | Email Address | Password | Capabilities |
|---|---|---|---|
| **Administrator** | `admin@jayaakademisi.local` | `Admin123!` | System stats, user management, category control |
| **Faculty Lecturer** | `lecturer@jayaakademisi.local` | `Lecturer123!` | Course authoring, curriculum building, grading |
| **Student** | `student@jayaakademisi.local` | `Student123!` | Course catalog, classroom, assignment submission |

*(Quick-login buttons are also provided directly on the Login page for rapid demonstration).*

---

## 🚀 Quick Start (Localhost)

### Option 1: Automated Startup Script (Recommended)
From the project root directory, run:
```bash
./start.sh
```
This script automatically checks the Python virtualenv, verifies dependencies, initializes and seeds the SQLite database, and launches both the backend and frontend simultaneously.

---

### Option 2: Manual Terminal Execution

#### Terminal 1 — Backend (Flask)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py        # Seed demonstration courses & users
python run.py         # Starts on http://localhost:5000
```

#### Terminal 2 — Frontend (Vite)
```bash
cd frontend
npm install
npm run dev           # Starts on http://localhost:5173
```

Now open **`http://localhost:5173`** in your browser.

---

## 🧪 Testing & Verification

The application includes two automated test suites:

### 1. API Integration Test Suite
```bash
backend/venv/bin/python backend/test_api.py
```
*Validates health check, logins for all roles, course catalog, course details with progress, dashboard metrics, and lesson completion toggling.*

### 2. Full End-to-End (E2E) Workflow Test Suite
```bash
backend/venv/bin/python backend/test_e2e_workflows.py
```
*Executes the complete academic lifecycle: Admin setup -> Lecturer course authoring -> Student enrollment -> Lesson completion (50% -> 100%) -> Assignment submission -> Lecturer grading -> Student gradebook verification -> SQLite data persistence across app restarts.*

---

## 📁 Project & Documentation Directory

```
jaya_akademisi/
├── backend/
│   ├── app/
│   │   ├── __init__.py           # Flask app factory & blueprint registration
│   │   ├── models.py             # SQLAlchemy models & SQLite foreign key listener
│   │   ├── auth.py               # JWT & role authorization decorators
│   │   └── routes/               # Modular REST API endpoints
│   ├── instance/
│   │   └── jaya_akademisi.db     # SQLite 3 database file
│   ├── requirements.txt
│   ├── run.py                    # Port 5000 entry point
│   ├── seed.py                   # Realistic database seeder
│   └── test_e2e_workflows.py     # E2E test suite
├── frontend/
│   ├── src/
│   │   ├── components/           # Navbar, Footer, ProtectedRoute
│   │   ├── context/              # AuthContext & token management
│   │   ├── pages/                # All 13 LMS pages
│   │   └── services/             # Axios API client
│   ├── package.json
│   ├── vite.config.ts            # Vite config (Port 5173 & API proxy)
│   └── tailwind.config.js
├── docs/
│   ├── README.md                 # Documentation index
│   ├── PROJECT-BLUEPRINT.md      # Architecture blueprint
│   ├── WATERFALL-METHODOLOGY.md  # Waterfall SDLC structure
│   ├── REQUIREMENTS-ANALYSIS.md  # Functional & non-functional requirements
│   ├── SYSTEM-DESIGN.md          # Client-server architecture
│   ├── DATABASE-DESIGN.md        # Relational schema specification
│   ├── ERD.md                    # Entity Relationship Diagram (Mermaid)
│   ├── USE-CASE.md               # Use Case analysis & diagrams
│   ├── DFD.md                    # Data Flow Diagrams Level 0 & Level 1
│   ├── API-DOCUMENTATION.md      # REST API specification
│   ├── TESTING-REPORT.md         # Test outcomes & verification report
│   ├── DEPLOYMENT-GUIDE.md       # Localhost deployment guide
│   └── phases/
│       ├── PHASE-01-REQUIREMENTS.md
│       ├── PHASE-02-SYSTEM-DESIGN.md
│       ├── PHASE-03-IMPLEMENTATION.md
│       ├── PHASE-04-TESTING.md
│       └── PHASE-05-DEPLOYMENT.md
├── start.sh                      # Localhost startup orchestration script
└── README.md                     # Root project documentation
```

---

## 📜 License
Developed for academic demonstration at **Universitas Pembangunan Jaya (UPJ)**. All rights reserved.
