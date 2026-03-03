# SignPortal Deployment Guide

This guide provides step-by-step instructions for deploying SignPortal in your on-premises environment.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [System Requirements](#system-requirements)
3. [Installation Options](#installation-options)
4. [Docker Deployment](#docker-deployment)
5. [Kubernetes Deployment](#kubernetes-deployment)
6. [Manual Installation](#manual-installation)
7. [Configuration](#configuration)
8. [Security Hardening](#security-hardening)
9. [High Availability Setup](#high-availability-setup)
10. [Monitoring & Maintenance](#monitoring--maintenance)
11. [Backup & Recovery](#backup--recovery)
12. [Troubleshooting](#troubleshooting)

---

## Prerequisites

Before installing SignPortal, ensure you have:

### Required Services

| Service | Minimum Version | Purpose |
|---------|-----------------|---------|
| **MySQL** | 8.0+ | Primary database |
| **Redis** | 7.0+ | Session cache & queues |
| **LDAP/AD** | Windows Server 2016+ | User authentication |
| **SMTP Server** | Any | Email notifications |

### Required Software

| Software | Version | Purpose |
|----------|---------|---------|
| **Docker** | 24.0+ | Container runtime |
| **Docker Compose** | 2.20+ | Container orchestration |
| **Node.js** | 18.0+ | Frontend build |
| **.NET SDK** | 8.0+ | Backend build |
| **OpenSSL** | 3.0+ | Certificate operations |

### Network Requirements

| Port | Protocol | Purpose |
|------|----------|---------|
| 443 | HTTPS | Web application |
| 3306 | TCP | MySQL database |
| 6379 | TCP | Redis cache |
| 389/636 | LDAP/LDAPS | Directory service |
| 25/587 | SMTP | Email delivery |

---

## System Requirements

### Minimum Requirements (Development/Testing)

| Resource | Specification |
|----------|---------------|
| CPU | 4 cores |
| RAM | 8 GB |
| Storage | 100 GB SSD |
| Network | 100 Mbps |

### Recommended (Production - Small)

| Resource | Specification |
|----------|---------------|
| CPU | 8 cores |
| RAM | 32 GB |
| Storage | 500 GB NVMe SSD |
| Network | 1 Gbps |

### Enterprise (Production - Large)

| Resource | Specification |
|----------|---------------|
| CPU | 16+ cores |
| RAM | 64+ GB |
| Storage | 2+ TB NVMe SSD (RAID) |
| Network | 10 Gbps |

---

## Installation Options

SignPortal supports multiple deployment methods:

```
┌─────────────────────────────────────────────────────────────────┐
│                    DEPLOYMENT OPTIONS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐  │
│  │   Docker     │  │  Kubernetes  │  │  Manual/Bare Metal   │  │
│  │   Compose    │  │              │  │                      │  │
│  └──────────────┘  └──────────────┘  └──────────────────────┘  │
│                                                                  │
│  Best for:         Best for:         Best for:                  │
│  • Small teams     • Enterprise      • Custom environments     │
│  • Quick setup     • Auto-scaling    • Air-gapped networks     │
│  • Development     • HA required     • Maximum control         │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Docker Deployment

### Step 1: Clone Repository

```bash
git clone https://github.com/your-org/signportal.git
cd signportal
```

### Step 2: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit configuration
nano .env
```

**Required environment variables:**

```env
# Application
APP_URL=https://signportal.company.com
APP_SECRET=your-256-bit-secret-key

# Database
DATABASE_HOST=db
DATABASE_PORT=3306
DATABASE_NAME=signportal
DATABASE_USER=signportal
DATABASE_PASSWORD=secure-password-here

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=redis-password-here

# LDAP/Active Directory
LDAP_URL=ldap://dc.company.com:389
LDAP_BASE_DN=DC=company,DC=com
LDAP_BIND_DN=CN=SignPortal,OU=Services,DC=company,DC=com
LDAP_BIND_PASSWORD=ldap-service-password

# Email
SMTP_HOST=smtp.company.com
SMTP_PORT=587
SMTP_USER=signportal@company.com
SMTP_PASSWORD=smtp-password
SMTP_FROM=noreply@company.com

# Storage
STORAGE_TYPE=s3
S3_ENDPOINT=http://minio:9000
S3_BUCKET=documents
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin

# Security
JWT_SECRET=jwt-secret-key
ENCRYPTION_KEY=aes-256-encryption-key
```

### Step 3: Create Docker Compose File

```yaml
# docker-compose.yml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://api:5000
    depends_on:
      - api
    restart: unless-stopped

  api:
    build:
      context: .
      dockerfile: Dockerfile.api
    ports:
      - "5000:5000"
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
      - ConnectionStrings__DefaultConnection=Server=db;Database=signportal;User=signportal;Password=${DATABASE_PASSWORD}
      - Redis__ConnectionString=redis:6379,password=${REDIS_PASSWORD}
    depends_on:
      - db
      - redis
    restart: unless-stopped
    volumes:
      - ./certs:/app/certs:ro
      - ./logs:/app/logs

  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: ${DATABASE_ROOT_PASSWORD}
      MYSQL_DATABASE: signportal
      MYSQL_USER: signportal
      MYSQL_PASSWORD: ${DATABASE_PASSWORD}
    volumes:
      - mysql_data:/var/lib/mysql
      - ./init-db.sql:/docker-entrypoint-initdb.d/init.sql
    restart: unless-stopped
    command: --default-authentication-plugin=mysql_native_password

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    restart: unless-stopped

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${S3_ACCESS_KEY}
      MINIO_ROOT_PASSWORD: ${S3_SECRET_KEY}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./certs:/etc/nginx/certs:ro
    depends_on:
      - web
      - api
    restart: unless-stopped

volumes:
  mysql_data:
  redis_data:
  minio_data:
```

### Step 4: Generate SSL Certificates

```bash
# Generate self-signed certificate (for testing)
openssl req -x509 -nodes -days 365 -newkey rsa:4096 \
  -keyout certs/signportal.key \
  -out certs/signportal.crt \
  -subj "/CN=signportal.company.com"

# For production, use certificates from your CA
```

### Step 5: Start Services

```bash
# Build and start all services
docker-compose up -d

# Check service status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 6: Initialize Database

```bash
# Run database migrations
docker-compose exec api dotnet ef database update

# Create admin user
docker-compose exec api dotnet signportal.dll create-admin \
  --email admin@company.com \
  --password SecurePassword123!
```

### Step 7: Verify Installation

```bash
# Check health endpoint
curl -k https://localhost/api/health

# Expected response:
# {"status":"healthy","version":"2.0.0","timestamp":"2026-03-03T14:30:00Z"}
```

---

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (1.28+)
- kubectl configured
- Helm 3.x installed
- Ingress controller (nginx-ingress)
- cert-manager (for TLS)

### Step 1: Add Helm Repository

```bash
helm repo add signportal https://charts.signportal.com
helm repo update
```

### Step 2: Create Namespace

```bash
kubectl create namespace signportal
```

### Step 3: Create Secrets

```bash
# Database credentials
kubectl create secret generic signportal-db \
  --namespace signportal \
  --from-literal=password=your-db-password

# LDAP credentials
kubectl create secret generic signportal-ldap \
  --namespace signportal \
  --from-literal=bind-password=your-ldap-password

# Encryption keys
kubectl create secret generic signportal-encryption \
  --namespace signportal \
  --from-literal=jwt-secret=your-jwt-secret \
  --from-literal=encryption-key=your-aes-256-key
```

### Step 4: Create Values File

```yaml
# values.yaml
global:
  domain: signportal.company.com

frontend:
  replicaCount: 2
  image:
    repository: signportal/web
    tag: "2.0.0"
  resources:
    requests:
      cpu: 500m
      memory: 512Mi
    limits:
      cpu: 1000m
      memory: 1Gi

api:
  replicaCount: 3
  image:
    repository: signportal/api
    tag: "2.0.0"
  resources:
    requests:
      cpu: 1000m
      memory: 2Gi
    limits:
      cpu: 2000m
      memory: 4Gi

database:
  host: mysql.database.svc.cluster.local
  port: 3306
  name: signportal
  user: signportal
  existingSecret: signportal-db

redis:
  enabled: true
  architecture: standalone
  auth:
    enabled: true

minio:
  enabled: true
  mode: standalone
  persistence:
    size: 100Gi

ingress:
  enabled: true
  className: nginx
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt-prod
  hosts:
    - host: signportal.company.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: signportal-tls
      hosts:
        - signportal.company.com

ldap:
  url: ldap://dc.company.com:389
  baseDn: DC=company,DC=com
  bindDn: CN=SignPortal,OU=Services,DC=company,DC=com
  existingSecret: signportal-ldap
```

### Step 5: Deploy

```bash
helm install signportal signportal/signportal \
  --namespace signportal \
  --values values.yaml

# Wait for pods
kubectl wait --for=condition=ready pod \
  --all \
  --namespace signportal \
  --timeout=300s
```

### Step 6: Verify Deployment

```bash
# Check pods
kubectl get pods -n signportal

# Check services
kubectl get svc -n signportal

# Check ingress
kubectl get ingress -n signportal

# Test endpoint
curl https://signportal.company.com/api/health
```

---

## Manual Installation

For environments without container support.

### Step 1: Install Dependencies

**Ubuntu/Debian:**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install .NET 8 SDK
wget https://dot.net/v1/dotnet-install.sh
chmod +x dotnet-install.sh
./dotnet-install.sh --channel 8.0

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL 8
sudo apt install -y mysql-server

# Install Redis
sudo apt install -y redis-server

# Install Nginx
sudo apt install -y nginx
```

**RHEL/Rocky Linux:**
```bash
# Enable EPEL
sudo dnf install -y epel-release

# Install .NET 8
sudo dnf install -y dotnet-sdk-8.0

# Install Node.js 18
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo dnf install -y nodejs

# Install MySQL 8
sudo dnf install -y mysql-server
sudo systemctl enable --now mysqld

# Install Redis
sudo dnf install -y redis
sudo systemctl enable --now redis

# Install Nginx
sudo dnf install -y nginx
sudo systemctl enable --now nginx
```

### Step 2: Configure MySQL

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p << EOF
CREATE DATABASE signportal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'signportal'@'localhost' IDENTIFIED BY 'your-secure-password';
GRANT ALL PRIVILEGES ON signportal.* TO 'signportal'@'localhost';
FLUSH PRIVILEGES;
EOF
```

### Step 3: Build Application

```bash
# Clone repository
git clone https://github.com/your-org/signportal.git
cd signportal

# Build frontend
cd frontend
npm install
npm run build
cd ..

# Build backend
cd backend
dotnet restore
dotnet publish -c Release -o /opt/signportal/api
cd ..

# Copy frontend build
cp -r frontend/.next /opt/signportal/web
```

### Step 4: Configure Services

**Create systemd service for API:**
```ini
# /etc/systemd/system/signportal-api.service
[Unit]
Description=SignPortal API Server
After=network.target mysql.service

[Service]
Type=notify
User=signportal
Group=signportal
WorkingDirectory=/opt/signportal/api
ExecStart=/usr/bin/dotnet /opt/signportal/api/SignPortal.API.dll
Restart=always
RestartSec=10
KillSignal=SIGINT
SyslogIdentifier=signportal-api
Environment=ASPNETCORE_ENVIRONMENT=Production
Environment=DOTNET_PRINT_TELEMETRY_MESSAGE=false

[Install]
WantedBy=multi-user.target
```

**Create systemd service for Frontend:**
```ini
# /etc/systemd/system/signportal-web.service
[Unit]
Description=SignPortal Web Application
After=network.target signportal-api.service

[Service]
Type=simple
User=signportal
Group=signportal
WorkingDirectory=/opt/signportal/web
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=10
Environment=NODE_ENV=production
Environment=PORT=3000

[Install]
WantedBy=multi-user.target
```

### Step 5: Configure Nginx

```nginx
# /etc/nginx/sites-available/signportal
server {
    listen 80;
    server_name signportal.company.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name signportal.company.com;

    ssl_certificate /etc/nginx/certs/signportal.crt;
    ssl_certificate_key /etc/nginx/certs/signportal.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers off;

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Increase timeouts for large uploads
        proxy_read_timeout 300;
        proxy_connect_timeout 300;
        proxy_send_timeout 300;
        client_max_body_size 100M;
    }
}
```

### Step 6: Start Services

```bash
# Enable and start services
sudo systemctl daemon-reload
sudo systemctl enable signportal-api signportal-web
sudo systemctl start signportal-api signportal-web

# Enable Nginx
sudo ln -s /etc/nginx/sites-available/signportal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Configuration

### Application Configuration

```json
// appsettings.Production.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=signportal;User=signportal;Password=xxx"
  },
  "Redis": {
    "ConnectionString": "localhost:6379,password=xxx"
  },
  "Jwt": {
    "Secret": "your-256-bit-secret",
    "Issuer": "SignPortal",
    "Audience": "SignPortal",
    "ExpirationMinutes": 60
  },
  "Ldap": {
    "Url": "ldap://dc.company.com:389",
    "BaseDn": "DC=company,DC=com",
    "BindDn": "CN=SignPortal,OU=Services,DC=company,DC=com",
    "BindPassword": "xxx",
    "UseTls": true
  },
  "Storage": {
    "Type": "S3",
    "S3": {
      "Endpoint": "http://localhost:9000",
      "Bucket": "documents",
      "AccessKey": "xxx",
      "SecretKey": "xxx"
    }
  },
  "Email": {
    "SmtpHost": "smtp.company.com",
    "SmtpPort": 587,
    "SmtpUser": "signportal@company.com",
    "SmtpPassword": "xxx",
    "FromAddress": "noreply@company.com",
    "FromName": "SignPortal"
  },
  "Security": {
    "EncryptionKey": "your-aes-256-key",
    "HsmEnabled": false,
    "HsmSlotId": 0
  }
}
```

---

## Security Hardening

### TLS Configuration

```nginx
# Strong TLS settings
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
ssl_prefer_server_ciphers off;
ssl_session_timeout 1d;
ssl_session_cache shared:SSL:10m;
ssl_session_tickets off;
ssl_stapling on;
ssl_stapling_verify on;

# Security headers
add_header Strict-Transport-Security "max-age=63072000" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';" always;
```

### Firewall Rules

```bash
# Allow only necessary ports
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### File Permissions

```bash
# Secure application files
sudo chown -R signportal:signportal /opt/signportal
sudo chmod -R 750 /opt/signportal
sudo chmod 640 /opt/signportal/api/appsettings.*.json
```

---

## Monitoring & Maintenance

### Health Checks

```bash
# Check application health
curl -s https://signportal.company.com/api/health | jq

# Check database connectivity
mysql -u signportal -p -e "SELECT 1"

# Check Redis
redis-cli ping
```

### Log Management

```bash
# View API logs
journalctl -u signportal-api -f

# View web logs
journalctl -u signportal-web -f

# View Nginx access logs
tail -f /var/log/nginx/access.log
```

### Performance Monitoring

```yaml
# prometheus.yml scrape config
scrape_configs:
  - job_name: 'signportal'
    static_configs:
      - targets: ['localhost:5000']
    metrics_path: '/api/metrics'
```

---

## Backup & Recovery

### Database Backup

```bash
#!/bin/bash
# backup-db.sh

BACKUP_DIR="/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup
mysqldump -u signportal -p signportal | gzip > "$BACKUP_DIR/signportal_$DATE.sql.gz"

# Clean old backups
find "$BACKUP_DIR" -type f -mtime +$RETENTION_DAYS -delete

echo "Backup completed: signportal_$DATE.sql.gz"
```

### Document Storage Backup

```bash
#!/bin/bash
# backup-storage.sh

# Sync to backup location
aws s3 sync s3://signportal-documents s3://signportal-backup --profile backup

# Or for MinIO
mc mirror signportal/documents backup/documents
```

### Recovery Procedure

```bash
# Restore database
gunzip < /backups/mysql/signportal_20260303.sql.gz | mysql -u signportal -p signportal

# Restore storage
mc mirror backup/documents signportal/documents
```

---

## Troubleshooting

### Common Issues

**Issue: Cannot connect to database**
```bash
# Check MySQL status
sudo systemctl status mysql

# Test connection
mysql -u signportal -p -e "SELECT 1"

# Check logs
sudo tail -f /var/log/mysql/error.log
```

**Issue: LDAP authentication failing**
```bash
# Test LDAP connection
ldapsearch -x -H ldap://dc.company.com -D "CN=SignPortal,OU=Services,DC=company,DC=com" -W -b "DC=company,DC=com" "(sAMAccountName=testuser)"
```

**Issue: Documents not uploading**
```bash
# Check storage connectivity
mc ls signportal/documents

# Check disk space
df -h

# Check Nginx upload limits
grep client_max_body_size /etc/nginx/nginx.conf
```

**Issue: Slow performance**
```bash
# Check system resources
htop

# Check database performance
mysqladmin -u signportal -p status

# Check Redis memory
redis-cli INFO memory
```

---

## Support

For additional support:

- 📧 **Email:** support@signportal.com
- 📖 **Documentation:** https://docs.signportal.com
- 🎫 **Support Portal:** https://support.signportal.com
- 📞 **Enterprise Support:** Contact your account manager

---

*Deployment Guide Version: 2.0*  
*Last Updated: March 2026*
