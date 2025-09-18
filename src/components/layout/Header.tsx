import React from "react";
import { Link, useLocation } from "react-router-dom";
import { CheckSquare, Plus, Home, List } from "lucide-react";
import Button from "@/components/ui/Button";

const Header: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 font-lora">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <CheckSquare className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900 font-lora">
              Taskoo
            </span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Home className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/tasks"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive("/tasks")
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <List className="h-4 w-4" />
              <span>All Tasks</span>
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            <Link to="/tasks/create">
              <Button icon={Plus} size="sm" className="font-lora">
                New Task
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200">
        <div className="px-4 py-2 space-y-1">
          <Link
            to="/"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Home className="h-4 w-4" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/tasks"
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium ${
              isActive("/tasks")
                ? "text-blue-600 bg-blue-50"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <List className="h-4 w-4" />
            <span>All Tasks</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
