# InverSer Marketing Platform

Sistema de landing pages personalizadas para mentores con gestión centralizada de botones, acciones y enlaces.

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18 (CRA + CRACO) |
| Backend | FastAPI (Python 3.11) |
| Database | MongoDB 7 |
| Serving | Nginx (frontend), Uvicorn (backend) |

## EasyPanel Notes

- **No usamos `ports` ni `container_name`** en docker-compose.yml (EasyPanel los gestiona automáticamente)
- **Servicio a mapear al dominio**: `frontend` (puerto interno 80)
- **Variables mínimas a configurar**:
  - `FRONTEND_URL` = tu dominio público (ej: `https://tu-dominio.com`)
  - `PUBLIC_API_URL` = mismo dominio público
  - `ADMIN_PASSWORDS` = passwords separados por `|`

## Quick Start (Local)

Para desarrollo local, puedes usar `docker-compose.local.yml` o agregar ports manualmente:

```bash
cp .env.example .env
docker compose up --build
```

## Deploy to EasyPanel

### Step 1: Connect GitHub
1. EasyPanel → **Projects** → **Create New**
2. Select **Docker Compose**
3. Connect your GitHub repository

### Step 2: Environment Variables
| Variable | Example | Required |
|----------|---------|----------|
| `MONGO_DB_NAME` | `inverser_db` | No |
| `FRONTEND_URL` | `https://tu-dominio.com` | **Yes** |
| `PUBLIC_API_URL` | `https://tu-dominio.com` | **Yes** |
| `ADMIN_PASSWORDS` | `clave1\|clave2\|clave3` | **Yes** |
| `CORS_ORIGINS` | `*` | No |

### Step 3: Map Domain
- Map your domain to service `frontend` (port 80)
- Enable HTTPS/SSL

### Step 4: Deploy
Click Deploy. Done.

## Project Structure

```
/app
├── docker-compose.yml      # EasyPanel-ready (no ports/container_name)
├── .env.example            # Template de variables
├── backend/
│   ├── Dockerfile
│   └── server.py           # Entrypoint: uvicorn server:app
└── frontend/
    ├── Dockerfile
    └── nginx.conf          # SPA routing
```

## Authentication

- Login simple con múltiples passwords (sin usuarios/roles)
- Variable: `ADMIN_PASSWORDS=pass1|pass2|pass3`
- Separador: pipe `|`

## Troubleshooting

| Problema | Solución |
|----------|----------|
| Magic links con URL incorrecta | Verificar `FRONTEND_URL` |
| Frontend no conecta a API | Verificar `PUBLIC_API_URL` |
| Login no funciona | Verificar `ADMIN_PASSWORDS` (separados por `\|`) |
| 404 al refrescar página | Verificar nginx.conf tiene `try_files` |

## License

Proprietary - InverSer SBS LLC © 2009-2025
