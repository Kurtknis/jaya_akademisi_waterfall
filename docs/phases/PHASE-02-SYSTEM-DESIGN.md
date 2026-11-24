# Phase 2: System Design

## Objective
Translate the functional requirements into technical blueprints, including client-server architecture, database schema with relational integrity, API routing contracts, and workflow diagrams.

## Activities Performed
1. Designed decoupled client-server architecture: React Vite frontend communicating with Flask REST API backend.
2. Modeled SQLite 3 schema consisting of 9 normalized relational tables: `users`, `categories`, `courses`, `course_modules`, `lessons`, `enrollments`, `lesson_progress`, `assignments`, and `assignment_submissions`.
3. Created UML and system diagrams:
   - Entity Relationship Diagram (ERD).
   - Use Case Diagram for all three user roles.
   - Data Flow Diagrams (DFD Level 0 Context and Level 1 Decomposition).
4. Specified JWT-based stateless authentication flow with token-based role verification.

## Features Developed & Specified
- Relational integrity schema with foreign key constraints and cascade rules.
- REST API endpoint specifications for auth, courses, curriculum, enrollment, progress, assignments, and dashboards.
- UI/UX layout system with academic navy palette, responsive grid, and modular component hierarchy.

## Files Created / Modified
- `docs/SYSTEM-DESIGN.md`
- `docs/DATABASE-DESIGN.md`
- `docs/ERD.md`
- `docs/USE-CASE.md`
- `docs/DFD.md`
- `docs/phases/PHASE-02-SYSTEM-DESIGN.md`

## Testing Performed
- ERD relationship normalization check (Third Normal Form - 3NF).
- Verification of foreign key cascade paths for course deletions and enrollment cleanup.

## Results
Complete technical blueprint established, providing an unambiguous basis for backend and frontend implementation.

## Completion Status
**COMPLETED** (Waterfall Stage 2 Signed-off).
