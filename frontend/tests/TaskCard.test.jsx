import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskCard from '../components/TaskCard';

describe('TaskCard Component', () => {
    const mockTask = {
        _id: '1',
        title: 'Test Task',
        description: 'Test Description',
        status: 'pending',
        createdAt: '2024-01-01T00:00:00.000Z',
        user: {
            name: 'John Doe',
            email: 'john@example.com',
        },
    };

    const mockOnEdit = jest.fn();
    const mockOnDelete = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders task details correctly', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isAdmin={false}
            />
        );

        expect(screen.getByText('Test Task')).toBeInTheDocument();
        expect(screen.getByText('Test Description')).toBeInTheDocument();
        expect(screen.getByText('pending')).toBeInTheDocument();
    });

    test('shows user info for admin users', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isAdmin={true}
            />
        );

        expect(screen.getByText(/john doe/i)).toBeInTheDocument();
        expect(screen.getByText(/john@example.com/i)).toBeInTheDocument();
    });

    test('opens edit dialog when edit button is clicked', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isAdmin={false}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /edit/i }));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    test('opens delete confirmation when delete button is clicked', () => {
        render(
            <TaskCard
                task={mockTask}
                onEdit={mockOnEdit}
                onDelete={mockOnDelete}
                isAdmin={false}
            />
        );

        fireEvent.click(screen.getByRole('button', { name: /delete/i }));
        expect(screen.getByText(/are you sure/i)).toBeInTheDocument();
    });
});