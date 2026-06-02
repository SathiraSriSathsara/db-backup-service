import React, { useState } from 'react';
import {
  Box, Paper, Typography, TextField, Button, Divider, Alert, Card, CardContent,
} from '@mui/material';
import { toast } from 'react-toastify';

export default function Settings() {
  const [settings, setSettings] = useState({
    appName: 'DB Backup Manager',
    email: 'admin@dbbackup.com',
    maxBackupSize: 5,
    notificationEmail: 'alerts@dbbackup.com',
    enableNotifications: true,
  });
  const [saved, setSaved] = useState(false);

  const handleChange = (field, value) => {
    setSettings({ ...settings, [field]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    try {
      // In a real application, this would call an API endpoint to save settings
      toast.success('Settings saved successfully');
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Settings</Typography>

      {saved && <Alert severity="success" sx={{ mb: 2 }}>Settings saved successfully!</Alert>}

      <Box sx={{ display: 'grid', gap: 3, maxWidth: 600 }}>
        {/* General Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>General Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Application Name"
              value={settings.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Admin Email"
              value={settings.email}
              onChange={(e) => handleChange('email', e.target.value)}
              margin="normal"
            />
          </CardContent>
        </Card>

        {/* Backup Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Backup Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Max Backup Size (GB)"
              type="number"
              value={settings.maxBackupSize}
              onChange={(e) => handleChange('maxBackupSize', parseInt(e.target.value, 10))}
              margin="normal"
            />
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>Notification Settings</Typography>
            <Divider sx={{ mb: 2 }} />
            <TextField
              fullWidth
              label="Notification Email"
              value={settings.notificationEmail}
              onChange={(e) => handleChange('notificationEmail', e.target.value)}
              margin="normal"
            />
            <Box sx={{ mt: 2 }}>
              <Button
                variant={settings.enableNotifications ? 'contained' : 'outlined'}
                onClick={() => handleChange('enableNotifications', !settings.enableNotifications)}
              >
                {settings.enableNotifications ? 'Notifications Enabled' : 'Notifications Disabled'}
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Save Button */}
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button variant="contained" onClick={handleSave}>Save Settings</Button>
          <Button variant="outlined" onClick={() => window.location.reload()}>Reset</Button>
        </Box>
      </Box>
    </Box>
  );
}
