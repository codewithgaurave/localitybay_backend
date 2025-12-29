import React from "react";
import { cn } from "./utils";

interface LoadingProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "skeleton";
  className?: string;
  text?: string;
}

export function Loading({
  size = "md",
  variant = "spinner",
  className,
  text = "Loading...",
}: LoadingProps) {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  const textSizeClasses = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  if (variant === "skeleton") {
    return (
      <div className={cn("animate-pulse", className)}>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div
        className={cn("flex items-center justify-center space-x-1", className)}
      >
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
        </div>
        {text && (
          <span className={cn("ml-2 text-gray-600", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "rounded-full bg-gradient-to-r from-blue-500 to-blue-600 animate-pulse",
            sizeClasses[size]
          )}
        ></div>
        {text && (
          <span className={cn("ml-3 text-gray-600", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    );
  }

  // Default spinner
  return (
    <div className={cn("flex items-center justify-center", className)}>
      <div className="relative">
        <div
          className={cn(
            "border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin",
            sizeClasses[size]
          )}
        ></div>
        {text && (
          <span className={cn("ml-3 text-gray-600", textSizeClasses[size])}>
            {text}
          </span>
        )}
      </div>
    </div>
  );
}

// Full page loading component
export function FullPageLoading({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-12 w-12 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
          <div className="absolute inset-0 h-12 w-12 border-4 border-transparent border-r-blue-300 rounded-full animate-spin [animation-direction:reverse] [animation-duration:1.5s]"></div>
        </div>
        <div className="text-center">
          <p className="text-lg font-semibold text-gray-800">{text}</p>
          <p className="text-sm text-gray-500 mt-1">Please wait...</p>
        </div>
      </div>
    </div>
  );
}

// Card skeleton loading
export function CardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse", className)}>
      <div className="bg-white rounded-xl p-6 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="h-8 w-8 bg-gray-200 rounded-lg"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded w-full"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-6 bg-gray-200 rounded-full w-16"></div>
          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
        </div>
      </div>
    </div>
  );
}

// Map skeleton loading
export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-100 rounded-xl", className)}>
      <div className="h-64 sm:h-80 lg:h-96 relative overflow-hidden rounded-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300"></div>
        <div className="absolute top-4 right-4">
          <div className="h-8 w-24 bg-gray-300 rounded-lg"></div>
        </div>
        <div className="absolute top-1/4 left-1/3">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute top-2/3 right-1/3">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        </div>
        <div className="absolute top-1/2 left-2/3">
          <div className="h-12 w-12 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
