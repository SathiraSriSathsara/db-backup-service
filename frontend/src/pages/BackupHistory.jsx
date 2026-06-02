import React, { useEffect, useState } from 'react';
import {
  Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Chip, Alert,
} from '@mui/material';
import { backupJobApi, databaseServerApi } from '../services/apiService';
import { toast } from 'react-toastify';

export default function BackupHistory() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBackupJobs();
  }, []);

  const fetchBackupJobs = async () => {
    try {
      setLoading(true);
      const response = await backupJobApi.getAll(1, 50);
      setJobs(response.data.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch backup history');
      toast.error('Failed to fetch backup history');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'SUCCESS':
        return 'success';
      case 'FAILED':
        return 'error';
      case 'IN_PROGRESS':
        return 'warning';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5">Backup History</Typography>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Server</TableCell>
                <TableCell>Schedule</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Size</TableCell>
                <TableCell>Started</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {jobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No backup history available
                  </TableCell>
                </TableRow>
              ) : (
                jobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>{job.DatabaseServer?.name || 'N/A'}</TableCell>
                    <TableCell>{job.BackupSchedule?.name || 'Manual'}</TableCell>
                    <TableCell>
                      <Chip label={job.status} color={getStatusColor(job.status)} />
                    </TableCell>
                    <TableCell>
                      {job.backupSize ? `${(job.backupSize / 1024 / 1024 / 1024).toFixed(2)} GB` : 'N/A'}
                    </TableCell>
                    <TableCell>{new Date(job.startedAt).toLocaleString()}</TableCell>
                    <TableCell>{job.completedAt ? new Date(job.completedAt).toLocaleString() : 'In Progress'}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
