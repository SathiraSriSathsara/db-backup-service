import React, { useEffect, useState } from 'react';
import {
  Grid, Paper, Typography, Box, Card, CardContent, LinearProgress,
} from '@mui/material';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { backupJobApi, databaseServerApi } from '../services/apiService';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalServers: 0,
    totalBackups: 0,
    successRate: 0,
    failedJobs: 0,
  });
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch servers count
      const serversResponse = await databaseServerApi.getAll(1, 1);
      const totalServersCount = serversResponse.data.data.total || 0;
      
      // Fetch all backup jobs to calculate stats
      const jobsResponse = await backupJobApi.getAll(1, 500);
      const jobs = jobsResponse.data.data.data || [];

      const totalBackups = jobs.length;
      const successJobs = jobs.filter((j) => j.status === 'SUCCESS').length;
      const failedJobs = jobs.filter((j) => j.status === 'FAILED').length;
      const successRate = totalBackups > 0 ? Math.round((successJobs / totalBackups) * 100) : 0;

      setStats({
        totalServers: totalServersCount,
        totalBackups,
        successRate,
        failedJobs,
      });

      // Generate real chart data from jobs, grouped by date
      const dateMap = {};
      
      jobs.forEach((job) => {
        const date = new Date(job.startedAt);
        const dateStr = date.toLocaleDateString();
        
        if (!dateMap[dateStr]) {
          dateMap[dateStr] = {
            date: dateStr,
            backups: 0,
            failed: 0,
          };
        }
        
        if (job.status === 'SUCCESS') {
          dateMap[dateStr].backups += 1;
        } else if (job.status === 'FAILED') {
          dateMap[dateStr].failed += 1;
        }
      });

      // Get last 7 days and fill missing dates with 0
      const last7Days = [];
      for (let i = 6; i >= 0; i -= 1) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toLocaleDateString();
        
        last7Days.push(dateMap[dateStr] || {
          date: dateStr,
          backups: 0,
          failed: 0,
        });
      }
      
      setChartData(last7Days);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, color }) => (
    <Card sx={{ backgroundColor: color, color: 'white' }}>
      <CardContent>
        <Typography color="inherit" gutterBottom>
          {title}
        </Typography>
        <Typography variant="h5">{value}</Typography>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <LinearProgress />;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Dashboard</Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Servers" value={stats.totalServers} color="#1976d2" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Total Backups" value={stats.totalBackups} color="#388e3c" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Success Rate" value={`${stats.successRate}%`} color="#f57c00" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Failed Jobs" value={stats.failedJobs} color="#d32f2f" />
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Daily Backup Trend</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="backups" 
                  stroke="#1976d2"
                  name="Successful Backups"
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>Success vs Failed</Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="backups" fill="#388e3c" name="Successful" />
                <Bar dataKey="failed" fill="#d32f2f" name="Failed" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
