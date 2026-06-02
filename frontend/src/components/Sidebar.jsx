import React from 'react';
import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, Box, Typography,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import StorageIcon from '@mui/icons-material/Storage';
import BackupIcon from '@mui/icons-material/Backup';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';

const menuItems = [
  { path: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
  { path: '/database-servers', label: 'Database Servers', icon: StorageIcon },
  { path: '/backup-schedules', label: 'Backup Schedules', icon: BackupIcon },
  { path: '/backup-history', label: 'Backup History', icon: BackupIcon },
  { path: '/storage-providers', label: 'Storage Providers', icon: StorageIcon },
  { path: '/users', label: 'Users', icon: PeopleIcon, adminOnly: true },
  { path: '/settings', label: 'Settings', icon: SettingsIcon },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Drawer variant="permanent" sx={{ width: 240, '& .MuiDrawer-paper': { width: 240 } }}>
      {/* Logo and App Name */}
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 },
        }}
        onClick={() => navigate('/dashboard')}
      >
        <img src="/logo.png" alt="SnapDB" style={{ width: 40, height: 40 }} />
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
          SnapDB
        </Typography>
      </Box>
      <Divider />

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            onClick={() => navigate(item.path)}
            selected={location.pathname === item.path}
          >
            <ListItemIcon>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </Drawer>
  );
}
