import User from './User.model';
import Client from './Client.model';
import Appointment from './Appointment.model';
import AppointmentType from './AppointmentType.model';
import ClientNote from './ClientNote.model';
import Notification from './Notification.model';

// Define associations
User.hasMany(Client, { foreignKey: 'created_by', as: 'createdClients' });
Client.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Appointment, { foreignKey: 'created_by', as: 'createdAppointments' });
Appointment.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

Client.hasMany(Appointment, { foreignKey: 'client_id', as: 'appointments' });
Appointment.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

AppointmentType.hasMany(Appointment, { foreignKey: 'appointment_type_id', as: 'appointments' });
Appointment.belongsTo(AppointmentType, { foreignKey: 'appointment_type_id', as: 'appointmentType' });

Client.hasMany(ClientNote, { foreignKey: 'client_id', as: 'clientNotes' });
ClientNote.belongsTo(Client, { foreignKey: 'client_id', as: 'client' });

User.hasMany(ClientNote, { foreignKey: 'created_by', as: 'createdNotes' });
ClientNote.belongsTo(User, { foreignKey: 'created_by', as: 'creator' });

User.hasMany(Notification, { foreignKey: 'user_id', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'user_id', as: 'user' });

export {
  User,
  Client,
  Appointment,
  AppointmentType,
  ClientNote,
  Notification,
};

export default {
  User,
  Client,
  Appointment,
  AppointmentType,
  ClientNote,
  Notification,
};
