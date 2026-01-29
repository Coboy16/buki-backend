import { Op } from 'sequelize';
import { Client, Appointment, AppointmentType, User } from '../models';
import { NotFoundError, ConflictError } from '../utils/errors.util';
import { PaginationParams, PaginationResult, PreferredContact } from '../types';

interface CreateClientData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date?: Date | null;
  address?: string | null;
  preferred_contact?: PreferredContact;
  notes?: string | null;
  created_by: string;
}

interface UpdateClientData {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  birth_date?: Date | null;
  address?: string | null;
  preferred_contact?: PreferredContact;
  notes?: string | null;
}

interface ClientListResult {
  clients: Client[];
  pagination: PaginationResult;
}

export class ClientService {
  async findAll(
    pagination: PaginationParams,
    search?: string
  ): Promise<ClientListResult> {
    const { page, limit } = pagination;
    const offset = (page - 1) * limit;

    const whereClause: Record<string, unknown> = {};

    if (search) {
      whereClause[Op.or as unknown as string] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { phone: { [Op.like]: `%${search}%` } },
      ];
    }

    const { count, rows } = await Client.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
      ],
    });

    return {
      clients: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    };
  }

  async findById(id: string): Promise<Client> {
    const client = await Client.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'full_name', 'email'],
        },
        {
          model: Appointment,
          as: 'appointments',
          include: [
            {
              model: AppointmentType,
              as: 'appointmentType',
              attributes: ['id', 'name', 'duration_minutes', 'color'],
            },
          ],
          order: [['appointment_date', 'DESC'], ['start_time', 'DESC']],
          limit: 10,
        },
      ],
    });

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    return client;
  }

  async create(data: CreateClientData): Promise<Client> {
    const existingClient = await Client.findOne({
      where: { email: data.email },
      paranoid: false,
    });

    if (existingClient) {
      if (existingClient.deleted_at) {
        throw new ConflictError('A client with this email was previously deleted. Contact support to restore.');
      }
      throw new ConflictError('A client with this email already exists');
    }

    const client = await Client.create(data);

    return this.findById(client.id);
  }

  async update(id: string, data: UpdateClientData): Promise<Client> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    if (data.email && data.email !== client.email) {
      const existingClient = await Client.findOne({
        where: { email: data.email, id: { [Op.ne]: id } },
      });

      if (existingClient) {
        throw new ConflictError('A client with this email already exists');
      }
    }

    await client.update(data);

    return this.findById(id);
  }

  async delete(id: string): Promise<void> {
    const client = await Client.findByPk(id);

    if (!client) {
      throw new NotFoundError('Client not found');
    }

    await client.destroy();
  }
}

export default new ClientService();
