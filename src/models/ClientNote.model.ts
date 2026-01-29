import { DataTypes, Model, Optional } from 'sequelize';
import { sequelize } from '../config/database';

export interface ClientNoteAttributes {
  id: string;
  client_id: string;
  note: string;
  is_important: boolean;
  created_by: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ClientNoteCreationAttributes extends Optional<ClientNoteAttributes, 'id' | 'is_important' | 'created_at' | 'updated_at'> {}

export class ClientNote extends Model<ClientNoteAttributes, ClientNoteCreationAttributes> implements ClientNoteAttributes {
  public id!: string;
  public client_id!: string;
  public note!: string;
  public is_important!: boolean;
  public created_by!: string;
  public readonly created_at!: Date;
  public readonly updated_at!: Date;
}

ClientNote.init(
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
    note: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    is_important: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
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
    tableName: 'client_notes',
    timestamps: true,
    paranoid: false,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
);

export default ClientNote;
