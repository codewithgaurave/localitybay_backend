import Joi from "joi";
import { objectId } from "./custom.validation";
import {
  ADVERTISEMENT_STATUS,
  ADVERTISEMENT_CATEGORIES,
  ADVERTISEMENT_DURATION,
  ADVERTISEMENT_PRICING,
  ADVERTISEMENT_FIELD_LIMITS,
} from "../constants/categories";

// Create advertisement validation
const createAdvertisement = {
  body: Joi.object().keys({
    // Template reference
    template: Joi.string().custom(objectId).required().messages({
      "string.empty": "Template reference is required",
      "any.required": "Template reference is required",
    }),

    // Advertisement details
    heading: Joi.string()
      .required()
      .max(ADVERTISEMENT_FIELD_LIMITS.HEADING)
      .trim()
      .messages({
        "string.empty": "Heading is required",
        "string.max": `Heading cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.HEADING} characters`,
      }),
    briefDescription: Joi.string()
      .required()
      .max(ADVERTISEMENT_FIELD_LIMITS.BRIEF_DESCRIPTION)
      .trim()
      .messages({
        "string.empty": "Brief description is required",
        "string.max": `Brief description cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.BRIEF_DESCRIPTION} characters`,
      }),
    contactInfo: Joi.string()
      .required()
      .max(ADVERTISEMENT_FIELD_LIMITS.CONTACT_INFO)
      .trim()
      .messages({
        "string.empty": "Contact info is required",
        "string.max": `Contact info cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.CONTACT_INFO} characters`,
      }),
    location: Joi.string()
      .required()
      .max(ADVERTISEMENT_FIELD_LIMITS.LOCATION)
      .trim()
      .messages({
        "string.empty": "Location is required",
        "string.max": `Location cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.LOCATION} characters`,
      }),
    website: Joi.string().allow("").uri().trim().messages({
      "string.uri": "Website must be a valid URL",
    }),
    icon: Joi.string().required().trim().messages({
      "string.empty": "Icon is required",
    }),

    // Detailed content
    detailedHeading: Joi.string()
      .required()
      .max(ADVERTISEMENT_FIELD_LIMITS.DETAILED_HEADING)
      .trim()
      .messages({
        "string.empty": "Detailed heading is required",
        "string.max": `Detailed heading cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.DETAILED_HEADING} characters`,
      }),
    detailedDescription: Joi.string()
      .required()
      .max(ADVERTISEMENT_FIELD_LIMITS.DETAILED_DESCRIPTION)
      .trim()
      .messages({
        "string.empty": "Detailed description is required",
        "string.max": `Detailed description cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.DETAILED_DESCRIPTION} characters`,
      }),
    specialOffers: Joi.string()
      .allow("")
      .max(ADVERTISEMENT_FIELD_LIMITS.SPECIAL_OFFERS)
      .trim()
      .messages({
        "string.max": `Special offers cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.SPECIAL_OFFERS} characters`,
      }),
    detailedLocation: Joi.string()
      .allow("")
      .max(ADVERTISEMENT_FIELD_LIMITS.DETAILED_LOCATION)
      .trim()
      .messages({
        "string.max": `Detailed location cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.DETAILED_LOCATION} characters`,
      }),
    detailedWebsite: Joi.string().allow("").uri().trim().messages({
      "string.uri": "Detailed website must be a valid URL",
    }),
    detailedContactInfo: Joi.string().allow("").trim(),
    additionalDetails: Joi.string()
      .allow("")
      .max(ADVERTISEMENT_FIELD_LIMITS.ADDITIONAL_DETAILS)
      .trim()
      .messages({
        "string.max": `Additional details cannot exceed ${ADVERTISEMENT_FIELD_LIMITS.ADDITIONAL_DETAILS} characters`,
      }),

    // Location and pricing
    state: Joi.string().required().trim().messages({
      "string.empty": "State is required",
    }),
    city: Joi.string().required().trim().messages({
      "string.empty": "City is required",
    }),
    localities: Joi.array()
      .items(Joi.string().trim())
      .min(1)
      .required()
      .messages({
        "array.min": "At least one locality must be selected",
        "any.required": "Localities are required",
      }),
    duration: Joi.object()
      .keys({
        hours: Joi.number()
          .min(ADVERTISEMENT_DURATION.HOURS.MIN)
          .max(ADVERTISEMENT_DURATION.HOURS.MAX)
          .required()
          .messages({
            "number.min": `Hours must be at least ${ADVERTISEMENT_DURATION.HOURS.MIN}`,
            "number.max": `Hours cannot exceed ${ADVERTISEMENT_DURATION.HOURS.MAX}`,
            "any.required": "Hours are required",
          }),
        days: Joi.number()
          .min(ADVERTISEMENT_DURATION.DAYS.MIN)
          .max(ADVERTISEMENT_DURATION.DAYS.MAX)
          .required()
          .messages({
            "number.min": `Days must be at least ${ADVERTISEMENT_DURATION.DAYS.MIN}`,
            "number.max": `Days cannot exceed ${ADVERTISEMENT_DURATION.DAYS.MAX}`,
            "any.required": "Days are required",
          }),
      })
      .required()
      .custom((value, helpers) => {
        // At least one of hours or days must be greater than 0
        if (value.hours === 0 && value.days === 0) {
          return helpers.error("custom.durationRequired");
        }
        return value;
      })
      .messages({
        "any.required": "Duration is required",
        "custom.durationRequired":
          "At least one of hours or days must be greater than 0",
      }),

    // Media files
    uploadedFiles: Joi.array().items(Joi.string().uri()).max(5).messages({
      "array.max": "Cannot upload more than 5 files",
      "string.uri": "Each file URL must be a valid URI",
    }),
  }),
};

// Update advertisement validation
const updateAdvertisement = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      heading: Joi.string().max(ADVERTISEMENT_FIELD_LIMITS.HEADING).trim(),
      briefDescription: Joi.string()
        .max(ADVERTISEMENT_FIELD_LIMITS.BRIEF_DESCRIPTION)
        .trim(),
      contactInfo: Joi.string()
        .max(ADVERTISEMENT_FIELD_LIMITS.CONTACT_INFO)
        .trim(),
      location: Joi.string().max(ADVERTISEMENT_FIELD_LIMITS.LOCATION).trim(),
      website: Joi.string().allow("").uri().trim(),
      icon: Joi.string().trim(),
      detailedHeading: Joi.string()
        .max(ADVERTISEMENT_FIELD_LIMITS.DETAILED_HEADING)
        .trim(),
      detailedDescription: Joi.string()
        .max(ADVERTISEMENT_FIELD_LIMITS.DETAILED_DESCRIPTION)
        .trim(),
      specialOffers: Joi.string()
        .allow("")
        .max(ADVERTISEMENT_FIELD_LIMITS.SPECIAL_OFFERS)
        .trim(),
      detailedLocation: Joi.string()
        .allow("")
        .max(ADVERTISEMENT_FIELD_LIMITS.DETAILED_LOCATION)
        .trim(),
      detailedWebsite: Joi.string().allow("").uri().trim(),
      detailedContactInfo: Joi.string().allow("").trim(),
      additionalDetails: Joi.string()
        .allow("")
        .max(ADVERTISEMENT_FIELD_LIMITS.ADDITIONAL_DETAILS)
        .trim(),
      state: Joi.string().trim(),
      city: Joi.string().trim(),
      localities: Joi.array().items(Joi.string().trim()).min(1),
      duration: Joi.object().keys({
        hours: Joi.number()
          .min(ADVERTISEMENT_DURATION.HOURS.MIN)
          .max(ADVERTISEMENT_DURATION.HOURS.MAX),
        days: Joi.number()
          .min(ADVERTISEMENT_DURATION.DAYS.MIN)
          .max(ADVERTISEMENT_DURATION.DAYS.MAX),
      }),

      status: Joi.string().valid(...ADVERTISEMENT_STATUS),
      uploadedFiles: Joi.array()
        .items(
          Joi.object().keys({
            name: Joi.string().required(),
            type: Joi.string().required(),
            size: Joi.number().min(0).required(),
            url: Joi.string().uri().required(),
          })
        )
        .max(5),
    })
    .min(1),
};

// Get advertisement by ID validation
const getAdvertisement = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

// Get advertisements validation
const getAdvertisements = {
  query: Joi.object().keys({
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
    category: Joi.string().valid(...ADVERTISEMENT_CATEGORIES),
    state: Joi.string().trim(),
    city: Joi.string().trim(),
    status: Joi.string().valid(...ADVERTISEMENT_STATUS),
  }),
};

// Get advertisements by location validation
const getAdvertisementsByLocation = {
  query: Joi.object().keys({
    state: Joi.string().required().trim().messages({
      "string.empty": "State parameter is required",
    }),
    city: Joi.string().required().trim().messages({
      "string.empty": "City parameter is required",
    }),
    localities: Joi.array().items(Joi.string().trim()),
    page: Joi.number().min(1).default(1),
    limit: Joi.number().min(1).max(100).default(10),
  }),
};

// Delete advertisement validation
const deleteAdvertisement = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export {
  createAdvertisement,
  updateAdvertisement,
  getAdvertisement,
  getAdvertisements,
  getAdvertisementsByLocation,
  deleteAdvertisement,
};
