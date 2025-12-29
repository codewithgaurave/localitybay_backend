import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Search,
  MapPin,
  Star,
  Shield,
  Plus,
  Phone,
  Mail,
  MessageSquare,
  Navigation,
  List,
  Map,
  ChevronDown,
  Filter,
  Briefcase,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";



export function ServicesPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [location, setLocation] = useState("Current Location");
  const [distance, setDistance] = useState("10km");
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [filters, setFilters] = useState({
    verifiedOnly: false,
  });

  const serviceCategories = [
    "Home Services",
    "Personal Care",
    "Tech Support",
    "Tutoring",
    "Pet Care",
    "Fitness Training",
    "Photography",
    "Cleaning",
    "Repairs",
    "Consulting",
    "Beauty & Wellness",
    "Automotive",
    "Legal Services",
    "Financial Services",
  ];

  const mockProviders = [
    {
      id: "SP001",
      name: "Mike Johnson",
      services: ["Plumbing", "Home Repairs"],
      cost: "₹1,500-2,500/hour",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      verified: true,
      rating: 4.8,
      reviews: 127,
      experience: "8 years",
      distance: "2.3km",
      contact: {
        phone: "+91-98765-43210",
        email: "mike@repairs.com",
      },
    },
    {
      id: "SP002",
      name: "Sarah Photography",
      services: ["Wedding Photography", "Portrait Sessions"],
      cost: "₹8,000-20,000/session",
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b5b65b75?w=100&h=100&fit=crop&crop=face",
      verified: true,
      rating: 4.9,
      reviews: 89,
      experience: "5 years",
      distance: "1.8km",
      contact: {
        phone: "+91-98765-43211",
        email: "sarah@photography.com",
      },
    },
    {
      id: "SP003",
      name: "David Tech Solutions",
      services: ["Computer Repair", "Tech Support"],
      cost: "₹1,200-2,000/hour",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      verified: false,
      rating: 4.6,
      reviews: 45,
      experience: "3 years",
      distance: "3.5km",
      contact: {
        phone: "+91-98765-43212",
      },
    },
    {
      id: "SP004",
      name: "Priya Wellness Spa",
      services: ["Massage Therapy", "Beauty Treatments"],
      cost: "₹800-1,500/session",
      photo:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
      verified: true,
      rating: 4.7,
      reviews: 156,
      experience: "6 years",
      distance: "4.2km",
      contact: {
        phone: "+91-98765-43213",
        email: "priya@wellness.com",
      },
    },
  ];

  const filteredProviders = mockProviders.filter((provider) => {
    if (filters.verifiedOnly && !provider.verified) return false;
    if (
      selectedCategory &&
      !provider.services.some((service) =>
        service.toLowerCase().includes(selectedCategory.toLowerCase())
      )
    )
      return false;
    if (
      searchQuery &&
      !provider.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !provider.services.some((service) =>
        service.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ) {
      return false;
    }
    return true;
  });

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setSearchQuery(category);
    setShowCategoryDropdown(false);
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Subtle Professional Services Background */}
      <div className="fixed inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&h=1080&fit=crop"
          alt="Professional services background"
          className="w-full h-full object-cover opacity-[0.025]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/98 via-white/99 to-white/98" />
      </div>

      {/* Content overlay */}
      <div className="relative z-10 bg-transparent">
        {/* Top Section - Headline and Service Messages Button */}
        <div className="p-4 bg-white/80 backdrop-blur-sm border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 animate-slide-down">
              Discover Trusted{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                Local Services
              </span>
            </h1>

            <Button
              onClick={() => navigate(ROUTES.SERVICE_MESSAGES)}
              variant="outline"
              size="sm"
              className="rounded-full p-2 animate-fade-in hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: "0.2s" }}
            >
              <MessageSquare className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Search Services Section */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowCategoryDropdown(true)}
              placeholder="Search services..."
              className="pl-10 pr-4 py-3 text-base rounded-xl"
            />
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />

            {/* Category Dropdown */}
            {showCategoryDropdown && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-50 max-h-60 overflow-y-auto">
                {serviceCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-700">{category}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Location and Distance Filters */}
        <div className="p-4 bg-white border-b border-gray-100">
          <div className="flex items-center space-x-3">
            {/* Set Location */}
            <div className="flex-1">
              <Button
                variant="outline"
                className="w-full justify-start rounded-xl h-12"
              >
                <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-gray-700">{location}</span>
              </Button>
            </div>

            {/* Set Distance */}
            <Button variant="outline" className="rounded-xl h-12 px-6">
              <Navigation className="h-4 w-4 mr-2 text-gray-500" />
              <span className="text-gray-700">{distance}</span>
            </Button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-white border-b border-gray-100 space-y-3">
          {/* Register as Service Provider */}
          <Button
            onClick={() => navigate(ROUTES.REGISTER_SERVICE)}
            className="w-full btn-gradient rounded-xl h-12"
          >
            <Plus className="h-4 w-4 mr-2" />
            Register as Service Provider
          </Button>

          {/* View List / View Map Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verified-only"
                checked={filters.verifiedOnly}
                onChange={(e) =>
                  setFilters((prev) => ({
                    ...prev,
                    verifiedOnly: e.target.checked,
                  }))
                }
                className="rounded accent-blue-500"
              />
              <label
                htmlFor="verified-only"
                className="text-sm font-medium text-gray-700"
              >
                Verified Providers Only
              </label>
            </div>

            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <Button
                variant={viewMode === "list" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("list")}
                className="rounded-none px-4"
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("map")}
                className="rounded-none px-4"
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
            </div>
          </div>
        </div>

        {/* Tagline */}
        <div className="px-4 pt-3 pb-1">
          <p className="text-sm text-gray-600 text-center">
            Connect with local service experts
          </p>
        </div>

        {/* Service Providers List/Map */}
        <div className="p-4">
          {viewMode === "list" ? (
            <div className="space-y-3">
              {filteredProviders.map((provider) => (
                <Card
                  key={provider.id}
                  className="hover:shadow-md transition-shadow border border-gray-200 rounded-xl"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Avatar className="h-14 w-14 border-2 border-gray-100">
                        <AvatarImage src={provider.photo} alt={provider.name} />
                        <AvatarFallback>
                          {provider.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900 truncate">
                              {provider.name}
                            </h3>
                            {provider.verified && (
                              <div className="bg-blue-500 rounded-full p-1">
                                <Shield className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <span className="text-xs text-gray-500">
                            {provider.distance}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1 mb-2">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium text-gray-700">
                            {provider.rating}
                          </span>
                          <span className="text-xs text-gray-500">
                            ({provider.reviews})
                          </span>
                          <span className="text-xs text-gray-500">
                            • {provider.experience}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1 mb-2">
                          {provider.services.map((service) => (
                            <Badge
                              key={service}
                              variant="secondary"
                              className="text-xs px-2 py-1"
                            >
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-blue-600">
                            {provider.cost}
                          </span>
                          <div className="flex items-center space-x-2">
                            {provider.contact.phone && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5"
                              >
                                <Phone className="h-3 w-3" />
                              </Button>
                            )}
                            {provider.contact.email && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1.5"
                              >
                                <Mail className="h-3 w-3" />
                              </Button>
                            )}
                            <Button
                              size="sm"
                              className="text-xs px-3 py-1"
                              onClick={() => navigate(ROUTES.SERVICE_MESSAGES)}
                            >
                              Contact
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border border-gray-200 rounded-xl">
              <CardContent className="p-6">
                <div className="bg-gradient-to-br from-blue-50 to-slate-50 rounded-xl h-80 flex items-center justify-center border border-blue-100">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-blue-500 mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2 text-gray-800">
                      Map View
                    </h3>
                    <p className="text-gray-600">
                      Service providers would be shown on an interactive map
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {filteredProviders.length === 0 && (
            <div className="text-center py-12">
              <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">
                No service providers found
              </h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your filters or be the first to register as a
                service provider.
              </p>
              <Button
                onClick={() => navigate(ROUTES.REGISTER_SERVICE)}
                className="btn-gradient px-6 py-3"
              >
                <Plus className="h-4 w-4 mr-2" />
                Register as Provider
              </Button>
            </div>
          )}
        </div>

        {/* Click outside to close dropdown */}
        {showCategoryDropdown && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowCategoryDropdown(false)}
          />
        )}
      </div>
    </div>
  );
}
