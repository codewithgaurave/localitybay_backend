import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { UserService } from '../services/userService';
import { IUpdateUserRequest, AuthenticatedRequest } from '../types';
import ApiError from '../utils/ApiError';
import SuccessResponse from '../utils/ApiSuccess';

export class UserController {
  /**
   * Get user profile (protected route)
   */
  static getProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
   

    const result = await UserService.getUserById(req.user._id);
    return SuccessResponse.ok(res, result.data);
  });

  /**
   * Update user profile (protected route)
   */
  static updateProfile = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    

    const updateData: IUpdateUserRequest = req.body;
    const result = await UserService.updateUserProfile(req.user._id, updateData);
    return SuccessResponse.ok(res, result.data, 'User updated successfully');
  });

  /**
   * Get public user profile by ID (public route)
   */
  static getPublicProfile = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.getPublicUserProfile(id);
    return SuccessResponse.ok(res, result.data);
  });

  /**
   * Get user statistics for admin dashboard
   * @route GET /api/users/stats
   * @access Private (Admin only)
   */
  static getStats = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.getUserStats();
    return SuccessResponse.ok(res, result.data);
  });
} 