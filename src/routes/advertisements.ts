import express from "express";
import { AdvertisementController } from "../controllers/advertisementController";
import { auth } from "../middleware/auth";
import validate from "../middleware/validation";
import {
  createAdvertisement,
  updateAdvertisement,
  getAdvertisement,
  getAdvertisements,
  getAdvertisementsByLocation,
  deleteAdvertisement,
} from "../validations/advertisementValidation";

const router = express.Router();

// Create advertisement (authenticated)
router.post(
  "/",
  auth,
  validate(createAdvertisement),
  AdvertisementController.createAdvertisement
);

// Get all advertisements with filtering and pagination
router.get(
  "/",
  validate(getAdvertisements),
  AdvertisementController.getAdvertisements
);

// Get advertisement by ID
router.get(
  "/:id",
  validate(getAdvertisement),
  AdvertisementController.getAdvertisementById
);

// Get advertisements by user (authenticated)
router.get(
  "/user/my-advertisements",
  auth,
  AdvertisementController.getAdvertisementsByUser
);

// Get advertisements by location
router.get(
  "/location/search",
  validate(getAdvertisementsByLocation),
  AdvertisementController.getAdvertisementsByLocation
);

// Calculate pricing
router.post("/calculate-pricing", AdvertisementController.calculatePricing);

// Get templates
router.get("/templates/list", AdvertisementController.getTemplates);

// Get states
router.get("/locations/states", AdvertisementController.getStates);

// Get cities by state
router.get(
  "/locations/cities/:state",
  AdvertisementController.getCitiesByState
);

// Get localities by city
router.get(
  "/locations/localities/:city",
  AdvertisementController.getLocalitiesByCity
);

// Get advertisement statistics
router.get("/stats/overview", AdvertisementController.getAdvertisementStats);

// Update advertisement (authenticated)
router.put(
  "/:id",
  auth,
  validate(updateAdvertisement),
  AdvertisementController.updateAdvertisement
);

// Delete advertisement (authenticated)
router.delete(
  "/:id",
  auth,
  validate(deleteAdvertisement),
  AdvertisementController.deleteAdvertisement
);

export default router;
