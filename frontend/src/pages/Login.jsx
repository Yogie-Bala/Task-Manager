import React, { useState } from 'react';
import {
    Container,
    Paper,
    Typography,
    TextField,
    Button,
    Box,
    Alert,
    Link,
    CircularProgress,
    InputAdornment,
    IconButton,
    useTheme,
    useMediaQuery,
    Divider,
    Chip,
    Fade,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Login as LoginIcon,
    Email,
    Lock,
    AdminPanelSettings,
    Person,
} from '@mui/icons-material';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import axios from '../api/axios';

const Login = ({ onLogin }) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [loading, setLoading] = useState(false);
    const [focusedField, setFocusedField] = useState('');

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        }
        if (apiError) {
            setApiError('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setApiError('');

        try {
            const response = await axios.post('/auth/login', formData);

            if (response.data.success) {
                const { token, ...userData } = response.data.data;
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                onLogin(userData);
                navigate('/dashboard');
            }
        } catch (error) {
            setApiError(
                error.response?.data?.message || 'Invalid email or password. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleDemoLogin = (email, password) => {
        setFormData({ email, password });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 50%, ${theme.palette.primary.light} 100%)`,
                position: 'relative',
                overflow: 'hidden',
                py: { xs: 2, sm: 4 },
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    opacity: 0.1,
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        width: '200%',
                        height: '200%',
                        top: '-50%',
                        left: '-50%',
                        background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 50%)',
                        animation: 'rotate 20s linear infinite',
                    },
                }}
            />

            <Container maxWidth="sm" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in timeout={1000}>
                    <Paper
                        elevation={24}
                        sx={{
                            p: { xs: 3, sm: 5 },
                            borderRadius: { xs: 2, sm: 4 },
                            background: theme.palette.mode === 'light' 
                                ? 'rgba(255, 255, 255, 0.95)'
                                : 'rgba(18, 18, 18, 0.95)',
                            backdropFilter: 'blur(10px)',
                            border: `1px solid ${theme.palette.divider}`,
                            transition: 'transform 0.3s ease-in-out',
                            '&:hover': {
                                transform: 'translateY(-4px)',
                            },
                        }}
                    >
                        {/* Header Section with Icon */}
                        <Box sx={{ textAlign: 'center', mb: 4 }}>
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: '50%',
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px',
                                    boxShadow: theme.shadows[8],
                                }}
                            >
                                <LoginIcon sx={{ fontSize: 40, color: 'white' }} />
                            </Box>
                            <Typography
                                variant={isMobile ? "h5" : "h4"}
                                gutterBottom
                                sx={{
                                    fontWeight: 700,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}
                            >
                                Log In
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Please sign in to access your account
                            </Typography>
                        </Box>

                        {/* Error Alert */}
                        {apiError && (
                            <Fade in timeout={500}>
                                <Alert
                                    severity="error"
                                    sx={{ mb: 3, borderRadius: 2 }}
                                    onClose={() => setApiError('')}
                                    variant="filled"
                                >
                                    {apiError}
                                </Alert>
                            </Fade>
                        )}

                        {/* Login Form */}
                        <Box component="form" onSubmit={handleSubmit} noValidate>
                            <TextField
                                fullWidth
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('email')}
                                onBlur={() => setFocusedField('')}
                                error={!!errors.email}
                                helperText={errors.email}
                                margin="normal"
                                required
                                disabled={loading}
                                autoFocus
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Email color={focusedField === 'email' ? 'primary' : 'action'} />
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    },
                                }}
                            />

                            <TextField
                                fullWidth
                                label="Password"
                                name="password"
                                type={showPassword ? 'text' : 'password'}
                                value={formData.password}
                                onChange={handleChange}
                                onFocus={() => setFocusedField('password')}
                                onBlur={() => setFocusedField('')}
                                error={!!errors.password}
                                helperText={errors.password}
                                margin="normal"
                                required
                                disabled={loading}
                                variant="outlined"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock color={focusedField === 'password' ? 'primary' : 'action'} />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={togglePasswordVisibility}
                                                edge="end"
                                                size="small"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                                sx={{
                                    '& .MuiOutlinedInput-root': {
                                        borderRadius: 2,
                                        transition: 'all 0.2s',
                                        '&:hover': {
                                            '& .MuiOutlinedInput-notchedOutline': {
                                                borderColor: theme.palette.primary.main,
                                            },
                                        },
                                    },
                                }}
                            />

                            {/* Forgot Password Link */}
                            <Box sx={{ textAlign: 'right', mt: 1 }}>
                                <Link
                                    component={RouterLink}
                                    to="/forgot-password"
                                    variant="body2"
                                    sx={{
                                        textDecoration: 'none',
                                        '&:hover': {
                                            textDecoration: 'underline',
                                        },
                                    }}
                                >
                                    Forgot Password?
                                </Link>
                            </Box>

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                size="large"
                                sx={{
                                    mt: 3,
                                    mb: 2,
                                    py: 1.5,
                                    fontSize: '1.1rem',
                                    fontWeight: 600,
                                    borderRadius: 2,
                                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                                    boxShadow: theme.shadows[4],
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-2px)',
                                        boxShadow: theme.shadows[8],
                                        background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
                                    },
                                    '&:disabled': {
                                        background: theme.palette.action.disabledBackground,
                                    },
                                }}
                                disabled={loading}
                            >
                                {loading ? (
                                    <CircularProgress size={24} color="inherit" />
                                ) : (
                                    'Sign In'
                                )}
                            </Button>

                            {/* Registration Link */}
                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                <Typography variant="body2" color="text.secondary">
                                    New to Task Manager?{' '}
                                    <Link
                                        component={RouterLink}
                                        to="/register"
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                            '&:hover': {
                                                textDecoration: 'underline',
                                            },
                                        }}
                                    >
                                        Create an account
                                    </Link>
                                </Typography>
                            </Box>

                            
                           
                           
                        </Box>
                    </Paper>
                </Fade>
            </Container>

            {/* Global styles for animations */}
            <style>
                {`
                    @keyframes rotate {
                        from {
                            transform: rotate(0deg);
                        }
                        to {
                            transform: rotate(360deg);
                        }
                    }
                `}
            </style>
        </Box>
    );
};

export default Login;