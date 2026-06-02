import React, { useEffect, useState } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, TextField, Alert, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { backupScheduleApi, databaseServerApi } from '../services/apiService';
import { toast } from 'react-toastify';

export default function BackupSchedules() {
  const [schedules, setSchedules] = useState([]);
  const [servers, setServers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);
  const [formData, setFormData] = useState({
    serverId: '', name: '', cronExpression: '0 2 * * *', isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSchedules();
    fetchServers();
  }, []);

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await backupScheduleApi.getAll();
      setSchedules(response.data.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch schedules');
      toast.error('Failed to fetch schedules');
    } finally {
      setLoading(false);
    }
  };

  const fetchServers = async () => {
    try {
      const response = await databaseServerApi.getAll(1, 100);
      setServers(response.data.data.data);
    } catch (err) {
      toast.error('Failed to fetch servers');
    }
  };

  const handleOpenDialog = (schedule = null) => {
    if (schedule) {
      setEditingSchedule(schedule);
      setFormData(schedule);
    } else {
      setEditingSchedule(null);
      setFormData({
        serverId: '', name: '', cronExpression: '0 2 * * *', isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingSchedule(null);
  };

  const handleSave = async () => {
    try {
      if (editingSchedule) {
        await backupScheduleApi.update(editingSchedule.id, formData);
        toast.success('Schedule updated successfully');
      } else {
        await backupScheduleApi.create(formData);
        toast.success('Schedule created successfully');
      }
      fetchSchedules();
      handleCloseDialog();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save schedule');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await backupScheduleApi.delete(id);
        toast.success('Schedule deleted successfully');
        fetchSchedules();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete schedule');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Backup Schedules</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Schedule
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      {loading ? (
        <Typography>Loading...</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Name</TableCell>
                <TableCell>Server</TableCell>
                <TableCell>Cron Expression</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {schedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.name}</TableCell>
                  <TableCell>{schedule.DatabaseServer?.name || 'N/A'}</TableCell>
                  <TableCell>{schedule.cronExpression}</TableCell>
                  <TableCell>{schedule.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(schedule)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(schedule.id)}
                      startIcon={<DeleteIcon />}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            {editingSchedule ? 'Edit Schedule' : 'Add New Schedule'}
          </Typography>
          <FormControl fullWidth margin="normal">
            <InputLabel>Database Server</InputLabel>
            <Select
              value={formData.serverId}
              onChange={(e) => setFormData({ ...formData, serverId: e.target.value })}
              label="Database Server"
            >
              {servers.map((server) => (
                <MenuItem key={server.id} value={server.id}>{server.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Schedule Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Cron Expression"
            value={formData.cronExpression}
            onChange={(e) => setFormData({ ...formData, cronExpression: e.target.value })}
            margin="normal"
            helperText="e.g., '0 2 * * *' for daily at 2 AM"
          />
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>Save</Button>
            <Button variant="outlined" onClick={handleCloseDialog}>Cancel</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
