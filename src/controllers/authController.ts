import { Request, Response } from 'express';
import httpStatus from 'http-status';
import catchAsync from '../utils/catchAsync';
import { UserService } from '../services/userService';
import { ICreateUserRequest, ILoginRequest } from '../types';
import ApiError from '../utils/ApiError';
import SuccessResponse from '../utils/ApiSuccess';

export class AuthController {
  /**
   * Register a new user
   */
  static register = catchAsync(async (req: Request, res: Response) => {
    const userData: ICreateUserRequest = req.body;
    

    const result = await UserService.createUser(userData);
    return SuccessResponse.created(res, result.data, 'User registered successfully');
  });

  /**
   * Login user
   */
  static login = catchAsync(async (req: Request, res: Response) => {
    const loginData: ILoginRequest = req.body;
    
    
    const result = await UserService.loginUser(loginData);
    return SuccessResponse.ok(res, result.data, 'Logged in successfully');
  });

      /**
       * Get current user (protected route)
       */
      static getCurrentUser = catchAsync(async (req: Request, res: Response) => {
      

        const result = await UserService.getUserById(req.user.id);
        return SuccessResponse.ok(res, result.data);
      });
} 