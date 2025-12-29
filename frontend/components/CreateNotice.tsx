import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FullScreenLayout } from "./FullScreenLayout";
import { noticeService, CreateNoticeData } from "../services/noticeService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import {
  Upload,
  DollarSign,
  AlertTriangle,
  MapPin,
  Target,
  Megaphone,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function CreateNotice() {
  const navigate = useNavigate();
  const [notice, setNotice] = useState({
    title: "",
    category: "",
    duration: "",
    description: "",
    contact: "",
    urgent: false,
    location: "",
    radius: 5, // Default 5km radius
  });
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);

  // Check if notice is permanent
  const isPermanent = notice.duration === "Permanent";

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await noticeService.getNoticeCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error loading categories:", error);
        // Fallback to hardcoded categories
        setCategories([
          "Buy/Sell",
          "Job Postings",
          "Matrimony",
          "Offers",
          "Lost & Found",
          "Services",
          "Housing",
          "Events",
          "Miscellaneous",
        ]);
      }
    };

    loadCategories();
  }, []);

  const durations = [
    "Permanent",
    "1 day",
    "3 days",
    "1 week",
    "2 weeks",
    "1 month",
  ];

  // Handle duration change and auto-uncheck urgent for permanent notices
  const handleDurationChange = (value: string) => {
    setNotice((prev) => ({
      ...prev,
      duration: value,
      urgent: value === "Permanent" ? false : prev.urgent, // Uncheck urgent for permanent
    }));
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);

      const noticeData: CreateNoticeData = {
        title: notice.title,
        description: notice.description,
        category: notice.category,
        location: notice.location,
        radius: notice.radius,
        contact: notice.contact,
        urgent: notice.urgent,
        duration: notice.duration,
      };

      await noticeService.createNotice(noticeData);
      navigate(ROUTES.NOTICES);
    } catch (error) {
      console.error("Error creating notice:", error);
      alert("Failed to create notice. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullScreenLayout
      title="Create New Notice"
      onClose={() => navigate(ROUTES.NOTICES)}
    >
      <div
        className="relative min-h-screen "
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Enhanced Community Notice Background */}
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1586087475898-590f99d00e33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBub3RpY2UlMjBib2FyZCUyMGFubm91bmNlbWVudHxlbnwxfHx8fDE3NTQ5MTIyNTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Community notice board and announcements"
            className="w-full h-full object-cover opacity-[0.04]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-orange-50/95 via-white/98 to-yellow-50/95" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/98 via-transparent to-white/98" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_0%,_rgba(251,146,60,0.05)_100%)]" />
        </div>

        {/* Content overlay with enhanced animations */}
        <div className="relative z-10 space-y-6 max-w-2xl mx-auto animate-fade-in ">
          {/* Floating particles animation */}
          <div className="absolute inset-0 pointer-events-none">
            <div
              className="absolute top-16 left-8 w-2 h-2 bg-orange-400/20 rounded-full animate-bounce"
              style={{ animationDelay: "0s", animationDuration: "3s" }}
            ></div>
            <div
              className="absolute top-32 right-16 w-1.5 h-1.5 bg-yellow-400/20 rounded-full animate-bounce"
              style={{ animationDelay: "1.5s", animationDuration: "4s" }}
            ></div>
            <div
              className="absolute top-48 left-1/4 w-1 h-1 bg-amber-500/20 rounded-full animate-bounce"
              style={{ animationDelay: "3s", animationDuration: "5s" }}
            ></div>
          </div>

          <Card className="card-enhanced card-cream animate-slide-up hover:shadow-2xl transition-all duration-500 relative backdrop-blur-sm pb-10">
            <CardHeader>
              <CardTitle className="flex items-start justify-between space-x-3 animate-slide-down">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-600 flex items-center justify-center shadow-lg shadow-orange-500/25 animate-pulse">
                    <Megaphone className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <span className="text-2xl">
                      Create New{" "}
                      <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600 bg-clip-text text-transparent font-bold">
                        Notice
                      </span>
                    </span>
                    <p className="text-sm text-gray-600 font-normal mt-1">
                      Share important information with your community
                    </p>
                  </div>
                </div>
                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.NOTICES)}
                  className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                >
                  <X className="h-5 w-5 text-gray-500 hover:text-gray-700" />
                </Button>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <span>Basic Information</span>
                </h3>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Notice Title *
                  </label>
                  <Input
                    value={notice.title}
                    onChange={(e) =>
                      setNotice((prev) => ({ ...prev, title: e.target.value }))
                    }
                    placeholder="e.g. Lost Cat - Orange Tabby"
                    className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-orange-500 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Category *
                  </label>
                  <Select
                    value={notice.category}
                    onValueChange={(value) =>
                      setNotice((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                      {categories.map((category) => (
                        <SelectItem
                          key={category}
                          value={category}
                          className="cursor-pointer"
                        >
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Duration *
                  </label>
                  <Select
                    value={notice.duration}
                    onValueChange={handleDurationChange}
                  >
                    <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                      {durations.map((duration) => (
                        <SelectItem
                          key={duration}
                          value={duration}
                          className="cursor-pointer"
                        >
                          {duration}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Location and Radius Section */}
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                  <div className="h-2 w-2 bg-orange-500 rounded-full"></div>
                  <span>Location & Visibility</span>
                </h3>

                <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/60 p-5 rounded-xl border border-orange-200/50 backdrop-blur-sm">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2 text-orange-600" />
                    Location & Visibility
                  </h4>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Set Notice Location
                      </label>
                      <div className="flex space-x-2">
                        <Input
                          value={notice.location}
                          onChange={(e) =>
                            setNotice((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Enter address or area"
                          className="flex-1 bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-orange-500 rounded-xl"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="px-3 whitespace-nowrap"
                        >
                          <Target className="h-4 w-4 mr-1" />
                          Use Current
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        This helps people find your notice in their local area
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Visibility Radius: {notice.radius} km
                      </label>
                      <div className="px-3">
                        <input
                          type="range"
                          min="1"
                          max="50"
                          value={notice.radius}
                          onChange={(e) =>
                            setNotice((prev) => ({
                              ...prev,
                              radius: parseInt(e.target.value),
                            }))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                          style={{
                            background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                              (notice.radius / 50) * 100
                            }%, #E5E7EB ${
                              (notice.radius / 50) * 100
                            }%, #E5E7EB 100%)`,
                          }}
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>1km</span>
                          <span>25km</span>
                          <span>50km</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Your notice will be visible to people within{" "}
                        {notice.radius}km of the selected location
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Contact Info <span className="text-gray-500">(Optional)</span>
                </label>
                <Input
                  value={notice.contact}
                  onChange={(e) =>
                    setNotice((prev) => ({ ...prev, contact: e.target.value }))
                  }
                  placeholder="Phone, email, or other contact info"
                  className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-orange-500 rounded-xl"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description *
                </label>
                <Textarea
                  value={notice.description}
                  onChange={(e) =>
                    setNotice((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe your notice in detail..."
                  rows={4}
                  className="min-h-24 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-orange-500 rounded-xl resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Media <span className="text-gray-500">(Optional)</span>
                </label>
                <div className="border-2 border-dashed border-orange-300/40 rounded-xl p-8 text-center cursor-pointer hover:border-orange-400/60 transition-all duration-300 bg-gradient-to-br from-orange-50/30 to-amber-50/20">
                  <Upload className="h-10 w-10 mx-auto text-orange-500/70 mb-3" />
                  <p className="text-sm text-gray-600 font-medium">
                    Click to upload images or videos
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, JPG, GIF, MP4 up to 10MB
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="urgent"
                  checked={notice.urgent}
                  onCheckedChange={(checked) =>
                    setNotice((prev) => ({
                      ...prev,
                      urgent: checked as boolean,
                    }))
                  }
                  disabled={isPermanent}
                />
                <label
                  htmlFor="urgent"
                  className="text-sm font-medium flex items-center space-x-2"
                >
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <span>Mark as urgent</span>
                  {isPermanent && (
                    <span className="text-xs text-gray-500">
                      (Not available for permanent notices)
                    </span>
                  )}
                </label>
              </div>

              {isPermanent && (
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 text-blue-800">
                    <div className="h-4 w-4 rounded-full bg-blue-500 flex items-center justify-center">
                      <span className="text-white text-xs font-bold">∞</span>
                    </div>
                    <span className="font-medium">Permanent Notice</span>
                  </div>
                  <p className="text-sm text-blue-700 mt-1">
                    This notice will remain visible indefinitely until manually
                    removed.
                  </p>
                </div>
              )}

              {notice.urgent && !isPermanent && (
                <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                  <div className="flex items-center space-x-2 text-orange-800">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-medium">
                      Urgent Notice Fee: $2.99
                    </span>
                  </div>
                  <p className="text-sm text-orange-700 mt-1">
                    Urgent notices are highlighted and appear at the top of
                    listings.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => navigate(ROUTES.NOTICES)}
                  className="btn-gradient-outline rounded-xl px-6 py-2"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={
                    !notice.title ||
                    !notice.category ||
                    !notice.duration ||
                    !notice.description ||
                    !notice.location
                  }
                  className="btn-gradient rounded-xl px-6 py-2 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-600"
                >
                  Publish Notice
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FullScreenLayout>
  );
}
