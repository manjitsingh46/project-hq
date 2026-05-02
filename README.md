# Project HQ

Project HQ is a full-stack project management web app where teams can create projects, assign tasks, track progress, and manage role-based access for `ADMIN` and `MEMBER` users.

## Features

- JWT-based signup and login
- Role-based access control with `ADMIN` and `MEMBER`
- Project creation, viewing, and deletion
- Team member add/remove with project roles
- Task creation, assignment, deletion, and status updates
- Dashboard with total, completed, in-progress, and overdue tasks
- Paginated task APIs
- Railway-ready backend and frontend Dockerfiles

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS
- Backend: Spring Boot 3, Spring Security, Spring Data JPA
- Database: MySQL
- Auth: JWT + BCrypt
- Deployment: Railway

## Structure

```text
project-hq/
  backend/
  frontend/
  README.md
```

## Backend API

### Auth

- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`

### Projects

- `GET /api/projects?page=0&size=10`
- `POST /api/projects`
- `GET /api/projects/{id}`
- `DELETE /api/projects/{id}`
- `POST /api/projects/{id}/members`
- `DELETE /api/projects/{id}/members/{userId}`

### Tasks

- `GET /api/tasks?page=0&size=10`
- `GET /api/tasks/project/{id}?page=0&size=10`
- `POST /api/tasks`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`

### Dashboard

- `GET /api/dashboard`

### Users

- `GET /api/users?q=search-term`

## Local Setup

### Backend

```bash
cd project-hq\backend
copy .env.example .env
.\gradlew.bat bootRun
```

Local backend development uses H2 by default when `SPRING_DATASOURCE_URL` is not set. To use Railway MySQL locally, set `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, and `SPRING_DATASOURCE_PASSWORD`.

### Frontend

```bash
cd project-hq\frontend
copy .env.example .env
npm install
npm run dev
```

Set:

- `VITE_API_BASE_URL=http://localhost:8080/api`

## Railway Deployment

Deploy as two Railway services (Backend + Frontend) with a MySQL database. Free tier available!

**For detailed step-by-step instructions, see [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)**

### Quick Summary

1. **Push to GitHub** - Railway deploys from GitHub repositories
2. **Create Railway Project** - Connect your GitHub repo to Railway
3. **Deploy Backend Service**:
   - Root directory: `backend`
   - Add MySQL database
   - Set environment variables (see RAILWAY_DEPLOYMENT.md)
4. **Deploy Frontend Service**:
   - Root directory: `frontend`
   - Set `VITE_API_BASE_URL` to your backend URL
5. **Link Services** - Update CORS and API URLs

**Go to [RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md) for complete step-by-step guide!**

## Notes

- Global `ADMIN` users can manage all projects and tasks.
- `MEMBER` users only see their assigned task scope where applicable.
