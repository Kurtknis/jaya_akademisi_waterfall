# Deployment Guide (Localhost Target)

This guide documents the procedures for installing, configuring, running, and maintaining the **Jaya Akademisi LMS** platform in a local environment.

## 1. System Requirements
- **Operating System**: Linux (Ubuntu 20.04+, Debian, Mint, Fedora), macOS, or Windows (WSL2 recommended).
- **Python**: Version 3.10 or newer (Python 3.12 verified).
- **Node.js**: Version 18.x or newer (Node v24.20.0 verified).
- **Package Managers**: `pip` and `npm`.

## 2. Directory Structure
```
jaya_akademisi/
├── backend/
│   ├── app/
│   │   ├── __init__.py          # Flask application factory
│   │   ├── models.py            # SQLAlchemy models
│   │   ├── auth.py              # JWT & RBAC decorators
│   │   └── routes/              # Modular blueprints
│   ├── instance/
│   │   └── jaya_akademisi.db    # SQLite database file
│   ├── requirements.txt         # Backend Python dependencies
│   ├── run.py                   # Port 5000 entry point
│   ├── seed.py                  # Realistic demo seeder
│   └── test_e2e_workflows.py    # E2E test suite
├── frontend/
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── context/             # Auth context
│   │   ├── pages/               # LMS pages
│   │   └── services/            # Axios API client
│   ├── package.json
│   ├── vite.config.ts           # Port 5173 configuration
│   └── tailwind.config.js       # Academic theme configuration
├── docs/                        # Complete Waterfall documentation
├── start.sh                     # Automated startup orchestration script
└── README.md                    # Project README
```

## 3. Quick Startup (One Command)
Run the automated startup script from the project root:
```bash
./start.sh
```
This automatically verifies dependencies, seeds the database if needed, and starts:
- **Backend API**: `http://localhost:5000`
- **Frontend App**: `http://localhost:5173`

## 4. Manual Startup Commands

### Backend Terminal
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python seed.py        # Initializes SQLite and seeds demo accounts
python run.py         # Runs on http://localhost:5000
```

### Frontend Terminal
```bash
cd frontend
npm install
npm run dev           # Runs on http://localhost:5173
```

## 5. Demonstration Accounts
| Role | Email Address | Password | Permissions |
|---|---|---|---|
| **Administrator** | `admin@jayaakademisi.local` | `Admin123!` | Full user, category, course control |
| **Faculty Lecturer** | `lecturer@jayaakademisi.local` | `Lecturer123!` | Course authoring, grading, syllabus |
| **Student** | `student@jayaakademisi.local` | `Student123!` | Course enrollment, classroom, assignments |
