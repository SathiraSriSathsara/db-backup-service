import React, { useEffect, useState } from 'react';
import {
  Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Dialog, TextField, Alert, Select, MenuItem, FormControl, InputLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { storageProviderApi } from '../services/apiService';
import { toast } from 'react-toastify';

export default function StorageProviders() {
  const [providers, setProviders] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProvider, setEditingProvider] = useState(null);
  const [formData, setFormData] = useState({
    name: '', type: 'LOCAL', path: '', accessKey: '', secretKey: '', region: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      setLoading(true);
      const response = await storageProviderApi.getAll();
      setProviders(response.data.data.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch storage providers');
      toast.error('Failed to fetch storage providers');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (provider = null) => {
    if (provider) {
      setEditingProvider(provider);
      setFormData(provider);
    } else {
      setEditingProvider(null);
      setFormData({
        name: '', type: 'LOCAL', path: '', accessKey: '', secretKey: '', region: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProvider(null);
  };

  const handleSave = async () => {
    try {
      if (editingProvider) {
        await storageProviderApi.update(editingProvider.id, formData);
        toast.success('Provider updated successfully');
      } else {
        await storageProviderApi.create(formData);
        toast.success('Provider created successfully');
      }
      fetchProviders();
      handleCloseDialog();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save provider');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure?')) {
      try {
        await storageProviderApi.delete(id);
        toast.success('Provider deleted successfully');
        fetchProviders();
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete provider');
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Storage Providers</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Provider
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
                <TableCell>Type</TableCell>
                <TableCell>Location/Path</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map((provider) => (
                <TableRow key={provider.id}>
                  <TableCell>{provider.name}</TableCell>
                  <TableCell>{provider.type}</TableCell>
                  <TableCell>{provider.path || provider.region || 'N/A'}</TableCell>
                  <TableCell>
                    <Button
                      size="small"
                      onClick={() => handleOpenDialog(provider)}
                      startIcon={<EditIcon />}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      onClick={() => handleDelete(provider.id)}
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
            {editingProvider ? 'Edit Provider' : 'Add New Provider'}
          </Typography>
          <TextField
            fullWidth
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              label="Type"
            >
              <MenuItem value="LOCAL">Local Storage</MenuItem>
              <MenuItem value="AWS_S3">AWS S3</MenuItem>
              <MenuItem value="GOOGLE_CLOUD">Google Cloud</MenuItem>
              <MenuItem value="AZURE">Azure</MenuItem>
            </Select>
          </FormControl>
          {formData.type === 'LOCAL' && (
            <TextField
              fullWidth
              label="Path"
              value={formData.path}
              onChange={(e) => setFormData({ ...formData, path: e.target.value })}
              margin="normal"
            />
          )}
          {formData.type === 'AWS_S3' && (
            <>
              <TextField
                fullWidth
                label="Access Key"
                value={formData.accessKey}
                onChange={(e) => setFormData({ ...formData, accessKey: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Secret Key"
                value={formData.secretKey}
                onChange={(e) => setFormData({ ...formData, secretKey: e.target.value })}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Region"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                margin="normal"
              />
            </>
          )}
          <Box sx={{ mt: 3, display: 'flex', gap: 1 }}>
            <Button variant="contained" onClick={handleSave}>Save</Button>
            <Button variant="outlined" onClick={handleCloseDialog}>Cancel</Button>
          </Box>
        </Box>
      </Dialog>
    </Box>
  );
}
