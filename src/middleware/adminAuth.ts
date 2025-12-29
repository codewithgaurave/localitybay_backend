import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../config/index';
import ApiError from '../utils/ApiError';
import httpStatus from 'http-status';
import { User } from '../models/User';

// Extend Session interface to include custom properties
declare module 'express-session' {
  interface SessionData {
    adminUser?: any;
    user?: any;
    admin?: any;
  }
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const adminAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // First, try JWT token authentication
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, config.jwtSecret) as any;
      const user = await User.findById(decoded.user.id);

      if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token.', 'INVALID_TOKEN');
      }

      if (user.role !== 'admin') {
        throw new ApiError(httpStatus.FORBIDDEN, 'Access denied. Admin privileges required.', 'ADMIN_REQUIRED');
      }

      req.user = user;
      return next();
    }

    // If no JWT token, try AdminJS session authentication
    if (req.session) {
      
      // Check for AdminJS session data - it might be stored differently
      const adminUser = req.session.adminUser || req.session.user || req.session.admin;
      
      if (adminUser) {
        const user = await User.findById(adminUser.id || adminUser._id);
        
        if (!user) {
          throw new ApiError(httpStatus.UNAUTHORIZED, 'Invalid session.', 'INVALID_SESSION');
        }

        if (user.role !== 'admin') {
          throw new ApiError(httpStatus.FORBIDDEN, 'Access denied. Admin privileges required.', 'ADMIN_REQUIRED');
        }

        req.user = user;
        return next();
      }
    }

    // If neither authentication method works
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Access denied. No token or session provided.', 'NO_AUTH');
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token.', 'INVALID_TOKEN'));
    } else {
      next(error);
    }
  }
}; 