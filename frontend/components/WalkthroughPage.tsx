import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  MapPin,
  Users,
  Calendar,
  Megaphone,
  Shield,
  ChevronRight,
  ChevronLeft,
  X,
  BookOpen,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";



export function WalkthroughPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Set Your Location",
      icon: MapPin,
      description:
        "Choose your location and radius to discover nearby users and events.",
    },
    {
      title: "Explore the Map",
      icon: Users,
      description:
        "Click on user icons to see profiles, send messages, and connect with locals.",
    },
    {
      title: "Create Meetups",
      icon: Calendar,
      description:
        "Organize events and automatically create temporary chat groups.",
    },
    {
      title: "Post Notices",
      icon: Megaphone,
      description:
        "Share local announcements, lost items, or services with your community.",
    },
    {
      title: "Get Verified",
      icon: Shield,
      description:
        "Upload your ID to get a verification badge and build trust.",
    },
  ];

  const nextStep = () =>
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 0));

  const currentStepData = steps[currentStep];
  const IconComponent = currentStepData.icon;

  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Enhanced Learning Tutorial Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1515073838964-4d4d56a58b21?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx0dXRvcmlhbCUyMGd1aWRlJTIwbGVhcm5pbmclMjBlZHVjYXRpb258ZW58MXx8fHwxNzU0OTEyNDg4fDA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Tutorial and learning guide background"
          className="w-full h-full object-cover opacity-[0.03]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-50/95 via-white/98 to-indigo-50/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-transparent to-white/98" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(147,51,234,0.05)_100%)]" />
      </div>

      {/* Content overlay with enhanced animations */}
      <div className="relative z-10 space-y-6 max-w-2xl mx-auto animate-fade-in">
        {/* Floating particles animation */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-16 left-10 w-2 h-2 bg-purple-400/20 rounded-full animate-bounce"
            style={{ animationDelay: "0s", animationDuration: "3s" }}
          ></div>
          <div
            className="absolute top-36 right-12 w-1.5 h-1.5 bg-indigo-400/20 rounded-full animate-bounce"
            style={{ animationDelay: "1s", animationDuration: "4s" }}
          ></div>
          <div
            className="absolute top-56 left-1/4 w-1 h-1 bg-violet-500/20 rounded-full animate-bounce"
            style={{ animationDelay: "2s", animationDuration: "5s" }}
          ></div>
        </div>

        {/* Header Card */}
        <Card className="card-enhanced card-cream animate-slide-up hover:shadow-2xl transition-all duration-500 relative backdrop-blur-sm">
          {/* Close Button */}

          <CardHeader>
            <CardTitle className="flex items-start justify-between space-x-3 animate-slide-down">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 via-indigo-600 to-violet-700 flex items-center justify-center shadow-lg shadow-purple-500/25 animate-pulse">
                  <BookOpen className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-2xl">
                    How to Use{" "}
                    <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700 bg-clip-text text-transparent font-bold">
                      Social City
                    </span>
                  </span>
                  <p className="text-sm text-gray-600 font-normal mt-1">
                    Learn how to connect with your community
                  </p>
                </div>{" "}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/home")}
                className=" rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
              </Button>
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="card-enhanced card-cream animate-slide-up hover:shadow-2xl transition-all duration-500 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3">
                <div
                  className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-lg animate-pulse ${
                    currentStep === 0
                      ? "bg-gradient-to-br from-green-500 to-emerald-600 shadow-green-500/25"
                      : currentStep === 1
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-blue-500/25"
                      : currentStep === 2
                      ? "bg-gradient-to-br from-purple-500 to-violet-600 shadow-purple-500/25"
                      : currentStep === 3
                      ? "bg-gradient-to-br from-orange-500 to-amber-600 shadow-orange-500/25"
                      : "bg-gradient-to-br from-indigo-500 to-blue-600 shadow-indigo-500/25"
                  }`}
                >
                  <IconComponent className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="text-xl">{currentStepData.title}</span>
                  <p className="text-sm text-gray-600 font-normal mt-1">
                    Learn the basics of Social City
                  </p>
                </div>
              </CardTitle>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gradient-to-br from-purple-50/80 to-indigo-50/60 p-5 rounded-xl border border-purple-200/50 backdrop-blur-sm">
              <p className="text-gray-700 leading-relaxed">
                {currentStepData.description}
              </p>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="btn-gradient-outline rounded-xl px-6 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              {currentStep === steps.length - 1 ? (
                <Button
                  onClick={() => navigate("/home")}
                  className="btn-gradient rounded-xl px-6 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700"
                >
                  Get Started
                </Button>
              ) : (
                <Button
                  onClick={nextStep}
                  className="btn-gradient rounded-xl px-6 py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-violet-700"
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Progress indicator */}
        <div className="flex justify-center space-x-3 animate-slide-up">
          {steps.map((_, index) => (
            <button
              key={index}
              className={`w-4 h-4 rounded-full transition-all duration-300 transform hover:scale-110 ${
                index === currentStep
                  ? "bg-gradient-to-r from-purple-600 to-indigo-600 shadow-lg shadow-purple-500/30"
                  : index < currentStep
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setCurrentStep(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
