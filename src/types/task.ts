export interface Task {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "todo";
  priority: "low" | "medium" | "high";
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  category?: string;
  tags?: string[];
  isArchived?: boolean;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status?: "pending" | "in-progress" | "completed" | "todo";
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  category?: string;
  tags?: string[];
}

export interface UpdateTaskRequest extends Partial<CreateTaskRequest> {
  id: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
  page: number;
  limit: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
