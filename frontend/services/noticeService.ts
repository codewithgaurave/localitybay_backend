import { apiService } from "./apiService";

export interface Notice {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  radius: number;
  contact?: string;
  urgent: boolean;
  duration: string;
  status: "active" | "expired" | "removed";
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface NoticeFilters {
  category?: string;
  location?: string;
  radius?: number;
  status?: string;
}

export interface CreateNoticeData {
  title: string;
  description: string;
  category: string;
  location: string;
  radius: number;
  contact?: string;
  urgent: boolean;
  duration: string;
}

export interface UpdateNoticeData extends Partial<CreateNoticeData> {}

export interface PaginatedResponse<T> {
  notices: T[];
  total: number;
  pages: number;
}

export const noticeService = {
  // Create a new notice
  async createNotice(data: CreateNoticeData): Promise<Notice> {
    const response = await apiService.post<Notice>("/notices", data);
    return response.data;
  },

  // Get all notices with pagination and filtering
  async getNotices(
    page: number = 1,
    limit: number = 10,
    filters: NoticeFilters = {}
  ): Promise<PaginatedResponse<Notice>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.category && { category: filters.category }),
      ...(filters.location && { location: filters.location }),
      ...(filters.radius && { radius: filters.radius.toString() }),
      ...(filters.status && { status: filters.status }),
    });

    const response = await apiService.get<PaginatedResponse<Notice>>(
      `/notices?${params}`
    );
    return response.data;
  },

  // Get notice by ID
  async getNoticeById(id: string): Promise<Notice> {
    const response = await apiService.get<Notice>(`/notices/${id}`);
    return response.data;
  },

  // Update notice
  async updateNotice(id: string, data: UpdateNoticeData): Promise<Notice> {
    const response = await apiService.patch<Notice>(`/notices/${id}`, data);
    return response.data;
  },

  // Delete notice
  async deleteNotice(id: string): Promise<void> {
    await apiService.delete(`/notices/${id}`);
  },

  // Get notices by location
  async getNoticesByLocation(
    location: string,
    radius: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Notice>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      radius: radius.toString(),
    });

    const response = await apiService.get<PaginatedResponse<Notice>>(
      `/notices/location/${encodeURIComponent(location)}?${params}`
    );
    return response.data;
  },

  // Get notice statistics
  async getNoticeStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    urgent: number;
  }> {
    const response = await apiService.get<{
      total: number;
      active: number;
      expired: number;
      urgent: number;
    }>("/notices/stats");
    return response.data;
  },

  // Get notice categories
  async getNoticeCategories(): Promise<string[]> {
    // For now, return the hardcoded categories
    // In the future, this could be an API endpoint
    return [
      "Buy/Sell",
      "Job Postings",
      "Matrimony",
      "Offers",
      "Lost & Found",
      "Services",
      "Housing",
      "Events",
      "Miscellaneous",
    ];
  },
};
