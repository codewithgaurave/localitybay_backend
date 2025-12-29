import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  ArrowRight,
  Users,
  Heart,
  Coffee,
  Camera,
  Plane,
  Code,
  Music,
  Book,
  Dumbbell,
  Palette,
  Car,
  Gamepad2,
  Utensils,
  Wine,
  Globe,
  Briefcase,
  GraduationCap,
  Activity,
  Home,
  TreePine,
  Bike,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function InterestsSelection() {
  const navigate = useNavigate();
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const interestCategories = [
    {
      title: "Hobbies & Activities",
      interests: [
        { name: "Photography", icon: Camera, color: "bg-purple-500" },
        { name: "Travel", icon: Plane, color: "bg-blue-500" },
        { name: "Music", icon: Music, color: "bg-pink-500" },
        { name: "Reading", icon: Book, color: "bg-indigo-500" },
        { name: "Fitness", icon: Dumbbell, color: "bg-green-500" },
        { name: "Art & Design", icon: Palette, color: "bg-orange-500" },
        { name: "Gaming", icon: Gamepad2, color: "bg-red-500" },
        { name: "Cycling", icon: Bike, color: "bg-cyan-500" },
      ],
    },
    {
      title: "Food & Lifestyle",
      interests: [
        { name: "Cooking", icon: Utensils, color: "bg-yellow-500" },
        { name: "Coffee", icon: Coffee, color: "bg-amber-600" },
        { name: "Wine & Drinks", icon: Wine, color: "bg-purple-600" },
        { name: "Pets", icon: Heart, color: "bg-emerald-500" },
      ],
    },
    {
      title: "Professional & Learning",
      interests: [
        { name: "Technology", icon: Code, color: "bg-slate-600" },
        { name: "Business", icon: Briefcase, color: "bg-blue-600" },
        { name: "Education", icon: GraduationCap, color: "bg-indigo-600" },
        { name: "Languages", icon: Globe, color: "bg-teal-500" },
      ],
    },
    {
      title: "Outdoor & Sports",
      interests: [
        { name: "Hiking", icon: TreePine, color: "bg-green-600" },
        { name: "Sports", icon: Activity, color: "bg-orange-600" },
        { name: "Cars & Motors", icon: Car, color: "bg-gray-600" },
        { name: "Home & Garden", icon: Home, color: "bg-lime-600" },
      ],
    },
  ];

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    );
  };

  const handleContinue = () => {
    // Save interests to user data (would be API call in real app)
    console.log("Selected interests:", selectedInterests);
    navigate(ROUTES.PHOTO_UPLOAD);
  };

  const handleSkip = () => {
    navigate(ROUTES.PHOTO_UPLOAD);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-blue-100/50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.HOME)}
            className="p-2 hover:bg-blue-50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-blue-600" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">
            Choose Your Interests
          </h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-blue-600 hover:bg-blue-50"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6 relative">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop"
              alt="People connecting through shared interests"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-2xl"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Connect with Like-Minded People
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Your interests will be displayed on your profile to help others
            discover shared passions and connect with you. Choose what you love
            and find your community in Social City!
          </p>

          {/* Selected Count */}
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Users className="h-5 w-5 text-blue-500" />
            <span className="text-sm text-gray-600">
              {selectedInterests.length} interest
              {selectedInterests.length !== 1 ? "s" : ""} selected
            </span>
          </div>
        </div>

        {/* Interests Grid */}
        <div className="space-y-8 mb-8">
          {interestCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                {category.title}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {category.interests.map((interest, index) => {
                  const IconComponent = interest.icon;
                  const isSelected = selectedInterests.includes(interest.name);

                  return (
                    <button
                      key={index}
                      onClick={() => handleInterestToggle(interest.name)}
                      className={`p-4 rounded-xl border-2 transition-all duration-300 flex flex-col items-center space-y-2 hover:scale-105 ${
                        isSelected
                          ? "border-blue-500 bg-blue-50 shadow-lg shadow-blue-500/25"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:shadow-md"
                      }`}
                    >
                      <div
                        className={`p-3 rounded-full ${interest.color} shadow-lg`}
                      >
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <span
                        className={`text-sm font-medium text-center ${
                          isSelected ? "text-blue-700" : "text-gray-700"
                        }`}
                      >
                        {interest.name}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                          <Heart className="h-3 w-3 text-white fill-current" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Selected Interests Summary */}
        {selectedInterests.length > 0 && (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-8">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">
              Your Selected Interests
            </h4>
            <div className="flex flex-wrap gap-2">
              {selectedInterests.map((interest, index) => (
                <Badge
                  key={index}
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors"
                  onClick={() => handleInterestToggle(interest)}
                >
                  {interest}
                  <button className="ml-1 hover:bg-blue-300 rounded-full p-0.5">
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 sm:flex-none px-8 py-3 border-gray-300"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
            disabled={selectedInterests.length === 0}
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Pro Tips:</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Choose at least 3-5 interests for better connections</li>
            <li>• Your interests help others find common ground with you</li>
            <li>
              • You can always update these later in your profile settings
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
