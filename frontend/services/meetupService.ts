import { api } from './apiService';

// Types for meetups
export interface Meetup {
  _id: string;
  title: string;
  description: string;
  category: string;
  creator: {
    _id: string;
    name: string;
    avatar?: string;
    userId: string;
  };
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
  date: string;
  startTime: string;
  endTime?: string;
  maxAttendees?: number;
  hasNoLimit: boolean;
  genderSpecific: boolean;
  maxMale?: number;
  maxFemale?: number;
  maxTransgender?: number;
  currentAttendees: number;
  attendees: string[];
  waitingList: string[];
  tags: string[];
  image?: string;
  price?: string;
  paymentMethod?: string;
  allowChatContinuation: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface CreateMeetupData {
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
  date: string;
  startTime: string;
  endTime?: string;
  maxAttendees?: number;
  hasNoLimit: boolean;
  genderSpecific: boolean;
  maxMale?: number;
  maxFemale?: number;
  maxTransgender?: number;
  tags: string[];
  image?: string;
  price?: string;
  paymentMethod?: string;
  allowChatContinuation: boolean;
}

export interface MeetupFilters {
  category?: string;
  type?: string;
  meetupFormat?: string;
  location?: string;
  visibilityLocation?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  visibilityRadius?: number;
  status?: string;
  creator?: string;
  tags?: string[];
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  totalPages: number;
  currentPage: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Meetup service functions
const MEETUP_BASE_URL = 'meetups';

// Get all meetups with optional filtering
export const getMeetups = async (filters: MeetupFilters = {}): Promise<PaginatedResponse<Meetup>> => {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          queryParams.append(key, value.join(','));
        } else {
          queryParams.append(key, String(value));
        }
      }
    });

    const endpoint = queryParams.toString() ? `${MEETUP_BASE_URL}?${queryParams.toString()}` : MEETUP_BASE_URL;
    const response = await api<ApiResponse<PaginatedResponse<Meetup>>>(endpoint, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meetups: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get meetup by ID
export const getMeetupById = async (id: string): Promise<Meetup> => {
  try {
    const response = await api<ApiResponse<Meetup>>(`${MEETUP_BASE_URL}/${id}`, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meetup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Create new meetup
export const createMeetup = async (meetupData: CreateMeetupData): Promise<Meetup> => {
  try {
    const response = await api<ApiResponse<Meetup>>(MEETUP_BASE_URL, {
      method: 'POST',
      data: meetupData,
      includeAuth: true
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create meetup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Update meetup
export const updateMeetup = async (id: string, meetupData: Partial<CreateMeetupData>): Promise<Meetup> => {
  try {
    const response = await api<ApiResponse<Meetup>>(`${MEETUP_BASE_URL}/${id}`, {
      method: 'PUT',
      data: meetupData
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update meetup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete meetup
export const deleteMeetup = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await api<ApiResponse<{ message: string }>>(`${MEETUP_BASE_URL}/${id}`, {
      method: 'DELETE'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to delete meetup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Join meetup
export const joinMeetup = async (id: string): Promise<Meetup> => {
  try {
    const response = await api<ApiResponse<Meetup>>(`${MEETUP_BASE_URL}/${id}/join`, {
      method: 'POST'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to join meetup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Leave meetup
export const leaveMeetup = async (id: string): Promise<Meetup> => {
  try {
    const response = await api<ApiResponse<Meetup>>(`${MEETUP_BASE_URL}/${id}/leave`, {
      method: 'POST'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to leave meetup: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get meetup statistics (admin only)
export const getMeetupStats = async (): Promise<{
  totalMeetups: number;
  recentMeetups: number;
  upcomingMeetups: number;
  completedMeetups: number;
}> => {
  try {
    const response = await api<ApiResponse<any>>(`${MEETUP_BASE_URL}/stats`, {
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch meetup stats: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export all meetup functions as a service object for backward compatibility
export const meetupService = {
  getMeetups,
  getMeetupById,
  createMeetup,
  updateMeetup,
  deleteMeetup,
  joinMeetup,
  leaveMeetup,
  getMeetupStats,
};