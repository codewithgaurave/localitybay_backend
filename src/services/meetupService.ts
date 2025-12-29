import httpStatus from 'http-status';
import mongoose from 'mongoose';
import { Meetup, IMeetup } from '../models/Meetup';
import { 
  ICreateMeetupRequest, 
  IUpdateMeetupRequest, 
  IMeetupFilters,
  IMeetup as IMeetupType,
  IApiResponse,
  IPaginatedResponse
} from '../types';
import ApiError from '../utils/ApiError';
import { createBoundingBox, validateCoordinates } from '../utils/geoUtils';

export class MeetupService {
  /**
   * Create a new meetup
   */
  static async createMeetup(meetupData: ICreateMeetupRequest, creatorId: string): Promise<IApiResponse<IMeetupType>> {
    // Validate coordinates if provided for physical meetups
    if (meetupData.meetupFormat === 'physical' && meetupData.location?.coordinates) {
      const [longitude, latitude] = meetupData.location.coordinates;
      if (!validateCoordinates(latitude, longitude)) {
        throw new ApiError(
          httpStatus.BAD_REQUEST,
          'Invalid coordinates provided',
          'INVALID_COORDINATES'
        );
      }
    }

    const meetup = new Meetup({
      ...meetupData,
      creator: creatorId,
      attendees: [creatorId],
      currentAttendees: 1,
      waitingList: [],
      status: 'upcoming'
    });

    await meetup.save();
    await meetup.populate('creator', 'name avatar userId');
    await meetup.populate('attendees', 'name avatar userId');

    return {
      success: true,
      data: this.formatMeetupResponse(meetup)
    };
  }

  /**
   * Get all meetups with filtering and pagination
   */
  static async getMeetups(filters: IMeetupFilters): Promise<IApiResponse<IPaginatedResponse<IMeetupType>>> {
    const { 
      category, 
      type, 
      meetupFormat, 
      location, 
      visibilityLocation, 
      latitude, 
      longitude, 
      radius = 50, 
      visibilityRadius,
      status,
      creator,
      tags,
      search,
      page = 1, 
      limit = 10 
    } = filters;
    
    const filter: any = {};
    
    // Basic filters
    if (category) filter.category = category;
    if (type) filter.type = type;
    if (meetupFormat) filter.meetupFormat = meetupFormat;
    if (status) filter.status = status;
    if (creator) filter.creator = creator;
    
    // Location-based filtering
    if (location) {
      filter.$or = [
        { 'location.address': { $regex: location, $options: 'i' } },
        { meetupLocation: { $regex: location, $options: 'i' } }
      ];
    }
    
    // Visibility location filtering
    if (visibilityLocation) {
      filter.visibilityLocation = { $regex: visibilityLocation, $options: 'i' };
    }
    
    // Visibility radius filtering
    if (visibilityRadius) {
      filter.visibilityRadius = { $lte: visibilityRadius };
    }
    
    // Tags filtering
    if (tags && tags.length > 0) {
      filter.tags = { $in: tags };
    }
    
    // Search in title, description, and tags
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Add geospatial filtering if coordinates are provided
    if (latitude && longitude && validateCoordinates(latitude, longitude)) {
      const boundingBox = createBoundingBox(latitude, longitude, radius);
      filter['location.coordinates'] = {
        $geoWithin: {
          $box: [
            [boundingBox.minLon, boundingBox.minLat],
            [boundingBox.maxLon, boundingBox.maxLat]
          ]
        }
      };
    }

    const meetups = await Meetup.find(filter)
      .populate('creator', 'name avatar userId')
      .populate('attendees', 'name avatar userId')
      .sort({ date: 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Meetup.countDocuments(filter);

    return {
      success: true,
      data: {
        data: meetups.map(meetup => this.formatMeetupResponse(meetup)),
        totalPages: Math.ceil(total / Number(limit)),
        currentPage: Number(page),
        total,
        limit: Number(limit)
      }
    };
  }

  /**
   * Get meetup by ID
   */
  static async getMeetupById(meetupId: string): Promise<IApiResponse<IMeetupType>> {
    const meetup = await Meetup.findById(meetupId)
      .populate('creator', 'name avatar bio')
      .populate('attendees', 'name avatar');

    if (!meetup) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Meetup not found',
        'MEETUP_NOT_FOUND'
      );
    }

    return {
      success: true,
      data: this.formatMeetupResponse(meetup)
    };
  }

  /**
   * Update meetup (creator only)
   */
  static async updateMeetup(meetupId: string, updateData: IUpdateMeetupRequest, userId: string): Promise<IApiResponse<IMeetupType>> {
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

    const meetup = await Meetup.findById(meetupId);
    
    if (!meetup) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Meetup not found',
        'MEETUP_NOT_FOUND'
      );
    }

    if (meetup.creator.toString() !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Not authorized to update this meetup',
        'NOT_AUTHORIZED'
      );
    }

    const updatedMeetup = await Meetup.findByIdAndUpdate(
      meetupId,
      updateData,
      { new: true }
    ).populate('creator', 'name avatar');

    if (!updatedMeetup) {
      throw new ApiError(
        httpStatus.INTERNAL_SERVER_ERROR,
        'Failed to update meetup',
        'UPDATE_FAILED'
      );
    }

    return {
      success: true,
      data: this.formatMeetupResponse(updatedMeetup)
    };
  }

  /**
   * Delete meetup (organizer only)
   */
  static async deleteMeetup(meetupId: string, userId: string): Promise<IApiResponse<{ message: string }>> {
    const meetup = await Meetup.findById(meetupId);
    
    if (!meetup) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Meetup not found',
        'MEETUP_NOT_FOUND'
      );
    }

    if (meetup.creator.toString() !== userId) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'Not authorized to delete this meetup',
        'NOT_AUTHORIZED'
      );
    }

    await meetup.deleteOne();

    return {
      success: true,
      data: { message: 'Meetup removed successfully' }
    };
  }

  /**
   * Join a meetup
   */
  static async joinMeetup(meetupId: string, userId: string): Promise<IApiResponse<IMeetupType>> {
    const meetup = await Meetup.findById(meetupId);
    
    if (!meetup) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Meetup not found',
        'MEETUP_NOT_FOUND'
      );
    }

    if (meetup.attendees.some((p: any) => p.toString() === userId)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Already joined this meetup',
        'ALREADY_JOINED'
      );
    }

    if (!meetup.hasNoLimit && meetup.attendees.length >= (meetup.maxAttendees || 0)) {
      throw new ApiError(
        httpStatus.CONFLICT,
        'Meetup is full',
        'MEETUP_FULL'
      );
    }

    meetup.attendees.push(new mongoose.Types.ObjectId(userId));
    await meetup.save();

    await meetup.populate('creator', 'name avatar userId');
    await meetup.populate('attendees', 'name avatar userId');

    return {
      success: true,
      data: this.formatMeetupResponse(meetup)
    };
  }

  /**
   * Leave a meetup
   */
  static async leaveMeetup(meetupId: string, userId: string): Promise<IApiResponse<IMeetupType>> {
    const meetup = await Meetup.findById(meetupId);
    
    if (!meetup) {
      throw new ApiError(
        httpStatus.NOT_FOUND,
        'Meetup not found',
        'MEETUP_NOT_FOUND'
      );
    }

    if (!meetup.attendees.some((p: any) => p.toString() === userId)) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Not joined this meetup',
        'NOT_JOINED'
      );
    }

    meetup.attendees = meetup.attendees.filter(
      (id: any) => id.toString() !== userId
    );
    await meetup.save();

    await meetup.populate('creator', 'name avatar userId');
    await meetup.populate('attendees', 'name avatar userId');

    return {
      success: true,
      data: this.formatMeetupResponse(meetup)
    };
  }

  /**
   * Get meetup statistics for admin dashboard
   */
  static async getMeetupStats() {
    try {
      const totalMeetups = await Meetup.countDocuments();
      
      // Get meetups created in the last 7 days
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentMeetups = await Meetup.countDocuments({
        createdAt: { $gte: oneWeekAgo }
      });

      return {
        success: true,
        data: {
          totalMeetups,
          recentMeetups
        }
      };
    } catch (error) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to get meetup statistics', 'STATS_ERROR');
    }
  }

  /**
   * Format meetup response
   */
  private static formatMeetupResponse(meetup: IMeetup): IMeetupType {
    return {
      _id: meetup._id,
      title: meetup.title,
      description: meetup.description,
      category: meetup.category,
      creator: meetup.creator as any, // Return the populated object directly
      type: meetup.type,
      meetupFormat: meetup.meetupFormat,
      meetupLocation: meetup.meetupLocation,
      visibilityLocation: meetup.visibilityLocation,
      visibilityRadius: meetup.visibilityRadius,
      location: meetup.location,
      virtualLink: meetup.virtualLink,
      meetingCode: meetup.meetingCode,
      meetingPassword: meetup.meetingPassword,
      date: meetup.date,
      startTime: meetup.startTime,
      endTime: meetup.endTime,
      maxAttendees: meetup.maxAttendees,
      hasNoLimit: meetup.hasNoLimit,
      genderSpecific: meetup.genderSpecific,
      maxMale: meetup.maxMale,
      maxFemale: meetup.maxFemale,
      maxTransgender: meetup.maxTransgender,
      currentAttendees: meetup.currentAttendees,
      attendees: meetup.attendees as any, // Return the populated objects directly
      waitingList: meetup.waitingList.map((id: any) => id.toString()),
      tags: meetup.tags,
      image: meetup.image,
      price: meetup.price,
      paymentMethod: meetup.paymentMethod,
      allowChatContinuation: meetup.allowChatContinuation,
      status: meetup.status,
      createdAt: meetup.createdAt,
      updatedAt: meetup.updatedAt
    };
  }

} 