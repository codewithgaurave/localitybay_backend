import { api, apiUtils } from './apiService';

// Types for authentication
export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  userId?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: {
    address: string;
    coordinates: [number, number];
    city?: string;
    state?: string;
    country?: string;
  };
  interests?: string[];
  photos?: string[];
  badges?: string[];
  bio?: string;
  isVerified: boolean;
  isPremium?: boolean;
  isServiceProvider?: boolean;
  privacy?: {
    showLocation: boolean;
    showPhone: boolean;
    showEmail: boolean;
    profileVisibility: string;
  };
  stats?: {
    meetupsJoined: number;
    meetupsCreated: number;
    communitiesJoined: number;
  };
  lastActive?: string;
  role?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  location?: {
    address: string;
    coordinates: [number, number];
  };
  interests?: string[];
}

export interface AuthResponse {
  status: boolean;
  code: number;
  message?: string;
  data: {
    user: User;
    token: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Auth service functions
const AUTH_BASE_URL = 'auth';

// Login user
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  try {
    const response = await api<AuthResponse>(`${AUTH_BASE_URL}/login`, {
      method: 'POST',
      data: credentials,
      includeAuth: false
    });
    
    if (response.status && response.data.token) {
      // Set token in the base service
      apiUtils.setToken(response.data.token);
    }
    
    return response;
  } catch (error) {
    throw new Error(`Login failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Register user
export const register = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api<AuthResponse>(`${AUTH_BASE_URL}/register`, {
      method: 'POST',
      data: userData,
      includeAuth: false
    });
    
    if (response.status && response.data.token) {
      // Set token in the base service
      apiUtils.setToken(response.data.token);
    }
    
    return response;
  } catch (error) {
    throw new Error(`Registration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Logout user
export const logout = async (): Promise<void> => {
  // For JWT-based authentication, logout is client-side only
  // Simply clear the local token to end the session
  apiUtils.removeToken();
};

// Get current user profile
export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api<ApiResponse<User>>(`${AUTH_BASE_URL}/me`, {
      method: 'GET'
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to get user profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Update user profile
export const updateProfile = async (userData: Partial<RegisterData>): Promise<User> => {
  try {
    const response = await api<ApiResponse<User>>(`${AUTH_BASE_URL}/me`, {
      method: 'PUT',
      data: userData
    });
    return response.data;
  } catch (error) {
    throw new Error(`Failed to update profile: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Change password
export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    await api(`${AUTH_BASE_URL}/change-password`, {
      method: 'PUT',
      data: {
        currentPassword,
        newPassword
      }
    });
  } catch (error) {
    throw new Error(`Failed to change password: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Forgot password
export const forgotPassword = async (email: string): Promise<void> => {
  try {
    await api(`${AUTH_BASE_URL}/forgot-password`, {
      method: 'POST',
      data: { email },
      includeAuth: false
    });
  } catch (error) {
    throw new Error(`Failed to send reset email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Reset password
export const resetPassword = async (token: string, newPassword: string): Promise<void> => {
  try {
    await api(`${AUTH_BASE_URL}/reset-password`, {
      method: 'POST',
      data: { token, newPassword },
      includeAuth: false
    });
  } catch (error) {
    throw new Error(`Failed to reset password: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Verify email
export const verifyEmail = async (token: string): Promise<void> => {
  try {
    await api(`${AUTH_BASE_URL}/verify-email`, {
      method: 'POST',
      data: { token },
      includeAuth: false
    });
  } catch (error) {
    throw new Error(`Failed to verify email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Resend verification email
export const resendVerificationEmail = async (): Promise<void> => {
  try {
    await api(`${AUTH_BASE_URL}/resend-verification`, {
      method: 'POST'
    });
  } catch (error) {
    throw new Error(`Failed to resend verification email: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  return apiUtils.isAuthenticated();
};

// Get current token
export const getToken = (): string | null => {
  return apiUtils.getToken();
};

// Clear authentication (logout without server call)
export const clearAuth = (): void => {
  apiUtils.removeToken();
};

// Export all auth functions as a service object for backward compatibility
export const authService = {
  login,
  register,
  logout,
  getCurrentUser,
  updateProfile,
  changePassword,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationEmail,
  isAuthenticated,
  getToken,
  clearAuth,
};