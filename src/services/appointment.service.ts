import { Op } from 'sequelize';
import { Appointment, Client, AppointmentType, User } from '../models';
import { NotFoundError, ConflictError, BadRequestError } from '../utils/errors.util';
import { PaginationParams, PaginationResult, AppointmentStatus } from '../types';

interface CreateAppointmentData {
  client_id: string;
  appointment_type_id: string;
  appointment_date: Date;
  start_time: string;
  notes?: string | null;
  created_by: string;
}

interface UpdateAppointmentData {
  client_id?: string;
  appointment_type_id?: string;
  appointment_date?: Date;
  start_time?: string;
  notes?: string | null;
}

interface AppointmentFilters {
  date?: Date;
  status?: AppointmentStatus;
  client_id?: string;
}

interface AppointmentListResult {
  appointments: Appointment[];
  pagination: PaginationResult;
}

export class AppointmentService {
  async findAll(
    pagination: PaginationParams,
    filters: AppointmentFilters
  ): Promise<AppointmentListResult> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};

    if (filters.date) {
      whereClause['appointment_date'] = filters.date;
    }

    if (filters.status) {
      whereClause['status'] = filters.status;
    }

    if (filters.client_id) {
      whereClause['client_id'] = filters.client_id;
    }

    const { count, rows } = await Appointment.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['appointment_date', 'ASC'], ['start_time', 'ASC']],
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone'],
        },
        {
          model: AppointmentType,
          as: 'appointmentType',
          attributes: ['id', 'name', 'duration_minutes', 'color'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    return {
      appointments: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findById(id: string): Promise<Appointment> {
    const appointment = await Appointment.findByPk(id, {
      include: [
        {
          model: Client,
          as: 'client',
          attributes: ['id', 'first_name', 'last_name', 'email', 'phone', 'address', 'preferred_contact'],
        },
        {
          model: AppointmentType,
          as: 'appointmentType',
          attributes: ['id', 'name', 'description', 'duration_minutes', 'color'],
        },
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    return appointment;
  }

  async create(data: CreateAppointmentData): Promise<Appointment> {
    // Verify client exists
    const client = await Client.findByPk(data.client_id);
    if (!client) {
      throw new NotFoundError('Client not found');
    }

    // Verify appointment type exists
    const appointmentType = await AppointmentType.findByPk(data.appointment_type_id);
    if (!appointmentType) {
      throw new NotFoundError('Appointment type not found');
    }

    if (!appointmentType.is_active) {
      throw new BadRequestError('This appointment type is not active');
    }

    // Validate appointment date is not in the past
    const appointmentDate = new Date(data.appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (appointmentDate < today) {
      throw new BadRequestError('Appointment date cannot be in the past');
    }

    // Check for overlapping appointments
    await this.checkForOverlap(
      data.client_id,
      data.appointment_date,
      data.start_time,
      appointmentType.duration_minutes
    );

    const appointment = await Appointment.create({
      ...data,
      status: 'pending',
    });

    return this.findById(appointment.id);
  }

  async update(id: string, data: UpdateAppointmentData): Promise<Appointment> {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    // Validate new client if provided
    if (data.client_id && data.client_id !== appointment.client_id) {
      const client = await Client.findByPk(data.client_id);
      if (!client) {
        throw new NotFoundError('Client not found');
      }
    }

    // Validate new appointment type if provided
    let appointmentType = await AppointmentType.findByPk(appointment.appointment_type_id);
    if (data.appointment_type_id && data.appointment_type_id !== appointment.appointment_type_id) {
      appointmentType = await AppointmentType.findByPk(data.appointment_type_id);
      if (!appointmentType) {
        throw new NotFoundError('Appointment type not found');
      }
      if (!appointmentType.is_active) {
        throw new BadRequestError('This appointment type is not active');
      }
    }

    // Validate date if changed
    if (data.appointment_date) {
      const appointmentDate = new Date(data.appointment_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (appointmentDate < today) {
        throw new BadRequestError('Appointment date cannot be in the past');
      }
    }

    // Check for overlapping appointments if date or time changed
    if (data.appointment_date || data.start_time || data.client_id) {
      await this.checkForOverlap(
        data.client_id ?? appointment.client_id,
        data.appointment_date ?? appointment.appointment_date,
        data.start_time ?? appointment.start_time,
        appointmentType!.duration_minutes,
        id
      );
    }

    await appointment.update(data);

    return this.findById(id);
  }

  async updateStatus(id: string, status: AppointmentStatus): Promise<Appointment> {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    await appointment.update({ status });

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const appointment = await Appointment.findByPk(id);

    if (!appointment) {
      throw new NotFoundError('Appointment not found');
    }

    await appointment.destroy();
  }

  private async checkForOverlap(
    clientId: string,
    appointmentDate: Date,
    startTime: string,
    durationMinutes: number,
    excludeAppointmentId?: string
  ): Promise<void> {
    // Parse start time
    const [hours, minutes] = startTime.split(':').map(Number);
    const startMinutes = (hours ?? 0) * 60 + (minutes ?? 0);
    const endMinutes = startMinutes + durationMinutes;

    // Format end time
    const endHours = Math.floor(endMinutes / 60);
    const endMins = endMinutes % 60;
    const endTime = `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}:00`;

    const whereClause: Record<string, unknown> = {
      client_id: clientId,
      appointment_date: appointmentDate,
      status: { [Op.notIn]: ['cancelled', 'no_show'] },
    };

    if (excludeAppointmentId) {
      whereClause['id'] = { [Op.ne]: excludeAppointmentId };
    }

    const existingAppointments = await Appointment.findAll({
      where: whereClause,
      include: [
        {
          model: AppointmentType,
          as: 'appointmentType',
          attributes: ['duration_minutes'],
        },
      ],
    });

    for (const existing of existingAppointments) {
      const existingType = existing.get('appointmentType') as AppointmentType;
      const [existingHours, existingMinutes] = existing.start_time.split(':').map(Number);
      const existingStartMinutes = (existingHours ?? 0) * 60 + (existingMinutes ?? 0);
      const existingEndMinutes = existingStartMinutes + existingType.duration_minutes;

      // Check if times overlap
      if (startMinutes < existingEndMinutes && endMinutes > existingStartMinutes) {
        throw new ConflictError(
          `This appointment overlaps with an existing appointment at ${existing.start_time}`,
          { existingAppointmentId: existing.id }
        );
      }
    }
  }
}

export default new AppointmentService();
