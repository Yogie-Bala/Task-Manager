import React, { useState, useEffect } from 'react';
import {
    Container,
    Grid,
    Paper,
    Typography,
    Box,
    Button,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Alert,
    CircularProgress,
    Divider,
    Tabs,
    Tab,
    Chip,
} from '@mui/material';
import { Add as AddIcon, Dashboard as DashboardIcon, People as PeopleIcon } from '@mui/icons-material';
import TaskCard from '../components/Taskcard';
import AdminDashboard from '../components/AdminDashboard';
import axios from '../api/axios';

const Dashboard = ({ user }) => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openCreate, setOpenCreate] = useState(false);
    const [createForm, setCreateForm] = useState({
        title: '',
        description: '',
        status: 'pending',
    });
    const [formErrors, setFormErrors] = useState({});
    const [tabValue, setTabValue] = useState(0);

    const isAdmin = user?.role === 'admin';

    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await axios.get('/tasks');
            setTasks(response.data.data);
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    };

    const validateCreateForm = () => {
        const errors = {};
        if (!createForm.title.trim()) {
            errors.title = 'Title is required';
        }
        if (!createForm.description.trim()) {
            errors.description = 'Description is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleCreateTask = async () => {
        if (!validateCreateForm()) {
            return;
        }

        try {
            const response = await axios.post('/tasks', createForm);
            setTasks([response.data.data, ...tasks]);
            setOpenCreate(false);
            setCreateForm({ title: '', description: '', status: 'pending' });
            setFormErrors({});
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to create task');
        }
    };

    const handleEditTask = async (taskId, updatedData) => {
        try {
            const response = await axios.put(`/tasks/${taskId}`, updatedData);
            setTasks(tasks.map(task =>
                task._id === taskId ? response.data.data : task
            ));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to update task');
        }
    };

    const handleDeleteTask = async (taskId) => {
        try {
            await axios.delete(`/tasks/${taskId}`);
            setTasks(tasks.filter(task => task._id !== taskId));
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to delete task');
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const pendingTasks = tasks.filter(task => task.status === 'pending');
    const completedTasks = tasks.filter(task => task.status === 'completed');

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* User Info */}
            <Paper sx={{ p: 3, mb: 4 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={8}>
                        <Typography variant="h5" gutterBottom>
                            Welcome, {user?.name}!
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Role: <Chip label={user?.role} color={isAdmin ? 'secondary' : 'primary'} size="small" />
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Email: {user?.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={4} sx={{ textAlign: 'right' }}>
                        <Typography variant="h3" color="primary">
                            {tasks.length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Tasks
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {/* Tabs for Admin */}
            {isAdmin && (
                <Paper sx={{ mb: 4 }}>
                    <Tabs
                        value={tabValue}
                        onChange={handleTabChange}
                        indicatorColor="primary"
                        textColor="primary"
                        centered
                    >
                        <Tab icon={<DashboardIcon />} label="TASKS" />
                        <Tab icon={<PeopleIcon />} label="USERS & STATS" />
                    </Tabs>
                </Paper>
            )}

            {/* Task Creation Button (shown in tasks tab) */}
            {(!isAdmin || tabValue === 0) && (
                <Box sx={{ mb: 4 }}>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenCreate(true)}
                        size="large"
                    >
                        Create New Task
                    </Button>
                </Box>
            )}

            {/* Content based on tab */}
            {isAdmin && tabValue === 1 ? (
                <AdminDashboard />
            ) : (
                /* Tasks Section */
                <Grid container spacing={3}>
                    {/* Pending Tasks */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom color="warning.main">
                                Pending Tasks ({pendingTasks.length})
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {pendingTasks.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No pending tasks
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => setOpenCreate(true)}
                                        sx={{ mt: 2 }}
                                    >
                                        Create your first task
                                    </Button>
                                </Box>
                            ) : (
                                pendingTasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        isAdmin={isAdmin}
                                    />
                                ))
                            )}
                        </Paper>
                    </Grid>

                    {/* Completed Tasks */}
                    <Grid item xs={12} md={6}>
                        <Paper sx={{ p: 3, height: '100%' }}>
                            <Typography variant="h6" gutterBottom color="success.main">
                                Completed Tasks ({completedTasks.length})
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {completedTasks.length === 0 ? (
                                <Box sx={{ textAlign: 'center', py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No completed tasks yet
                                    </Typography>
                                </Box>
                            ) : (
                                completedTasks.map((task) => (
                                    <TaskCard
                                        key={task._id}
                                        task={task}
                                        onEdit={handleEditTask}
                                        onDelete={handleDeleteTask}
                                        isAdmin={isAdmin}
                                    />
                                ))
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            )}

            {/* Create Task Dialog */}
            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        fullWidth
                        variant="outlined"
                        value={createForm.title}
                        onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })}
                        error={!!formErrors.title}
                        helperText={formErrors.title}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        variant="outlined"
                        value={createForm.description}
                        onChange={(e) => setCreateForm({ ...createForm, description: e.target.value })}
                        error={!!formErrors.description}
                        helperText={formErrors.description}
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={createForm.status}
                            label="Status"
                            onChange={(e) => setCreateForm({ ...createForm, status: e.target.value })}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
                    <Button onClick={handleCreateTask} variant="contained" color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Dashboard;