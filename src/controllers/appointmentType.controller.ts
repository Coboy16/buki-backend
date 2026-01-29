import { Request, Response, NextFunction } from 'express';
import appointmentTypeService from '../services/appointmentType.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.util';

/**
 * @swagger
 * /appointment-types:
 *   get:
 *     summary: Listar todos los tipos de cita
 *     description: Obtiene una lista de todos los tipos de cita activos
 *     tags: [Appointment Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: include_inactive
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Incluir tipos de cita inactivos (solo admin)
 *     responses:
 *       200:
 *         description: Lista de tipos de cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AppointmentType'
 *       401:
 *         description: No autorizado
 */
export const getAppointmentTypes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const includeInactive = req.query.include_inactive === 'true' && req.user?.role === 'admin';
    const appointmentTypes = await appointmentTypeService.findAll(includeInactive);
    sendSuccess(res, appointmentTypes);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointment-types/{id}:
 *   get:
 *     summary: Obtener un tipo de cita por ID
 *     description: Devuelve los detalles de un tipo de cita específico
 *     tags: [Appointment Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del tipo de cita
 *     responses:
 *       200:
 *         description: Detalles del tipo de cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AppointmentType'
 *       404:
 *         description: Tipo de cita no encontrado
 *       401:
 *         description: No autorizado
 */
export const getAppointmentTypeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointmentType = await appointmentTypeService.findById(id);
    sendSuccess(res, appointmentType);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointment-types:
 *   post:
 *     summary: Crear un nuevo tipo de cita
 *     description: Crea un nuevo tipo de cita en el sistema (solo administradores)
 *     tags: [Appointment Types]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentTypeInput'
 *     responses:
 *       201:
 *         description: Tipo de cita creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AppointmentType'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       403:
 *         description: No tiene permisos de administrador
 *       409:
 *         description: Ya existe un tipo de cita con ese nombre
 *       401:
 *         description: No autorizado
 */
export const createAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const appointmentType = await appointmentTypeService.create(req.body);
    sendCreated(res, appointmentType, 'Appointment type created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointment-types/{id}:
 *   put:
 *     summary: Actualizar un tipo de cita
 *     description: Actualiza los datos de un tipo de cita existente (solo administradores)
 *     tags: [Appointment Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del tipo de cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentTypeInput'
 *     responses:
 *       200:
 *         description: Tipo de cita actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/AppointmentType'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Tipo de cita no encontrado
 *       409:
 *         description: Ya existe un tipo de cita con ese nombre
 *       401:
 *         description: No autorizado
 */
export const updateAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointmentType = await appointmentTypeService.update(id, req.body);
    sendSuccess(res, appointmentType, 'Appointment type updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointment-types/{id}:
 *   delete:
 *     summary: Eliminar un tipo de cita
 *     description: Desactiva un tipo de cita del sistema (solo administradores)
 *     tags: [Appointment Types]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID del tipo de cita
 *     responses:
 *       204:
 *         description: Tipo de cita eliminado exitosamente
 *       403:
 *         description: No tiene permisos de administrador
 *       404:
 *         description: Tipo de cita no encontrado
 *       401:
 *         description: No autorizado
 */
export const deleteAppointmentType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await appointmentTypeService.delete(id);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};
