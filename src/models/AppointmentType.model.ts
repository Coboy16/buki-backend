import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface AppointmentTypeAttributes {
  id: string;
  name: string;
  description?: string | null;
  duration_minutes: number;
  color?: string | null;
  is_active: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface AppointmentTypeCreationAttributes extends Optional<AppointmentTypeAttributes, 'id' | 'description' | 'color' | 'is_active' | 'created_at' | 'updated_at'> {}

export class AppointmentType extends Model<AppointmentTypeAttributes, AppointmentTypeCreationAttributes> implements AppointmentTypeAttributes {
  public id!: string;
  public name!: string;
  public description!: string | null;
  public duration_minutes!: number;
  public color!: string | null;
  public is_active!: boolean;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

AppointmentType.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    duration_minutes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 30,
    },
    color: {
      type: DataTypes.STRING(7),
      allowNull: true,
      defaultValue: '#4CAF50',
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    sequelize,
    tableName: 'appointment_types',
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default AppointmentType;
