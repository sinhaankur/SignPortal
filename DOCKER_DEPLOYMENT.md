# SignPortal Docker Deployment Guide

This guide covers deploying SignPortal using Docker for offline/on-premises installations.

## Prerequisites

- Docker Engine 20.10+
- Docker Compose v2.0+
- Minimum 4GB RAM
- 20GB available disk space

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/sinhaankur/SignPortal.git
cd SignPortal
```

### 2. Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit with your settings
nano .env
```

**Required settings to change:**
- `JWT_SECRET` - Generate a secure 32+ character key
- `NEXTAUTH_SECRET` - Generate a secure key
- `ENCRYPTION_KEY` - 32-character encryption key
- `POSTGRES_PASSWORD` - Strong database password

### 3. Start Services

```bash
# Start core services (app, database, redis)
docker-compose up -d

# View logs
docker-compose logs -f signportal
```

### 4. Access SignPortal

Open your browser and navigate to: `http://localhost:3000`

---

## Deployment Options

### Basic Deployment (Default)

Core services only: SignPortal app, PostgreSQL, and Redis.

```bash
docker-compose up -d
```

### With Object Storage (MinIO)

For enterprises requiring S3-compatible document storage:

```bash
docker-compose --profile storage up -d
```

Access MinIO Console: `http://localhost:9001`

### With Nginx Reverse Proxy

For production deployments with SSL:

```bash
docker-compose --profile proxy up -d
```

### Development Mode (with pgAdmin)

Includes database administration tools:

```bash
docker-compose --profile dev up -d
```

Access pgAdmin: `http://localhost:5050`

### Full Stack (All Services)

```bash
docker-compose --profile storage --profile proxy --profile dev up -d
```

---

## Configuration Reference

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_PORT` | Application port | 3000 |
| `DATABASE_URL` | PostgreSQL connection string | See .env.example |
| `REDIS_URL` | Redis connection string | redis://redis:6379 |
| `JWT_SECRET` | JWT signing secret | **Must set** |
| `ENCRYPTION_KEY` | Document encryption key | **Must set** |
| `STORAGE_TYPE` | Storage backend (local/s3/minio) | local |

### Storage Configuration

#### Local Storage (Default)

Documents stored on the filesystem:

```env
STORAGE_TYPE=local
STORAGE_PATH=/app/storage
```

#### MinIO (Self-hosted S3)

```env
STORAGE_TYPE=minio
S3_ENDPOINT=http://minio:9000
S3_BUCKET=signportal-documents
S3_ACCESS_KEY=signportal
S3_SECRET_KEY=signportal_minio_password
```

#### AWS S3

```env
STORAGE_TYPE=s3
S3_BUCKET=your-bucket-name
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key
```

---

## Operations

### Starting Services

```bash
docker-compose up -d
```

### Stopping Services

```bash
docker-compose down
```

### Viewing Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f signportal
docker-compose logs -f postgres
```

### Updating SignPortal

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache signportal
docker-compose up -d
```

### Database Backup

```bash
# Create backup
docker-compose exec postgres pg_dump -U signportal signportal > backup_$(date +%Y%m%d).sql

# Restore backup
cat backup_20260303.sql | docker-compose exec -T postgres psql -U signportal signportal
```

### Accessing Shell

```bash
# Application container
docker-compose exec signportal sh

# PostgreSQL
docker-compose exec postgres psql -U signportal signportal
```

---

## Health Checks

SignPortal includes built-in health monitoring:

```bash
# Check application health
curl http://localhost:3000/api/health

# Docker health status
docker-compose ps
```

---

## Security Considerations

### Network Isolation

The docker-compose setup uses an isolated bridge network. Services communicate internally without exposing ports unnecessarily.

### Secrets Management

For production, consider using Docker secrets or a secrets manager:

```bash
# Using Docker secrets
echo "your-secret" | docker secret create jwt_secret -
```

### SSL/TLS

For production deployments, always use HTTPS:

1. Place SSL certificates in `docker/nginx/ssl/`
2. Enable the nginx profile: `docker-compose --profile proxy up -d`
3. Update `NEXTAUTH_URL` to use `https://`

### Regular Updates

Keep Docker images updated:

```bash
docker-compose pull
docker-compose up -d
```

---

## Troubleshooting

### Container won't start

Check logs:
```bash
docker-compose logs signportal
```

Common issues:
- Port conflict: Change `APP_PORT` in .env
- Database not ready: Wait for postgres health check

### Database connection errors

```bash
# Check postgres status
docker-compose ps postgres

# Test connection
docker-compose exec postgres pg_isready
```

### Out of memory

Increase Docker memory allocation or reduce container limits in docker-compose.yml.

### Permission errors

Ensure volumes have correct permissions:
```bash
sudo chown -R 1001:1001 ./storage
```

---

## Support

For issues and questions:
- GitHub Issues: https://github.com/sinhaankur/SignPortal/issues
- Documentation: https://signportal.com/docs
