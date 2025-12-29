import { Request, Response } from "express";
import { NoticeService } from "../services/noticeService";
import {
  createNotice,
  updateNotice,
  getNotice,
  getNotices,
  getNoticesByLocation,
  deleteNotice,
} from "../validations/noticeValidation";

export class NoticeController {
  // Create a new notice
  static async createNotice(req: Request, res: Response): Promise<void> {
    try {
      const {
        title,
        description,
        category,
        location,
        radius,
        contact,
        urgent,
        duration,
      } = req.body;

      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          status: false,
          code: 401,
          message: "User not authenticated",
        });
        return;
      }

      // Check if user can create urgent notice
      if (urgent) {
        const canCreateUrgent = await NoticeService.canCreateUrgentNotice(
          userId
        );
        if (!canCreateUrgent) {
          res.status(400).json({
            status: false,
            code: 400,
            message: "You have reached the monthly limit of 3 urgent notices",
          });
          return;
        }
      }

      const noticeData = {
        title,
        description,
        category,
        location,
        radius: radius || 5,
        contact,
        urgent: urgent || false,
        duration,
        createdBy: userId,
      };

      const notice = await NoticeService.createNotice(noticeData);

      res.status(201).json({
        status: true,
        code: 201,
        message: "Notice created successfully",
        data: notice,
      });
    } catch (error) {
      console.error("Create notice error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get all notices with filtering and pagination
  static async getNotices(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        location,
        status,
        urgent,
      } = req.query;

      const filters = {
        category: category as string,
        location: location as string,
        status: status as string,
        urgent: urgent === "true" ? true : undefined,
      };

      const result = await NoticeService.getNotices(
        parseInt(page as string),
        parseInt(limit as string),
        filters
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Notices retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get notices error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get notice by ID
  static async getNoticeById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      const notice = await NoticeService.getNoticeById(id);
      if (!notice) {
        res.status(404).json({
          status: false,
          code: 404,
          message: "Notice not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Notice retrieved successfully",
        data: notice,
      });
    } catch (error) {
      console.error("Get notice by ID error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get notices by user
  static async getNoticesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          status: false,
          code: 401,
          message: "User not authenticated",
        });
        return;
      }

      const { page = 1, limit = 10 } = req.query;

      const result = await NoticeService.getNoticesByUser(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "User notices retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get user notices error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Update notice
  static async updateNotice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          status: false,
          code: 401,
          message: "User not authenticated",
        });
        return;
      }

      const updateData = req.body;

      const notice = await NoticeService.updateNotice(id, updateData, userId);
      if (!notice) {
        res.status(404).json({
          status: false,
          code: 404,
          message: "Notice not found or you don't have permission to update it",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Notice updated successfully",
        data: notice,
      });
    } catch (error) {
      console.error("Update notice error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Delete notice
  static async deleteNotice(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          status: false,
          code: 401,
          message: "User not authenticated",
        });
        return;
      }

      const deleted = await NoticeService.deleteNotice(id, userId);
      if (!deleted) {
        res.status(404).json({
          status: false,
          code: 404,
          message: "Notice not found or you don't have permission to delete it",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Notice deleted successfully",
      });
    } catch (error) {
      console.error("Delete notice error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get notices by location
  static async getNoticesByLocation(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { location, radius = 5, page = 1, limit = 10 } = req.query;

      if (!location) {
        res.status(400).json({
          status: false,
          code: 400,
          message: "Location parameter is required",
        });
        return;
      }

      const result = await NoticeService.getNoticesByLocation(
        location as string,
        parseInt(radius as string),
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Location-based notices retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get notices by location error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get urgent notices count for user
  static async getUrgentNoticesCount(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        res.status(401).json({
          status: false,
          code: 401,
          message: "User not authenticated",
        });
        return;
      }

      const count = await NoticeService.getUrgentNoticesCountThisMonth(userId);
      const canCreate = await NoticeService.canCreateUrgentNotice(userId);

      res.status(200).json({
        status: true,
        code: 200,
        message: "Urgent notices count retrieved successfully",
        data: {
          count,
          canCreate,
          limit: 3,
        },
      });
    } catch (error) {
      console.error("Get urgent notices count error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get notice statistics
  static async getNoticeStats(req: Request, res: Response): Promise<void> {
    try {
      const stats = await NoticeService.getNoticeStats();

      res.status(200).json({
        status: true,
        code: 200,
        message: "Notice statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Get notice stats error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }
}
