// types/api/responses.ts
export interface ApiResponse<T = unknown> {
  success: true
  data: T
  message?: string
  meta?: {
    page?: number
    limit?: number
    total?: number
  }
}

export interface ApiError {
  success: false
  error: {
    code: string
    message: string
    details?: unknown
  }
}

export type ApiResult<T> = ApiResponse<T> | ApiError