import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  servers: [],
  currentServer: null,
  loading: false,
  error: null,
  pagination: { page: 1, limit: 10, total: 0 },
};

const databaseSlice = createSlice({
  name: 'database',
  initialState,
  reducers: {
    setServers: (state, action) => {
      state.servers = action.payload;
    },
    setCurrentServer: (state, action) => {
      state.currentServer = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setServers, setCurrentServer, setLoading, setError, setPagination, clearError } = databaseSlice.actions;
export default databaseSlice.reducer;
