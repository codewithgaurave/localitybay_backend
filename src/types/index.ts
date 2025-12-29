import { Request } from 'express';

// Properly extend Express Request interface
export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

// User types
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  userId: string; // @username format
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
    city: string;
    state: string;
    country: string;
  };
  interests: string[];
  photos: string[]; // Array of photo URLs
  badges: string[]; // User badges like "Explorer", "Local Guide"
  avatar?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  isPremium: boolean;
  isVerified: boolean;
  verificationDocument?: string;
  privacy: {
    showLocation: boolean;
    showPhone: boolean;
    showEmail: boolean;
    profileVisibility: 'public' | 'friends' | 'private';
  };
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      meetups: boolean;
      messages: boolean;
    };
    radius: number; // in kilometers
  };
  stats: {
    meetupsJoined: number;
    meetupsCreated: number;
    communitiesJoined: number;
  };
  lastActive: Date;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserResponse {
  _id: string;
  name: string;
  email: string;
  userId: string;
  location: {
    address: string;
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
  };
  interests: string[];
  photos: string[];
  badges: string[];
  avatar?: string;
  bio?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  isPremium: boolean;
  isVerified: boolean;
  privacy: {
    showLocation: boolean;
    showPhone: boolean;
    showEmail: boolean;
    profileVisibility: 'public' | 'friends' | 'private';
  };
  stats: {
    meetupsJoined: number;
    meetupsCreated: number;
    communitiesJoined: number;
  };
  lastActive: Date;
  role: 'user' | 'admin' | 'moderator';
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthResponse {
  token: string;
  user: IUserResponse;
}

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  userId: string; // @username format
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
    city: string;
    state: string;
    country: string;
  };
  interests?: string[];
  photos?: string[];
  badges?: string[];
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
}

export interface IUpdateUserRequest {
  name?: string;
  userId?: string;
  location?: {
    address: string;
    coordinates: [number, number];
    city: string;
    state: string;
    country: string;
  };
  bio?: string;
  interests?: string[];
  photos?: string[];
  badges?: string[];
  avatar?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  privacy?: {
    showLocation?: boolean;
    showPhone?: boolean;
    showEmail?: boolean;
    profileVisibility?: 'public' | 'friends' | 'private';
  };
  settings?: {
    notifications?: {
      email?: boolean;
      push?: boolean;
      meetups?: boolean;
      messages?: boolean;
    };
    radius?: number;
  };
}

export interface ILoginRequest {
  email: string;
  password: string;
}

// Meetup types
export interface IMeetup {
  _id: string;
  title: string;
  description: string;
  category: string;
  creator: string | any; // Can be ObjectId or populated user
  type: 'free' | 'paid' | 'invite-only';
  meetupFormat: 'physical' | 'virtual';
  meetupLocation: string; // Where the meetup will be held
  visibilityLocation: string; // Where the meetup will be visible
  visibilityRadius: number; // Radius in km for visibility
  location?: {
    address: string;
    coordinates: [number, number];
    venue?: string;
  };
  virtualLink?: string; // For virtual meetups
  meetingCode?: string; // Meeting code for virtual meetups
  meetingPassword?: string; // Meeting password for virtual meetups
  date: Date;
  startTime: string; // HH:MM format
  endTime?: string; // HH:MM format
  maxAttendees?: number; // Can be null for unlimited
  hasNoLimit: boolean;
  genderSpecific: boolean;
  maxMale?: number;
  maxFemale?: number;
  maxTransgender?: number; // New field for transgender attendees
  currentAttendees: number;
  attendees: (string | any)[]; // Can be ObjectId or populated users
  waitingList: (string | any)[]; // Can be ObjectId or populated users
  tags: string[];
  image?: string; // Single event image
  price?: string; // For paid events
  paymentMethod?: string; // For paid events
  allowChatContinuation: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateMeetupRequest {
  title: string;
  description: string;
  category: string;
  type: 'free' | 'paid' | 'invite-only';
  meetupFormat: 'physical' | 'virtual';
  meetupLocation: string;
  visibilityLocation: string;
  visibilityRadius: number;
  location?: {
    address: string;
    coordinates: [number, number];
    venue?: string;
  };
  virtualLink?: string;
  meetingCode?: string;
  meetingPassword?: string;
  date: Date;
  startTime: string;
  endTime?: string;
  maxAttendees?: number;
  hasNoLimit: boolean;
  genderSpecific: boolean;
  maxMale?: number;
  maxFemale?: number;
  maxTransgender?: number;
  tags?: string[];
  image?: string;
  price?: string;
  paymentMethod?: string;
  allowChatContinuation?: boolean;
}

export interface IUpdateMeetupRequest {
  title?: string;
  description?: string;
  category?: string;
  type?: 'free' | 'paid' | 'invite-only';
  meetupFormat?: 'physical' | 'virtual';
  meetupLocation?: string;
  visibilityLocation?: string;
  visibilityRadius?: number;
  location?: {
    address: string;
    coordinates: [number, number];
    venue?: string;
  };
  virtualLink?: string;
  meetingCode?: string;
  meetingPassword?: string;
  date?: Date;
  startTime?: string;
  endTime?: string;
  maxAttendees?: number;
  hasNoLimit?: boolean;
  genderSpecific?: boolean;
  maxMale?: number;
  maxFemale?: number;
  maxTransgender?: number;
  tags?: string[];
  image?: string;
  price?: string;
  paymentMethod?: string;
  allowChatContinuation?: boolean;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

export interface IMeetupFilters {
  category?: string;
  type?: 'free' | 'paid' | 'invite-only';
  meetupFormat?: 'physical' | 'virtual';
  location?: string;
  visibilityLocation?: string;
  latitude?: number;
  longitude?: number;
  radius?: number; // Search radius in kilometers
  visibilityRadius?: number; // Visibility radius filter
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  creator?: string;
  tags?: string[];
  search?: string; // Search in title and description
  page?: number;
  limit?: number;
}

// API Response types
export interface IApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface IPaginatedResponse<T> {
  data: T[];
  totalPages: number;
  currentPage: number;
  total: number;
  limit: number;
}

// JWT Payload
export interface IJwtPayload {
  user: {
    _id: string;
  };
} 