import React from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    Avatar,
    Menu,
    MenuItem,
    IconButton,
    Chip,
    Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
    ExitToApp,
    Dashboard,
    Person as PersonIcon,
    AdminPanelSettings as AdminIcon
} from '@mui/icons-material';

const Navbar = ({ user, onLogout }) => {
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleClose();
        onLogout();
    };

    const goToDashboard = () => {
        handleClose();
        navigate('/dashboard');
    };

    return (
        <AppBar position="static" sx={{ mb: 4 }}>
            <Toolbar>
                <Typography
                    variant="h6"
                    component="div"
                    sx={{
                        flexGrow: 1,
                        cursor: 'pointer',
                        fontWeight: 'bold',
                    }}
                    onClick={() => navigate('/dashboard')}
                >
                    Task Manager
                </Typography>

                {user ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Box sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 1 }}>
                            <Typography variant="body1">
                                {user.name}
                            </Typography>
                            <Tooltip title={`Role: ${user.role}`}>
                                <Chip
                                    icon={user.role === 'admin' ? <AdminIcon /> : <PersonIcon />}
                                    label={user.role}
                                    size="small"
                                    color={user.role === 'admin' ? 'secondary' : 'primary'}
                                    sx={{ textTransform: 'capitalize' }}
                                />
                            </Tooltip>
                        </Box>
                        <IconButton
                            onClick={handleMenu}
                            color="inherit"
                            size="large"
                        >
                            <Avatar
                                sx={{
                                    width: 35,
                                    height: 35,
                                    bgcolor: user.role === 'admin' ? 'secondary.main' : 'primary.main',
                                }}
                            >
                                {user.name?.charAt(0).toUpperCase()}
                            </Avatar>
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={Boolean(anchorEl)}
                            onClose={handleClose}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'right',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                        >
                            <MenuItem onClick={goToDashboard}>
                                <Dashboard sx={{ mr: 1, fontSize: 20 }} /> Dashboard
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>
                                <ExitToApp sx={{ mr: 1, fontSize: 20 }} /> Logout
                            </MenuItem>
                        </Menu>
                    </Box>
                ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button color="inherit" onClick={() => navigate('/login')}>
                            Login
                        </Button>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/register')}
                            variant="outlined"
                            sx={{
                                borderColor: 'white',
                                '&:hover': {
                                    borderColor: 'white',
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                }
                            }}
                        >
                            Register
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;