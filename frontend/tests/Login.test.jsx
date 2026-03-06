import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Login from '../pages/Login';
import axios from '../api/axios';

jest.mock('../api/axios');

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

describe('Login Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders login form', () => {
        render(
            <BrowserRouter>
                <Login onLogin={jest.fn()} />
            </BrowserRouter>
        );

        expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    test('shows validation errors for empty fields', async () => {
        render(
            <BrowserRouter>
                <Login onLogin={jest.fn()} />
            </BrowserRouter>
        );

        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is required/i)).toBeInTheDocument();
            expect(screen.getByText(/password is required/i)).toBeInTheDocument();
        });
    });

    test('shows error for invalid email', async () => {
        render(
            <BrowserRouter>
                <Login onLogin={jest.fn()} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'invalid-email' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(screen.getByText(/email is invalid/i)).toBeInTheDocument();
        });
    });

    test('successful login redirects to dashboard', async () => {
        const mockOnLogin = jest.fn();
        const mockResponse = {
            data: {
                success: true,
                data: {
                    token: 'fake-token',
                    name: 'Test User',
                    email: 'test@example.com',
                    role: 'user',
                },
            },
        };

        axios.post.mockResolvedValueOnce(mockResponse);

        render(
            <BrowserRouter>
                <Login onLogin={mockOnLogin} />
            </BrowserRouter>
        );

        fireEvent.change(screen.getByLabelText(/email/i), {
            target: { value: 'test@example.com' },
        });
        fireEvent.change(screen.getByLabelText(/password/i), {
            target: { value: 'password123' },
        });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        await waitFor(() => {
            expect(axios.post).toHaveBeenCalledWith('/auth/login', {
                email: 'test@example.com',
                password: 'password123',
            });
            expect(localStorage.setItem).toHaveBeenCalled();
            expect(mockOnLogin).toHaveBeenCalled();
            expect(mockNavigate).toHaveBeenCalledWith('/dashboard');
        });
    });
});