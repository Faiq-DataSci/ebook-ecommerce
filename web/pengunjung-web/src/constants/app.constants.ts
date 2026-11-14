export const APP_CONFIG = {
  SYSTEM_NAME: 'Sistem Informasi E-Commerce E-Book',
  BRAND_NAME: 'E-BOOK STORE',
  SIMULATION_LABEL: 'DATA SIMULASI',
  API_BASE_URL:
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  CATALOG_PAGE_SIZE: 6,
} as const;
