import express from "express";
import { TemplateController } from "../controllers/templateController";
import { auth } from "../middleware/auth";
import validate from "../middleware/validation";
import {
  getTemplate,
  getTemplates,
  searchTemplates,
} from "../validations/templateValidation";

const router = express.Router();

// Get all templates
router.get("/", auth, validate(getTemplates), TemplateController.getTemplates);

// Get template by ID
router.get(
  "/:id",
  auth,
  validate(getTemplate),
  TemplateController.getTemplateById
);

// Get active templates
router.get("/active/list", auth, TemplateController.getActiveTemplates);

// Search templates
router.get(
  "/search/query",
  auth,
  validate(searchTemplates),
  TemplateController.searchTemplates
);

// Get template statistics
router.get("/stats/overview", auth, TemplateController.getTemplateStats);

export default router;
