export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const API_ENDPOINTS = {
  TASKS: "/tasks",
  TASK_BY_ID: (id: string) => `/tasks/${id}`,
} as const;

export const API_CONFIG = {
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
} as const;
