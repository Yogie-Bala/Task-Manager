import React, { useState, useEffect } from 'react';
import {
    Grid,
    Paper,
    Typography,
    Box,
    Card,
    CardContent,
    Avatar,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Collapse,
    LinearProgress,
    Divider,
} from '@mui/material';
import {
    People as PeopleIcon,
    Assignment as TaskIcon,
    CheckCircle as CompletedIcon,
    Pending as PendingIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import axios from '../api/axios';

const StyledCard = styled(Card)(({ theme }) => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: theme.shadows[4],
    },
}));

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [expandedUser, setExpandedUser] = useState(null);

    useEffect(() => {
        fetchAdminData();
    }, []);

    const fetchAdminData = async () => {
        setLoading(true);
        try {
            // Fetch users with task counts
            const usersResponse = await axios.get('/tasks/admin/users');
            setUsers(usersResponse.data.data);

            // Fetch admin stats
            const statsResponse = await axios.get('/tasks/admin/stats');
            setStats(statsResponse.data.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch admin data');
        } finally {
            setLoading(false);
        }
    };

    const StatCard = ({ icon: Icon, title, value, color, bgColor }) => (
        <StyledCard>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: bgColor, mr: 2 }}>
                        <Icon sx={{ color: 'white' }} />
                    </Avatar>
                    <Typography variant="h6" color="text.secondary">
                        {title}
                    </Typography>
                </Box>
                <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', color: color }}>
                    {value}
                </Typography>
            </CardContent>
        </StyledCard>
    );

    if (loading) {
        return (
            <Box sx={{ width: '100%', mt: 4 }}>
                <LinearProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            {/* Stats Cards */}
            {stats && (
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={PeopleIcon}
                            title="Total Users"
                            value={stats.stats.totalUsers}
                            color="#1976d2"
                            bgColor="#1976d2"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={TaskIcon}
                            title="Total Tasks"
                            value={stats.stats.totalTasks}
                            color="#2e7d32"
                            bgColor="#2e7d32"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={CompletedIcon}
                            title="Completed"
                            value={stats.stats.completedTasks}
                            color="#ed6c02"
                            bgColor="#ed6c02"
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <StatCard
                            icon={PendingIcon}
                            title="Pending"
                            value={stats.stats.pendingTasks}
                            color="#9c27b0"
                            bgColor="#9c27b0"
                        />
                    </Grid>
                </Grid>
            )}

            {/* Users Table */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                    <PeopleIcon sx={{ mr: 1 }} /> Users Management
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Total Users: {users.length}
                </Typography>

                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell>User</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell align="center">Role</TableCell>
                                <TableCell align="center">Total Tasks</TableCell>
                                <TableCell align="center">Completed</TableCell>
                                <TableCell align="center">Pending</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users.map((user) => (
                                <React.Fragment key={user._id}>
                                    <TableRow hover>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                <Avatar sx={{ mr: 2, bgcolor: user.role === 'admin' ? '#dc004e' : '#1976d2' }}>
                                                    {user.name.charAt(0).toUpperCase()}
                                                </Avatar>
                                                <Typography variant="body1">{user.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={user.role}
                                                color={user.role === 'admin' ? 'secondary' : 'primary'}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip label={user.taskCount || 0} size="small" />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={user.completedTasks || 0}
                                                color="success"
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <Chip
                                                label={user.pendingTasks || 0}
                                                color="warning"
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="center">
                                            <IconButton
                                                size="small"
                                                onClick={() => setExpandedUser(expandedUser === user._id ? null : user._id)}
                                            >
                                                {expandedUser === user._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>

                                    {/* Expanded user details - can show user's tasks here */}
                                    <TableRow>
                                        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
                                            <Collapse in={expandedUser === user._id} timeout="auto" unmountOnExit>
                                                <Box sx={{ margin: 2 }}>
                                                    <Typography variant="h6" gutterBottom component="div">
                                                        User Details
                                                    </Typography>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2">
                                                                <strong>User ID:</strong> {user._id}
                                                            </Typography>
                                                            <Typography variant="body2">
                                                                <strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString()}
                                                            </Typography>
                                                        </Grid>
                                                        <Grid item xs={12} sm={6}>
                                                            <Typography variant="body2">
                                                                <strong>Task Completion Rate:</strong>{' '}
                                                                {user.taskCount > 0
                                                                    ? Math.round((user.completedTasks / user.taskCount) * 100)
                                                                    : 0}%
                                                            </Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {users.length === 0 && (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body1" color="text.secondary">
                            No users found
                        </Typography>
                    </Box>
                )}
            </Paper>

            {/* Recent Activity */}
            {stats && (
                <Grid container spacing={3}>
                    {/* Recent Tasks */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <TaskIcon sx={{ mr: 1 }} /> Recent Tasks
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {stats.recentTasks.map((task) => (
                                <Box key={task._id} sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2">{task.title}</Typography>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="caption" color="text.secondary">
                                            by {task.user?.name || 'Unknown'}
                                        </Typography>
                                        <Chip
                                            label={task.status}
                                            size="small"
                                            color={task.status === 'completed' ? 'success' : 'warning'}
                                            sx={{ height: 20 }}
                                        />
                                    </Box>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            ))}
                        </Paper>
                    </Grid>

                    {/* Recent Users */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <PeopleIcon sx={{ mr: 1 }} /> Recent Users
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {stats.recentUsers.map((user) => (
                                <Box key={user._id} sx={{ mb: 2 }}>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="subtitle2">{user.name}</Typography>
                                        <Chip
                                            label={user.role}
                                            size="small"
                                            color={user.role === 'admin' ? 'secondary' : 'default'}
                                            sx={{ height: 20 }}
                                        />
                                    </Box>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        {user.email}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                                    </Typography>
                                    <Divider sx={{ mt: 1 }} />
                                </Box>
                            ))}
                        </Paper>
                    </Grid>
                </Grid>
            )}
        </Box>
    );
};

export default AdminDashboard;