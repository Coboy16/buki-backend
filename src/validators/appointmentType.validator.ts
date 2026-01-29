import Joi from 'joi';

const colorRegex = /^#[0-9A-Fa-f]{6}$/;

export const createAppointmentTypeSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
      'any.required': 'Name is required',
    }),
  description: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 500 characters',
    }),
  duration_minutes: Joi.number()
    .integer()
    .min(5)
    .max(480)
    .required()
    .messages({
      'number.min': 'Duration must be at least 5 minutes',
      'number.max': 'Duration must not exceed 480 minutes (8 hours)',
      'any.required': 'Duration is required',
    }),
  color: Joi.string()
    .pattern(colorRegex)
    .optional()
    .default('#4CAF50')
    .messages({
      'string.pattern.base': 'Color must be a valid hex color (e.g., #FF6B6B)',
    }),
});

export const updateAppointmentTypeSchema = Joi.object({
  name: Joi.string()
    .min(2)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name must not exceed 100 characters',
    }),
  description: Joi.string()
    .max(500)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Description must not exceed 500 characters',
    }),
  duration_minutes: Joi.number()
    .integer()
    .min(5)
    .max(480)
    .optional()
    .messages({
      'number.min': 'Duration must be at least 5 minutes',
      'number.max': 'Duration must not exceed 480 minutes (8 hours)',
    }),
  color: Joi.string()
    .pattern(colorRegex)
    .optional()
    .messages({
      'string.pattern.base': 'Color must be a valid hex color (e.g., #FF6B6B)',
    }),
  is_active: Joi.boolean()
    .optional(),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});
