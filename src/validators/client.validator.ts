import Joi from 'joi';

export const createClientSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 100 characters',
      'any.required': 'First name is required',
    }),
  last_name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 100 characters',
      'any.required': 'Last name is required',
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.email': 'Email must be a valid email address',
      'any.required': 'Email is required',
    }),
  phone: Joi.string()
    .min(7)
    .max(20)
    .required()
    .messages({
      'string.min': 'Phone must be at least 7 characters long',
      'string.max': 'Phone must not exceed 20 characters',
      'any.required': 'Phone is required',
    }),
  birth_date: Joi.date()
    .max('now')
    .optional()
    .messages({
      'date.max': 'Birth date must be in the past',
    }),
  address: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Address must not exceed 500 characters',
    }),
  preferred_contact: Joi.string()
    .valid('email', 'phone', 'whatsapp')
    .default('email')
    .messages({
      'any.only': 'Preferred contact must be one of: email, phone, whatsapp',
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Notes must not exceed 1000 characters',
    }),
});

export const updateClientSchema = Joi.object({
  first_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name must not exceed 100 characters',
    }),
  last_name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Last name must be at least 2 characters long',
      'string.max': 'Last name must not exceed 100 characters',
    }),
  email: Joi.string()
    .email()
    .optional()
    .messages({
      'string.email': 'Email must be a valid email address',
    }),
  phone: Joi.string()
    .min(7)
    .max(20)
    .optional()
    .messages({
      'string.min': 'Phone must be at least 7 characters long',
      'string.max': 'Phone must not exceed 20 characters',
    }),
  birth_date: Joi.date()
    .max('now')
    .optional()
    .allow(null)
    .messages({
      'date.max': 'Birth date must be in the past',
    }),
  address: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Address must not exceed 500 characters',
    }),
  preferred_contact: Joi.string()
    .valid('email', 'phone', 'whatsapp')
    .optional()
    .messages({
      'any.only': 'Preferred contact must be one of: email, phone, whatsapp',
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Notes must not exceed 1000 characters',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

export const clientQuerySchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit must not exceed 100',
    }),
  search: Joi.string()
    .max(100)
    .optional()
    .allow('')
    .messages({
      'string.max': 'Search term must not exceed 100 characters',
    }),
});
