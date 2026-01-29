import { UserAttributes } from '../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: 'admin' | 'user' | 'receptionist';
        fullName: string;
      };
    }
  }
}

export {};
