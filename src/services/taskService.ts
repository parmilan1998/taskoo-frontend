/* eslint-disable @typescript-eslint/no-explicit-any */
import { API_BASE_URL, API_ENDPOINTS, API_CONFIG } from "@/config/api";
import type {
  Task,
  CreateTaskRequest,
  UpdateTaskRequest,
  ApiResponse,
} from "@/types/task";

class TaskService {
  // Map API status to frontend status
  private mapTaskStatus(
    status: string
  ): "pending" | "in-progress" | "completed" {
    switch (status) {
      case "todo":
        return "pending";
      case "in-progress":
      case "in_progress": // Handle both formats
        return "in-progress";
      case "completed":
        return "completed";
      case "pending":
        return "pending";
      default:
        return "pending";
    }
  }

  // Map frontend status to API status
  private mapApiStatus(
    status: "pending" | "in-progress" | "completed"
  ): string {
    switch (status) {
      case "pending":
        return "todo";
      case "in-progress":
        return "in_progress"; // Use underscore format for API
      case "completed":
        return "completed";
      default:
        return "todo";
    }
  }

  // Transform task from API format to frontend format
  private transformTask(apiTask: any): Task {
    if (!apiTask) {
      throw new Error("Cannot transform null or undefined task data");
    }

    return {
      id: apiTask.id || "",
      title: apiTask.title || "",
      description: apiTask.description || "",
      status: this.mapTaskStatus(apiTask.status || "todo"),
      priority: apiTask.priority || "medium",
      dueDate: apiTask.dueDate || undefined,
      createdAt: apiTask.createdAt || new Date().toISOString(),
      updatedAt: apiTask.updatedAt || new Date().toISOString(),
      category: apiTask.category || undefined,
      tags: apiTask.tags || [],
      isArchived: apiTask.isArchived || false,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      console.log(`Making API request to: ${url}`);

      const response = await fetch(url, {
        ...API_CONFIG,
        ...options,
        headers: {
          ...API_CONFIG.headers,
          ...options.headers,
        },
        mode: "cors", // Enable CORS
      });

      console.log(`API response status: ${response.status}`);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`API error response: ${errorText}`);
        throw new Error(
          `HTTP error! status: ${response.status} - ${
            errorText || response.statusText
          }`
        );
      }

      const data = await response.json();
      console.log("API response data:", data);
      console.log("Data type:", typeof data);
      console.log("Is array:", Array.isArray(data));

      return {
        success: true,
        data,
      };
    } catch (error) {
      console.error("API request failed:", error);
      return {
        success: false,
        data: null as any,
        message:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  async getAllTasks(): Promise<ApiResponse<Task[]>> {
    const response = await this.request<any>(API_ENDPOINTS.TASKS);

    // Handle the nested API response structure
    if (response.success && response.data) {
      let tasks: any[] = [];

      // Check if the response has the nested structure with data.tasks
      if (response.data.data && Array.isArray(response.data.data.tasks)) {
        tasks = response.data.data.tasks;
      }
      // Check if tasks are directly in data.tasks
      else if (Array.isArray(response.data.tasks)) {
        tasks = response.data.tasks;
      }
      // Check if data is directly an array
      else if (Array.isArray(response.data)) {
        tasks = response.data;
      }
      // Fallback to empty array
      else {
        console.warn("Unexpected API response structure:", response.data);
        tasks = [];
      }

      // Transform tasks to frontend format
      const transformedTasks = tasks.map((task) => this.transformTask(task));

      return {
        success: true,
        data: transformedTasks,
      };
    }

    return {
      success: false,
      data: [],
      message: response.message || "Failed to fetch tasks",
    };
  }

  async getTaskById(id: string): Promise<ApiResponse<Task>> {
    const response = await this.request<any>(API_ENDPOINTS.TASK_BY_ID(id));

    console.log("Get task by ID response:", response);

    if (response.success && response.data) {
      let taskData = response.data;

      // Handle nested response structure like { data: { task: {...} } }
      if (response.data.data && response.data.data.task) {
        taskData = response.data.data.task;
      }
      // Handle nested response structure like { data: {...} }
      else if (response.data.data) {
        taskData = response.data.data;
      }
      // Handle direct task response
      else if (response.data.task) {
        taskData = response.data.task;
      }

      console.log("Task data to transform:", taskData);

      const transformedTask = this.transformTask(taskData);
      console.log("Transformed task:", transformedTask);

      return {
        success: true,
        data: transformedTask,
      };
    }

    return response;
  }

  async createTask(task: CreateTaskRequest): Promise<ApiResponse<Task>> {
    // Transform frontend task to API format
    const apiTask = {
      ...task,
      status: task.status ? this.mapApiStatus(task.status as any) : "todo",
    };

    console.log("Creating task with data:", apiTask);

    const response = await this.request<any>(API_ENDPOINTS.TASKS, {
      method: "POST",
      body: JSON.stringify(apiTask),
    });

    console.log("Create task response:", response);

    if (response.success && response.data) {
      // Handle both direct task response and nested response
      let taskData = response.data;

      // If response has nested structure like { data: { task: {...} } }
      if (response.data.data && response.data.data.task) {
        taskData = response.data.data.task;
      }
      // If response has task property directly
      else if (response.data.task) {
        taskData = response.data.task;
      }

      const transformedTask = this.transformTask(taskData);
      return {
        success: true,
        data: transformedTask,
      };
    }

    return response;
  }

  async updateTask(task: UpdateTaskRequest): Promise<ApiResponse<Task>> {
    // Transform frontend task to API format and remove ID from body
    const { id, ...taskWithoutId } = task;
    const apiTask = {
      ...taskWithoutId,
      status: task.status ? this.mapApiStatus(task.status as any) : undefined,
    };

    console.log("Updating task with data:", apiTask);
    console.log(
      "Update URL:",
      `${API_BASE_URL}${API_ENDPOINTS.TASK_BY_ID(id)}`
    );

    // Use the standard v1 API endpoint for updates
    const response = await this.request<any>(API_ENDPOINTS.TASK_BY_ID(id), {
      method: "PUT",
      body: JSON.stringify(apiTask),
    });

    console.log("Update task response:", response);

    if (response.success && response.data) {
      // Handle both direct task response and nested response
      let taskData = response.data;

      // If response has nested structure like { data: { task: {...} } }
      if (response.data.data && response.data.data.task) {
        taskData = response.data.data.task;
      }
      // If response has task property directly
      else if (response.data.task) {
        taskData = response.data.task;
      }

      const transformedTask = this.transformTask(taskData);
      return {
        success: true,
        data: transformedTask,
      };
    }

    // Enhanced error handling for update failures
    console.error("Update task failed:", response);
    return {
      success: false,
      data: null as any,
      message:
        response.message ||
        "Failed to update task. Please check the task ID and try again.",
    };
  }

  async deleteTask(id: string): Promise<ApiResponse<void>> {
    return this.request<void>(API_ENDPOINTS.TASK_BY_ID(id), {
      method: "DELETE",
    });
  }

  // Test method to check API connectivity
  async testApiConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      console.log("Testing API connection...");
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.TASKS}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        console.log("API connection successful");
        return { connected: true, message: "API connection successful" };
      } else {
        console.log(`API connection failed: ${response.status}`);
        return {
          connected: false,
          message: `API returned status: ${response.status} - ${response.statusText}`,
        };
      }
    } catch (error) {
      console.error("API connection test failed:", error);
      return {
        connected: false,
        message: `Connection failed: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      };
    }
  }

  // Test all API endpoints
  async testAllEndpoints(): Promise<void> {
    console.log("=== Testing All API Endpoints ===");

    // Test GET /tasks
    console.log("1. Testing GET /tasks");
    try {
      const tasks = await this.getAllTasks();
      console.log(
        "✅ GET /tasks:",
        tasks.success ? "SUCCESS" : "FAILED",
        tasks
      );
    } catch (error) {
      console.log("❌ GET /tasks FAILED:", error);
    }

    // Test POST /tasks
    console.log("2. Testing POST /tasks");
    try {
      const newTask = {
        title: "Test Task",
        description: "This is a test task created by the API test",
        priority: "medium" as const,
        status: "pending" as const,
        dueDate: new Date().toISOString(),
      };
      const created = await this.createTask(newTask);
      console.log(
        "✅ POST /tasks:",
        created.success ? "SUCCESS" : "FAILED",
        created
      );

      if (created.success && created.data) {
        const taskId = created.data.id;

        // Test GET /tasks/:id
        console.log("3. Testing GET /tasks/:id");
        try {
          const task = await this.getTaskById(taskId);
          console.log(
            "✅ GET /tasks/:id:",
            task.success ? "SUCCESS" : "FAILED",
            task
          );
        } catch (error) {
          console.log("❌ GET /tasks/:id FAILED:", error);
        }

        // Test PUT /tasks/:id
        console.log("4. Testing PUT /tasks/:id");
        try {
          const updatedTask = {
            ...created.data,
            title: "Updated Test Task",
            status: "completed" as const,
          };
          const updated = await this.updateTask(updatedTask);
          console.log(
            "✅ PUT /tasks/:id:",
            updated.success ? "SUCCESS" : "FAILED",
            updated
          );
        } catch (error) {
          console.log("❌ PUT /tasks/:id FAILED:", error);
        }

        // Test DELETE /tasks/:id
        console.log("5. Testing DELETE /tasks/:id");
        try {
          const deleted = await this.deleteTask(taskId);
          console.log(
            "✅ DELETE /tasks/:id:",
            deleted.success ? "SUCCESS" : "FAILED",
            deleted
          );
        } catch (error) {
          console.log("❌ DELETE /tasks/:id FAILED:", error);
        }
      }
    } catch (error) {
      console.log("❌ POST /tasks FAILED:", error);
    }

    console.log("=== API Endpoint Testing Complete ===");
  }
}

export const taskService = new TaskService();
