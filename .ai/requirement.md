Senior Software Architect Prompt

Act as a Senior Full-Stack Software Architect and Staff Engineer.

Design and implement a production-ready, Docker-supported Database Backup Management Platform with the following requirements.

Technology Stack
Backend
Node.js (Latest LTS)
Express.js
Sequelize ORM
MySQL (Platform database)
JWT Authentication
RBAC (Role Based Access Control)
Socket.IO for real-time updates
Node Cron for scheduled backups
Docker SDK or Docker CLI integration
Winston Logging
Redis for queue/cache (optional)
Multer for file uploads
Nodemailer for email notifications
Frontend
React.js
React Router
Redux Toolkit
Axios
Material UI (MUI)
Recharts for analytics
Socket.IO Client
React Hook Form
DevOps
Docker
Docker Compose
Nginx Reverse Proxy
GitHub Actions CI/CD
Linux Server Deployment
Project Overview

Build a web-based Database Backup Management Platform that allows administrators to:

Register database servers
Configure backup schedules
Execute manual backups
Monitor backup jobs
Download backup files
Restore backups
View backup history
Manage storage locations
Receive notifications
Monitor backup health

The system must support:

MySQL
MariaDB
PostgreSQL
MongoDB

Future support should be easy to add.

Core Features
Authentication

Implement:

Login
Logout
Refresh Tokens
Password Reset
Email Verification
Multi-device Sessions

Roles:

Super Admin
Full access
Admin
Manage backups and servers
Viewer
Read-only access
Database Server Management

Users should be able to add:

Database Name
Host
Port
Username
Password (encrypted)
Database Type
SSL Configuration

Features:

Test Connection
Edit Server
Delete Server
Enable/Disable

Store credentials securely using AES encryption.

Backup Scheduling

Allow creating schedules:

Frequency
Every X Minutes
Hourly
Daily
Weekly
Monthly
Custom Cron Expression

Options:

Retention Period
Compression
Encryption
File Naming Pattern
Auto Cleanup

Example:

Backup MySQL every day at 1:00 AM.

Backup Engine

Implement a Backup Service Layer.

For each database type:

MySQL

Use:

mysqldump

PostgreSQL

Use:

pg_dump

MongoDB

Use:

mongodump

Features:

Compression (gzip)
Streaming backup generation
Large file support
Progress tracking
Error handling
Retry mechanism

Backup metadata must be stored in database.

Docker Integration

The entire platform must run inside Docker.

Create:

docker-compose.yml

Services:

frontend
backend
mysql
redis
nginx

Implement:

Volume mappings
Environment variables
Health checks
Restart policies
Storage Providers

Design a pluggable storage architecture.

Initial providers:

Local Storage

Store backups locally.

SFTP Storage

Upload backups to remote server.

Amazon S3

Upload backups to S3 bucket.

MinIO

S3 compatible support.

Each backup job can choose storage destination.

Backup Restore System

Allow:

Restore entire backup
Restore selected backup version

Features:

Validation before restore
Confirmation workflow
Restore logs
Rollback protection
Dashboard

Build a modern admin dashboard.

Widgets:

Statistics
Total Servers
Total Backups
Success Rate
Failed Jobs
Charts
Daily Backup Trend
Storage Usage
Success vs Failure
Activity Feed

Real-time updates using Socket.IO.

Backup History

Display:

Backup Name
Database
Status
Size
Duration
Storage Location
Download Link
Created Date

Features:

Search
Filtering
Pagination
Export CSV
Notifications

Support:

Email

Notify:

Backup Success
Backup Failure
Restore Success
Restore Failure
In-App Notifications

Real-time notifications.

Logging & Auditing

Create centralized audit logs.

Track:

Login
Backup Creation
Backup Execution
Restore Operations
Server Modifications
User Actions

Include:

User
IP
Timestamp
Action
API Design

Create RESTful APIs.

Modules:

Auth
Users
Roles
Database Servers
Backup Jobs
Backup History
Storage Providers
Notifications
Audit Logs
Dashboard Analytics

Generate:

Controllers
Services
Repositories
Routes
Validators
Middleware
Frontend Requirements

Create pages:

Login
Dashboard
Users
Database Servers
Backup Schedules
Backup History
Storage Providers
Notifications
Audit Logs
Settings

Requirements:

Responsive Design
Dark Mode
Loading States
Error Handling
Toast Notifications
Security Requirements

Implement:

Helmet
CORS
Rate Limiting
CSRF Protection
JWT Security
Password Hashing (bcrypt)
Encrypted Credentials
Secure File Downloads

Follow OWASP best practices.

Database Design

Create complete Sequelize models:

User
Role
UserSession
DatabaseServer
BackupSchedule
BackupJob
BackupFile
StorageProvider
Notification
AuditLog

Generate:

ER Diagram
Relationships
Migrations
Seeders
CI/CD

Create:

GitHub Actions workflows for:

Testing
Build
Docker Build
Docker Push
Production Deployment
Deliverables

Generate:

Complete system architecture
Folder structure
Database schema
Sequelize models
API specifications
React frontend architecture
Docker configuration
Docker Compose setup
Nginx configuration
GitHub Actions pipelines
Security implementation
Backup execution engine
Storage provider abstraction layer
Step-by-step implementation roadmap

Use enterprise-grade code organization, clean architecture principles, SOLID principles, and production-ready standards.

Start by generating the complete system architecture and project folder structure before writing any code.