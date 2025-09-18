import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Plus,
  Target,
  Lightbulb,
  TrendingUp,
  CheckCircle,
  Flag,
  Sparkles,
  Zap,
  Star,
  Calendar,
  Users,
  BarChart3,
} from "lucide-react";
import type { CreateTaskRequest } from "@/types/task";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import TaskForm from "@/components/task/TaskForm";
import { confirmDialog } from "@/utils/sweetAlert";

const CreateTaskPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (data: CreateTaskRequest) => {
    // Show confirmation dialog before creating
    const result = await confirmDialog.create("Task");

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    try {
      setLoading(true);

      // Show loading toast
      const loadingToast = toast.loading("Creating task...");

      const response = await taskService.createTask(data);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.success) {
        // Show success with SweetAlert
        await confirmDialog.success(
          "Task Created!",
          "Your task has been created successfully."
        );
        navigate("/tasks");
      } else {
        toast.error(response.message || "Failed to create task");
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
      console.error("Create task error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/tasks");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Hero Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-2xl mb-12">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
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
                  <div className="flex items-center space-x-2 text-blue-200 font-lora">
                    <span>Tasks</span>
                    <span>/</span>
                    <span className="text-white font-medium">
                      Create New Task
                    </span>
                  </div>
                </div>

                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1 mb-8 lg:mb-0">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Plus className="w-6 h-6 text-blue-200" />
                      </div>
                      <span className="text-blue-200 font-medium font-lora">
                        Task Creation
                      </span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight font-lora mb-6 text-white">
                      Create{" "}
                      <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                        New Task
                      </span>
                    </h1>

                    <p className="text-xl text-blue-100 font-lora mb-8 max-w-2xl leading-relaxed">
                      Transform your ideas into actionable tasks with our
                      professional task management system.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Target className="w-5 h-5 text-green-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Organize
                            </p>
                            <p className="text-blue-200 text-sm font-lora">
                              Your workflow
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <TrendingUp className="w-5 h-5 text-purple-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Boost
                            </p>
                            <p className="text-blue-200 text-sm font-lora">
                              Productivity
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-yellow-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Track
                            </p>
                            <p className="text-blue-200 text-sm font-lora">
                              Progress
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Star className="w-5 h-5 text-orange-300" />
                          <div>
                            <p className="text-white font-semibold font-lora">
                              Achieve
                            </p>
                            <p className="text-blue-200 text-sm font-lora">
                              Goals
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
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <Plus className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-slate-900 font-lora">
                        Task Details
                      </h2>
                      <p className="text-slate-600 font-lora">
                        Fill in the information below to create your task
                      </p>
                    </div>
                  </div>

                  <TaskForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Modern Sidebar */}
            <div className="space-y-8">
              {/* Tips Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-yellow-100 rounded-xl">
                    <Lightbulb className="w-6 h-6 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Pro Tips
                    </h3>
                    <p className="text-slate-600 font-lora">
                      Best practices for task creation
                    </p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                        <Target className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Clear Titles
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          Use descriptive titles that explain what needs to be
                          accomplished
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                    <div className="flex items-start space-x-4">
                      <div className="p-2 bg-green-100 rounded-lg flex-shrink-0">
                        <Calendar className="w-4 h-4 text-green-600" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 font-lora mb-1">
                          Realistic Deadlines
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          Set achievable due dates to maintain momentum and
                          avoid stress
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
                          Smart Priorities
                        </h4>
                        <p className="text-sm text-slate-600 font-lora">
                          Choose priority levels that help you focus on what
                          matters most
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Productivity Insights Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
                <div className="flex items-center space-x-4 mb-8">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 font-lora">
                      Productivity Insights
                    </h3>
                    <p className="text-slate-600 font-lora">
                      Your task management journey
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                      <span className="text-blue-100 text-sm font-lora">
                        Team
                      </span>
                    </div>
                    <p className="text-lg font-bold font-lora">Personal</p>
                    <p className="text-blue-100 text-sm font-lora">Workspace</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Zap className="w-4 h-4" />
                      </div>
                      <span className="text-green-100 text-sm font-lora">
                        Speed
                      </span>
                    </div>
                    <p className="text-lg font-bold font-lora">Fast</p>
                    <p className="text-green-100 text-sm font-lora">Creation</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="p-2 bg-white/20 rounded-lg">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <span className="text-purple-100 text-sm font-lora">
                        Quality
                      </span>
                    </div>
                    <p className="text-lg font-bold font-lora">Premium</p>
                    <p className="text-purple-100 text-sm font-lora">
                      Experience
                    </p>
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

export default CreateTaskPage;
