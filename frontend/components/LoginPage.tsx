import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ROUTES } from "../constants/routes";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Users } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { useAuth } from "../contexts/AuthContext";

export function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await login(formData.email, formData.password);
      navigate(ROUTES.HOME);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
    navigate(ROUTES.HOME);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/30 via-gray-800/20 to-black/40 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&h=1200&fit=crop&crop=center"
          alt="Serene modern workspace with natural lighting and peaceful atmosphere"
          className="w-full h-full object-cover"
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-white p-12">
          <div className="max-w-md text-center space-y-6 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-8">
              <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-xl border border-white/30">
                <Users className="h-8 w-8 text-white" />
              </div>
              <span className="text-3xl font-bold tracking-tight">
                Social City
              </span>
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Welcome Back to Your Community
            </h2>

            <p className="text-xl text-white/90 leading-relaxed">
              Connect with neighbors, discover local events, and build
              meaningful relationships in your area.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">50K+</div>
                <div className="text-white/80 text-sm">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">10K+</div>
                <div className="text-white/80 text-sm">Local Events</div>
              </div>
            </div>
          </div>

          {/* Social City Logo Placement - Bottom Left */}
          <div className="absolute bottom-8 left-8 flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
            <Users className="h-5 w-5 text-white" />
            <span className="text-sm font-semibold text-white">
              Social City
            </span>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-10 right-10 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm animate-bounce-gentle" />
        <div
          className="absolute bottom-20 left-10 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 right-20 w-12 h-12 rounded-full bg-white/10 backdrop-blur-sm animate-bounce-gentle"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Mobile Header (hidden on lg+) */}
          <div className="lg:hidden text-center space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-3">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-blue-500 via-indigo-600 to-blue-700 flex items-center justify-center shadow-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold logo-gradient tracking-tight">
                Social City
              </span>
            </div>
            <div className="relative w-full h-48 rounded-2xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-800/60 to-gray-700/60 z-10" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=400&h=300&fit=crop&crop=center"
                alt="Peaceful workspace atmosphere"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <p className="text-white text-center px-4 font-semibold">
                  Connect with your local community
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
            <p className="text-muted-foreground">
              Sign in to your account to continue exploring your community
            </p>
          </div>

          {/* Login Form */}
          <Card
            className="card-enhanced card-cream animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-gray-800">
                Sign In
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          email: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          password: e.target.value,
                        }))
                      }
                      required
                    />
                    {/* <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button> */}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input
                      type="checkbox"
                      className="rounded transition-all duration-300 accent-blue-500"
                    />
                    <span className="font-medium text-gray-700">
                      Remember me
                    </span>
                  </label>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-700 font-semibold"
                  >
                    Forgot password?
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Signing in..." : "Sign In"}
                </Button>
              </form>

              <div className="relative">
                <Separator className="bg-gray-200" />
                <span className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-muted-foreground font-medium">
                  or continue with
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Google")}
                  className="bg-white/90 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl"
                >
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Google
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleSocialLogin("Facebook")}
                  className="bg-white/90 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 rounded-xl"
                >
                  <svg
                    className="h-4 w-4 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </Button>
              </div>

              <div className="text-center">
                <span className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.SIGNUP)}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                  >
                    Sign up
                  </Button>
                </span>
              </div>
            </CardContent>
          </Card>

          <Button
            variant="ghost"
            onClick={() => navigate(ROUTES.HOME)}
            className="w-full rounded-xl"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continue as guest
          </Button>
        </div>
      </div>
    </div>
  );
}
