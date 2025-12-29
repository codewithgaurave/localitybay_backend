import Joi from "joi";
import { objectId } from "./custom.validation";
import {
  MEETUP_CATEGORIES,
  MEETUP_TYPES,
  MEETUP_FORMATS,
  MEETUP_STATUSES,
} from "../constants";

// Time validation (HH:MM format)
const timeFormat = Joi.string()
  .pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/)
  .messages({
    "string.pattern.base": "Time must be in HH:MM format",
  });

// Date validation (must be in future)
const futureDate = Joi.date().min("now").iso().messages({
  "date.min": "Date must be in the future",
  "date.format": "Date must be in ISO format",
});

// Location validation
const location = Joi.object({
  address: Joi.string().required().max(200),
  coordinates: Joi.array().items(Joi.number()).length(2).messages({
    "array.length": "Coordinates must be [longitude, latitude]",
    "array.items": "Coordinates must be numbers",
  }),
  venue: Joi.string().max(100),
});

// Virtual link validation
const virtualLink = Joi.string()
  .uri()
  .pattern(/^https?:\/\/.+/)
  .messages({
    "string.uri": "Virtual link must be a valid URL",
    "string.pattern.base": "Virtual link must start with http:// or https://",
  });

// Create meetup validation
const createMeetup = {
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
        .valid(...MEETUP_CATEGORIES)
        .messages({
          "string.empty": "Category is required",
          "any.only": "Category must be one of the valid options",
        }),
      type: Joi.string()
        .required()
        .valid(...MEETUP_TYPES)
        .messages({
          "string.empty": "Event type is required",
          "any.only": "Event type must be free, paid, or invite-only",
        }),
      meetupFormat: Joi.string()
        .required()
        .valid(...MEETUP_FORMATS)
        .messages({
          "string.empty": "Meetup format is required",
          "any.only": "Meetup format must be physical or virtual",
        }),
      meetupLocation: Joi.string().required().min(3).max(200).trim().messages({
        "string.empty": "Meetup location is required",
        "string.min": "Meetup location must be at least 3 characters long",
        "string.max": "Meetup location cannot exceed 200 characters",
      }),
      visibilityLocation: Joi.string()
        .required()
        .min(3)
        .max(200)
        .trim()
        .messages({
          "string.empty": "Visibility location is required",
          "string.min":
            "Visibility location must be at least 3 characters long",
          "string.max": "Visibility location cannot exceed 200 characters",
        }),
      visibilityRadius: Joi.number().required().min(1).max(50).messages({
        "number.min": "Visibility radius must be at least 1km",
        "number.max": "Visibility radius cannot exceed 50km (premium feature)",
        "any.required": "Visibility radius is required",
      }),
      location: location.when("meetupFormat", {
        is: "physical",
        then: Joi.optional(),
        otherwise: Joi.optional(),
      }),
      virtualLink: Joi.string()
        .allow("")
        .when("meetupFormat", {
          is: "virtual",
          then: Joi.required().custom((value, helpers) => {
            if (!value || value.trim() === "") {
              return helpers.error("custom.virtualLinkRequired");
            }
            // Validate URL format
            try {
              new URL(value);
              if (
                !value.startsWith("http://") &&
                !value.startsWith("https://")
              ) {
                return helpers.error("custom.virtualLinkFormat");
              }
            } catch {
              return helpers.error("custom.virtualLinkFormat");
            }
            return value;
          }),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": "Virtual link is required for virtual events",
          "custom.virtualLinkRequired":
            "Virtual link is required for virtual events",
          "custom.virtualLinkFormat":
            "Virtual link must be a valid URL starting with http:// or https://",
        }),
      meetingCode: Joi.string()
        .allow("")
        .max(50)
        .trim()
        .when("meetupFormat", {
          is: "virtual",
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "string.max": "Meeting code cannot exceed 50 characters",
        }),
      meetingPassword: Joi.string()
        .allow("")
        .max(50)
        .trim()
        .when("meetupFormat", {
          is: "virtual",
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "string.max": "Meeting password cannot exceed 50 characters",
        }),
      date: futureDate.required(),
      startTime: timeFormat.required(),
      endTime: Joi.string()
        .allow("")
        .when("startTime", {
          is: Joi.exist(),
          then: Joi.custom((value, helpers) => {
            const startTime = helpers.state.ancestors[0].startTime;
            if (
              value &&
              value.trim() !== "" &&
              startTime &&
              value <= startTime
            ) {
              return helpers.error("custom.endTimeAfterStart");
            }
            return value;
          }).messages({
            "custom.endTimeAfterStart": "End time must be after start time",
          }),
          otherwise: Joi.optional(),
        }),
      maxAttendees: Joi.number()
        .min(2)
        .max(1000)
        .when("hasNoLimit", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.required(),
        })
        .messages({
          "number.min": "Max attendees must be at least 2",
          "number.max": "Max attendees cannot exceed 1000",
          "any.required": "Max attendees is required when no limit is not set",
        }),
      hasNoLimit: Joi.boolean().default(false),
      genderSpecific: Joi.boolean().default(false),
      maxMale: Joi.number()
        .min(0)
        .when("genderSpecific", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "number.min": "Max male attendees cannot be negative",
        }),
      maxFemale: Joi.number()
        .min(0)
        .when("genderSpecific", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "number.min": "Max female attendees cannot be negative",
        }),
      maxTransgender: Joi.number()
        .min(0)
        .when("genderSpecific", {
          is: true,
          then: Joi.optional(),
          otherwise: Joi.forbidden(),
        })
        .messages({
          "number.min": "Max transgender attendees cannot be negative",
        }),
      tags: Joi.array().items(Joi.string().max(30)).max(10).messages({
        "array.max": "Cannot have more than 10 tags",
        "string.max": "Each tag cannot exceed 30 characters",
      }),
      image: Joi.string()
        .uri()
        .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
        .allow("")
        .messages({
          "string.uri": "Image must be a valid URL",
          "string.pattern.base":
            "Image must be a valid image file (jpg, jpeg, png, gif, webp)",
        }),
      price: Joi.string()
        .allow("")
        .when("type", {
          is: "paid",
          then: Joi.required().custom((value, helpers) => {
            if (!value || value.trim() === "") {
              return helpers.error("custom.priceRequired");
            }
            return value;
          }),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": "Price is required for paid events",
          "custom.priceRequired": "Price is required for paid events",
        }),
      paymentMethod: Joi.string()
        .allow("")
        .when("type", {
          is: "paid",
          then: Joi.required().custom((value, helpers) => {
            if (!value || value.trim() === "") {
              return helpers.error("custom.paymentMethodRequired");
            }
            return value;
          }),
          otherwise: Joi.optional(),
        })
        .messages({
          "any.required": "Payment method is required for paid events",
          "custom.paymentMethodRequired":
            "Payment method is required for paid events",
        }),
      allowChatContinuation: Joi.boolean().default(false),
    })
    .custom((value, helpers) => {
      // Validate gender limits don't exceed max attendees
      if (value.genderSpecific && !value.hasNoLimit && value.maxAttendees) {
        const maxMale = value.maxMale || 0;
        const maxFemale = value.maxFemale || 0;
        const maxTransgender = value.maxTransgender || 0;
        if (maxMale + maxFemale + maxTransgender > value.maxAttendees) {
          return helpers.error("custom.genderLimitExceeded");
        }
        // At least one gender limit must be specified
        if (maxMale === 0 && maxFemale === 0 && maxTransgender === 0) {
          return helpers.error("custom.noGenderLimit");
        }
      }
      return value;
    })
    .messages({
      "custom.genderLimitExceeded":
        "Combined gender limits cannot exceed total max attendees",
      "custom.noGenderLimit":
        "At least one gender limit must be specified when using gender-specific attendance",
    }),
};

const updateMeetup = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      title: Joi.string().min(3).max(100).trim(),
      description: Joi.string().min(10).max(2000).trim(),
      category: Joi.string().valid(...MEETUP_CATEGORIES),
      type: Joi.string().valid(...MEETUP_TYPES),
      meetupFormat: Joi.string().valid(...MEETUP_FORMATS),
      meetupLocation: Joi.string().min(3).max(200).trim(),
      visibilityLocation: Joi.string().min(3).max(200).trim(),
      visibilityRadius: Joi.number().min(1).max(50),
      location: location,
      virtualLink: Joi.string().allow(""),
      meetingCode: Joi.string().allow("").max(50).trim(),
      meetingPassword: Joi.string().allow("").max(50).trim(),
      date: futureDate,
      startTime: timeFormat,
      endTime: timeFormat,
      maxAttendees: Joi.number().min(2).max(1000),
      hasNoLimit: Joi.boolean(),
      genderSpecific: Joi.boolean(),
      maxMale: Joi.number().min(0),
      maxFemale: Joi.number().min(0),
      maxTransgender: Joi.number().min(0),
      tags: Joi.array().items(Joi.string().max(30)).max(10),
      image: Joi.string()
        .uri()
        .pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
        .allow(""),
      price: Joi.string().allow(""),
      paymentMethod: Joi.string().allow(""),
      allowChatContinuation: Joi.boolean(),
      status: Joi.string().valid(...MEETUP_STATUSES),
    })
    .min(1),
};

const getMeetup = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const getMeetups = {
  query: Joi.object().keys({
    category: Joi.string().valid(...MEETUP_CATEGORIES),
    type: Joi.string().valid(...MEETUP_TYPES),
    meetupFormat: Joi.string().valid(...MEETUP_FORMATS),
    location: Joi.string().trim(),
    visibilityLocation: Joi.string().trim(),
    latitude: Joi.number().min(-90).max(90),
    longitude: Joi.number().min(-180).max(180),
    radius: Joi.number().min(1).max(100),
    visibilityRadius: Joi.number().min(1).max(50),
    status: Joi.string().valid(...MEETUP_STATUSES),
    creator: Joi.string().custom(objectId),
    tags: Joi.array().items(Joi.string()),
    search: Joi.string().trim(),
    page: Joi.number().min(1),
    limit: Joi.number().min(1).max(100),
  }),
};

const joinMeetup = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

const leaveMeetup = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

export {
  createMeetup,
  updateMeetup,
  getMeetup,
  getMeetups,
  joinMeetup,
  leaveMeetup,
};
