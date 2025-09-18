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
  // Download,
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-blue-600 to-cyan-600 shadow-2xl mb-12">
            {/* Enhanced Animated Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-0 left-0 w-80 h-80 bg-cyan-300/20 rounded-full blur-3xl animate-pulse"></div>
              <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300/15 rounded-full blur-3xl animate-pulse delay-700"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-2xl animate-pulse delay-1000"></div>
            </div>

            {/* Decorative Grid Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
                  backgroundSize: "20px 20px",
                }}
              ></div>
            </div>

            <div className="relative px-8 py-16 lg:px-16 lg:py-20">
              <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-8">
                      <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm border border-white/30 shadow-lg">
                        <Target className="w-7 h-7 text-cyan-200" />
                      </div>
                      <div>
                        <span className="text-cyan-100 font-semibold font-lora text-lg">
                          Task Management
                        </span>
                        <p className="text-blue-200 text-sm font-lora">
                          Professional Dashboard
                        </p>
                      </div>
                    </div>

                    <h1 className="text-5xl lg:text-7xl font-bold tracking-tight font-lora mb-8 text-white leading-tight">
                      Your{" "}
                      <span className="bg-gradient-to-r from-cyan-200 via-blue-200 to-white bg-clip-text text-transparent">
                        Tasks
                      </span>
                    </h1>

                    <p className="text-xl lg:text-2xl text-blue-100 font-lora mb-10 max-w-3xl leading-relaxed">
                      Streamline your workflow with our intelligent task
                      management system. Organize, prioritize, and achieve your
                      goals efficiently.
                    </p>

                    {/* Enhanced Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                      <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-cyan-400/20 rounded-xl group-hover:bg-cyan-400/30 transition-colors duration-300">
                            <BarChart3 className="w-6 h-6 text-cyan-200" />
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white font-lora">
                              {tasks.length}
                            </p>
                            <p className="text-cyan-200 text-sm font-lora font-medium">
                              Total Tasks
                            </p>
                          </div>
                        </div>
                        <div className="h-1 bg-cyan-400/30 rounded-full overflow-hidden">
                          <div className="h-full bg-cyan-300 rounded-full w-full"></div>
                        </div>
                      </div>

                      <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-emerald-400/20 rounded-xl group-hover:bg-emerald-400/30 transition-colors duration-300">
                            <CheckCircle className="w-6 h-6 text-emerald-200" />
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white font-lora">
                              {getTaskStats().completed}
                            </p>
                            <p className="text-emerald-200 text-sm font-lora font-medium">
                              Completed
                            </p>
                          </div>
                        </div>
                        <div className="h-1 bg-emerald-400/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-300 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                tasks.length > 0
                                  ? (getTaskStats().completed / tasks.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-amber-400/20 rounded-xl group-hover:bg-amber-400/30 transition-colors duration-300">
                            <Clock className="w-6 h-6 text-amber-200" />
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white font-lora">
                              {getTaskStats().inProgress}
                            </p>
                            <p className="text-amber-200 text-sm font-lora font-medium">
                              In Progress
                            </p>
                          </div>
                        </div>
                        <div className="h-1 bg-amber-400/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-amber-300 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                tasks.length > 0
                                  ? (getTaskStats().inProgress / tasks.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>

                      <div className="group bg-white/15 backdrop-blur-md rounded-2xl p-6 border border-white/30 shadow-xl hover:bg-white/20 transition-all duration-300 hover:scale-105">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-3 bg-violet-400/20 rounded-xl group-hover:bg-violet-400/30 transition-colors duration-300">
                            <Calendar className="w-6 h-6 text-violet-200" />
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white font-lora">
                              {getTaskStats().pending}
                            </p>
                            <p className="text-violet-200 text-sm font-lora font-medium">
                              Pending
                            </p>
                          </div>
                        </div>
                        <div className="h-1 bg-violet-400/30 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-violet-300 rounded-full transition-all duration-500"
                            style={{
                              width: `${
                                tasks.length > 0
                                  ? (getTaskStats().pending / tasks.length) *
                                    100
                                  : 0
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>

                    {/* <div className="flex flex-col sm:flex-row gap-6">
                      <Link to="/tasks/create">
                        <Button className="group bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-white/20 border-2 border-white/20">
                          <Plus className="w-6 h-6 mr-3 group-hover:rotate-90 transition-transform duration-300" />
                          Create New Task
                        </Button>
                      </Link>
                      <Button className="group bg-white/20 text-white hover:bg-white/30 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border-2 border-white/30 shadow-xl">
                        <Download className="w-6 h-6 mr-3 group-hover:translate-y-1 transition-transform duration-300" />
                        Export Tasks
                      </Button>
                      <Button className="group bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white hover:from-cyan-500/30 hover:to-blue-500/30 px-10 py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 backdrop-blur-md border-2 border-cyan-300/30 shadow-xl">
                        <Target className="w-6 h-6 mr-3 group-hover:rotate-12 transition-transform duration-300" />
                        View Analytics
                      </Button>
                    </div> */}
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
