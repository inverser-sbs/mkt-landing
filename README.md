# InverSer Marketing Platform

Sistema de landing pages personalizadas para mentores con gestión centralizada de botones, acciones y enlaces.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 (CRA + CRACO) |
| Backend | FastAPI (Python 3.11) |
| Database | MongoDB 7 |
| Serving | Nginx (frontend), Uvicorn (backend) |

## Quick Start (Local Development)

```bash
# Clone the repository
git clone <your-repo-url>
cd inverser

# Copy environment file
cp .env.example .env
# Edit .env with your values

# Start all services
docker compose up --build
```

Access:
- Frontend: http://localhost
- Backend API: http://localhost:8001
- API Docs: http://localhost:8001/docs

## Deploy to EasyPanel

### Step 1: Connect GitHub Repository
1. In EasyPanel, go to **Projects** → **Create New**
2. Select **Docker Compose**
3. Connect your GitHub repository
4. Select the branch to deploy

### Step 2: Configure Environment Variables
Set these variables in EasyPanel:

| Variable | Value | Description |
|----------|-------|-------------|
| `MONGO_DB_NAME` | `inverser_db` | Database name |
| `FRONTEND_URL` | `https://your-domain.com` | **CRITICAL** for magic links |
| `PUBLIC_API_URL` | `https://your-domain.com` | API URL for frontend |
| `ADMIN_PASSWORDS` | `pass1\|pass2\|pass3` | Pipe-separated admin passwords |
| `CORS_ORIGINS` | `*` | Allowed origins |

### Step 3: Map Domain
1. In EasyPanel, go to your project → **Domains**
2. Add your domain
3. Map it to the `frontend` service (port 80)
4. Enable SSL/HTTPS

### Step 4: Deploy
Click **Deploy** and wait for services to start.

## Project Structure

```
/app
├── docker-compose.yml      # Production orchestration
├── .env.example            # Environment template
├── backend/
│   ├── Dockerfile          # Python FastAPI container
│   ├── server.py           # Main entrypoint (uvicorn server:app)
│   ├── routes/             # API endpoints
│   ├── models/             # Pydantic models
│   └── services/           # Business logic
├── frontend/
│   ├── Dockerfile          # Node build + Nginx serve
│   ├── nginx.conf          # SPA routing config
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   └── templates/      # Landing templates (CPN, etc.)
│   └── build/              # Production output (CRA)
```

## Technical Details

### Frontend (CRA + CRACO)
- **Build tool**: Create React App with CRACO override
- **Build output**: `/build` directory
- **Environment variables**: `REACT_APP_*` prefix (injected at build time)
- **Serving**: Nginx with SPA fallback (`try_files $uri /index.html`)

### Backend (FastAPI)
- **Entrypoint**: `uvicorn server:app --host 0.0.0.0 --port 8000`
- **API prefix**: All routes under `/api/*`
- **Database**: MongoDB via Motor (async driver)

### Authentication
- Simple password-based login (no users/roles)
- Multiple valid passwords via `ADMIN_PASSWORDS` env var
- Passwords separated by pipe `|` character

## Troubleshooting

### 1. Frontend shows blank page
- Check browser console for errors
- Verify `REACT_APP_BACKEND_URL` was set at build time
- Rebuild frontend: `docker compose build frontend`

### 2. API calls fail (CORS)
- Check `CORS_ORIGINS` includes your domain
- Verify backend is running: `docker compose logs backend`

### 3. Magic links have wrong domain
- Check `FRONTEND_URL` is set correctly
- Must include protocol: `https://your-domain.com`

### 4. SPA routing 404 on refresh
- Verify nginx.conf has `try_files $uri /index.html`
- Check nginx is using the correct config

### 5. MongoDB connection fails
- Check mongo service is healthy: `docker compose ps`
- Verify `MONGO_URL` uses service name: `mongodb://mongo:27017`

### 6. Login doesn't work
- Check `ADMIN_PASSWORDS` format (pipe-separated)
- Verify backend logs: `docker compose logs backend`

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_DB_NAME` | No | `inverser_db` | MongoDB database name |
| `FRONTEND_URL` | **Yes** | - | Public URL for magic links |
| `PUBLIC_API_URL` | **Yes** | - | API URL for frontend |
| `ADMIN_PASSWORDS` | No | - | Pipe-separated passwords |
| `ADMIN_PASSWORD` | No | `inverser2024` | Single password fallback |
| `CORS_ORIGINS` | No | `*` | Allowed CORS origins |

## License

Proprietary - InverSer SBS LLC © 2009-2025
