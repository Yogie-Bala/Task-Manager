import React, { useState } from 'react';
import {
    Card,
    CardContent,
    Typography,
    CardActions,
    Button,
    Chip,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Avatar,
    Tooltip,
} from '@mui/material';
import { Edit, Delete, CheckCircle, Pending, Person } from '@mui/icons-material';

const TaskCard = ({ task, onEdit, onDelete, isAdmin }) => {
    const [openEdit, setOpenEdit] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [editForm, setEditForm] = useState({
        title: task.title,
        description: task.description,
        status: task.status,
    });

    const handleEditOpen = () => {
        setEditForm({
            title: task.title,
            description: task.description,
            status: task.status,
        });
        setOpenEdit(true);
    };

    const handleEditClose = () => {
        setOpenEdit(false);
    };

    const handleEditSave = () => {
        onEdit(task._id, editForm);
        setOpenEdit(false);
    };

    const handleDeleteConfirm = () => {
        onDelete(task._id);
        setOpenDelete(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <Card
                sx={{
                    mb: 2,
                    position: 'relative',
                    borderLeft: task.status === 'completed'
                        ? '4px solid #4caf50'
                        : '4px solid #ff9800',
                    '&:hover': {
                        boxShadow: 3,
                    },
                }}
            >
                <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                            {task.title}
                        </Typography>
                        <Chip
                            icon={task.status === 'completed' ? <CheckCircle /> : <Pending />}
                            label={task.status}
                            color={task.status === 'completed' ? 'success' : 'warning'}
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                        />
                    </Box>

                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                        {task.description}
                    </Typography>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {isAdmin && task.user && (
                                <Tooltip title={`Assigned to: ${task.user.name}`}>
                                    <Chip
                                        avatar={<Avatar>{task.user.name.charAt(0).toUpperCase()}</Avatar>}
                                        label={task.user.name}
                                        size="small"
                                        variant="outlined"
                                    />
                                </Tooltip>
                            )}
                        </Box>

                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                            <Typography variant="caption" color="text.secondary">
                                Created: {formatDate(task.createdAt)}
                            </Typography>
                            {task.updatedAt !== task.createdAt && (
                                <Typography variant="caption" color="text.secondary">
                                    Updated: {formatDate(task.updatedAt)}
                                </Typography>
                            )}
                        </Box>
                    </Box>

                    {/* Show user email for admin */}
                    {isAdmin && task.user && task.user.email && (
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                            Email: {task.user.email}
                        </Typography>
                    )}
                </CardContent>

                <CardActions sx={{ justifyContent: 'flex-end', borderTop: '1px solid #eee', pt: 1 }}>
                    <Button
                        size="small"
                        color="primary"
                        onClick={handleEditOpen}
                        startIcon={<Edit />}
                        variant="text"
                    >
                        Edit
                    </Button>
                    <Button
                        size="small"
                        color="error"
                        onClick={() => setOpenDelete(true)}
                        startIcon={<Delete />}
                        variant="text"
                    >
                        Delete
                    </Button>
                </CardActions>
            </Card>

            {/* Edit Dialog */}
            <Dialog open={openEdit} onClose={handleEditClose} maxWidth="sm" fullWidth>
                <DialogTitle>Edit Task</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Title"
                        type="text"
                        fullWidth
                        variant="outlined"
                        value={editForm.title}
                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                        required
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Description"
                        type="text"
                        fullWidth
                        multiline
                        rows={4}
                        variant="outlined"
                        value={editForm.description}
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        required
                        sx={{ mb: 2 }}
                    />
                    <FormControl fullWidth>
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={editForm.status}
                            label="Status"
                            onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                        >
                            <MenuItem value="pending">Pending</MenuItem>
                            <MenuItem value="completed">Completed</MenuItem>
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditClose}>Cancel</Button>
                    <Button onClick={handleEditSave} variant="contained" color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this task?</Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        <strong>Title:</strong> {task.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TaskCard;