import Joi from "joi";
import { objectId } from "./custom.validation";
import {
  NOTICE_CATEGORIES,
  NOTICE_DURATIONS,
  NOTICE_STATUS,
  NOTICE_RADIUS,
} from "../constants/categories";

// Create notice validation
const createNotice = {
  body: Joi.object()
    .keys({
      title: Joi.string().required().min(3).max(100).trim().messages({
        "string.empty": "Title is required",
        "string.min": "Title must be at least 3 characters long",
        "string.max": "Title cannot exceed 100 characters",
      }),
      description: Joi.string().required().min(10).max(2000).trim().messages({
        "string.empty": "Description is required",
        "string.min": "Description must be at least 10 characters long",
        "string.max": "Description cannot exceed 2000 characters",
      }),
      category: Joi.string()
        .required()
        .valid(...NOTICE_CATEGORIES)
        .messages({
          "string.empty": "Category is required",
          "any.only": "Category must be one of the valid options",
        }),
      location: Joi.string().required().min(3).max(200).trim().messages({
        "string.empty": "Location is required",
        "string.min": "Location must be at least 3 characters long",
        "string.max": "Location cannot exceed 200 characters",
      }),
      radius: Joi.number()
        .min(NOTICE_RADIUS.MIN)
        .max(NOTICE_RADIUS.MAX)
        .default(NOTICE_RADIUS.DEFAULT)
        .messages({
          "number.min": `Radius must be at least ${NOTICE_RADIUS.MIN}km`,
          "number.max": `Radius cannot exceed ${NOTICE_RADIUS.MAX}km`,
        }),
      contact: Joi.string().allow("").max(10).trim().messages({
        "string.max": "Contact info cannot exceed 10 characters",
      }),
      urgent: Joi.boolean().default(false),
      duration: Joi.string()
        .required()
        .valid(...NOTICE_DURATIONS)
        .messages({
          "string.empty": "Duration is required",
          "any.only": "Duration must be one of the valid options",
        }),
    })
    .custom((value, helpers) => {
      // If urgent is true and duration is Permanent, it's not allowed
      if (value.urgent && value.duration === "Permanent") {
        return helpers.error("custom.urgentNotAllowedForPermanent");
      }
      return value;
    })
    .messages({
      "custom.urgentNotAllowedForPermanent":
        "Urgent notices are not allowed for permanent duration",
    }),
};

// Update notice validation
const updateNotice = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().min(3).max(100).trim(),
      description: Joi.string().min(10).max(2000).trim(),
      category: Joi.string().valid(...NOTICE_CATEGORIES),
      location: Joi.string().min(3).max(200).trim(),
      radius: Joi.number().min(NOTICE_RADIUS.MIN).max(NOTICE_RADIUS.MAX),
      contact: Joi.string().allow("").max(10).trim(),
      urgent: Joi.boolean(),
      duration: Joi.string().valid(...NOTICE_DURATIONS),
      status: Joi.string().valid(...NOTICE_STATUS),
    })
    .min(1)
    .custom((value, helpers) => {
      // If urgent is true and duration is Permanent, it's not allowed
      if (value.urgent && value.duration === "Permanent") {
        return helpers.error("custom.urgentNotAllowedForPermanent");
      }
      return value;
    })
    .messages({
      "custom.urgentNotAllowedForPermanent":
        "Urgent notices are not allowed for permanent duration",
    }),
};

// Get notice by ID validation
const getNotice = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

// Get notices validation
const getNotices = {
  query: Joi.object().keys({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    category: Joi.string().valid(...NOTICE_CATEGORIES),
    location: Joi.string().trim(),
    status: Joi.string().valid(...NOTICE_STATUS),
    urgent: Joi.boolean(),
  }),
};

// Get notices by location validation
const getNoticesByLocation = {
  query: Joi.object().keys({
    location: Joi.string().required().trim().messages({
      "string.empty": "Location parameter is required",
    }),
    radius: Joi.number()
      .min(NOTICE_RADIUS.MIN)
      .max(NOTICE_RADIUS.MAX)
      .default(5),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),
};

// Delete notice validation
const deleteNotice = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export {
  createNotice,
  updateNotice,
  getNotice,
  getNotices,
  getNoticesByLocation,
  deleteNotice,
};
