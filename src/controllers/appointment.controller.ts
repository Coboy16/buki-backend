import { Request, Response, NextFunction } from 'express';
import appointmentService from '../services/appointment.service';
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.util';
import { AppointmentStatus } from '../types';

/**
 * @swagger
 * /appointments:
 *   get:
 *     summary: Listar todas las citas
 *     description: Obtiene una lista paginada de citas con filtros opcionales
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Número de página
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *           maximum: 100
 *         description: Cantidad de registros por página
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filtrar por fecha (YYYY-MM-DD)
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, confirmed, completed, cancelled, no_show]
 *         description: Filtrar por estado
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filtrar por ID de cliente
 *     responses:
 *       200:
 *         description: Lista de citas
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     appointments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Appointment'
 *                     pagination:
 *                       $ref: '#/components/schemas/Pagination'
 *       401:
 *         description: No autorizado
 */
export const getAppointments = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { page, limit, date, status, client_id } = req.query;
    const result = await appointmentService.findAll(
      { page: Number(page) || 1, limit: Number(limit) || 10 },
      {
        date: date ? new Date(date as string) : undefined,
        status: status as AppointmentStatus | undefined,
        client_id: client_id as string | undefined,
      }
    );
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointments/{id}:
 *   get:
 *     summary: Obtener una cita por ID
 *     description: Devuelve los detalles de una cita específica incluyendo información del cliente
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la cita
 *     responses:
 *       200:
 *         description: Detalles de la cita
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 */
export const getAppointmentById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.findById(id);
    sendSuccess(res, appointment);
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointments:
 *   post:
 *     summary: Crear una nueva cita
 *     description: Crea una nueva cita en el sistema. Valida que no haya solapamiento de citas.
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       201:
 *         description: Cita creada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos o fecha en el pasado
 *       404:
 *         description: Cliente o tipo de cita no encontrado
 *       409:
 *         description: Conflicto de horarios (solapamiento de citas)
 *       401:
 *         description: No autorizado
 */
export const createAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = req.user!.id;
    const appointment = await appointmentService.create({
      ...req.body,
      created_by: userId,
    });
    sendCreated(res, appointment, 'Appointment created successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointments/{id}:
 *   put:
 *     summary: Actualizar una cita
 *     description: Actualiza los datos de una cita existente
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AppointmentInput'
 *     responses:
 *       200:
 *         description: Cita actualizada exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *                 message:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos
 *       404:
 *         description: Cita no encontrada
 *       409:
 *         description: Conflicto de horarios
 *       401:
 *         description: No autorizado
 */
export const updateAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const appointment = await appointmentService.update(id, req.body);
    sendSuccess(res, appointment, 'Appointment updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointments/{id}/status:
 *   patch:
 *     summary: Actualizar estado de una cita
 *     description: Cambia únicamente el estado de una cita
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la cita
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, confirmed, completed, cancelled, no_show]
 *     responses:
 *       200:
 *         description: Estado actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Appointment'
 *                 message:
 *                   type: string
 *       400:
 *         description: Estado inválido
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 */
export const updateAppointmentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appointment = await appointmentService.updateStatus(id, status);
    sendSuccess(res, appointment, 'Appointment status updated successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * @swagger
 * /appointments/{id}:
 *   delete:
 *     summary: Eliminar una cita
 *     description: Elimina una cita del sistema (soft delete)
 *     tags: [Appointments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID de la cita
 *     responses:
 *       204:
 *         description: Cita eliminada exitosamente
 *       404:
 *         description: Cita no encontrada
 *       401:
 *         description: No autorizado
 */
export const deleteAppointment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    await appointmentService.delete(id);
    sendNoContent(res);
  } catch (error) {
    next(error);
  }
};
