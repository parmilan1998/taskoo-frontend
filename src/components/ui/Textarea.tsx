import React from "react";

interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  fullWidth = false,
  className = "",
  id,
  ...props
}) => {
  const textareaId =
    id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses =
    "block px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200 resize-vertical font-sans";
  const errorClasses = error
    ? "border-red-300 focus:ring-red-500 focus:border-red-500"
    : "";
  const widthClasses = fullWidth ? "w-full" : "";

  const classes = `
    ${baseClasses}
    ${errorClasses}
    ${widthClasses}
    ${className}
  `.trim();

  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-medium text-gray-700 mb-1 font-sans"
        >
          {label}
        </label>
      )}
      <textarea id={textareaId} className={classes} {...props} />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default Textarea;
