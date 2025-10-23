// lib/api/endpoints.ts
export const API_ENDPOINTS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
    refresh: '/api/auth/refresh',
  },
  habits: {
    list: '/api/habits',
    detail: (id: string) => `/api/habits/${id}`,
    complete: (id: string) => `/api/habits/${id}/complete`,
  },
  rewards: {
    list: '/api/rewards',
    detail: (id: string) => `/api/rewards/${id}`,
    claim: '/api/rewards/claim',
  },
  friends: {
    list: '/api/friends',
    detail: (id: string) => `/api/friends/${id}`,
    requests: '/api/friends/requests',
    search: '/api/friends/search',
  },
} as const