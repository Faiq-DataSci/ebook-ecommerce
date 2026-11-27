import { APP_CONFIG } from '../../constants/app.constants';
import { API_ENDPOINTS } from './endpoints';

export interface ApiHealthStatus {
  reachable: boolean;
  mode: 'SIMULASI_LOKAL' | 'BACKEND_TERHUBUNG';
  checkedAt: string;
}

export async function checkBackendHealth(): Promise<ApiHealthStatus> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), 1800);

  try {
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}${API_ENDPOINTS.HEALTH}`, {
      method: 'GET',
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    return {
      reachable: response.ok,
      mode: response.ok ? 'BACKEND_TERHUBUNG' : 'SIMULASI_LOKAL',
      checkedAt: new Date().toISOString(),
    };
  } catch {
    window.clearTimeout(timeoutId);
    return {
      reachable: false,
      mode: 'SIMULASI_LOKAL',
      checkedAt: new Date().toISOString(),
    };
  }
}

export interface PublicApiEnvelope<T> {
  success: boolean;
  data: T;
  meta?: Record<string, unknown>;
  message?: string;
}

export async function fetchPublicApi<T>(
  path: string,
  timeoutMs = 5000,
): Promise<{ status: number; ok: boolean; body: PublicApiEnvelope<T> | null }> {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}${cleanPath}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    const body = (await response.json().catch(() => null)) as PublicApiEnvelope<T> | null;
    return {
      status: response.status,
      ok: response.ok,
      body,
    };
  } catch (err) {
    window.clearTimeout(timeoutId);
    throw err;
  }
}

const ACCESS_TOKEN_KEY = 'ebook_store_access_token';

export function getStoredAccessToken(): string | null {
  try {
    return window.localStorage.getItem(ACCESS_TOKEN_KEY);
  } catch {
    return null;
  }
}

export async function fetchAuthenticatedApi<T>(
  path: string,
  options?: { method?: 'GET' | 'POST' | 'PATCH' | 'PUT'; body?: unknown; timeoutMs?: number },
): Promise<{ status: number; ok: boolean; body: PublicApiEnvelope<T> | null }> {
  const token = getStoredAccessToken();
  if (!token) {
    return { status: 401, ok: false, body: null };
  }

  const controller = new AbortController();
  const timeoutId = window.setTimeout(
    () => controller.abort(),
    options?.timeoutMs ?? 5000,
  );

  try {
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    const response = await fetch(`${APP_CONFIG.API_BASE_URL}${cleanPath}`, {
      method: options?.method ?? 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
      signal: controller.signal,
    });
    window.clearTimeout(timeoutId);

    const body = (await response.json().catch(() => null)) as PublicApiEnvelope<T> | null;
    return { status: response.status, ok: response.ok, body };
  } catch (err) {
    window.clearTimeout(timeoutId);
    throw err;
  }
}
