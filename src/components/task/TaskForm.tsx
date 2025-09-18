import React, { useState } from "react";
import type { Task, CreateTaskRequest } from "@/types/task";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";

interface TaskFormProps {
  task?: Task;
  onSubmit: (data: CreateTaskRequest) => void;
  onCancel?: () => void;
  loading?: boolean;
}

const TaskForm: React.FC<TaskFormProps> = ({
  task,
  onSubmit,
  onCancel,
  loading = false,
}) => {
  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: task?.title || "",
    description: task?.description || "",
    status: task?.status || "pending",
    priority: task?.priority || "medium",
    dueDate: task?.dueDate
      ? new Date(task.dueDate).toISOString().split("T")[0]
      : "",
    category: task?.category || "",
    tags: task?.tags || [],
  });

  const [tagInput, setTagInput] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (formData.dueDate) {
      const dueDate = new Date(formData.dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.dueDate = "Due date cannot be in the past";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags?.filter((tag) => tag !== tagToRemove) || [],
    }));
  };

  const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  const handleChange = (field: keyof CreateTaskRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-8 font-lora">
        <div className="space-y-6">
          <Input
            label="Task Title"
            value={formData.title}
            onChange={(e) => handleChange("title", e.target.value)}
            error={errors.title}
            placeholder="Enter a clear, descriptive title for your task"
            fullWidth
            required
            className="font-lora text-lg"
          />

          <Textarea
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={errors.description}
            placeholder="Provide detailed information about what needs to be accomplished"
            rows={4}
            fullWidth
            required
            className="font-lora"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Status"
            value={formData.status}
            onChange={(e) => handleChange("status", e.target.value)}
            options={statusOptions}
            fullWidth
            className=" font-lora"
          />

          <Select
            label="Priority"
            value={formData.priority}
            onChange={(e) => handleChange("priority", e.target.value)}
            options={priorityOptions}
            fullWidth
            className=" font-lora"
          />
        </div>

        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange("dueDate", e.target.value)}
          error={errors.dueDate}
          fullWidth
          className=" font-lora"
        />

        <Input
          label="Category"
          value={formData.category || ""}
          onChange={(e) => handleChange("category", e.target.value)}
          placeholder="e.g., Development, Documentation, Testing"
          fullWidth
          className=" font-lora"
        />

        <div className="space-y-4">
          <label className="block text-sm font-medium text-slate-700 mb-3 font-lora">
            Tags (Optional)
          </label>
          <div className="space-y-4">
            <div className="flex gap-3">
              <Input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagInputKeyPress}
                placeholder="Type a tag and press Enter or click Add"
                className="flex-1 font-lora"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                disabled={!tagInput.trim()}
                className="px-6 font-lora"
              >
                Add Tag
              </Button>
            </div>
            {formData.tags && formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1.5 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200 font-lora"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end space-x-4 pt-8 border-t border-slate-200">
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="px-8 py-3 font-lora"
            >
              Cancel
            </Button>
          )}
          <Button
            type="submit"
            loading={loading}
            disabled={loading}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white shadow-lg font-lora"
          >
            {task ? "Update Task" : "Create Task"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;
