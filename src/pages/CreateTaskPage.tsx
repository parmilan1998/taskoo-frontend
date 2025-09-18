import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import type { CreateTaskRequest } from "@/types/task";
import { taskService } from "@/services/taskService";
import Layout from "@/components/layout/Layout";
import TaskForm from "@/components/task/TaskForm";
// import { Link } from "react-router-dom";
// import Button from "@/components/ui/Button";
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
                    Create New Task
                  </span>
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
                      Create New Task
                    </h1>
                    <p className="text-lg text-slate-600 font-lora">
                      Add a new task to organize your workflow and boost
                      productivity
                    </p>
                  </div>

                  <TaskForm
                    onSubmit={handleSubmit}
                    onCancel={handleCancel}
                    loading={loading}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tips Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-lora">
                  💡 Task Creation Tips
                </h3>
                <div className="space-y-4 text-sm text-slate-600 font-lora">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Use clear, descriptive titles that explain what needs to
                      be done
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Set realistic due dates to maintain achievable deadlines
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Add relevant tags to make tasks easier to find and
                      organize
                    </p>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                    <p>
                      Choose appropriate priority levels to focus on what
                      matters most
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Stats Card */}
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/50 shadow-lg rounded-xl p-6">
                <h3 className="text-lg font-semibold text-slate-900 mb-4 font-lora">
                  📊 Quick Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-lora">
                      Total Tasks
                    </span>
                    <span className="text-sm font-semibold text-slate-900 font-lora">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-lora">
                      Completed Today
                    </span>
                    <span className="text-sm font-semibold text-green-600 font-lora">
                      -
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600 font-lora">
                      In Progress
                    </span>
                    <span className="text-sm font-semibold text-blue-600 font-lora">
                      -
                    </span>
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
