import Joi from 'joi';
import { objectId } from './custom.validation';

// User ID validation
const userId = Joi.string()
  .pattern(/^@[a-zA-Z0-9_]+$/)
  .min(2)
  .max(30)
  .messages({
    'string.pattern.base': 'User ID must start with @ and contain only letters, numbers, and underscores',
    'string.min': 'User ID must be at least 2 characters long',
    'string.max': 'User ID cannot exceed 30 characters'
  });

// Email validation
const email = Joi.string()
  .email()
  .lowercase()
  .messages({
    'string.email': 'Please provide a valid email address'
  });

// Password validation
const password = Joi.string()
  .min(6)
  .max(128)
  .messages({
    'string.min': 'Password must be at least 6 characters long',
    'string.max': 'Password cannot exceed 128 characters'
  });

// Phone validation
const phone = Joi.string()
  .pattern(/^[+]?[1-9][\d]{0,15}$/)
  .allow('')
  .messages({
    'string.pattern.base': 'Please provide a valid phone number'
  });

// Location validation
const location = Joi.object({
  address: Joi.string().required().max(200),
  coordinates: Joi.array()
    .items(Joi.number())
    .length(2)
    .required()
    .messages({
      'array.length': 'Coordinates must be [longitude, latitude]',
      'array.items': 'Coordinates must be numbers'
    }),
  city: Joi.string().required().max(100),
  state: Joi.string().required().max(100),
  country: Joi.string().required().max(100).default('India')
});

// Create user validation
const createUser = {
  body: Joi.object().keys({
    name: Joi.string().required().min(1).max(50).trim(),
    email: email.required(),
    password: password.required(),
    userId: userId.required(),
    location: location.required(),
    interests: Joi.array().items(Joi.string().max(50)).max(20),
    photos: Joi.array().items(
      Joi.string().uri().pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    ).max(10),
    badges: Joi.array().items(Joi.string().max(30)).max(10),
    phone: phone,
    dateOfBirth: Joi.date().max('now').iso(),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say'),
    bio: Joi.string().max(500),
    avatar: Joi.string().uri().allow(''),
    privacy: Joi.object({
      showLocation: Joi.boolean(),
      showPhone: Joi.boolean(),
      showEmail: Joi.boolean(),
      profileVisibility: Joi.string().valid('public', 'friends', 'private')
    }),
    settings: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
        meetups: Joi.boolean(),
        messages: Joi.boolean()
      }),
      radius: Joi.number().min(1).max(50)
    })
  }),
};

// Update user validation
const updateUser = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
  body: Joi.object().keys({
    name: Joi.string().min(1).max(50).trim(),
    userId: userId,
    location: location,
    interests: Joi.array().items(Joi.string().max(50)).max(20),
    photos: Joi.array().items(
      Joi.string().uri().pattern(/\.(jpg|jpeg|png|gif|webp)$/i)
    ).max(10),
    badges: Joi.array().items(Joi.string().max(30)).max(10),
    phone: phone,
    dateOfBirth: Joi.date().max('now').iso(),
    gender: Joi.string().valid('male', 'female', 'other', 'prefer-not-to-say'),
    bio: Joi.string().max(500),
    avatar: Joi.string().uri().allow(''),
    privacy: Joi.object({
      showLocation: Joi.boolean(),
      showPhone: Joi.boolean(),
      showEmail: Joi.boolean(),
      profileVisibility: Joi.string().valid('public', 'friends', 'private')
    }),
    settings: Joi.object({
      notifications: Joi.object({
        email: Joi.boolean(),
        push: Joi.boolean(),
        meetups: Joi.boolean(),
        messages: Joi.boolean()
      }),
      radius: Joi.number().min(1).max(50)
    })
  }).min(1),
};

// Get user by ID validation
const getUserById = {
  params: Joi.object().keys({
    id: Joi.string().required().custom(objectId),
  }),
};

// Login validation
const login = {
  body: Joi.object().keys({
    email: email.required(),
    password: Joi.string().required()
  }),
};

export {
  createUser,
  updateUser,
  getUserById,
  login,
}; 