import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import databaseReducer from './slices/databaseSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    database: databaseReducer,
  },
});

export default store;
