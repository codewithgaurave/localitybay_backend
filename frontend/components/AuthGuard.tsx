import React, { useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function AuthGuard({
  children,
  fallback = <div>Please log in to access this page.</div>,
  redirectTo = "login",
}: AuthGuardProps) {
  const { isAuthenticated, isLoading } = useAuth();

  // Listen for token expiry events
  useEffect(() => {
    const handleTokenExpiry = () => {
      // The API service will handle the redirect
      console.log("Token expired, redirecting to login...");
    };

    window.addEventListener("tokenExpired", handleTokenExpiry);

    return () => {
      window.removeEventListener("tokenExpired", handleTokenExpiry);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Higher-order component for protecting routes
export function withAuthGuard<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ReactNode
) {
  return function AuthGuardedComponent(props: P) {
    return (
      <AuthGuard fallback={fallback}>
        <Component {...props} />
      </AuthGuard>
    );
  };
}
