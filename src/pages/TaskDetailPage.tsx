import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { confirmDialog } from "@/utils/sweetAlert";
import {
  Edit,
  Trash2,
  Calendar,
  Clock,
  ArrowLeft,
  AlertCircle,
  User,
  Building2,
  Tag,
  FileText,
  Share2,
  // Archive,
  CheckCircle2,
  Timer,
  Flag,
  Sparkles,
  Activity,
  Target,
  Zap,
  TrendingUp,
  Eye,
  Heart,
  // Bookmark,
  // Copy,
  // Download,
  // ExternalLink,
} from "lucide-react";
import type { Task } from "@/types/task";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";

const TaskDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId: string) => {
    try {
      setLoading(true);
      setError(null); // Clear previous errors

      console.log("Fetching task with ID:", taskId);
      const response = await taskService.getTaskById(taskId);
      console.log("Task fetch response:", response);

      if (response.success && response.data) {
        console.log("Setting task data:", response.data);
        setTask(response.data);
      } else {
        const errorMsg = response.message || "Failed to fetch task";
        console.error("Task fetch failed:", errorMsg);
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unexpected error occurred";
      console.error("Task fetch error:", err);
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task) return;

    // Show confirmation dialog before deleting
    const result = await confirmDialog.delete(task.title);

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Deleting task...");

      const response = await taskService.deleteTask(task.id);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.success) {
        // Show success with SweetAlert
        await confirmDialog.success(
          "Task Deleted!",
          "The task has been deleted successfully."
        );
        navigate("/tasks");
      } else {
        toast.error("Failed to delete task");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the task");
      console.error("Delete task error:", err);
    }
  };

  const formatStatus = (status: Task["status"]) => {
    if (!status) return "Unknown";

    switch (status) {
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
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
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center">
          <div className="max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-red-200/50 shadow-xl rounded-2xl p-12">
              <div className="text-center">
                <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-6">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-lora mb-4">
                  Task Not Found
                </h3>
                <p className="text-red-600 mb-8 font-lora text-lg">
                  {error ||
                    "The task you're looking for doesn't exist or has been deleted."}
                </p>
                <Link to="/tasks">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Tasks
                  </Button>
                </Link>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 shadow-2xl mb-12">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-8 py-12 lg:px-16 lg:py-16">
              <div className="max-w-6xl mx-auto">
                {/* Navigation Breadcrumb */}
                <div className="flex items-center space-x-3 mb-8">
                  <Link to="/tasks">
                    <Button className="bg-white/20 text-white hover:bg-white/30 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30">
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Tasks
                    </Button>
                  </Link>
                  <div className="flex items-center space-x-2 text-blue-200 font-lora">
                    <span>Tasks</span>
                    <span>/</span>
                    <span className="text-white font-medium truncate max-w-xs">
                      {task.title}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-8 lg:mb-0">
                    {/* Status and Priority Badges */}
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                        <CheckCircle2 className="w-4 h-4 text-green-300" />
                        <span className="text-white font-medium font-lora">
                          {formatStatus(task.status)}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2 border border-white/30">
                        <Flag className="w-4 h-4 text-orange-300" />
                        <span className="text-white font-medium font-lora">
                          {task.priority
                            ? task.priority.charAt(0).toUpperCase() +
                              task.priority.slice(1)
                            : "Unknown"}{" "}
                          Priority
                        </span>
                      </div>
                    </div>

                    {/* Task Title */}
                    <h1 className="text-4xl lg:text-5xl font-bold tracking-tight font-lora mb-6 text-white leading-tight">
                      {task.title}
                    </h1>

                    {/* Task Meta Info */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <User className="w-5 h-5 text-blue-300" />
                          <div>
                            <p className="text-slate-300 text-sm font-lora">
                              Created by
                            </p>
                            <p className="text-white font-medium font-lora">
                              System
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-green-300" />
                          <div>
                            <p className="text-slate-300 text-sm font-lora">
                              Created
                            </p>
                            <p className="text-white font-medium font-lora">
                              {format(new Date(task.createdAt), "MMM dd, yyyy")}
                            </p>
                          </div>
                        </div>
                      </div>
                      {task.dueDate && (
                        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-purple-300" />
                            <div>
                              <p className="text-slate-300 text-sm font-lora">
                                Due Date
                              </p>
                              <p className="text-white font-medium font-lora">
                                {format(new Date(task.dueDate), "MMM dd, yyyy")}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-3 lg:ml-8">
                    <div className="flex items-center space-x-3">
                      <Button className="bg-white/20 text-white hover:bg-white/30 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30">
                        <Heart className="w-4 h-4 mr-2" />
                        Favorite
                      </Button>
                      <Button className="bg-white/20 text-white hover:bg-white/30 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30">
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Link to={`/tasks/edit/${task.id}`}>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Task
                        </Button>
                      </Link>
                      <Button
                        onClick={handleDelete}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <FileText className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-lora">
                      Task Description
                    </h2>
                    <p className="text-slate-600 font-lora">
                      Detailed information about this task
                    </p>
                  </div>
                </div>
                <div className="bg-slate-50/50 rounded-xl p-6 border border-slate-100">
                  <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-lg font-lora">
                    {task.description ||
                      "No description provided for this task."}
                  </p>
                </div>
              </div>

              {/* Task Analytics Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 font-lora">
                      Task Analytics
                    </h2>
                    <p className="text-slate-600 font-lora">
                      Performance and timeline insights
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Eye className="w-5 h-5" />
                      </div>
                      <span className="text-blue-100 text-sm font-lora">
                        Views
                      </span>
                    </div>
                    <p className="text-2xl font-bold font-lora">1</p>
                    <p className="text-blue-100 text-sm font-lora">
                      Total views
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Activity className="w-5 h-5" />
                      </div>
                      <span className="text-green-100 text-sm font-lora">
                        Status
                      </span>
                    </div>
                    <p className="text-2xl font-bold font-lora">
                      {formatStatus(task.status)}
                    </p>
                    <p className="text-green-100 text-sm font-lora">
                      Current state
                    </p>
                  </div>

                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Zap className="w-5 h-5" />
                      </div>
                      <span className="text-purple-100 text-sm font-lora">
                        Priority
                      </span>
                    </div>
                    <p className="text-2xl font-bold font-lora">
                      {task.priority
                        ? task.priority.charAt(0).toUpperCase() +
                          task.priority.slice(1)
                        : "Unknown"}
                    </p>
                    <p className="text-purple-100 text-sm font-lora">
                      Task priority
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Sidebar */}
            <div className="space-y-8">
              {/* Task Properties Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <Target className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Task Properties
                    </h3>
                    <p className="text-slate-600 font-lora">
                      Key task information
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Status */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <label className="text-sm font-medium text-slate-600 mb-3 block font-lora">
                      Status
                    </label>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          task.status === "completed"
                            ? "bg-green-100"
                            : task.status === "in-progress"
                            ? "bg-blue-100"
                            : "bg-orange-100"
                        }`}
                      >
                        <CheckCircle2
                          className={`w-4 h-4 ${
                            task.status === "completed"
                              ? "text-green-600"
                              : task.status === "in-progress"
                              ? "text-blue-600"
                              : "text-orange-600"
                          }`}
                        />
                      </div>
                      <span className="text-slate-900 font-medium font-lora">
                        {formatStatus(task.status)}
                      </span>
                    </div>
                  </div>

                  {/* Priority */}
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <label className="text-sm font-medium text-slate-600 mb-3 block font-lora">
                      Priority
                    </label>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-lg ${
                          task.priority === "high"
                            ? "bg-red-100"
                            : task.priority === "medium"
                            ? "bg-yellow-100"
                            : "bg-gray-100"
                        }`}
                      >
                        <Flag
                          className={`w-4 h-4 ${
                            task.priority === "high"
                              ? "text-red-600"
                              : task.priority === "medium"
                              ? "text-yellow-600"
                              : "text-gray-600"
                          }`}
                        />
                      </div>
                      <span className="text-slate-900 font-medium font-lora">
                        {task.priority
                          ? task.priority.charAt(0).toUpperCase() +
                            task.priority.slice(1)
                          : "Unknown"}{" "}
                        Priority
                      </span>
                    </div>
                  </div>

                  {/* Category */}
                  {task.category && (
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                      <label className="text-sm font-medium text-slate-600 mb-3 block font-lora">
                        Category
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                          <Building2 className="w-4 h-4 text-indigo-600" />
                        </div>
                        <span className="text-slate-900 font-medium font-lora">
                          {task.category}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Due Date */}
                  {task.dueDate && (
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                      <label className="text-sm font-medium text-slate-600 mb-3 block font-lora">
                        Due Date
                      </label>
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-pink-100 rounded-lg">
                          <Calendar className="w-4 h-4 text-pink-600" />
                        </div>
                        <div>
                          <p className="text-slate-900 font-medium font-lora">
                            {format(new Date(task.dueDate), "MMM dd, yyyy")}
                          </p>
                          <p className="text-slate-500 text-sm font-lora">
                            {format(new Date(task.dueDate), "EEEE")}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  {task.tags && task.tags.length > 0 && (
                    <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                      <label className="text-sm font-medium text-slate-600 mb-3 block font-lora">
                        Tags
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {task.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200 font-lora"
                          >
                            <Tag className="w-3 h-3 mr-1.5" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modern Timeline Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Timer className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Activity Timeline
                    </h3>
                    <p className="text-slate-600 font-lora">
                      Task history and updates
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Created Event */}
                  <div className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 font-lora mb-1">
                          Task Created
                        </p>
                        <p className="text-sm text-slate-600 font-lora">
                          {format(
                            new Date(task.createdAt),
                            "EEEE, MMMM dd, yyyy 'at' h:mm a"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Updated Event */}
                  <div className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
                          <Activity className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                        <p className="text-sm font-semibold text-slate-900 font-lora mb-1">
                          Last Updated
                        </p>
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

              {/* Modern Quick Actions Card */}
              {/* <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-orange-100 rounded-xl">
                    <Zap className="w-6 h-6 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Quick Actions
                    </h3>
                    <p className="text-slate-600 font-lora">Manage this task</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Button className="w-full justify-start bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                    <Bookmark className="w-4 h-4 mr-3" />
                    Bookmark Task
                  </Button>
                  <Button className="w-full justify-start bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                    <Copy className="w-4 h-4 mr-3" />
                    Duplicate Task
                  </Button>
                  <Button className="w-full justify-start bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                    <Download className="w-4 h-4 mr-3" />
                    Export Task
                  </Button>
                  <Button className="w-full justify-start bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                    <ExternalLink className="w-4 h-4 mr-3" />
                    Open in New Tab
                  </Button>
                  <Button className="w-full justify-start bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-xl transition-all duration-200 hover:scale-105">
                    <Archive className="w-4 h-4 mr-3" />
                    Archive Task
                  </Button>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TaskDetailPage;
