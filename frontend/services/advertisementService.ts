import { apiService } from "./apiService";

export interface Advertisement {
  _id: string;
  template: {
    _id: string;
    name: string;
    image: string;
    description?: string;
  };
  heading: string;
  briefDescription: string;
  contactInfo: string;
  location: string;
  website?: string;
  icon: string;
  detailedHeading: string;
  detailedDescription: string;
  uploadedFiles?: string[];
  specialOffers?: string;
  detailedLocation?: string;
  detailedWebsite?: string;
  detailedContactInfo?: string;
  additionalDetails?: string;
  state: string;
  city: string;
  localities: string[];
  duration: {
    hours: number;
    days: number;
  };
  pricing: {
    basePrice: number;
    discount: number;
    finalPrice: number;
    discountReason?: string;
  };
  status: "draft" | "active" | "expired" | "removed";
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdvertisementFilters {
  category?: string;
  state?: string;
  city?: string;
  status?: string;
}

export interface CreateAdvertisementData {
  template: string;
  heading: string;
  briefDescription: string;
  contactInfo: string;
  location: string;
  website?: string;
  icon: string;
  detailedHeading: string;
  detailedDescription: string;
  uploadedFiles?: string[];
  specialOffers?: string;
  detailedLocation?: string;
  detailedWebsite?: string;
  detailedContactInfo?: string;
  additionalDetails?: string;
  state: string;
  city: string;
  localities: string[];
  duration: {
    hours: number;
    days: number;
  };
}

export interface UpdateAdvertisementData
  extends Partial<CreateAdvertisementData> {}

export interface PaginatedResponse<T> {
  advertisements: T[];
  total: number;
  pages: number;
}

export interface PricingCalculation {
  localities: string[];
  hours: number;
  days: number;
}

export interface PricingResult {
  basePrice: number;
  discount: number;
  finalPrice: number;
  discountReason: string;
}

export const advertisementService = {
  // Create a new advertisement
  async createAdvertisement(
    data: CreateAdvertisementData
  ): Promise<Advertisement> {
    const response = await apiService.post<Advertisement>(
      "/advertisements",
      data
    );
    return response.data;
  },

  // Get all advertisements with pagination and filtering
  async getAdvertisements(
    page: number = 1,
    limit: number = 10,
    filters: AdvertisementFilters = {}
  ): Promise<PaginatedResponse<Advertisement>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.category && { category: filters.category }),
      ...(filters.state && { state: filters.state }),
      ...(filters.city && { city: filters.city }),
      ...(filters.status && { status: filters.status }),
    });

    const response = await apiService.get<PaginatedResponse<Advertisement>>(
      `/advertisements?${params}`
    );
    return response.data;
  },

  // Get advertisement by ID
  async getAdvertisementById(id: string): Promise<Advertisement> {
    const response = await apiService.get<Advertisement>(
      `/advertisements/${id}`
    );
    return response.data;
  },

  // Update advertisement
  async updateAdvertisement(
    id: string,
    data: UpdateAdvertisementData
  ): Promise<Advertisement> {
    const response = await apiService.patch<Advertisement>(
      `/advertisements/${id}`,
      data
    );
    return response.data;
  },

  // Delete advertisement
  async deleteAdvertisement(id: string): Promise<void> {
    await apiService.delete(`/advertisements/${id}`);
  },

  // Get advertisements by user
  async getAdvertisementsByUser(): Promise<Advertisement[]> {
    const response = await apiService.get<Advertisement[]>(
      "/advertisements/user"
    );
    return response.data;
  },

  // Get advertisements by location
  async getAdvertisementsByLocation(
    state: string,
    city: string,
    localities: string[],
    page: number = 1,
    limit: number = 10
  ): Promise<PaginatedResponse<Advertisement>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      state,
      city,
      ...localities.map((locality) => ["localities", locality]),
    });

    const response = await apiService.get<PaginatedResponse<Advertisement>>(
      `/advertisements/location?${params}`
    );
    return response.data;
  },

  // Calculate pricing
  async calculatePricing(data: PricingCalculation): Promise<PricingResult> {
    const response = await apiService.post<PricingResult>(
      "/advertisements/pricing",
      data
    );
    return response.data;
  },

  // Get advertisement statistics
  async getAdvertisementStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    draft: number;
    totalRevenue: number;
  }> {
    const response = await apiService.get<{
      total: number;
      active: number;
      expired: number;
      draft: number;
      totalRevenue: number;
    }>("/advertisements/stats");
    return response.data;
  },

  // Get templates
  async getTemplates(): Promise<
    Array<{
      id: string;
      name: string;
      category: string;
      image: string;
    }>
  > {
    const response = await apiService.get<
      Array<{
        id: string;
        name: string;
        category: string;
        image: string;
      }>
    >("/advertisements/templates");
    return response.data;
  },

  // Get states
  async getStates(): Promise<string[]> {
    const response = await apiService.get<string[]>(
      "/advertisements/locations/states"
    );
    return response.data;
  },

  // Get cities by state
  async getCitiesByState(state: string): Promise<string[]> {
    const response = await apiService.get<string[]>(
      `/advertisements/locations/cities/${encodeURIComponent(state)}`
    );
    return response.data;
  },

  // Get localities by city
  async getLocalitiesByCity(city: string): Promise<string[]> {
    const response = await apiService.get<string[]>(
      `/advertisements/locations/localities/${encodeURIComponent(city)}`
    );
    return response.data;
  },
};
