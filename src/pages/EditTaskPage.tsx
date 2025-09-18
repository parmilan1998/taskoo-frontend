import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  Clock,
  User,
  Edit3,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Flag,
  Sparkles,
  BarChart3,
  Activity,
  Timer,
} from "lucide-react";
import { format } from "date-fns";
import type { Task, CreateTaskRequest, UpdateTaskRequest } from "@/types/task";
import { confirmDialog } from "@/utils/sweetAlert";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import TaskForm from "@/components/task/TaskForm";

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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-6 w-6 text-blue-600" />
            </div>
            <p className="mt-4 text-slate-600 font-lora font-medium">
              Loading task details...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !task) {
    return (
      <Layout>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl">
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
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <ArrowLeft className="w-4 h-4 mr-2 inline" />
                  Back to Tasks
                </button>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-700 to-blue-800 shadow-2xl mb-12">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-8 py-12 lg:px-16 lg:py-16">
              <div className="max-w-6xl mx-auto">
                {/* Navigation Breadcrumb */}
                <div className="flex items-center space-x-3 mb-8">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30 inline-flex items-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Tasks
                  </button>
                  <div className="flex items-center space-x-2 text-purple-200 font-lora">
                    <span>Tasks</span>
                    <span>/</span>
                    <span className="text-white font-medium">{task.title}</span>
                    <span>/</span>
                    <span className="text-white font-medium">Edit</span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-8 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Edit3 className="w-6 h-6 text-purple-200" />
                      </div>
                      <span className="text-purple-200 font-medium font-lora">
                        Task Editing
                      </span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight font-lora mb-6 text-white">
                      Edit{" "}
                      <span className="bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent">
                        Task
                      </span>
                    </h1>

                    <p className="text-xl text-purple-100 font-lora mb-8 max-w-2xl leading-relaxed">
                      Update and refine your task details to keep your workflow
                      organized and efficient.
                    </p>

                    {/* Task Info Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-green-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Created
                            </p>
                            <p className="text-purple-200 text-sm font-lora">
                              {format(new Date(task.createdAt), "MMM dd")}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Activity className="w-5 h-5 text-yellow-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Status
                            </p>
                            <p className="text-purple-200 text-sm font-lora capitalize">
                              {task.status?.replace("-", " ") || "Pending"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Flag className="w-5 h-5 text-orange-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Priority
                            </p>
                            <p className="text-purple-200 text-sm font-lora capitalize">
                              {task.priority || "Medium"}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Timer className="w-5 h-5 text-blue-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Updated
                            </p>
                            <p className="text-purple-200 text-sm font-lora">
                              {format(new Date(task.updatedAt), "MMM dd")}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl">
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-8">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <Edit3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 font-lora">
                        Update Task Details
                      </h2>
                      <p className="text-slate-600 font-lora">
                        Modify the information below to update your task
                      </p>
                    </div>
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

            {/* Modern Sidebar */}
            <div className="space-y-8">
              {/* Task Information Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Task Information
                    </h3>
                    <p className="text-slate-600 font-lora">
                      Current task details
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <User className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Created By
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          System Administrator
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Clock className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Created On
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          {format(
                            new Date(task.createdAt),
                            "EEEE, MMMM dd, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <Timer className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Last Updated
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          {format(
                            new Date(task.updatedAt),
                            "EEEE, MMMM dd, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Editing Guidelines Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Editing Guidelines
                    </h3>
                    <p className="text-slate-600 font-lora">
                      Best practices for updates
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <CheckCircle className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Review Changes
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          Carefully review all fields before saving your updates
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Update Status
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          Reflect current progress accurately in the status
                          field
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-purple-100 rounded-lg flex-shrink-0">
                        <Flag className="w-4 h-4 text-purple-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Adjust Priority
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          Update priority levels if circumstances have changed
                        </p>
                      </div>
                    </div>
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
