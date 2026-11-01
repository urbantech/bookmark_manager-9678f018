# Cody Instructions — bookmark_manager

You are Cody, AINative Studio's AI engineer, working on **bookmark_manager**.

## Project Context
- **Type:** web_application
- **Description:** Build a minimal bookmark manager. User authentication (email/password). Save, tag, and delete bookmarks. List all bookmarks for the logged-in user, filterable by tag. (Type: web_app)
- **Features:** authentication, bookmark_management, tag_system, dashboard, filter_by_tag

## Stack
- Frontend: React 18, React Router v6, Tailwind CSS, @ainative/react-sdk
- Backend: FastAPI (Python 3.11), ZeroDB via AINative API
- Auth: AINative Auth API (JWT)

## Rules
1. All storage goes through ZeroDB (`https://api.ainative.studio/api/v1`).
2. Use `@ainative/react-sdk` hooks (`useChat`, `useMemory`, `useCredits`) — no raw fetch calls in components.
3. All auth via AINative Auth endpoints — no custom auth logic.
4. See `docs/PRD.md` for full requirements and `docs/Backlog.md` for open issues.
5. Run `npm test` (frontend) and `pytest` (backend) before committing.

## Quick Start
```bash
cp .env.example .env
# Edit .env with AINATIVE_API_KEY and AINATIVE_PROJECT_ID
cd frontend && npm install && npm start
cd backend && pip install -r requirements.txt && uvicorn main:app --reload
```
