# Ceylon Travo - Docker Setup

This document describes how to run Ceylon Travo using Docker containers with non-conflicting ports.

## Port Configuration

The application uses the following ports to avoid conflicts with other running containers:

- **Frontend (Nginx)**: `8081` → Internal `80`
- **Backend API**: `3001` → Internal `4000`
- **MySQL Database**: `3307` → Internal `3306`

## Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Create environment file**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the values, especially `JWT_SECRET` for production.

2. **Build and start all services**:
   ```bash
   docker-compose up -d
   ```

3. **Check service status**:
   ```bash
   docker-compose ps
   ```

4. **View logs**:
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f ceylontravo-backend
   docker-compose logs -f ceylontravo-frontend
   docker-compose logs -f ceylontravo-db
   ```

## Accessing the Application

- **Frontend**: http://localhost:8081
- **Backend API**: http://localhost:3001/api
- **MySQL**: `localhost:3307` (username: `ceylontravo_user`, password from `.env`)

## Database Management

### Run Migrations

Migrations are automatically run when the backend container starts. To run manually:

```bash
docker-compose exec ceylontravo-backend npx prisma migrate deploy
```

### Seed Database

```bash
docker-compose exec ceylontravo-backend npm run seed
```

### Access MySQL CLI

```bash
docker-compose exec ceylontravo-db mysql -u ceylontravo_user -p ceylontravo
```

## Development Commands

### Rebuild a specific service

```bash
# Rebuild backend
docker-compose up -d --build ceylontravo-backend

# Rebuild frontend
docker-compose up -d --build ceylontravo-frontend
```

### Stop all services

```bash
docker-compose down
```

### Stop and remove volumes (WARNING: deletes database data)

```bash
docker-compose down -v
```

### Restart a service

```bash
docker-compose restart ceylontravo-backend
```

## Troubleshooting

### Port Conflicts

If you still encounter port conflicts, edit `docker-compose.yml` and change the host ports:

```yaml
ports:
  - "NEW_PORT:CONTAINER_PORT"
```

### Database Connection Issues

1. Ensure the database is healthy:
   ```bash
   docker-compose ps
   ```

2. Check backend logs:
   ```bash
   docker-compose logs ceylontravo-backend
   ```

3. Verify DATABASE_URL in the backend container:
   ```bash
   docker-compose exec ceylontravo-backend env | grep DATABASE_URL
   ```

### Container Won't Start

1. Check logs:
   ```bash
   docker-compose logs [service-name]
   ```

2. Remove and recreate containers:
   ```bash
   docker-compose down
   docker-compose up -d
   ```

## Production Deployment

1. Update `.env` with strong passwords and secrets
2. Set `NODE_ENV=production`
3. Use a reverse proxy (Nginx/Traefik) for SSL/TLS
4. Consider using Docker secrets or external secret management
5. Set up regular database backups
6. Configure proper logging and monitoring

## Container Names

All containers are prefixed with `ceylontravo-` to avoid naming conflicts:

- `ceylontravo-frontend`
- `ceylontravo-backend`
- `ceylontravo-db`

Network: `ceylontravo-network`
Volume: `ceylontravo-db-data`

## Health Checks

All services include health checks:

- **Database**: MySQL ping check every 10s
- **Backend**: HTTP check on port 4000 every 30s
- **Frontend**: HTTP check on port 80 every 30s
