/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Plus,
  Search,
  Filter,
  AlertCircle,
  Grid3X3,
  List,
  Download,
  CheckCircle,
  Clock,
  Calendar,
  BarChart3,
  Star,
  Activity,
  Sparkles,
  Target,
} from "lucide-react";
import { confirmDialog } from "@/utils/sweetAlert";
import type { Task } from "@/types/task";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import TaskCard from "@/components/task/TaskCard";

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchTerm, statusFilter, priorityFilter]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const response = await taskService.getAllTasks();

      if (response.success) {
        // Ensure response.data is an array
        const tasksData = Array.isArray(response.data) ? response.data : [];
        setTasks(tasksData);
      } else {
        setError(response.message || "Failed to fetch tasks");
        setTasks([]); // Set empty array on error
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.log({ err });
      setTasks([]); // Set empty array on error
    } finally {
      setLoading(false);
    }
  };

  const filterTasks = () => {
    // Ensure tasks is an array
    const tasksArray = Array.isArray(tasks) ? tasks : [];
    let filtered = [...tasksArray];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          task.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((task) => task.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter((task) => task.priority === priorityFilter);
    }

    setFilteredTasks(filtered);
  };

  const handleDeleteTask = async (taskId: string) => {
    // Find the task to get its title for the confirmation dialog
    const task = tasks.find((t) => t.id === taskId);
    const taskTitle = task?.title || "this task";

    // Show confirmation dialog before deleting
    const result = await confirmDialog.delete(taskTitle);

    if (!result.isConfirmed) {
      return; // User cancelled
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Deleting task...");

      const response = await taskService.deleteTask(taskId);

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      if (response.success) {
        setTasks((prev) =>
          Array.isArray(prev) ? prev.filter((task) => task.id !== taskId) : []
        );
        // Show success with SweetAlert
        await confirmDialog.success(
          "Task Deleted!",
          "The task has been deleted successfully."
        );
      } else {
        toast.error("Failed to delete task");
      }
    } catch (err) {
      toast.error("An error occurred while deleting the task");
      console.error("Delete task error:", err);
    }
  };

  const getTaskStats = () => {
    const stats = {
      pending: 0,
      inProgress: 0,
      completed: 0,
    };

    tasks.forEach((task) => {
      switch (task.status) {
        case "pending":
          stats.pending++;
          break;
        case "in-progress":
          stats.inProgress++;
          break;
        case "completed":
          stats.completed++;
          break;
      }
    });

    return stats;
  };

  const statusOptions = [
    { value: "all", label: "All Status" },
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "all", label: "All Priorities" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

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
              Loading your tasks...
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
          {/* Modern Header Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-800 via-slate-900 to-blue-900 shadow-2xl mb-12">
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-slate-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className="relative px-8 py-16 lg:px-16 lg:py-20">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-6">
                      <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                        <Target className="w-6 h-6 text-blue-200" />
                      </div>
                      <span className="text-blue-200 font-medium font-lora">
                        Task Management Dashboard
                      </span>
                    </div>

                    <h1 className="text-5xl lg:text-6xl font-bold tracking-tight font-lora mb-6 text-white">
                      Your{" "}
                      <span className="bg-gradient-to-r from-blue-200 to-indigo-200 bg-clip-text text-transparent">
                        Tasks
                      </span>
                    </h1>

                    <p className="text-xl text-slate-300 font-lora mb-8 max-w-2xl leading-relaxed">
                      Organize, prioritize, and track your tasks with our
                      professional management system.
                    </p>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <BarChart3 className="w-5 h-5 text-blue-300" />
                          <div>
                            <p className="text-2xl font-bold text-white font-lora">
                              {tasks.length}
                            </p>
                            <p className="text-slate-300 text-sm font-lora">
                              Total
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="w-5 h-5 text-green-300" />
                          <div>
                            <p className="text-2xl font-bold text-white font-lora">
                              {getTaskStats().completed}
                            </p>
                            <p className="text-slate-300 text-sm font-lora">
                              Completed
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-5 h-5 text-orange-300" />
                          <div>
                            <p className="text-2xl font-bold text-white font-lora">
                              {getTaskStats().inProgress}
                            </p>
                            <p className="text-slate-300 text-sm font-lora">
                              In Progress
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-5 h-5 text-purple-300" />
                          <div>
                            <p className="text-2xl font-bold text-white font-lora">
                              {getTaskStats().pending}
                            </p>
                            <p className="text-slate-300 text-sm font-lora">
                              Pending
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Link to="/tasks/create">
                        <Button className="bg-white text-slate-800 hover:bg-blue-50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                          <Plus className="w-5 h-5 mr-2" />
                          Create New Task
                        </Button>
                      </Link>
                      <Button className="bg-white/20 text-white hover:bg-white/30 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 backdrop-blur-sm border border-white/30">
                        <Download className="w-5 h-5 mr-2" />
                        Export Tasks
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modern Filters and Controls */}
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-8 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Filter className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 font-lora">
                    Filter & Search
                  </h3>
                  <p className="text-slate-600 font-lora">
                    Find exactly what you're looking for
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
                  <Grid3X3 className="w-4 h-4 mr-2" />
                  Grid View
                </Button>
                <Button className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105">
                  <List className="w-4 h-4 mr-2" />
                  List View
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <Input
                  placeholder="Search tasks by title or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 py-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 font-lora text-lg"
                  fullWidth
                />
              </div>
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                options={statusOptions}
                className="py-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 font-lora text-lg"
                fullWidth
              />
              <Select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                options={priorityOptions}
                className="py-4 rounded-xl border-slate-200 focus:border-blue-500 focus:ring-blue-500 font-lora text-lg"
                fullWidth
              />
            </div>
          </div>
          {/* Modern Tasks Grid */}
          {error ? (
            <div className="bg-white/80 backdrop-blur-sm border border-red-200/50 shadow-xl rounded-2xl p-12">
              <div className="text-center">
                <div className="p-4 bg-red-100 rounded-full w-fit mx-auto mb-6">
                  <AlertCircle className="h-12 w-12 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 font-lora mb-4">
                  Something went wrong
                </h3>
                <p className="text-red-600 mb-8 font-lora text-lg">{error}</p>
                <Button
                  onClick={fetchTasks}
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  <Activity className="w-5 h-5 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          ) : filteredTasks.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>

              {/* Modern Results Summary */}
              <div className="mt-12 text-center">
                <div className="bg-white/60 backdrop-blur-sm border border-slate-200/50 rounded-2xl p-6 inline-block">
                  <div className="flex items-center space-x-3">
                    <Star className="w-5 h-5 text-blue-600" />
                    <span className="text-slate-700 font-lora font-medium">
                      Showing {filteredTasks.length} of {tasks.length} tasks
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-xl rounded-2xl p-16">
              <div className="text-center">
                <div className="p-6 bg-slate-100 rounded-full w-fit mx-auto mb-8">
                  {tasks.length === 0 ? (
                    <Target className="h-16 w-16 text-slate-400" />
                  ) : (
                    <Filter className="h-16 w-16 text-slate-400" />
                  )}
                </div>
                <h3 className="text-3xl font-bold text-slate-900 mb-4 font-lora">
                  {tasks.length === 0
                    ? "Ready to get started?"
                    : "No tasks match your filters"}
                </h3>
                <p className="text-slate-600 mb-8 font-lora text-xl max-w-md mx-auto leading-relaxed">
                  {tasks.length === 0
                    ? "Create your first task and start organizing your workflow with our professional task management system."
                    : "Try adjusting your search or filter criteria to find the tasks you're looking for."}
                </p>
                {tasks.length === 0 && (
                  <Link to="/tasks/create">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:scale-105 shadow-lg">
                      <Plus className="w-5 h-5 mr-2" />
                      Create Your First Task
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TasksPage;
