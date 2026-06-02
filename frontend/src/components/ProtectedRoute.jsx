import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAuthenticated } from '../utils/auth';

export default function ProtectedRoute({ children }) {
  const authState = useSelector((state) => state.auth);
  const isAuth = isAuthenticated() || authState.isAuthenticated;

  return isAuth ? children : <Navigate to="/login" />;
}
