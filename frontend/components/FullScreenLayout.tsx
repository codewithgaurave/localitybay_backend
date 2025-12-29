import React from "react";
import { X } from "lucide-react";
import { Button } from "./ui/button";

interface FullScreenLayoutProps {
  children: React.ReactNode;
  title: string;
  onClose: () => void;
  showCloseButton?: boolean;
  className?: string;
}

export function FullScreenLayout({
  children,
  title,
  onClose,
  showCloseButton = true,
  className = "",
}: FullScreenLayoutProps) {
  return (
    <div className="fixed inset-0 z-50 bg-white overflow-auto">
      {/* Content */}
      <div className={`p-4 ${className}`}>{children}</div>
    </div>
  );
}
