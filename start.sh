#!/usr/bin/env bash
set -e

# ==============================================================================
# JAYA AKADEMISI — Localhost Startup Orchestration Script
# Universitas Pembangunan Jaya University Learning Management System (LMS)
# ==============================================================================

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_DIR="$PROJECT_DIR/backend"
FRONTEND_DIR="$PROJECT_DIR/frontend"
DB_FILE="$BACKEND_DIR/instance/jaya_akademisi.db"

echo "======================================================================"
echo "    🚀 STARTING JAYA AKADEMISI — UNIVERSITY LMS PLATFORM"
echo "======================================================================"

# 1. Verify / Setup Backend Virtual Environment
if [ ! -d "$BACKEND_DIR/venv" ]; then
    echo "Creating Python virtual environment in backend/venv..."
    python3 -m venv "$BACKEND_DIR/venv"
    "$BACKEND_DIR/venv/bin/pip" install -r "$BACKEND_DIR/requirements.txt"
fi

# 2. Verify / Initialize Database
if [ ! -f "$DB_FILE" ]; then
    echo "Initializing and seeding SQLite database at $DB_FILE..."
    "$BACKEND_DIR/venv/bin/python" "$BACKEND_DIR/seed.py"
else
    echo "SQLite database verified at: $DB_FILE"
fi

# 3. Function to kill background services on exit
cleanup() {
    echo ""
    echo "Shutting down Jaya Akademisi services..."
    if [ ! -z "$BACKEND_PID" ]; then
        kill "$BACKEND_PID" 2>/dev/null || true
    fi
    if [ ! -z "$FRONTEND_PID" ]; then
        kill "$FRONTEND_PID" 2>/dev/null || true
    fi
    echo "Services stopped cleanly. Goodbye!"
    exit 0
}
trap cleanup SIGINT SIGTERM EXIT

# 4. Start Backend Server (Flask on port 5000)
echo "Starting Flask API Backend on http://localhost:5000..."
cd "$BACKEND_DIR"
"$BACKEND_DIR/venv/bin/python" run.py &
BACKEND_PID=$!
cd "$PROJECT_DIR"

# Wait briefly for backend to initialize
sleep 2

# 5. Start Frontend Server (Vite on port 5173)
echo "Starting Vite React Frontend on http://localhost:5173..."
cd "$FRONTEND_DIR"
npm run dev &
FRONTEND_PID=$!
cd "$PROJECT_DIR"

echo "======================================================================"
echo "    ✅ JAYA AKADEMISI IS NOW RUNNING!"
echo "======================================================================"
echo "    Frontend: http://localhost:5173"
echo "    Backend:  http://localhost:5000"
echo "    Database: backend/instance/jaya_akademisi.db"
echo ""
echo "    DEMONSTRATION CREDENTIALS:"
echo "    • Admin:    admin@jayaakademisi.local    / Admin123!"
echo "    • Lecturer: lecturer@jayaakademisi.local / Lecturer123!"
echo "    • Student:  student@jayaakademisi.local  / Student123!"
echo "======================================================================"
echo "Press Ctrl+C to terminate both servers."

wait
