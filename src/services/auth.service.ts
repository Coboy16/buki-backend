import { User } from '../models';
import { comparePassword, hashPassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';
import { UnauthorizedError, ConflictError, NotFoundError } from '../utils/errors.util';
import { UserRole } from '../types';

interface LoginResult {
  user: {
    id: string;
    email: string;
    full_name: string;
    role: UserRole;
  };
  token: string;
}

interface RegisterData {
  email: string;
  password: string;
  full_name: string;
  role?: UserRole;
}

export class AuthService {
  async login(email: string, password: string): Promise<LoginResult> {
    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('User account is deactivated');
    }

    const isPasswordValid = await comparePassword(password, user.password_hash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    };
  }

  async register(data: RegisterData): Promise<LoginResult> {
    const existingUser = await User.findOne({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    const hashedPassword = await hashPassword(data.password);

    const user = await User.create({
      email: data.email,
      password_hash: hashedPassword,
      full_name: data.full_name,
      role: data.role ?? 'user',
      is_active: true,
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
      },
      token,
    };
  }

  async getProfile(userId: string): Promise<Omit<User['dataValues'], 'password_hash'>> {
    const user = await User.findByPk(userId, {
      attributes: { exclude: ['password_hash'] },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user.toSafeObject();
  }

  async refreshToken(userId: string): Promise<{ token: string }> {
    const user = await User.findByPk(userId);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.is_active) {
      throw new UnauthorizedError('User account is deactivated');
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return { token };
  }
}

export default new AuthService();
