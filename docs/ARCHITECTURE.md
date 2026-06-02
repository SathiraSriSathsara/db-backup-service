# System Architecture

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Client Browser                        │
└────────────────────┬────────────────────────────────────┘
                     │ HTTPS/WebSocket
┌────────────────────▼────────────────────────────────────┐
│              Nginx Reverse Proxy                         │
│           (Rate Limiting, Compression)                   │
└────────────┬─────────────────────────┬──────────────────┘
             │                         │
    ┌────────▼────────┐       ┌────────▼─────────┐
    │ React Frontend  │       │ Node.js Backend  │
    │  (SPA + Redux)  │       │  (Express + ORM) │
    └────────┬────────┘       └────────┬─────────┘
             │                        │
             │        ┌───────────────┼───────────────┐
             │        │               │               │
      ┌──────▼──┐  ┌──▼────┐  ┌──────▼──┐  ┌──────────▼──┐
      │  MySQL  │  │ Redis │  │  Backup │  │   Storage  │
      │         │  │ Cache │  │ Engine  │  │ Providers  │
      └─────────┘  └───────┘  └─────────┘  └────────────┘
```

## Component Architecture

### Backend Services
- **API Layer**: Express.js REST endpoints
- **Authentication**: JWT with refresh tokens, RBAC
- **Business Logic**: Services for each domain
- **Data Layer**: Sequelize ORM with MySQL
- **Backup Engine**: Multi-database support (MySQL, PostgreSQL, MongoDB)
- **Storage Layer**: Pluggable storage providers (Local, SFTP, S3, MinIO)
- **Scheduler**: Node Cron for automated backups
- **Queue**: Redis for async job handling

### Frontend Architecture
- **UI Framework**: React 18 with Material-UI
- **State Management**: Redux Toolkit
- **Routing**: React Router v6
- **API Client**: Axios with interceptors
- **Notifications**: React Toastify
- **Charts**: Recharts for analytics

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx with SSL/TLS support
- **Database**: MySQL 8.0 with persistent volumes
- **Cache**: Redis 7 for session/queue management
- **CI/CD**: GitHub Actions

## Database Schema

### Core Entities
- **Users**: Authentication & authorization
- **Roles**: RBAC (Super Admin, Admin, Viewer)
- **DatabaseServers**: Target databases for backup
- **BackupSchedules**: Backup job configurations
- **BackupJobs**: Execution records
- **BackupFiles**: Generated backup artifacts
- **StorageProviders**: Backup storage destinations
- **Notifications**: User alerts
- **AuditLogs**: System activity tracking

## Data Flow

### Backup Execution Flow
1. Scheduler triggers backup at scheduled time
2. BackupScheduler creates BackupJob record
3. BackupEngine connects to DatabaseServer
4. Database dump created (MySQL/PostgreSQL/MongoDB)
5. Optional: Compress with gzip
6. Optional: Encrypt with AES-256-CBC
7. Upload to StorageProvider (Local/SFTP/S3/MinIO)
8. Create BackupFile record with metadata
9. Update BackupJob status
10. Send notifications to users

### API Request Flow
1. Client sends HTTP request with JWT token
2. Nginx routes to backend
3. Authentication middleware verifies token
4. Authorization middleware checks RBAC
5. Request validator validates input
6. Controller calls appropriate service
7. Service performs business logic
8. Service interacts with models (ORM)
9. Response sent back through Nginx
10. Client updates UI with Redux

## Security Implementation

### Authentication
- JWT tokens with 7-day expiration
- Refresh token mechanism
- Password hashing with bcrypt
- Email verification on registration
- Password reset via email

### Authorization
- Role-based access control (RBAC)
- Three roles: SUPER_ADMIN, ADMIN, VIEWER
- Route protection with middleware
- Resource-level authorization

### Data Protection
- Database credentials encrypted with AES-256-CBC
- SSL/TLS for HTTPS communication
- Helmet.js for HTTP headers security
- CORS configuration
- Rate limiting on authentication endpoints
- Input validation and sanitization
- SQL injection prevention via ORM
- CSRF tokens for sensitive operations

### Audit & Monitoring
- Comprehensive audit logging
- User activity tracking
- Failed login attempts tracking
- Error logging with Winston

## Scalability Considerations

1. **Database**: MySQL can be replaced with managed service (AWS RDS, Azure MySQL)
2. **Cache**: Redis cluster for horizontal scaling
3. **Backend**: Stateless design allows horizontal scaling with load balancer
4. **Storage**: S3/MinIO support enables unlimited storage
5. **CDN**: Nginx can be replaced with CDN for static assets
6. **Monitoring**: Can integrate with ELK stack or Prometheus

## Deployment Options

1. **Docker Compose**: Local/small deployments
2. **Kubernetes**: Enterprise-grade orchestration
3. **AWS**: ECS/EKS with RDS, ElastiCache
4. **Azure**: AKS with Azure Database, Azure Cache
5. **On-premise**: Docker Compose on Linux servers
