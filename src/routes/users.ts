import express from 'express';
import { auth } from '../middleware/auth';
import { UserController } from '../controllers/userController';
import validate from '../middleware/validation';
import { updateUser, getUserById } from '../validations/userValidation';
import { adminAuth } from '../middleware/adminAuth';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, UserController.getProfile);

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, validate(updateUser), UserController.updateProfile);

// Get user statistics (Admin only)
router.get('/stats',  adminAuth, UserController.getStats);

// @route   GET /api/users/:id
// @desc    Get user by ID
// @access  Public
router.get('/:id', validate(getUserById), UserController.getPublicProfile);



export default router; 