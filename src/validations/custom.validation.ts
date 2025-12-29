import Joi from 'joi';

const password = (value: string, helpers: any) => {
  if (value.length < 8) {
    return helpers.message('Password must be at least 8 characters long');
  }
  if (!value.match(/\d/) || !value.match(/[a-z]/) || !value.match(/[A-Z]/)) {
    return helpers.message('Password must contain at least 1 letter and 1 number');
  }
  return value;
};

const email = (value: string, helpers: any) => {
  if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return helpers.message('Please provide a valid email address');
  }
  return value;
};

const objectId = (value: string, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('Invalid ID format');
  }
  return value;
};

const mobile = (value: string, helpers: any) => {
  if (!value.match(/^[0-9]{10}$/)) {
    return helpers.message('Mobile number must be exactly 10 digits');
  }
  return value;
};

const fullName = (value: string, helpers: any) => {
  if (!value.match(/^[a-zA-Z\s]+$/)) {
    return helpers.message('Full name can only contain letters and spaces');
  }
  return value;
};

const url = (value: string, helpers: any) => {
  if (value && !value.match(/^https?:\/\/.+/)) {
    return helpers.message('Please provide a valid URL');
  }
  return value;
};

const futureDate = (value: string, helpers: any) => {
  const date = new Date(value);
  const now = new Date();
  if (date <= now) {
    return helpers.message('Date must be in the future');
  }
  return value;
};

const pastDate = (value: string, helpers: any) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return helpers.message('Invalid date format');
  }
  if (date >= new Date()) {
    return helpers.message('Date must be in the past');
  }
  return value;
};

const coordinates = (value: number[], helpers: any) => {
  if (!Array.isArray(value) || value.length !== 2) {
    return helpers.message('Coordinates must be an array of 2 numbers [longitude, latitude]');
  }
  const [longitude, latitude] = value;
  if (typeof longitude !== 'number' || typeof latitude !== 'number') {
    return helpers.message('Coordinates must be numbers');
  }
  if (longitude < -180 || longitude > 180) {
    return helpers.message('Longitude must be between -180 and 180');
  }
  if (latitude < -90 || latitude > 90) {
    return helpers.message('Latitude must be between -90 and 90');
  }
  return value;
};

const phoneNumber = (value: string, helpers: any) => {
  if (!value.match(/^[+]?[1-9][\d]{0,15}$/)) {
    return helpers.message('Please provide a valid phone number');
  }
  return value;
};

const futureDateTime = (value: string, helpers: any) => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return helpers.message('Invalid date format');
  }
  if (date <= new Date()) {
    return helpers.message('Date and time must be in the future');
  }
  return value;
};

export {
  password,
  email,
  objectId,
  mobile,
  fullName,
  url,
  futureDate,
  pastDate,
  coordinates,
  phoneNumber,
  futureDateTime,
}; 