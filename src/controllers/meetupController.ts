import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { MeetupService } from '../services/meetupService';
import { ICreateMeetupRequest, IUpdateMeetupRequest, IMeetupFilters } from '../types';
import { AuthenticatedRequest } from '../types/AuthenticatedRequest';
import ApiError from '../utils/ApiError';
import SuccessResponse from '../utils/ApiSuccess';

export class MeetupController {
  /**
   * Create a new meetup (protected route)
   */
  static createMeetup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const meetupData: ICreateMeetupRequest = req.body;
    const result = await MeetupService.createMeetup(meetupData, req.user._id);
    return SuccessResponse.created(res, result.data, 'Meetup created successfully');
  });

  /**
   * Get all meetups with filtering (public route)
   */
  static getMeetups = catchAsync(async (req: Request, res: Response) => {
    const filters: IMeetupFilters = {
      category: req.query.category as string,
      type: req.query.type as 'free' | 'paid' | 'invite-only' | undefined,
      meetupFormat: req.query.meetupFormat as 'physical' | 'virtual' | undefined,
      location: req.query.location as string,
      visibilityLocation: req.query.visibilityLocation as string,
      latitude: req.query.latitude ? Number(req.query.latitude) : undefined,
      longitude: req.query.longitude ? Number(req.query.longitude) : undefined,
      radius: req.query.radius ? Number(req.query.radius) : undefined,
      visibilityRadius: req.query.visibilityRadius ? Number(req.query.visibilityRadius) : undefined,
      status: req.query.status as 'upcoming' | 'ongoing' | 'completed' | 'cancelled' | undefined,
      creator: req.query.creator as string,
      tags: req.query.tags ? (req.query.tags as string).split(',') : undefined,
      search: req.query.search as string,
      page: Number(req.query.page) || 1,
      limit: Number(req.query.limit) || 10
    };

    const result = await MeetupService.getMeetups(filters);
    return SuccessResponse.ok(res, result.data);
  });


  /**
   * Get meetup by ID (public route)
   */
  static getMeetupById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await MeetupService.getMeetupById(id);
    return SuccessResponse.ok(res, result.data);
  });

  /**
   * Update meetup (protected route, creator only)
   */
  static updateMeetup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const updateData: IUpdateMeetupRequest = req.body;
    const result = await MeetupService.updateMeetup(id, updateData, req.user._id);
    return SuccessResponse.ok(res, result.data, 'Meetup updated successfully');
  });

  /**
   * Delete meetup (protected route, creator only)
   */
  static deleteMeetup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await MeetupService.deleteMeetup(id, req.user._id);
    return SuccessResponse.ok(res, result.data, 'Meetup deleted successfully');
  });

  /**
   * Join a meetup (protected route)
   */
  static joinMeetup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await MeetupService.joinMeetup(id, req.user._id);
    return SuccessResponse.ok(res, result.data, 'Joined meetup successfully');
  });

  /**
   * Leave a meetup (protected route)
   */
  static leaveMeetup = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;
    const result = await MeetupService.leaveMeetup(id, req.user._id);
    return SuccessResponse.ok(res, result.data, 'Left meetup successfully');
  });

  /**
   * Get meetup statistics for admin dashboard
   * @route GET /api/meetups/stats
   * @access Private (Admin only)
   */
  static getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await MeetupService.getMeetupStats();
    return SuccessResponse.ok(res, result.data);
  });
} 