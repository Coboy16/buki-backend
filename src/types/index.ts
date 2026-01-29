export type UserRole = 'admin' | 'user' | 'receptionist';

export type PreferredContact = 'email' | 'phone' | 'whatsapp';

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no_show';

export type NotificationType = 'appointment_reminder' | 'appointment_confirmed' | 'appointment_cancelled' | 'system';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationResult {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    message: string;
    code: string;
    details?: Record<string, unknown>;
  };
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}
