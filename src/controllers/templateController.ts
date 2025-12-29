import { Request, Response } from "express";
import { TemplateService } from "../services/templateService";

export class TemplateController {
  // Get all templates with pagination and filtering
  static async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, isActive } = req.query;

      const filters: { isActive?: boolean } = {};
      if (isActive !== undefined) {
        filters.isActive = isActive === "true";
      }

      const result = await TemplateService.getTemplates(
        parseInt(page as string),
        parseInt(limit as string),
        filters
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Templates retrieved successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Error getting templates:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get template by ID
  static async getTemplateById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const template = await TemplateService.getTemplateById(id);

      if (!template) {
        res.status(404).json({
          status: false,
          code: 404,
          message: "Template not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Template retrieved successfully",
        data: template,
      });
    } catch (error: any) {
      console.error("Error getting template:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get active templates
  static async getActiveTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = await TemplateService.getActiveTemplates();

      res.status(200).json({
        status: true,
        code: 200,
        message: "Active templates retrieved successfully",
        data: templates,
      });
    } catch (error: any) {
      console.error("Error getting active templates:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Search templates
  static async searchTemplates(req: Request, res: Response): Promise<void> {
    try {
      const { q: searchTerm, page = 1, limit = 10 } = req.query;

      if (!searchTerm || (searchTerm as string).trim() === "") {
        res.status(400).json({
          status: false,
          code: 400,
          message: "Search term is required",
        });
        return;
      }

      const result = await TemplateService.searchTemplates(
        searchTerm as string,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Template search completed successfully",
        data: result,
      });
    } catch (error: any) {
      console.error("Error searching templates:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get template statistics
  static async getTemplateStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await TemplateService.getTemplateStats();

      res.status(200).json({
        status: true,
        code: 200,
        message: "Template statistics retrieved successfully",
        data: stats,
      });
    } catch (error: any) {
      console.error("Error getting template statistics:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }
}
