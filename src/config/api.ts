// config/api.ts
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

export const API_CONFIG = {
  timeout: 30000,
  retries: 3,
  retryDelay: 1000,
} as const