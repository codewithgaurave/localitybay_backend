import React, { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { ROUTES } from "../constants/routes";
import {
  Home,
  User,
  Calendar,
  MessageSquare,
  Megaphone,
  Briefcase,
  Settings,
  Menu,
  X,
  LogIn,
  UserPlus,
  LogOut,
  Bell,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export function Layout() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [messageCount, setMessageCount] = useState(3);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  // Bottom navigation items
  const bottomNavigation = [
    { id: "home", label: "Home", icon: Home, path: ROUTES.HOME },
    { id: "meetups", label: "Meetups", icon: Calendar, path: ROUTES.MEETUPS },
    { id: "notices", label: "Notices", icon: Bell, path: ROUTES.NOTICES },
    {
      id: "services",
      label: "Services",
      icon: Briefcase,
      path: ROUTES.SERVICES,
    },
    { id: "profile", label: "Profile", icon: User, path: ROUTES.PROFILE },
  ];

  const isActiveRoute = (path: string) => {
    if (path === ROUTES.HOME) {
      return location.pathname === ROUTES.HOME;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Header */}
      <header className="sticky top-0 z-50 w-full glass-nav animate-slide-down">
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex items-center justify-between py-4">
            {/* Left - Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="nav-button p-2 rounded-xl"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Left - Brand Name Only */}
            <div className="flex items-center animate-fade-in absolute left-16 md:left-20">
              <h1
                className="text-2xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 bg-clip-text text-transparent drop-shadow-sm"
                style={{
                  fontFamily: "'Urbanist', serif",
                  fontWeight: 800,
                  letterSpacing: "-0.03em",
                }}
              >
                Social City
              </h1>
            </div>

            {/* Right - Messages Button with Notification Badge */}
            <div className="relative">
              <button
                onClick={() => {
                  navigate(ROUTES.COMMUNITIES);
                  setMessageCount(0); // Clear messages when clicked
                }}
                className={`flex flex-col items-center justify-center p-2 transition-all duration-300 rounded-xl ${
                  isActiveRoute(ROUTES.COMMUNITIES) ||
                  isActiveRoute(ROUTES.CHAT_GROUPS)
                    ? "text-blue-600"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                <div className="relative">
                  <MessageSquare className="h-6 w-6" />
                  {/* Red notification badge */}
                  {messageCount > 0 &&
                    !isActiveRoute(ROUTES.COMMUNITIES) &&
                    !isActiveRoute(ROUTES.CHAT_GROUPS) && (
                      <div className="absolute -top-2 -right-2 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold animate-bounce-gentle">
                        {messageCount > 9 ? "9+" : messageCount}
                      </div>
                    )}
                </div>
                <span className="font-semibold text-xs mt-1 hidden md:inline">
                  Community
                </span>
              </button>
            </div>
          </div>

          {/* Dropdown Menu for Additional Options */}
          {mobileMenuOpen && (
            <div className="border-t border-blue-300/20 mobile-menu-enter">
              <div className="p-4">
                <nav className="flex flex-col space-y-2 stagger-children">
                  {/* Authentication and Admin Options */}
                  <div className="space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="flex items-center space-x-3 p-3 bg-white/5 rounded-xl">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <p className="font-semibold text-sm text-gray-700">
                              {user?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {user?.email || "user@example.com"}
                            </p>
                          </div>
                        </div>
                        {user?.role === "admin" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              navigate(ROUTES.ADMIN);
                              setMobileMenuOpen(false);
                            }}
                            className="nav-button flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl"
                          >
                            <Settings className="h-5 w-5" />
                            <span>Admin Panel</span>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            navigate(ROUTES.SETTINGS);
                            setMobileMenuOpen(false);
                          }}
                          className="nav-button flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl"
                        >
                          <Settings className="h-5 w-5" />
                          <span>Settings</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            handleLogout();
                            setMobileMenuOpen(false);
                          }}
                          className="nav-button flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Logout</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            navigate(ROUTES.LOGIN);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl mb-2"
                        >
                          <LogIn className="h-5 w-5" />
                          <span>Login</span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            navigate(ROUTES.SIGNUP);
                            setMobileMenuOpen(false);
                          }}
                          className="flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl font-semibold"
                        >
                          <UserPlus className="h-5 w-5" />
                          <span>Sign Up</span>
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Additional Options */}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(ROUTES.WALKTHROUGH);
                        setMobileMenuOpen(false);
                      }}
                      className="nav-button flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl"
                    >
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">?</span>
                      </div>
                      <span>Help & Support</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate(ROUTES.VERIFICATION);
                        setMobileMenuOpen(false);
                      }}
                      className="nav-button flex items-center justify-start space-x-3 w-full px-4 py-3 rounded-xl"
                    >
                      <div className="h-5 w-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">✓</span>
                      </div>
                      <span>Get Verified</span>
                    </Button>
                  </div>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-20 animate-fade-in">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg animate-slide-up">
        <div className="flex items-center justify-around px-2 py-2">
          {bottomNavigation.map((item, index) => (
            <button
              key={item.id}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center justify-center px-3 py-2 min-w-0 flex-1 transition-all duration-300 rounded-lg ${
                isActiveRoute(item.path)
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
              }`}
            >
              <item.icon className="h-5 w-5 mb-1" />
              <span className="text-xs font-medium truncate">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}
