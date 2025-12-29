import { Request, Response } from "express";
import { AdvertisementService } from "../services/advertisementService";

export class AdvertisementController {
  // Create a new advertisement
  static async createAdvertisement(req: Request, res: Response): Promise<void> {
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

      const { template, ...otherData } = req.body;

      const adData = {
        ...otherData,
        template,
        createdBy: userId,
      };

      const advertisement = await AdvertisementService.createAdvertisement(
        adData
      );

      res.status(201).json({
        status: true,
        code: 201,
        message: "Advertisement created successfully",
        data: advertisement,
      });
    } catch (error) {
      console.error("Create advertisement error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get all advertisements with filtering and pagination
  static async getAdvertisements(req: Request, res: Response): Promise<void> {
    try {
      const { page = 1, limit = 10, category, state, city, status } = req.query;

      const filters = {
        category: category as string,
        state: state as string,
        city: city as string,
        status: status as string,
      };

      const result = await AdvertisementService.getAdvertisements(
        parseInt(page as string),
        parseInt(limit as string),
        filters
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Advertisements retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get advertisements error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get advertisement by ID
  static async getAdvertisementById(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { id } = req.params;

      const advertisement = await AdvertisementService.getAdvertisementById(id);
      if (!advertisement) {
        res.status(404).json({
          status: false,
          code: 404,
          message: "Advertisement not found",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Advertisement retrieved successfully",
        data: advertisement,
      });
    } catch (error) {
      console.error("Get advertisement by ID error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get advertisements by user
  static async getAdvertisementsByUser(
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

      const { page = 1, limit = 10 } = req.query;

      const result = await AdvertisementService.getAdvertisementsByUser(
        userId,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "User advertisements retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get user advertisements error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Update advertisement
  static async updateAdvertisement(req: Request, res: Response): Promise<void> {
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

      const advertisement = await AdvertisementService.updateAdvertisement(
        id,
        updateData,
        userId
      );
      if (!advertisement) {
        res.status(404).json({
          status: false,
          code: 404,
          message:
            "Advertisement not found or you don't have permission to update it",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Advertisement updated successfully",
        data: advertisement,
      });
    } catch (error) {
      console.error("Update advertisement error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Delete advertisement
  static async deleteAdvertisement(req: Request, res: Response): Promise<void> {
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

      const deleted = await AdvertisementService.deleteAdvertisement(
        id,
        userId
      );
      if (!deleted) {
        res.status(404).json({
          status: false,
          code: 404,
          message:
            "Advertisement not found or you don't have permission to delete it",
        });
        return;
      }

      res.status(200).json({
        status: true,
        code: 200,
        message: "Advertisement deleted successfully",
      });
    } catch (error) {
      console.error("Delete advertisement error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get advertisements by location
  static async getAdvertisementsByLocation(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const { state, city, localities, page = 1, limit = 10 } = req.query;

      if (!state || !city) {
        res.status(400).json({
          status: false,
          code: 400,
          message: "State and city parameters are required",
        });
        return;
      }

      const localitiesArray = localities
        ? (localities as string).split(",")
        : [];

      const result = await AdvertisementService.getAdvertisementsByLocation(
        state as string,
        city as string,
        localitiesArray,
        parseInt(page as string),
        parseInt(limit as string)
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Location-based advertisements retrieved successfully",
        data: result,
      });
    } catch (error) {
      console.error("Get advertisements by location error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Calculate pricing
  static async calculatePricing(req: Request, res: Response): Promise<void> {
    try {
      const { localities, hours, days } = req.body;

      const pricing = AdvertisementService.calculatePricing(
        localities,
        hours,
        days
      );

      res.status(200).json({
        status: true,
        code: 200,
        message: "Pricing calculated successfully",
        data: pricing,
      });
    } catch (error) {
      console.error("Calculate pricing error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get templates
  static async getTemplates(req: Request, res: Response): Promise<void> {
    try {
      const templates = AdvertisementService.getTemplates();

      res.status(200).json({
        status: true,
        code: 200,
        message: "Templates retrieved successfully",
        data: templates,
      });
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get states
  static async getStates(req: Request, res: Response): Promise<void> {
    try {
      const states = AdvertisementService.getStates();

      res.status(200).json({
        status: true,
        code: 200,
        message: "States retrieved successfully",
        data: states,
      });
    } catch (error) {
      console.error("Get states error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get cities by state
  static async getCitiesByState(req: Request, res: Response): Promise<void> {
    try {
      const { state } = req.params;

      if (!state) {
        res.status(400).json({
          status: false,
          code: 400,
          message: "State parameter is required",
        });
        return;
      }

      const cities = AdvertisementService.getCitiesByState(state);

      res.status(200).json({
        status: true,
        code: 200,
        message: "Cities retrieved successfully",
        data: cities,
      });
    } catch (error) {
      console.error("Get cities by state error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get localities by city
  static async getLocalitiesByCity(req: Request, res: Response): Promise<void> {
    try {
      const { city } = req.params;

      if (!city) {
        res.status(400).json({
          status: false,
          code: 400,
          message: "City parameter is required",
        });
        return;
      }

      const localities = AdvertisementService.getLocalitiesByCity(city);

      res.status(200).json({
        status: true,
        code: 200,
        message: "Localities retrieved successfully",
        data: localities,
      });
    } catch (error) {
      console.error("Get localities by city error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }

  // Get advertisement statistics
  static async getAdvertisementStats(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      const stats = await AdvertisementService.getAdvertisementStats();

      res.status(200).json({
        status: true,
        code: 200,
        message: "Advertisement statistics retrieved successfully",
        data: stats,
      });
    } catch (error) {
      console.error("Get advertisement stats error:", error);
      res.status(500).json({
        status: false,
        code: 500,
        message: "Internal server error",
      });
    }
  }
}
