import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { AppointmentStatus } from '../types';

export interface AppointmentAttributes {
  id: string;
  client_id: string;
  appointment_type_id: string;
  appointment_date: Date;
  start_time: string;
  end_time?: string | null;
  status: AppointmentStatus;
  notes?: string | null;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface AppointmentCreationAttributes extends Optional<AppointmentAttributes, 'id' | 'end_time' | 'status' | 'notes' | 'created_at' | 'updated_at' | 'deleted_at'> {}

export class Appointment extends Model<AppointmentAttributes, AppointmentCreationAttributes> implements AppointmentAttributes {
  public id!: string;
  public client_id!: string;
  public appointment_type_id!: string;
  public appointment_date!: Date;
  public start_time!: string;
  public end_time!: string | null;
  public status!: AppointmentStatus;
  public notes!: string | null;
  public created_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;
}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'clients',
        key: 'id',
      },
    },
    appointment_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'appointment_types',
        key: 'id',
      },
    },
    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    start_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },
    end_time: {
      type: DataTypes.TIME,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'confirmed', 'completed', 'cancelled', 'no_show'),
      allowNull: false,
      defaultValue: 'pending',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    created_by: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
    },
  },
  {
    sequelize,
    tableName: 'appointments',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

export default Appointment;
