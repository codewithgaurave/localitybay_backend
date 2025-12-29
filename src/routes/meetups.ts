import express from 'express';
import { auth, optionalAuth } from '../middleware/auth';
import { adminAuth } from '../middleware/adminAuth';
import { MeetupController } from '../controllers/meetupController';
import validate from '../middleware/validation';
import { createMeetup, updateMeetup, getMeetups, getMeetup, joinMeetup, leaveMeetup } from '../validations/meetupValidation';

const router = express.Router();

// @route   POST /api/meetups
// @desc    Create a new meetup
// @access  Private
router.post('/', auth, validate(createMeetup), MeetupController.createMeetup);


// @route   GET /api/meetups
// @desc    Get all meetups with optional filtering
// @access  Public
router.get('/', optionalAuth, validate(getMeetups), MeetupController.getMeetups);

// Get meetup statistics (Admin only)
router.get('/stats', adminAuth, MeetupController.getStats);

// @route   GET /api/meetups/:id
// @desc    Get meetup by ID
// @access  Public
router.get('/:id', optionalAuth, validate(getMeetup), MeetupController.getMeetupById);

// @route   PUT /api/meetups/:id
// @desc    Update meetup
// @access  Private (creator only)
router.put('/:id', auth, validate(getMeetup), validate(updateMeetup), MeetupController.updateMeetup);

// @route   DELETE /api/meetups/:id
// @desc    Delete meetup
// @access  Private (creator only)
router.delete('/:id', auth, validate(getMeetup), MeetupController.deleteMeetup);

// @route   POST /api/meetups/:id/join
// @desc    Join a meetup
// @access  Private
router.post('/:id/join', auth, validate(joinMeetup), MeetupController.joinMeetup);

// @route   POST /api/meetups/:id/leave
// @desc    Leave a meetup
// @access  Private
router.post('/:id/leave', auth, validate(leaveMeetup), MeetupController.leaveMeetup);



export default router; 