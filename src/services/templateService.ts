import { Template, ITemplate } from "../models/Template";

export class TemplateService {
  // Get all templates with pagination and filtering
  static async getTemplates(
    page: number = 1,
    limit: number = 10,
    filters: {
      isActive?: boolean;
    } = {}
  ): Promise<{ templates: ITemplate[]; total: number; pages: number }> {
    const query: any = {};

    if (filters.isActive !== undefined) {
      query.isActive = filters.isActive;
    }

    const skip = (page - 1) * limit;
    const templates = await Template.find(query)
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Template.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { templates, total, pages };
  }

  // Get template by ID
  static async getTemplateById(id: string): Promise<ITemplate | null> {
    return await Template.findById(id).populate(
      "createdBy",
      "name email avatar"
    );
  }

  // Get active templates
  static async getActiveTemplates(): Promise<ITemplate[]> {
    return await Template.find({ isActive: true })
      .populate("createdBy", "name email avatar")
      .sort({ name: 1 });
  }

  // Get template statistics
  static async getTemplateStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const [total, active, inactive] = await Promise.all([
      Template.countDocuments(),
      Template.countDocuments({ isActive: true }),
      Template.countDocuments({ isActive: false }),
    ]);

    return { total, active, inactive };
  }

  // Search templates
  static async searchTemplates(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ templates: ITemplate[]; total: number; pages: number }> {
    const query = {
      $and: [
        { isActive: true },
        {
          $or: [
            { name: { $regex: searchTerm, $options: "i" } },
            { description: { $regex: searchTerm, $options: "i" } },
          ],
        },
      ],
    };

    const skip = (page - 1) * limit;
    const templates = await Template.find(query)
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Template.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { templates, total, pages };
  }
}
