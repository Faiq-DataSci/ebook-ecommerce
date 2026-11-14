export type UserRole = 'CUSTOMER';

export interface CustomerProfile {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  createdAt: string;
  isSimulation: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}
