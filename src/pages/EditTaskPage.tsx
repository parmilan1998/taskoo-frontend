import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { AlertCircle, ArrowLeft, Clock, User } from "lucide-react";
import { format } from "date-fns";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { confirmDialog } from "@/utils/sweetAlert";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import TaskForm from "@/components/task/TaskForm";
import Card from "@/components/ui/Card";

const EditTaskPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true);
      const response = await taskService.getTaskById(taskId);

      if (response.success) {
        setTask(response.data);
      } else {
        setError(response.message || "Failed to fetch task");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (data: CreateTaskRequest) => {
    if (!id) return;

    // Show confirmation dialog before updating
    const result = await confirmDialog.update(task?.title || "this task");

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    try {
      setSubmitting(true);

      // Show loading toast
      const loadingToast = toast.loading("Updating task...");

      // Create update request with proper typing
      const updateData: UpdateTaskRequest = { ...data, id };
      const response = await taskService.updateTask(updateData);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.success) {
        // Show success with SweetAlert
        await confirmDialog.success(
          "Task Updated!",
          "Your changes have been saved successfully."
        );
        navigate("/tasks");
      } else {
        toast.error(response.message || "Failed to update task");
      }
    } catch (err) {
      toast.error("An unexpected error occurred while updating the task");
      console.error("Update task error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </Layout>
    );
  }

  if (error || !task) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Card className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg">
              <div className="text-center py-16 font-lora">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle className="h-12 w-12 text-red-500" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3">
                  Task Not Found
                </h3>
                <p className="text-red-600 mb-8 max-w-md mx-auto">
                  {error ||
                    "The task you're looking for doesn't exist or has been deleted."}
                </p>
                <button
                  type="button"
                  onClick={() => navigate("/tasks")}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 inline" />
                  Back to Tasks
                </button>
              </div>
            </Card>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header Navigation */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-slate-200/50 shadow-sm inline-flex items-center px-4 py-2 rounded-lg transition-all duration-200 font-lora"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Tasks
                </button>
                <div className="h-6 w-px bg-slate-300"></div>
                <nav className="flex items-center space-x-2 text-sm text-slate-500 font-lora">
                  <span>Tasks</span>
                  <span>/</span>
                  <span className="text-slate-900 font-medium">
                    {task.title}
                  </span>
                  <span>/</span>
                  <span className="text-slate-900 font-medium">Edit</span>
                </nav>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-xl">
                <div className="p-8">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-slate-900 font-lora mb-2">
                      Edit Task
                    </h1>
                    <p className="text-lg text-slate-600 font-lora">
                      Update your task details and track your progress
                    </p>
                  </div>

                  <TaskForm
                    task={task}
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={submitting}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Task Info Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-lora">
                  📋 Task Information
                </h3>
                <div className="space-y-4 text-sm font-lora">
                  <div className="flex items-center space-x-3">
                    <User className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-slate-600">Created by</p>
                      <p className="font-medium text-slate-900">System</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-slate-600">Created on</p>
                      <p className="font-medium text-slate-900">
                        {format(
                          new Date(task.createdAt),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <div>
                      <p className="text-slate-600">Last updated</p>
                      <p className="font-medium text-slate-900">
                        {format(
                          new Date(task.updatedAt),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Edit Tips Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-lora">
                  💡 Editing Tips
                </h3>
                <div className="space-y-4 text-sm text-slate-600 font-lora">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Review all fields carefully before saving changes</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Update the status to reflect current progress</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Adjust priority if circumstances have changed</p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Add or remove tags to keep organization current</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EditTaskPage;
