import type {
  CustomerProfile,
  LoginCredentials,
  RegisterPayload,
} from '../types/user.types';
import { isValidEmail, validatePassword } from '../utils/validators';

const STORAGE_KEY = 'ebook_store_sim_customer';

const DEFAULT_DEMO_CUSTOMER: CustomerProfile = {
  id: 'cust-sim-01',
  fullName: 'Rizky Pratama (Akun Contoh)',
  email: 'pelanggan.simulasi@ebookstore.local',
  role: 'CUSTOMER',
  createdAt: '2026-10-01T08:00:00.000Z',
  isSimulation: true,
};

export const authService = {
  getStoredSession(): CustomerProfile | null {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw) as CustomerProfile;
    } catch {
      return null;
    }
  },

  async login(credentials: LoginCredentials): Promise<CustomerProfile> {
    if (!isValidEmail(credentials.email)) {
      throw new Error('Format alamat email tidak valid. Contoh: nama@domain.com');
    }

    const passwordError = validatePassword(credentials.password);
    if (passwordError) {
      throw new Error(passwordError);
    }

    if (credentials.email.toLowerCase().includes('gagal')) {
      throw new Error(
        'Email atau kata sandi salah (Mode uji error simulasi diaktifkan).',
      );
    }

    const profile: CustomerProfile = {
      ...DEFAULT_DEMO_CUSTOMER,
      email: credentials.email.trim().toLowerCase(),
      fullName:
        credentials.email.trim().toLowerCase() === DEFAULT_DEMO_CUSTOMER.email
          ? DEFAULT_DEMO_CUSTOMER.fullName
          : `${credentials.email.split('@')[0]} (DATA SIMULASI)`,
      isSimulation: true,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  async register(payload: RegisterPayload): Promise<CustomerProfile> {
    if (payload.fullName.trim().length < 3) {
      throw new Error('Nama lengkap minimal terdiri dari 3 karakter.');
    }
    if (!isValidEmail(payload.email)) {
      throw new Error('Format alamat email tidak valid.');
    }
    const passwordError = validatePassword(payload.password);
    if (passwordError) {
      throw new Error(passwordError);
    }
    if (payload.password !== payload.confirmPassword) {
      throw new Error('Konfirmasi kata sandi tidak cocok dengan kata sandi.');
    }
    if (!payload.acceptTerms) {
      throw new Error(
        'Anda wajib menyetujui Ketentuan Layanan & Kebijakan Privasi toko.',
      );
    }

    const profile: CustomerProfile = {
      id: 'cust-sim-01',
      fullName: `${payload.fullName.trim()} (DATA SIMULASI)`,
      email: payload.email.trim().toLowerCase(),
      role: 'CUSTOMER',
      createdAt: new Date().toISOString(),
      isSimulation: true,
    };

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    return profile;
  },

  logout(): void {
    window.localStorage.removeItem(STORAGE_KEY);
  },

  getDefaultDemoCredentials(): LoginCredentials {
    return {
      email: DEFAULT_DEMO_CUSTOMER.email,
      password: 'password123',
    };
  },
};
