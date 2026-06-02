# API Documentation

## Authentication Endpoints

### Register
- **POST** `/api/auth/register`
- **Body**: `{ email, firstName, lastName, password }`
- **Response**: User object

### Login
- **POST** `/api/auth/login`
- **Body**: `{ email, password }`
- **Response**: `{ user, token, refreshToken }`

### Logout
- **POST** `/api/auth/logout`
- **Auth**: Required
- **Response**: Success message

### Refresh Token
- **POST** `/api/auth/refresh-token`
- **Body**: `{ refreshToken }`
- **Response**: `{ token }`

### Request Password Reset
- **POST** `/api/auth/request-password-reset`
- **Body**: `{ email }`
- **Response**: Success message

### Reset Password
- **POST** `/api/auth/reset-password`
- **Body**: `{ token, password }`
- **Response**: Success message

## User Endpoints

### Get All Users
- **GET** `/api/users?page=1&limit=10`
- **Auth**: Required (ADMIN)
- **Response**: Paginated user list

### Get User by ID
- **GET** `/api/users/:id`
- **Auth**: Required
- **Response**: User object

### Update User
- **PUT** `/api/users/:id`
- **Auth**: Required
- **Body**: `{ email, firstName, lastName, isActive, roleId }`
- **Response**: Updated user object

### Delete User
- **DELETE** `/api/users/:id`
- **Auth**: Required (SUPER_ADMIN)
- **Response**: Success message

### Change Password
- **POST** `/api/users/change-password`
- **Auth**: Required
- **Body**: `{ currentPassword, newPassword }`
- **Response**: Success message

## Database Server Endpoints

### Get All Servers
- **GET** `/api/database-servers?page=1&limit=10`
- **Auth**: Required
- **Response**: Paginated server list

### Get Server by ID
- **GET** `/api/database-servers/:id`
- **Auth**: Required
- **Response**: Server object

### Create Server
- **POST** `/api/database-servers`
- **Auth**: Required (ADMIN)
- **Body**: `{ name, type, host, port, database, username, password, ssl }`
- **Response**: Created server object

### Update Server
- **PUT** `/api/database-servers/:id`
- **Auth**: Required (ADMIN)
- **Body**: Same as create
- **Response**: Updated server object

### Delete Server
- **DELETE** `/api/database-servers/:id`
- **Auth**: Required (ADMIN)
- **Response**: Success message

### Test Connection
- **POST** `/api/database-servers/:id/test-connection`
- **Auth**: Required
- **Response**: `{ success, message }`

## Backup Schedule Endpoints

### Get All Schedules
- **GET** `/api/backup-schedules?page=1&limit=10`
- **Auth**: Required
- **Response**: Paginated schedule list

### Get Schedule by ID
- **GET** `/api/backup-schedules/:id`
- **Auth**: Required
- **Response**: Schedule object

### Create Schedule
- **POST** `/api/backup-schedules`
- **Auth**: Required (ADMIN)
- **Body**: `{ name, frequency, cronExpression, serverId, storageProviderId, retentionDays, compression, encryption, fileNamingPattern }`
- **Response**: Created schedule object

### Update Schedule
- **PUT** `/api/backup-schedules/:id`
- **Auth**: Required (ADMIN)
- **Body**: Same as create
- **Response**: Updated schedule object

### Delete Schedule
- **DELETE** `/api/backup-schedules/:id`
- **Auth**: Required (ADMIN)
- **Response**: Success message

### Toggle Schedule
- **POST** `/api/backup-schedules/:id/toggle`
- **Auth**: Required (ADMIN)
- **Body**: `{ isActive }`
- **Response**: Updated schedule object

## Backup Job Endpoints

### Get All Jobs
- **GET** `/api/backup-jobs?page=1&limit=10&serverId=&status=`
- **Auth**: Required
- **Response**: Paginated job list

### Get Job by ID
- **GET** `/api/backup-jobs/:id`
- **Auth**: Required
- **Response**: Job object with files

### Get Jobs by Server
- **GET** `/api/backup-jobs/server/:serverId?page=1&limit=10`
- **Auth**: Required
- **Response**: Paginated job list for server

### Delete Job
- **DELETE** `/api/backup-jobs/:id`
- **Auth**: Required (ADMIN)
- **Response**: Success message

## Storage Provider Endpoints

### Get All Providers
- **GET** `/api/storage-providers?page=1&limit=10`
- **Auth**: Required
- **Response**: Paginated provider list

### Get Provider by ID
- **GET** `/api/storage-providers/:id`
- **Auth**: Required
- **Response**: Provider object

### Create Provider
- **POST** `/api/storage-providers`
- **Auth**: Required (ADMIN)
- **Body**: `{ name, type, config, isDefault, isActive }`
- **Response**: Created provider object

### Update Provider
- **PUT** `/api/storage-providers/:id`
- **Auth**: Required (ADMIN)
- **Body**: Same as create
- **Response**: Updated provider object

### Delete Provider
- **DELETE** `/api/storage-providers/:id`
- **Auth**: Required (ADMIN)
- **Response**: Success message

## Response Format

All responses follow this format:

**Success**:
```json
{
  "status": "success",
  "message": "Optional message",
  "data": {}
}
```

**Error**:
```json
{
  "status": "error",
  "statusCode": 400,
  "message": "Error description"
}
```

## Error Codes

- **400**: Bad Request - Validation error
- **401**: Unauthorized - Missing or invalid token
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Duplicate resource
- **500**: Internal Server Error
