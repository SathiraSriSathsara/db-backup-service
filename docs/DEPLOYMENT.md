# Deployment Guide

## Prerequisites
- Docker and Docker Compose installed
- SSL certificates (for production)
- Environment variables configured
- Backup directory with appropriate permissions

## Local Deployment (Docker Compose)

### 1. Clone and Setup
```bash
git clone <repository-url>
cd db-backup
cp backend/.env.example backend/.env
```

### 2. Configure Environment
Edit `backend/.env`:
```
NODE_ENV=production
PORT=5000
DB_HOST=mysql
DB_USER=root
DB_PASSWORD=your-secure-password
ENCRYPTION_KEY=your-32-character-encryption-key-here
JWT_SECRET=your-super-secret-jwt-key-change-in-prod
```

### 3. Start Services
```bash
docker-compose up -d
```

### 4. Verify Deployment
```bash
# Check running containers
docker-compose ps

# Check logs
docker-compose logs backend
docker-compose logs frontend

# Test API
curl http://localhost:5000/health
```

## Cloud Deployment

### AWS Deployment

#### Using ECS (Elastic Container Service)

1. **Push images to ECR**
```bash
aws ecr create-repository --repository-name db-backup-backend
aws ecr create-repository --repository-name db-backup-frontend

docker tag db-backup-backend:latest $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/db-backup-backend:latest
docker push $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/db-backup-backend:latest
```

2. **Create RDS MySQL instance**
```bash
aws rds create-db-instance \
  --db-instance-identifier db-backup-mysql \
  --db-instance-class db.t3.micro \
  --engine mysql \
  --master-username admin \
  --master-user-password YourPassword123!
```

3. **Create ECS Task Definition** (See provided task-definition.json)

4. **Create ECS Service**
```bash
aws ecs create-service \
  --cluster db-backup-cluster \
  --service-name db-backup-service \
  --task-definition db-backup-task:1 \
  --desired-count 2 \
  --load-balancers targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=backend,containerPort=5000
```

### Azure Deployment

#### Using AKS (Azure Kubernetes Service)

1. **Create resource group**
```bash
az group create --name db-backup-rg --location eastus
```

2. **Create AKS cluster**
```bash
az aks create \
  --resource-group db-backup-rg \
  --name db-backup-aks \
  --node-count 2 \
  --vm-set-type VirtualMachineScaleSets
```

3. **Deploy using kubectl**
```bash
kubectl apply -f kubernetes/
```

### GCP Deployment

#### Using GKE (Google Kubernetes Engine)

```bash
# Create cluster
gcloud container clusters create db-backup-cluster \
  --zone us-central1-a \
  --num-nodes 2

# Deploy
kubectl apply -f kubernetes/
```

## Kubernetes Deployment

### Create Namespace
```bash
kubectl create namespace db-backup
```

### Deploy with Helm (if using Helm charts)
```bash
helm repo add db-backup <chart-repo>
helm install db-backup db-backup/db-backup \
  -n db-backup \
  -f values.yaml
```

### Manual Kubernetes Deployment
```bash
# Apply manifests
kubectl apply -f kubernetes/namespace.yaml
kubectl apply -f kubernetes/configmap.yaml
kubectl apply -f kubernetes/secret.yaml
kubectl apply -f kubernetes/mysql-deployment.yaml
kubectl apply -f kubernetes/redis-deployment.yaml
kubectl apply -f kubernetes/backend-deployment.yaml
kubectl apply -f kubernetes/frontend-deployment.yaml
kubectl apply -f kubernetes/service.yaml
kubectl apply -f kubernetes/ingress.yaml
```

## SSL/TLS Configuration

### For Docker Compose with Nginx

1. **Generate self-signed certificate** (development)
```bash
mkdir -p ./certs
openssl req -x509 -newkey rsa:4096 -keyout ./certs/key.pem -out ./certs/cert.pem -days 365 -nodes
```

2. **For production, use Let's Encrypt with Certbot**
```bash
docker run -it --rm \
  -v ./certs:/etc/letsencrypt \
  certbot/certbot certonly \
  --standalone \
  -d yourdomain.com
```

3. **Update nginx.conf** to use SSL certificates

## Database Backup and Recovery

### Backup the MySQL database
```bash
docker exec db_backup_mysql mysqldump -u root -proot123456 db_backup > backup.sql
```

### Restore the MySQL database
```bash
docker exec -i db_backup_mysql mysql -u root -proot123456 db_backup < backup.sql
```

## Monitoring and Logging

### View logs
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Health checks
```bash
# Backend health
curl http://localhost:5000/health

# Database health
docker exec db_backup_mysql mysqladmin -u root -proot123456 ping
```

### Metrics (if using Prometheus)
```bash
# Access Prometheus at http://localhost:9090
# Access Grafana at http://localhost:3000
```

## Scaling

### Horizontal Scaling with Docker Compose
```bash
# Scale backend service
docker-compose up --scale backend=3 -d
```

### Kubernetes Horizontal Pod Autoscaler
```bash
kubectl autoscale deployment backend \
  --min=2 \
  --max=10 \
  --cpu-percent=70
```

## Backup and Disaster Recovery

### Regular Backups
1. Set up cron jobs for database backups
2. Backup to multiple storage locations
3. Test restore procedures regularly
4. Keep backup logs

### Recovery Procedure
1. Stop the application
2. Restore database from backup
3. Restore application files if needed
4. Restart services
5. Verify data integrity
6. Resume operations

## Performance Tuning

### MySQL Optimization
- Enable query caching
- Optimize indexes
- Configure connection pool
- Enable slow query log

### Redis Configuration
- Set appropriate maxmemory policy
- Enable persistence
- Configure replication

### Application Optimization
- Enable compression
- Optimize Docker images
- Use CDN for static assets
- Configure proper cache headers

## Security Hardening

- Enable SSL/TLS encryption
- Use strong passwords
- Implement rate limiting
- Enable audit logging
- Regular security updates
- Use security scanning tools
- Implement WAF (Web Application Firewall)
- Enable DDoS protection

## Troubleshooting

### Common Issues

1. **Connection refused**
   - Check if services are running
   - Verify port mappings
   - Check firewall rules

2. **Database connection errors**
   - Verify credentials
   - Check database is running
   - Check network connectivity

3. **Out of memory**
   - Increase Docker memory limits
   - Check for memory leaks
   - Scale horizontally

4. **Slow backups**
   - Check network bandwidth
   - Verify storage I/O
   - Optimize backup compression

## Maintenance

- Regular security patching
- Database maintenance (OPTIMIZE, ANALYZE)
- Log rotation and cleanup
- Backup verification
- Performance monitoring
- Dependency updates

---

For more details, see the main README.md and ARCHITECTURE.md
