import api from './api';

export const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (data) => api.post('/auth/register', data),
  logout: () => api.post('/auth/logout'),
  refreshToken: (token) => api.post('/auth/refresh-token', { refreshToken: token }),
  requestPasswordReset: (email) => api.post('/auth/request-password-reset', { email }),
  resetPassword: (token, password) => api.post('/auth/reset-password', { token, password }),
};

export const userApi = {
  getAll: (page = 1, limit = 10) => api.get('/users', { params: { page, limit } }),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  changePassword: (data) => api.post('/users/change-password', data),
};

export const databaseServerApi = {
  getAll: (page = 1, limit = 10) => api.get('/database-servers', { params: { page, limit } }),
  getById: (id) => api.get(`/database-servers/${id}`),
  create: (data) => api.post('/database-servers', data),
  update: (id, data) => api.put(`/database-servers/${id}`, data),
  delete: (id) => api.delete(`/database-servers/${id}`),
  testConnection: (id) => api.post(`/database-servers/${id}/test-connection`),
};

export const backupScheduleApi = {
  getAll: (page = 1, limit = 10) => api.get('/backup-schedules', { params: { page, limit } }),
  getById: (id) => api.get(`/backup-schedules/${id}`),
  create: (data) => api.post('/backup-schedules', data),
  update: (id, data) => api.put(`/backup-schedules/${id}`, data),
  delete: (id) => api.delete(`/backup-schedules/${id}`),
  toggle: (id, isActive) => api.post(`/backup-schedules/${id}/toggle`, { isActive }),
};

export const backupJobApi = {
  getAll: (page = 1, limit = 10, filters = {}) => api.get('/backup-jobs', { params: { page, limit, ...filters } }),
  getById: (id) => api.get(`/backup-jobs/${id}`),
  getByServer: (serverId, page = 1, limit = 10) => api.get(`/backup-jobs/server/${serverId}`, { params: { page, limit } }),
  delete: (id) => api.delete(`/backup-jobs/${id}`),
};

export const storageProviderApi = {
  getAll: (page = 1, limit = 10) => api.get('/storage-providers', { params: { page, limit } }),
  getById: (id) => api.get(`/storage-providers/${id}`),
  create: (data) => api.post('/storage-providers', data),
  update: (id, data) => api.put(`/storage-providers/${id}`, data),
  delete: (id) => api.delete(`/storage-providers/${id}`),
};
