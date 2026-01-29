import { Op } from 'sequelize';
import { AppointmentType } from '../models';
import { NotFoundError, ConflictError } from '../utils/errors.util';

interface CreateAppointmentTypeData {
  name: string;
  description?: string | null;
  duration_minutes: number;
  color?: string | null;
}

interface UpdateAppointmentTypeData {
  name?: string;
  description?: string | null;
  duration_minutes?: number;
  color?: string | null;
  is_active?: boolean;
}

export class AppointmentTypeService {
  async findAll(includeInactive: boolean = false): Promise<AppointmentType[]> {
    const whereClause: Record<string, unknown> = {};

    if (!includeInactive) {
      whereClause['is_active'] = true;
    }

    return AppointmentType.findAll({
      where: whereClause,
      order: [['name', 'ASC']],
    });
  }

  async findById(id: string): Promise<AppointmentType> {
    const appointmentType = await AppointmentType.findByPk(id);

    if (!appointmentType) {
      throw new NotFoundError('Appointment type not found');
    }

    return appointmentType;
  }

  async create(data: CreateAppointmentTypeData): Promise<AppointmentType> {
    const existingType = await AppointmentType.findOne({
      where: { name: data.name },
    });

    if (existingType) {
      throw new ConflictError('An appointment type with this name already exists');
    }

    return AppointmentType.create({
      ...data,
      is_active: true,
    });
  }

  async update(id: string, data: UpdateAppointmentTypeData): Promise<AppointmentType> {
    const appointmentType = await AppointmentType.findByPk(id);

    if (!appointmentType) {
      throw new NotFoundError('Appointment type not found');
    }

    if (data.name && data.name !== appointmentType.name) {
      const existingType = await AppointmentType.findOne({
        where: { name: data.name, id: { [Op.ne]: id } },
      });

      if (existingType) {
        throw new ConflictError('An appointment type with this name already exists');
      }
    }

    await appointmentType.update(data);

    return appointmentType;
  }

  async delete(id: string): Promise<void> {
    const appointmentType = await AppointmentType.findByPk(id);

    if (!appointmentType) {
      throw new NotFoundError('Appointment type not found');
    }

    // Soft delete by marking as inactive
    await appointmentType.update({ is_active: false });
  }
}

export default new AppointmentTypeService();
