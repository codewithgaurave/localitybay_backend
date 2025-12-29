import { apiService } from "./apiService";

export interface Template {
  _id: string;
  name: string;
  image: string;
  description?: string;
  isActive: boolean;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface TemplateStats {
  total: number;
  active: number;
  inactive: number;
}

export interface TemplateFilters {
  isActive?: boolean;
}

export interface TemplateSearchParams {
  q: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  templates: T[];
  total: number;
  pages: number;
}

export const templateService = {
  // Get all templates with pagination and filtering
  async getTemplates(
    page: number = 1,
    limit: number = 10,
    filters: TemplateFilters = {}
  ): Promise<PaginatedResponse<Template>> {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(filters.isActive !== undefined && {
        isActive: filters.isActive.toString(),
      }),
    });

    const response = await apiService.get<PaginatedResponse<Template>>(
      `/templates?${params}`
    );
    return response.data;
  },

  // Get template by ID
  async getTemplateById(id: string): Promise<Template> {
    const response = await apiService.get<Template>(`/templates/${id}`);
    return response.data;
  },

  // Get active templates
  async getActiveTemplates(): Promise<Template[]> {
    const response = await apiService.get<Template[]>("/templates/active/list");
    return response.data;
  },

  // Search templates
  async searchTemplates(
    params: TemplateSearchParams
  ): Promise<PaginatedResponse<Template>> {
    const searchParams = new URLSearchParams({
      q: params.q,
      page: (params.page || 1).toString(),
      limit: (params.limit || 10).toString(),
    });

    const response = await apiService.get<PaginatedResponse<Template>>(
      `/templates/search/query?${searchParams}`
    );
    return response.data;
  },

  // Get template statistics
  async getTemplateStats(): Promise<TemplateStats> {
    const response = await apiService.get<TemplateStats>(
      "/templates/stats/overview"
    );
    return response.data;
  },
};
