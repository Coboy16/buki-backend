import { sequelize } from '../config/database';
import { User } from '../models';
import { hashPassword } from '../utils/password.util';

const seedDatabase = async (): Promise<void> => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');

    // Check if admin user exists
    const existingAdmin = await User.findOne({
      where: { email: 'admin@appointments.com' },
    });

    if (existingAdmin) {
      console.log('Admin user already exists. Updating password...');
      const hashedPassword = await hashPassword('password123');
      await existingAdmin.update({ password_hash: hashedPassword });
      console.log('Password updated successfully!');
    } else {
      console.log('Creating admin user...');
      const hashedPassword = await hashPassword('password123');
      await User.create({
        email: 'admin@appointments.com',
        password_hash: hashedPassword,
        full_name: 'Administrador',
        role: 'admin',
        is_active: true,
      });
      console.log('Admin user created successfully!');
    }

    // List all users
    const users = await User.findAll({
      attributes: ['id', 'email', 'full_name', 'role', 'is_active'],
    });

    console.log('\nExisting users:');
    console.table(users.map(u => u.toJSON()));

    console.log('\n=================================');
    console.log('Login credentials:');
    console.log('Email: admin@appointments.com');
    console.log('Password: password123');
    console.log('=================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
