import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status';
import { User, IUser } from '../models/User';
import { 
  ICreateUserRequest, 
  IUpdateUserRequest, 
  ILoginRequest, 
  IUserResponse,
  IAuthResponse,
  IApiResponse,
  IJwtPayload 
} from '../types';
import ApiError from '../utils/ApiError';
import { validateCoordinates } from '../utils/geoUtils';

export class UserService {
  /**
   * Create a new user
   */
  static async createUser(userData: ICreateUserRequest): Promise<IApiResponse<IAuthResponse>> {
    // Check if user already exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'User already exists',
        'USER_ALREADY_EXISTS'
      );
    }

    // Validate coordinates if provided
    if (userData.location.coordinates) {
      const [longitude, latitude] = userData.location.coordinates;
      if (!validateCoordinates(latitude, longitude)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid coordinates provided',
          'INVALID_COORDINATES'
        );
      }
    }

    // Create new user
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: userData.password, // Let pre-save hook handle hashing
      userId: userData.userId,
      location: userData.location,
      interests: userData.interests || [],
      phone: userData.phone,
      dateOfBirth: userData.dateOfBirth,
      gender: userData.gender,
      isPremium: false,
      isVerified: false,
      privacy: {
        showLocation: true,
        showPhone: false,
        showEmail: false,
        profileVisibility: 'public'
      },
      settings: {
        notifications: {
          email: true,
          push: true,
          meetups: true,
          messages: true
        },
        radius: 5
      },
      stats: {
        meetupsJoined: 0,
        meetupsCreated: 0,
        communitiesJoined: 0
      },
      role: 'user',
      isActive: true
    });

    await user.save();

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      success: true,
      data: {
        token,
        user: this.formatUserResponse(user)
      }
    };
  }

  /**
   * Authenticate user login
   */
  static async loginUser(loginData: ILoginRequest): Promise<IApiResponse<IAuthResponse>> {
    // Find user by email and include password field
    const user = await User.findOne({ email: loginData.email }).select('+password');
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Invalid credentials',
        'INVALID_CREDENTIALS'
      );
    }

    // Validate password
    const isMatch = await bcrypt.compare(loginData.password, user.password);
    if (!isMatch) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        'Invalid credentials',
        'INVALID_CREDENTIALS'
      );
    }

    // Generate JWT token
    const token = this.generateToken(user.id);

    return {
      success: true,
      data: {
        token,
        user: this.formatUserResponse(user)
      }
    };
  }

  /**
   * Get user by ID
   */
  static async getUserById(userId: string): Promise<IApiResponse<IUserResponse>> {
    const user = await User.findById(userId).select('-password');
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'User not found',
        'USER_NOT_FOUND'
      );
    }

    return {
      success: true,
      data: this.formatUserResponse(user)
    };
  }

  /**
   * Get public user profile (without sensitive data)
   */
  static async getPublicUserProfile(userId: string): Promise<IApiResponse<IUserResponse>> {
    const user = await User.findById(userId).select('-password -email');
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'User not found',
        'USER_NOT_FOUND'
      );
    }

    return {
      success: true,
      data: this.formatUserResponse(user)
    };
  }

  /**
   * Update user profile
   */
  static async updateUserProfile(userId: string, updateData: IUpdateUserRequest): Promise<IApiResponse<IUserResponse>> {
    // Validate coordinates if provided
    if (updateData.location?.coordinates) {
      const [longitude, latitude] = updateData.location.coordinates;
      if (!validateCoordinates(latitude, longitude)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid coordinates provided',
          'INVALID_COORDINATES'
        );
      }
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'User not found',
        'USER_NOT_FOUND'
      );
    }

    // Update fields
    if (updateData.name) user.name = updateData.name;
    if (updateData.location) user.location = updateData.location;
    if (updateData.bio !== undefined) user.bio = updateData.bio;
    if (updateData.interests) user.interests = updateData.interests;
    if (updateData.avatar !== undefined) user.avatar = updateData.avatar;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.dateOfBirth !== undefined) user.dateOfBirth = updateData.dateOfBirth;
    if (updateData.gender !== undefined) user.gender = updateData.gender;
    if (updateData.privacy) user.privacy = { ...user.privacy, ...updateData.privacy };
    if (updateData.settings) {
      if (updateData.settings.notifications) {
        user.settings.notifications = { ...user.settings.notifications, ...updateData.settings.notifications };
      }
      if (updateData.settings.radius !== undefined) {
        user.settings.radius = updateData.settings.radius;
      }
    }

    await user.save();

    return {
      success: true,
      data: this.formatUserResponse(user)
    };
  }

  /**
   * Get user statistics for admin dashboard
   */
  static async getUserStats() {
    try {
      const totalUsers = await User.countDocuments();
      
      // Get users created in the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentUsers = await User.countDocuments({
        createdAt: { $gte: oneWeekAgo }
      });

      return {
        success: true,
        data: {
          totalUsers,
          recentUsers
        }
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get user statistics', 'STATS_ERROR');
    }
  }

  /**
   * Generate JWT token
   */
  private static generateToken(userId: string): string {
    const payload: IJwtPayload = {
      user: {
        _id: userId
      }
    };

    return jwt.sign(
      payload,
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '7d' }
    );
  }

  /**
   * Format user response (remove sensitive data)
   */
  private static formatUserResponse(user: IUser): IUserResponse {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      userId: user.userId,
      location: user.location,
      interests: user.interests,
      photos: user.photos,
      badges: user.badges,
      avatar: user.avatar,
      bio: user.bio,
      phone: user.phone,
      dateOfBirth: user.dateOfBirth,
      gender: user.gender,
      isPremium: user.isPremium,
      isVerified: user.isVerified,
      privacy: user.privacy,
      stats: user.stats,
      lastActive: user.lastActive,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    };
  }
} 