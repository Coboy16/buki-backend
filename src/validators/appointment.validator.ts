import Joi from 'joi';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?$/;

export const createAppointmentSchema = Joi.object({
  client_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Client ID must be a valid UUID',
      'any.required': 'Client ID is required',
    }),
  appointment_type_id: Joi.string()
    .uuid()
    .required()
    .messages({
      'string.guid': 'Appointment type ID must be a valid UUID',
      'any.required': 'Appointment type ID is required',
    }),
  appointment_date: Joi.date()
    .min('now')
    .required()
    .messages({
      'date.min': 'Appointment date cannot be in the past',
      'any.required': 'Appointment date is required',
    }),
  start_time: Joi.string()
    .pattern(timeRegex)
    .required()
    .messages({
      'string.pattern.base': 'Start time must be in format HH:MM or HH:MM:SS',
      'any.required': 'Start time is required',
    }),
  notes: Joi.string()
    .max(1000)
    .optional()
    .allow(null, '')
    .messages({
      'string.max': 'Notes must not exceed 1000 characters',
    }),
});

export const updateAppointmentSchema = Joi.object({
  client_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.guid': 'Client ID must be a valid UUID',
    }),
  appointment_type_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.guid': 'Appointment type ID must be a valid UUID',
    }),
  appointment_date: Joi.date()
    .min('now')
    .optional()
    .messages({
      'date.min': 'Appointment date cannot be in the past',
    }),
  start_time: Joi.string()
    .pattern(timeRegex)
    .optional()
    .messages({
      'string.pattern.base': 'Start time must be in format HH:MM or HH:MM:SS',
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

export const updateAppointmentStatusSchema = Joi.object({
  status: Joi.string()
    .valid('pending', 'confirmed', 'completed', 'cancelled', 'no_show')
    .required()
    .messages({
      'any.only': 'Status must be one of: pending, confirmed, completed, cancelled, no_show',
      'any.required': 'Status is required',
    }),
});

export const appointmentQuerySchema = Joi.object({
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
  date: Joi.date()
    .optional()
    .messages({
      'date.base': 'Date must be a valid date',
    }),
  status: Joi.string()
    .valid('pending', 'confirmed', 'completed', 'cancelled', 'no_show')
    .optional()
    .messages({
      'any.only': 'Status must be one of: pending, confirmed, completed, cancelled, no_show',
    }),
  client_id: Joi.string()
    .uuid()
    .optional()
    .messages({
      'string.guid': 'Client ID must be a valid UUID',
    }),
});
