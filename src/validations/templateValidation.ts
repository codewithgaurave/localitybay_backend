import Joi from "joi";
import { objectId } from "./custom.validation";

const getTemplates = {
  query: Joi.object().keys({
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
    }),
    isActive: Joi.boolean().messages({
      "boolean.base": "isActive must be a boolean value",
    }),
  }),
};

const getTemplate = {
  params: Joi.object().keys({
    id: Joi.string().custom(objectId).required().messages({
      "any.required": "Template ID is required",
      "string.pattern.name": "Template ID must be a valid ObjectId",
    }),
  }),
};

const searchTemplates = {
  query: Joi.object().keys({
    q: Joi.string().required().min(1).max(100).trim().messages({
      "string.empty": "Search query is required",
      "string.min": "Search query must be at least 1 character",
      "string.max": "Search query cannot exceed 100 characters",
      "any.required": "Search query is required",
    }),
    page: Joi.number().integer().min(1).default(1).messages({
      "number.base": "Page must be a number",
      "number.integer": "Page must be an integer",
      "number.min": "Page must be at least 1",
    }),
    limit: Joi.number().integer().min(1).max(100).default(10).messages({
      "number.base": "Limit must be a number",
      "number.integer": "Limit must be an integer",
      "number.min": "Limit must be at least 1",
      "number.max": "Limit cannot exceed 100",
    }),
  }),
};

export { getTemplates, getTemplate, searchTemplates };
