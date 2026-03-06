const express = require('express');
const router = express.Router();
const {
    createTask,
    getTasks,
    getTask,
    updateTask,
    deleteTask,
    getUsers,
    getAdminStats,
} = require('../controllers/taskController');
const { protect, admin } = require('../middleware/authMiddleware');

// All routes require authentication
router.use(protect);

// Task routes
router.route('/')
    .post(createTask)
    .get(getTasks);

router.route('/:id')
    .get(getTask)
    .put(updateTask)
    .delete(deleteTask);

// Admin only routes
router.get('/admin/users', admin, getUsers);
router.get('/admin/stats', admin, getAdminStats);

module.exports = router;