import Joi from 'joi';
import { password, email, fullName, url, pastDate, coordinates, phoneNumber } from './custom.validation';

const register = {
  body: Joi.object().keys({
    name: Joi.string()
      .trim()
      .min(2)
      .max(50)
      .required()
      .custom(fullName)
      .messages({
        'string.empty': 'Name is required.',
        'string.min': 'Name must be at least 2 characters long.',
        'string.max': 'Name cannot exceed 50 characters.',
      }),
    email: Joi.string().required().custom(email),
    password: Joi.string().required().custom(password),
    location: Joi.object().keys({
      address: Joi.string()
        .trim()
        .min(2)
        .max(200)
        .required()
        .messages({
          'string.empty': 'Address is required.',
          'string.min': 'Address must be at least 2 characters long.',
          'string.max': 'Address cannot exceed 200 characters.',
        }),
      coordinates: Joi.array().optional().custom(coordinates),
      city: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'City is required.',
          'string.min': 'City must be at least 2 characters long.',
          'string.max': 'City cannot exceed 50 characters.',
        }),
      state: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'State is required.',
          'string.min': 'State must be at least 2 characters long.',
          'string.max': 'State cannot exceed 50 characters.',
        }),
      country: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .required()
        .messages({
          'string.empty': 'Country is required.',
          'string.min': 'Country must be at least 2 characters long.',
          'string.max': 'Country cannot exceed 50 characters.',
        }),
    }).required(),
    interests: Joi.array()
      .items(Joi.string().trim().min(1).max(50))
      .min(1)
      .max(10)
      .optional()
      .messages({
        'array.min': 'At least one interest is required.',
        'array.max': 'Cannot have more than 10 interests.',
        'array.items': 'Each interest must be between 1 and 50 characters.',
      }),
    phone: Joi.string().optional().custom(phoneNumber),
    dateOfBirth: Joi.string().optional().custom(pastDate).messages({
      'any.custom': 'Date of birth must be in the past',
    }),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional(),
  }),
};

const login = {
  body: Joi.object().keys({
    email: Joi.string().required().custom(email),
    password: Joi.string().required(),
  }),
};

const updateProfile = {
  body: Joi.object()
    .keys({
      name: Joi.string()
        .trim()
        .min(2)
        .max(50)
        .optional()
        .custom(fullName)
        .messages({
          'string.min': 'Name must be at least 2 characters long.',
          'string.max': 'Name cannot exceed 50 characters.',
        }),
      location: Joi.object().keys({
        address: Joi.string()
          .trim()
          .min(2)
          .max(200)
          .required()
          .messages({
            'string.empty': 'Address is required.',
            'string.min': 'Address must be at least 2 characters long.',
            'string.max': 'Address cannot exceed 200 characters.',
          }),
        coordinates: Joi.array().optional().custom(coordinates),
        city: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required()
          .messages({
            'string.empty': 'City is required.',
            'string.min': 'City must be at least 2 characters long.',
            'string.max': 'City cannot exceed 50 characters.',
          }),
        state: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required()
          .messages({
            'string.empty': 'State is required.',
            'string.min': 'State must be at least 2 characters long.',
            'string.max': 'State cannot exceed 50 characters.',
          }),
        country: Joi.string()
          .trim()
          .min(2)
          .max(50)
          .required()
          .messages({
            'string.empty': 'Country is required.',
            'string.min': 'Country must be at least 2 characters long.',
            'string.max': 'Country cannot exceed 50 characters.',
          }),
      }).optional(),
      bio: Joi.string()
        .trim()
        .max(500)
        .optional()
        .allow('')
        .messages({
          'string.max': 'Bio cannot exceed 500 characters.',
        }),
      interests: Joi.array()
        .items(Joi.string().trim().min(1).max(50))
        .min(1)
        .max(10)
        .optional()
        .messages({
          'array.min': 'At least one interest is required.',
          'array.max': 'Cannot have more than 10 interests.',
          'array.items': 'Each interest must be between 1 and 50 characters.',
        }),
      avatar: Joi.string().optional().custom(url).allow(''),
      phone: Joi.string().optional().custom(phoneNumber),
      dateOfBirth: Joi.string().optional().custom(pastDate).messages({
        'any.custom': 'Date of birth must be in the past',
      }),
      gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say').optional(),
      privacy: Joi.object().keys({
        showLocation: Joi.boolean().optional(),
        showPhone: Joi.boolean().optional(),
        showEmail: Joi.boolean().optional(),
        profileVisibility: Joi.string().valid('public', 'friends', 'private').optional(),
      }).optional(),
      settings: Joi.object().keys({
        notifications: Joi.object({
          email: Joi.boolean().optional(),
          push: Joi.boolean().optional(),
          meetups: Joi.boolean().optional(),
          messages: Joi.boolean().optional()
        }).optional(),
        radius: Joi.number().min(1).max(100).optional().messages({
          'number.min': 'Radius must be at least 1 km',
          'number.max': 'Radius cannot exceed 100 km',
        }),
      }).optional(),
    })
    .min(1),
};

export {
  register,
  login,
  updateProfile,
}; 