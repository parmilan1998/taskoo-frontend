import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Clock, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Task } from "@/types/task";
import Card from "@/components/ui/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const getStatusVariant = (status: Task["status"]) => {
    switch (status) {
      case "completed":
        return "success";
      case "in-progress":
        return "info";
      case "pending":
        return "warning";
      default:
        return "default";
    }
  };

  const getPriorityVariant = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "danger";
      case "medium":
        return "warning";
      case "low":
        return "default";
      default:
        return "default";
    }
  };

  const formatStatus = (status: Task["status"]) => {
    switch (status) {
      case "in-progress":
        return "In Progress";
      case "completed":
        return "Completed";
      case "pending":
        return "Pending";
      default:
        return status;
    }
  };

  return (
    <Card hover className="h-full font-lora">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <Link to={`/tasks/${task.id}`}>
              <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600 transition-colors truncate">
                {task.title}
              </h3>
            </Link>
            <div className="flex items-center space-x-2 mt-1">
              <Badge variant={getStatusVariant(task.status)} size="sm">
                {formatStatus(task.status)}
              </Badge>
              <Badge variant={getPriorityVariant(task.priority)} size="sm">
                {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-1 ml-2">
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                icon={Edit}
                onClick={() => onEdit(task)}
                className="p-1"
              />
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                icon={Trash2}
                onClick={() => onDelete(task.id)}
                className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              />
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 flex-1 line-clamp-3">
          {task.description}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center space-x-4">
            {task.dueDate && (
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>Due {format(new Date(task.dueDate), "MMM dd")}</span>
              </div>
            )}
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>Created {format(new Date(task.createdAt), "MMM dd")}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;
