const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Create a task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res) => {
    try {
        const { title, description, status } = req.body;

        const task = await Task.create({
            title,
            description,
            status,
            user: req.user._id,
        });

        res.status(201).json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res) => {
    try {
        let tasks;

        if (req.user.role === 'admin') {
            // Admin sees all tasks with user info
            tasks = await Task.find()
                .populate('user', 'name email role')
                .sort('-createdAt');
        } else {
            // Regular users see only their tasks
            tasks = await Task.find({ user: req.user._id })
                .sort('-createdAt');
        }

        res.json({
            success: true,
            count: tasks.length,
            data: tasks,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate('user', 'name email role');

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Check if user owns task or is admin
        if (task.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to access this task',
            });
        }

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Check if user owns task or is admin
        if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this task',
            });
        }

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            {
                new: true,
                runValidators: true,
            }
        ).populate('user', 'name email role');

        res.json({
            success: true,
            data: task,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({
                success: false,
                message: 'Task not found',
            });
        }

        // Check if user owns task or is admin
        if (task.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this task',
            });
        }

        await task.deleteOne();

        res.json({
            success: true,
            message: 'Task removed',
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get all users (admin only)
// @route   GET /api/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select('-password')
            .sort('-createdAt');

        // Get task counts for each user
        const usersWithTaskCount = await Promise.all(
            users.map(async (user) => {
                const taskCount = await Task.countDocuments({ user: user._id });
                const completedTasks = await Task.countDocuments({
                    user: user._id,
                    status: 'completed'
                });
                const pendingTasks = await Task.countDocuments({
                    user: user._id,
                    status: 'pending'
                });

                return {
                    ...user.toObject(),
                    taskCount,
                    completedTasks,
                    pendingTasks,
                };
            })
        );

        res.json({
            success: true,
            count: users.length,
            data: usersWithTaskCount,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// @desc    Get dashboard stats (admin only)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const totalTasks = await Task.countDocuments();
        const completedTasks = await Task.countDocuments({ status: 'completed' });
        const pendingTasks = await Task.countDocuments({ status: 'pending' });

        // Get recent tasks
        const recentTasks = await Task.find()
            .populate('user', 'name email')
            .sort('-createdAt')
            .limit(5);

        // Get recent users
        const recentUsers = await User.find()
            .select('-password')
            .sort('-createdAt')
            .limit(5);

        res.json({
            success: true,
            data: {
                stats: {
                    totalUsers,
                    totalTasks,
                    completedTasks,
                    pendingTasks,
                },
                recentTasks,
                recentUsers,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getUsers,
    getAdminStats,
};