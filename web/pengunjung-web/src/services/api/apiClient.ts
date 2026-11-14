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
      mode: 'SIMULASI_LOKAL',
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
