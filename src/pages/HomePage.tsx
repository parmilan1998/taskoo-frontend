import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Wifi,
  WifiOff,
  BarChart3,
  // Target,
  Calendar,
  // Users,
  ArrowRight,
  Activity,
  Zap,
  Star,
  Sparkles,
} from "lucide-react";
import type { Task } from "@/types/task";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import Card from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import TaskCard from "@/components/task/TaskCard";

const HomePage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiStatus, setApiStatus] = useState<{
    connected: boolean;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchTasks();
    // testApiConnection();
  }, []);

  console.log("tasks", tasks);

  // const testApiConnection = async () => {
  //   const loadingToast = toast.loading("Testing API connection...");
  //   const status = await taskService.testApiConnection();
  //   setApiStatus(status);

  //   toast.dismiss(loadingToast);

  //   if (status.connected) {
  //     toast.success("API connection successful! 🚀");
  //   } else {
  //     toast.error(`API connection failed: ${status.message}`);
  //   }
  // };

  const runFullApiTest = async () => {
    const loadingToast = toast.loading("Running full API test...");
    console.log("Running full API endpoint test...");
    await taskService.testAllEndpoints();
    toast.dismiss(loadingToast);
    toast.success("API test completed! Check console for details 📊");
  };

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();

      console.log("API Response:", response);

      if (response.success) {
        // Ensure response.data is an array
        const tasksData = Array.isArray(response.data) ? response.data : [];
        console.log("Tasks data:", tasksData);
        setTasks(tasksData);
      } else {
        setError(response.message || "Failed to fetch tasks");
        setTasks([]); // Set empty array on error
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.log("Error:", err);
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const getTaskStats = () => {
    // Ensure tasks is an array
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    const total = tasksArray.length;
    const completed = tasksArray.filter(
      (task) => task.status === "completed"
    ).length;
    const inProgress = tasksArray.filter(
      (task) => task.status === "in-progress"
    ).length;
    const pending = tasksArray.filter(
      (task) => task.status === "pending"
    ).length;
    const overdue = tasksArray.filter((task) => {
      if (!task.dueDate) return false;
      return new Date(task.dueDate) < new Date() && task.status !== "completed";
    }).length;

    return { total, completed, inProgress, pending, overdue };
  };

  const getRecentTasks = () => {
    // Ensure tasks is an array
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    return tasksArray
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 6);
  };

  const stats = getTaskStats();
  const recentTasks = getRecentTasks();

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
              Loading your workspace...
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Modern Hero Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-2xl mb-12">
            {/* Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-8 py-16 lg:px-16 lg:py-24">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Sparkles className="w-6 h-6 text-blue-200" />
                      </div>
                      <span className="text-blue-200 font-medium font-lora">
                        Enterprise Task Management
                      </span>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight font-lora mb-6 text-white">
                      Welcome to{" "}
                      <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                        Taskoo
                      </span>
                    </h1>

                    <p className="text-xl text-blue-100 font-lora mb-8 max-w-2xl leading-relaxed">
                      Streamline your workflow with our professional task
                      management platform. Built for teams that demand
                      excellence and efficiency.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/tasks/create">
                        <Button className="bg-white text-blue-700 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                          <Plus className="w-5 h-5 mr-2" />
                          Create New Task
                        </Button>
                      </Link>
                      <Link to="/tasks">
                        <Button className="bg-white/20 text-white hover:bg-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30">
                          <ArrowRight className="w-5 h-5 mr-2" />
                          View All Tasks
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {apiStatus && (
                    <div className="lg:ml-8 mt-8 lg:mt-0">
                      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`p-2 rounded-lg ${
                                apiStatus.connected
                                  ? "bg-green-500/20"
                                  : "bg-red-500/20"
                              }`}
                            >
                              {apiStatus.connected ? (
                                <Wifi className="w-5 h-5 text-green-300" />
                              ) : (
                                <WifiOff className="w-5 h-5 text-red-300" />
                              )}
                            </div>
                            <div>
                              <p className="text-white font-semibold font-lora">
                                {apiStatus.connected
                                  ? "API Connected"
                                  : "API Disconnected"}
                              </p>
                              <p className="text-blue-200 text-sm font-lora">
                                {apiStatus.connected
                                  ? "All systems operational"
                                  : "Connection failed"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              type="button"
                              // onClick={testApiConnection}
                              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs text-white font-medium transition-colors duration-200"
                              title="Test API Connection"
                            >
                              <Activity className="w-3 h-3 mr-1 inline" />
                              Test
                            </button>
                            <button
                              type="button"
                              onClick={runFullApiTest}
                              className="px-3 py-1 bg-white/20 hover:bg-white/30 rounded-lg text-xs text-white font-medium transition-colors duration-200"
                              title="Run Full API Test"
                            >
                              <Zap className="w-3 h-3 mr-1 inline" />
                              Full Test
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modern Statistics Dashboard */}
          <div className="mb-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-slate-900 font-lora mb-4">
                Your Productivity Dashboard
              </h2>
              <p className="text-xl text-slate-600 font-lora max-w-2xl mx-auto">
                Track your progress and stay on top of your goals with real-time
                insights
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
              {/* Total Tasks */}
              <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold font-lora">
                        {stats.total}
                      </p>
                      <p className="text-blue-100 text-sm font-medium font-lora">
                        Total Tasks
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-blue-100 text-sm">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    <span className="font-lora">All time</span>
                  </div>
                </div>
              </Card>

              {/* Completed Tasks */}
              <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <CheckCircle className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold font-lora">
                        {stats.completed}
                      </p>
                      <p className="text-green-100 text-sm font-medium font-lora">
                        Completed
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-green-100 text-sm">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="font-lora">
                      {stats.total > 0
                        ? Math.round((stats.completed / stats.total) * 100)
                        : 0}
                      % done
                    </span>
                  </div>
                </div>
              </Card>

              {/* In Progress Tasks */}
              <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold font-lora">
                        {stats.inProgress}
                      </p>
                      <p className="text-orange-100 text-sm font-medium font-lora">
                        In Progress
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-orange-100 text-sm">
                    <Activity className="w-4 h-4 mr-1" />
                    <span className="font-lora">Active now</span>
                  </div>
                </div>
              </Card>

              {/* Pending Tasks */}
              <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <Calendar className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold font-lora">
                        {stats.pending}
                      </p>
                      <p className="text-purple-100 text-sm font-medium font-lora">
                        Pending
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-purple-100 text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span className="font-lora">Waiting</span>
                  </div>
                </div>
              </Card>

              {/* Overdue Tasks */}
              <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 border-0">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                      <AlertCircle className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold font-lora">
                        {stats.overdue}
                      </p>
                      <p className="text-red-100 text-sm font-medium font-lora">
                        Overdue
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center text-red-100 text-sm">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    <span className="font-lora">Needs attention</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>

          {/* Modern Recent Tasks Section */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-slate-900 font-lora mb-2">
                  Recent Tasks
                </h2>
                <p className="text-slate-600 font-lora">
                  Your latest task activity and updates
                </p>
              </div>
              <Link to="/tasks">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105 shadow-lg">
                  <ArrowRight className="w-4 h-4 mr-2" />
                  View All Tasks
                </Button>
              </Link>
            </div>

            {error ? (
              <Card className="bg-red-50 border-red-200">
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertCircle className="h-8 w-8 text-red-500" />
                  </div>
                  <h3 className="text-lg font-semibold text-red-900 mb-2 font-lora">
                    Error Loading Tasks
                  </h3>
                  <p className="text-red-600 mb-6 font-lora">{error}</p>
                  <Button
                    onClick={fetchTasks}
                    className="bg-red-600 hover:bg-red-700 text-white font-lora"
                  >
                    Try Again
                  </Button>
                </div>
              </Card>
            ) : recentTasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {recentTasks.map((task) => (
                  <div
                    key={task.id}
                    className="transform transition-all duration-200 hover:scale-105"
                  >
                    <TaskCard task={task} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="h-12 w-12 text-slate-400" />
                </div>
                <h3 className="text-2xl font-semibold text-slate-900 mb-3 font-lora">
                  No tasks yet
                </h3>
                <p className="text-slate-600 mb-8 max-w-md mx-auto font-lora">
                  Start your productivity journey by creating your first task.
                  Organize your work and achieve your goals.
                </p>
                <Link to="/tasks/create">
                  <Button
                    icon={Plus}
                    className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-lora px-8 py-3"
                  >
                    Create Your First Task
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HomePage;
