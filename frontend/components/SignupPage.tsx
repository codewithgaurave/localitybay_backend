import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ROUTES } from "../constants/routes";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { Checkbox } from "./ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  ArrowLeft,
  Users,
  Calendar,
  MessageSquare,
  MapPin,
  Phone,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { register } from "../services/authService";
import { useAuth } from "../contexts/AuthContext";

export function SignupPage() {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    userId: "",
    phone: "",
    dateOfBirth: "",
    gender: "",
    location: {
      address: "",
      coordinates: [0, 0] as [number, number],
      city: "",
      state: "",
      country: "India"
    },
    interests: [] as string[],
    agreeToTerms: false,
    agreeToMarketing: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      setIsLoading(false);
      return;
    }

    if (!formData.name || !formData.email || !formData.userId || !formData.location.address) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Get coordinates from address (simplified - in real app use geocoding)
      const coordinates: [number, number] = [72.8777, 19.0760]; // Mumbai coordinates as default
      
      const registrationData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        userId: formData.userId.startsWith('@') ? formData.userId : `@${formData.userId}`,
        phone: formData.phone,
        dateOfBirth: formData.dateOfBirth ? new Date(formData.dateOfBirth) : undefined,
        gender: formData.gender || undefined,
        location: {
          address: formData.location.address,
          coordinates,
          city: formData.location.city || "Mumbai",
          state: formData.location.state || "Maharashtra",
          country: formData.location.country
        },
        interests: formData.interests
      };

      const response = await register(registrationData);
      
      if (response.status && response.data.token) {
        // Login user automatically after registration
        authLogin(response.data.user, response.data.token);
        navigate(ROUTES.HOME);
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error instanceof Error ? error.message : 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignup = (provider: string) => {
    console.log(`Signup with ${provider}`);
    navigate(ROUTES.HOME);
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Left Side - Image Section */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-stone-900/20 via-neutral-800/15 to-slate-900/30 z-10" />
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=1200&fit=crop&crop=center"
          alt="Peaceful forest path with natural sunlight filtering through trees, creating a serene and welcoming atmosphere"
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
              Join Your Local Community Today
            </h2>

            <p className="text-xl text-white/90 leading-relaxed">
              Discover amazing people, events, and opportunities right in your
              neighborhood.
            </p>

            {/* Feature Icons */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border border-white/30">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-white/90 font-medium">Connect</div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border border-white/30">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-white/90 font-medium">Events</div>
              </div>
              <div className="text-center space-y-2">
                <div className="h-12 w-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border border-white/30">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <div className="text-sm text-white/90 font-medium">Chat</div>
              </div>
            </div>

            <div className="border-t border-white/20 pt-6 mt-6">
              <p className="text-white/80 text-sm">
                "Social City helped me find my community and make lasting
                friendships!"
              </p>
              <p className="text-white/60 text-xs mt-2">
                - Sarah M., Community Member
              </p>
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
        <div className="absolute top-16 right-16 w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm animate-bounce-gentle" />
        <div
          className="absolute bottom-32 left-16 w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm animate-bounce-gentle"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/3 right-32 w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm animate-bounce-gentle"
          style={{ animationDelay: "2s" }}
        />
      </div>

      {/* Right Side - Signup Form */}
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
              <div className="absolute inset-0 bg-gradient-to-br from-stone-800/50 to-slate-700/50 z-10" />
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&crop=center"
                alt="Peaceful natural environment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 z-20 flex items-center justify-center">
                <p className="text-white text-center px-4 font-semibold">
                  Join your local community today
                </p>
              </div>
            </div>
          </div>

          {/* Welcome Header */}
          <div className="text-center space-y-2 animate-fade-in">
            <h1 className="text-3xl font-bold text-gray-900">
              Create your account
            </h1>
            <p className="text-muted-foreground">
              Join thousands of people connecting in their local communities
            </p>
          </div>

          {/* Signup Form */}
          <Card
            className="card-enhanced card-cream animate-slide-up"
            style={{ animationDelay: "0.2s" }}
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-center text-gray-800">
                Sign Up
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg">
                    {error}
                  </div>
                )}
                
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <Input
                    placeholder="John Doe"
                    className="bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Username *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="@username"
                      className="pl-10 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.userId}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          userId: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="email"
                      placeholder="john@example.com"
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
                    Phone
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="tel"
                      placeholder="+91 9876543210"
                      className="pl-10 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Date of Birth
                    </label>
                    <Input
                      type="date"
                      className="bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.dateOfBirth}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          dateOfBirth: e.target.value,
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Gender
                    </label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, gender: value }))
                      }
                    >
                      <SelectTrigger className="bg-white/90 border-gray-200 rounded-xl">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Address *
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Your address"
                      className="pl-10 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.location.address}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, address: e.target.value },
                        }))
                      }
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      City
                    </label>
                    <Input
                      placeholder="Mumbai"
                      className="bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.location.city}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, city: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      State
                    </label>
                    <Input
                      placeholder="Maharashtra"
                      className="bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.location.state}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          location: { ...prev.location, state: e.target.value },
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
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
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl"
                      value={formData.confirmPassword}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-gray-600 transition-colors duration-200"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={formData.agreeToTerms}
                      onCheckedChange={(checked: boolean) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeToTerms: checked,
                        }))
                      }
                      className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm leading-relaxed text-gray-700"
                    >
                      I agree to the{" "}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                      >
                        Terms & Conditions
                      </Button>{" "}
                      and{" "}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                      >
                        Privacy Policy
                      </Button>
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={formData.agreeToMarketing}
                      onCheckedChange={(checked: boolean) =>
                        setFormData((prev) => ({
                          ...prev,
                          agreeToMarketing: checked,
                        }))
                      }
                      className="mt-0.5 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                    <label
                      htmlFor="marketing"
                      className="text-sm leading-relaxed text-gray-700"
                    >
                      I'd like to receive updates about Social City features and
                      community events
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full rounded-xl"
                  disabled={isLoading}
                >
                  {isLoading ? "Creating account..." : "Create Account"}
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
                  onClick={() => handleSocialSignup("Google")}
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
                  onClick={() => handleSocialSignup("Facebook")}
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
                  Already have an account?{" "}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate(ROUTES.LOGIN)}
                    className="text-blue-600 hover:text-blue-700 p-0 h-auto font-semibold"
                  >
                    Sign in
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
