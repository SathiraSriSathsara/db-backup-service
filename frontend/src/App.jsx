import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import store from './redux/store';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import DatabaseServers from './pages/DatabaseServers';
import BackupSchedules from './pages/BackupSchedules';
import BackupHistory from './pages/BackupHistory';
import StorageProviders from './pages/StorageProviders';
import Users from './pages/Users';
import Settings from './pages/Settings';
import Profile from './pages/Profile';

export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/database-servers"
            element={
              <ProtectedRoute>
                <Layout>
                  <DatabaseServers />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/backup-schedules"
            element={
              <ProtectedRoute>
                <Layout>
                  <BackupSchedules />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/backup-history"
            element={
              <ProtectedRoute>
                <Layout>
                  <BackupHistory />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/storage-providers"
            element={
              <ProtectedRoute>
                <Layout>
                  <StorageProviders />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <Layout>
                  <Users />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
      <ToastContainer />
    </Provider>
  );
}
