import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Checkbox } from "./ui/checkbox";
import {
  Upload,
  Shield,
  Briefcase,
  X,
  UserCheck,
  Calendar,
  Phone,
  MapPin,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function RegisterServiceProvider() {
  const navigate = useNavigate();
  const [provider, setProvider] = useState({
    name: "",
    dateOfBirth: "",
    contact: "",
    experience: "",
    address: "",
  });

  const [services, setServices] = useState<string[]>([]);
  const [pricing, setPricing] = useState("");

  const availableServices = [
    "Plumbing",
    "Electrical",
    "Painting",
    "Cleaning",
    "Tutoring",
    "Pet Care",
    "Photography",
    "Fitness Training",
    "Tech Support",
    "Home Repairs",
    "Consulting",
  ];

  const handleServiceToggle = (service: string) => {
    setServices((prev) =>
      prev.includes(service)
        ? prev.filter((s) => s !== service)
        : [...prev, service]
    );
  };

  const handleSubmit = () => {
    console.log("Registering service provider:", {
      provider,
      services,
      pricing,
    });
    navigate(ROUTES.SERVICES);
  };

  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Enhanced Professional Service Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1585508094372-aa593b7f9a94?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzZXJ2aWNlJTIwcHJvdmlkZXIlMjB3b3Jrc3BhY2V8ZW58MXx8fHwxNzU0OTEyMjU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Professional service provider workspace"
          className="w-full h-full object-cover opacity-[0.035]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/95 via-white/98 to-blue-50/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-transparent to-white/98" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(34,197,94,0.04)_100%)]" />
      </div>

      {/* Content overlay with enhanced animations */}
      <div className="relative z-10 space-y-6 max-w-4xl mx-auto animate-fade-in">
        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-20 left-12 w-2 h-2 bg-green-400/20 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-40 right-20 w-1.5 h-1.5 bg-blue-400/20 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute top-64 left-1/3 w-1 h-1 bg-emerald-500/20 rounded-full animate-bounce"
            style={{ animationDelay: "4s", animationDuration: "5s" }}
          ></div>
        </div>

        {/* Header Card */}
        <Card className="card-enhanced card-cream animate-slide-up hover:shadow-2xl transition-all duration-500 relative backdrop-blur-sm">
          {/* Close Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.SERVICES)}
            className="absolute top-4 right-4 z-10 rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
          </Button>

          <CardHeader>
            <CardTitle className="flex items-center space-x-3 animate-slide-down">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-green-600 via-emerald-600 to-blue-700 flex items-center justify-center shadow-lg shadow-green-500/25 animate-pulse">
                <Briefcase className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-2xl">
                  Register as{" "}
                  <span className="bg-gradient-to-r from-green-600 via-emerald-600 to-blue-700 bg-clip-text text-transparent font-bold">
                    Service Provider
                  </span>
                </span>
                <p className="text-sm text-gray-600 font-normal mt-1">
                  Join our platform and offer your professional services
                </p>
              </div>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Verification Documents Card */}
        <Card className="card-enhanced card-cream animate-slide-up hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <span>Verification Documents</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Government ID *
                </label>
                <div className="border-2 border-dashed border-green-300/40 rounded-xl p-8 text-center cursor-pointer hover:border-green-400/60 transition-all duration-300 bg-gradient-to-br from-green-50/30 to-emerald-50/20">
                  <Upload className="h-10 w-10 mx-auto text-green-500/70 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    Upload Government ID
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Aadhaar, PAN Card, or Passport
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Selfie *
                </label>
                <div className="border-2 border-dashed border-blue-300/40 rounded-xl p-8 text-center cursor-pointer hover:border-blue-400/60 transition-all duration-300 bg-gradient-to-br from-blue-50/30 to-sky-50/20">
                  <Upload className="h-10 w-10 mx-auto text-blue-500/70 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    Upload Selfie
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Clear photo for identity verification
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Services & Information Card */}
        <Card className="card-enhanced card-cream animate-slide-up hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center space-x-3">
              <div className="h-2 w-2 bg-green-600 rounded-full"></div>
              <span>Personal & Service Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <UserCheck className="h-4 w-4 text-green-600" />
                <span>Personal Details</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Full Name *
                  </label>
                  <Input
                    placeholder="Your full legal name"
                    value={provider.name}
                    onChange={(e) =>
                      setProvider((prev) => ({ ...prev, name: e.target.value }))
                    }
                    className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-green-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>Date of Birth *</span>
                  </label>
                  <Input
                    type="date"
                    value={provider.dateOfBirth}
                    onChange={(e) =>
                      setProvider((prev) => ({
                        ...prev,
                        dateOfBirth: e.target.value,
                      }))
                    }
                    className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-green-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span>Contact Info *</span>
                  </label>
                  <Input
                    placeholder="Phone number or email"
                    value={provider.contact}
                    onChange={(e) =>
                      setProvider((prev) => ({
                        ...prev,
                        contact: e.target.value,
                      }))
                    }
                    className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-green-500 rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Years of Experience *
                  </label>
                  <Input
                    placeholder="e.g. 5 years"
                    value={provider.experience}
                    onChange={(e) =>
                      setProvider((prev) => ({
                        ...prev,
                        experience: e.target.value,
                      }))
                    }
                    className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-green-500 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-1">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>Address *</span>
                </label>
                <Textarea
                  placeholder="Your complete address where you provide services"
                  value={provider.address}
                  onChange={(e) =>
                    setProvider((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }))
                  }
                  rows={3}
                  className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-green-500 rounded-xl resize-none"
                />
              </div>
            </div>

            {/* Services Offered */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <Briefcase className="h-4 w-4 text-green-600" />
                <span>Services Offered</span>
              </h3>

              <div className="bg-gradient-to-br from-green-50/80 to-emerald-50/60 p-5 rounded-xl border border-green-200/50 backdrop-blur-sm">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {availableServices.map((service) => (
                    <div
                      key={service}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-white/50 transition-colors duration-200"
                    >
                      <Checkbox
                        id={service}
                        checked={services.includes(service)}
                        onCheckedChange={() => handleServiceToggle(service)}
                        className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                      />
                      <label
                        htmlFor={service}
                        className="text-sm font-medium text-gray-700"
                      >
                        {service}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Pricing Information *
              </label>
              <Input
                placeholder="e.g. ₹500-800/hour or ₹2000/project"
                value={pricing}
                onChange={(e) => setPricing(e.target.value)}
                className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-green-500 rounded-xl"
              />
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-sky-50 p-5 rounded-xl border border-blue-200 flex items-start space-x-3">
              <Shield className="h-6 w-6 text-blue-600 mt-0.5 animate-pulse" />
              <div className="space-y-2">
                <p className="text-sm font-semibold text-blue-800">
                  Verification Process
                </p>
                <p className="text-sm text-blue-700">
                  Our admin team will verify your documents and assign a
                  verified badge upon approval. This helps build trust with
                  potential customers.
                </p>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate(ROUTES.SERVICES)}
                className="btn-gradient-outline rounded-xl px-6 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="btn-gradient rounded-xl px-6 py-2 bg-gradient-to-r from-green-600 via-emerald-600 to-blue-700"
              >
                Submit Application
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
