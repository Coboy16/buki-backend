import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';
import { PreferredContact } from '../types';

export interface ClientAttributes {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  birth_date?: Date | null;
  address?: string | null;
  preferred_contact: PreferredContact;
  notes?: string | null;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

export interface ClientCreationAttributes extends Optional<ClientAttributes, 'id' | 'birth_date' | 'address' | 'preferred_contact' | 'notes' | 'created_at' | 'updated_at' | 'deleted_at'> {}

export class Client extends Model<ClientAttributes, ClientCreationAttributes> implements ClientAttributes {
  public id!: string;
  public first_name!: string;
  public last_name!: string;
  public email!: string;
  public phone!: string;
  public birth_date!: Date | null;
  public address!: string | null;
  public preferred_contact!: PreferredContact;
  public notes!: string | null;
  public created_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
  public readonly deleted_at!: Date | null;

  public get fullName(): string {
    return `${this.first_name} ${this.last_name}`;
  }
}

Client.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    birth_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    preferred_contact: {
      type: DataTypes.ENUM('email', 'phone', 'whatsapp'),
      allowNull: false,
      defaultValue: 'email',
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
    tableName: 'clients',
    timestamps: true,
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  }
);

export default Client;
