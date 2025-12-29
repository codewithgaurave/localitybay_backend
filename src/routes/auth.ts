import express from 'express';
import { AuthController } from '../controllers/authController';
import { auth } from '../middleware/auth';
import validate from '../middleware/validation';
import { createUser, login } from '../validations/userValidation';

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validate(createUser), AuthController.register);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', validate(login), AuthController.login);

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, AuthController.getCurrentUser);

export default router; 