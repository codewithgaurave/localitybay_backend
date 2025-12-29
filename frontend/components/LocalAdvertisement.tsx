import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Upload, MapPin, Clock, Image as ImageIcon, X } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";



export function LocalAdvertisement() {
  const navigate = useNavigate();
  const [adData, setAdData] = useState({
    title: "",
    description: "",
    image: null as File | null,
    duration: [7], // days
    radius: [5], // km
    location: "Downtown Toronto, ON",
    category: "",
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Calculate price based on duration and radius
  const calculatePrice = () => {
    const basePricePerDay = 150; // Changed from $2 to ₹150
    const radiusMultiplier = adData.radius[0] / 5; // Base radius is 5km
    const duration = adData.duration[0];
    return Math.round(basePricePerDay * duration * radiusMultiplier);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAdData((prev) => ({ ...prev, image: file }));

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePostAd = () => {
    console.log("Posting advertisement:", adData);
    console.log("Price:", calculatePrice());
    // Reset form
    setAdData({
      title: "",
      description: "",
      image: null,
      duration: [7],
      radius: [5],
      location: "Downtown Toronto, ON",
      category: "",
    });
    setImagePreview(null);
  };

  return (
    <div
      className="relative min-h-screen"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Subtle Business/Marketing Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&h=1080&fit=crop"
          alt="Business marketing background"
          className="w-full h-full object-cover opacity-[0.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/98 via-white/99 to-white/98" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 space-y-6">
        <Card className="card-enhanced card-cream animate-slide-up">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-3 animate-slide-down">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center">
                  <span className="text-white text-lg font-bold">₹</span>
                </div>
                <span>
                  Local{" "}
                  <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                    Advertisement
                  </span>
                </span>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  Post Your Ad
                </Badge>
              </CardTitle>

              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.NOTICES)}
                className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Title and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Input
                placeholder="Ad title..."
                value={adData.title}
                onChange={(e) =>
                  setAdData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
              />
              <Select
                value={adData.category}
                onValueChange={(value: string) =>
                  setAdData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl ">
                  <SelectItem value="services" className="cursor-pointer">
                    Services
                  </SelectItem>
                  <SelectItem value="products" className="cursor-pointer">
                    Products
                  </SelectItem>
                  <SelectItem value="events" className="cursor-pointer">
                    Events
                  </SelectItem>
                  <SelectItem value="housing" className="cursor-pointer">
                    Housing
                  </SelectItem>
                  <SelectItem value="jobs" className="cursor-pointer">
                    Jobs
                  </SelectItem>
                  <SelectItem value="other" className="cursor-pointer">
                    Other
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <Textarea
              placeholder="Describe your ad..."
              value={adData.description}
              onChange={(e) =>
                setAdData((prev) => ({ ...prev, description: e.target.value }))
              }
              className="min-h-16 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none"
            />

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">
                Upload Image
              </label>
              <div className="flex items-center space-x-3">
                <div className="flex-1">
                  <label className="flex items-center justify-center w-full h-20 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-300 cursor-pointer bg-white/60">
                    <div className="text-center">
                      {imagePreview ? (
                        <div className="relative h-16 w-24">
                          <ImageWithFallback
                            src={imagePreview}
                            alt="Ad preview"
                            className="h-full w-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-1">
                          <ImageIcon className="h-6 w-6 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            Upload photo
                          </span>
                        </div>
                      )}
                    </div>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            </div>

            {/* Location and Controls */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Location
                </label>
                <div className="flex space-x-2">
                  <Input
                    value={adData.location}
                    onChange={(e) =>
                      setAdData((prev) => ({
                        ...prev,
                        location: e.target.value,
                      }))
                    }
                    className="flex-1 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl px-2"
                  >
                    <MapPin className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Duration: {adData.duration[0]} days
                </label>
                <Slider
                  value={adData.duration}
                  onValueChange={(value: number[]) =>
                    setAdData((prev) => ({ ...prev, duration: value }))
                  }
                  max={30}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Radius: {adData.radius[0]}km
                </label>
                <Slider
                  value={adData.radius}
                  onValueChange={(value: number[]) =>
                    setAdData((prev) => ({ ...prev, radius: value }))
                  }
                  max={50}
                  min={1}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Price and Post Button */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-600">
                    ₹{calculatePrice()}
                  </div>
                  <div className="text-xs text-gray-500">Total cost</div>
                </div>
                <div className="text-xs text-gray-500">
                  <div>Duration: {adData.duration[0]} days</div>
                  <div>Radius: {adData.radius[0]}km</div>
                </div>
              </div>

              <Button
                onClick={handlePostAd}
                disabled={!adData.title || !adData.description}
                className="rounded-xl px-6"
              >
                <Upload className="h-4 w-4 mr-2" />
                Post Ad
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
