import { api, apiUtils } from './apiService';

// Types for users
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  userId: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: {
    address: string;
    coordinates: [number, number];
  };
  interests?: string[];
  isVerified: boolean;
  isServiceProvider: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  userId: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: {
    address: string;
    coordinates: [number, number];
  };
  interests?: string[];
  isVerified: boolean;
  isServiceProvider: boolean;
  bio?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
  rating?: number;
  totalMeetups?: number;
  totalAttendees?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserData {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: {
    address: string;
    coordinates: [number, number];
  };
  interests?: string[];
  bio?: string;
  socialLinks?: {
    website?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// User service functions
const USER_BASE_URL = '/api/users';

// Get user profile by ID
export const getUserById = async (id: string): Promise<UserProfile> => {
  try {
    const response = await api<ApiResponse<UserProfile>>(`${USER_BASE_URL}/${id}`, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api<ApiResponse<User>>(`${USER_BASE_URL}/me`, {
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Update user profile
export const updateProfile = async (userData: UpdateUserData): Promise<User> => {
  try {
    const response = await api<ApiResponse<User>>(`${USER_BASE_URL}/me`, {
      method: 'PUT',
      data: userData
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Upload avatar
export const uploadAvatar = async (file: File): Promise<{ avatar: string }> => {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await api<ApiResponse<{ avatar: string }>>(`${USER_BASE_URL}/me/avatar`, {
      method: 'POST',
      data: formData
    });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to upload avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Delete avatar
export const deleteAvatar = async (): Promise<void> => {
  try {
    await api(`${USER_BASE_URL}/me/avatar`, {
      method: 'DELETE'
    });
  } catch (error) {
    throw new Error(`Failed to delete avatar: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get user's meetups
export const getUserMeetups = async (userId: string, filters: {
  status?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  meetups: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = queryParams.toString() ? `${USER_BASE_URL}/${userId}/meetups?${queryParams.toString()}` : `${USER_BASE_URL}/${userId}/meetups`;
    const response = await api<ApiResponse<any>>(endpoint, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch user meetups: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get user's attended meetups
export const getUserAttendedMeetups = async (userId: string, filters: {
  status?: string;
  page?: number;
  limit?: number;
} = {}): Promise<{
  meetups: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = queryParams.toString() ? `${USER_BASE_URL}/${userId}/attended?${queryParams.toString()}` : `${USER_BASE_URL}/${userId}/attended`;
    const response = await api<ApiResponse<any>>(endpoint, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch attended meetups: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Search users
export const searchUsers = async (query: string, filters: {
  page?: number;
  limit?: number;
} = {}): Promise<{
  users: UserProfile[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append('search', query);
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = `${USER_BASE_URL}?${queryParams.toString()}`;
    const response = await api<ApiResponse<any>>(endpoint, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to search users: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Follow user
export const followUser = async (userId: string): Promise<void> => {
  try {
    await api(`${USER_BASE_URL}/${userId}/follow`, {
      method: 'POST'
    });
  } catch (error) {
    throw new Error(`Failed to follow user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Unfollow user
export const unfollowUser = async (userId: string): Promise<void> => {
  try {
    await api(`${USER_BASE_URL}/${userId}/unfollow`, {
      method: 'POST'
    });
  } catch (error) {
    throw new Error(`Failed to unfollow user: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get user's followers
export const getUserFollowers = async (userId: string, filters: {
  page?: number;
  limit?: number;
} = {}): Promise<{
  followers: UserProfile[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = queryParams.toString() ? `${USER_BASE_URL}/${userId}/followers?${queryParams.toString()}` : `${USER_BASE_URL}/${userId}/followers`;
    const response = await api<ApiResponse<any>>(endpoint, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch followers: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get user's following
export const getUserFollowing = async (userId: string, filters: {
  page?: number;
  limit?: number;
} = {}): Promise<{
  following: UserProfile[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}> => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });

    const endpoint = queryParams.toString() ? `${USER_BASE_URL}/${userId}/following?${queryParams.toString()}` : `${USER_BASE_URL}/${userId}/following`;
    const response = await api<ApiResponse<any>>(endpoint, {
      method: 'GET',
      includeAuth: false
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to fetch following: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Export all user functions as a service object for backward compatibility
export const userService = {
  getUserById,
  getCurrentUser,
  updateProfile,
  uploadAvatar,
  deleteAvatar,
  getUserMeetups,
  getUserAttendedMeetups,
  searchUsers,
  followUser,
  unfollowUser,
  getUserFollowers,
  getUserFollowing,
};