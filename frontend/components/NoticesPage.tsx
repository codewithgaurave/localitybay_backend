import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FullScreenLayout } from "./FullScreenLayout";
import { noticeService, Notice } from "../services/noticeService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Megaphone,
  Plus,
  Clock,
  MapPin,
  AlertTriangle,
  MessageSquare,
  TrendingUp,
  ArrowRight,
  BarChart3,
  ShoppingCart,
  Briefcase,
  Heart,
  Gift,
  MoreVertical,
  Filter,
  ChevronDown,
  Home,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShareButton } from "./ShareButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function NoticesPage() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    category: "all",
    duration: "all",
    radius: "all",
  });

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Load notices from API
  useEffect(() => {
    const loadNotices = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await noticeService.getNotices(currentPage, 10, {
          category: filters.category !== "all" ? filters.category : undefined,
          radius: filters.radius ? parseInt(filters.radius) : undefined,
          status: "active",
        });

        setNotices(response.notices);
        setTotalPages(response.pages);
      } catch (err) {
        console.error("Error loading notices:", err);
        setError("Failed to load notices. Please try again.");
        // Fallback to empty array
        setNotices([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotices();
  }, [currentPage, filters.category, filters.radius, filters.duration]);

  // Handle filter changes
  const handleFilterChange = (filterType: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: "all",
      duration: "all",
      radius: "all",
    });
    setCurrentPage(1);
  };

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      filters.category !== "all" ||
      filters.duration !== "all" ||
      filters.radius !== "all"
    );
  };

  const categories = [
    { value: "Buy/Sell", label: "Buy/Sell", icon: ShoppingCart },
    {
      value: "Permanent Local Posts",
      label: "Permanent Local Posts",
      icon: MapPin,
    },
    { value: "Job Postings", label: "Job Postings", icon: Briefcase },
    { value: "Matrimony", label: "Matrimony", icon: Heart },
    { value: "Offers", label: "Offers", icon: Gift },
    { value: "Lost & Found", label: "Lost & Found", icon: AlertTriangle },
    { value: "Services", label: "Services", icon: Briefcase },
    { value: "Housing", label: "Housing", icon: MapPin },
    { value: "Events", label: "Events", icon: Megaphone },
  ];

  // Apply client-side filters for duration (not handled by API)
  const filteredNotices = notices.filter((notice) => {
    // Duration filter
    if (filters.duration === "permanent" && notice.duration !== "Permanent")
      return false;
    if (filters.duration === "temporary" && notice.duration === "Permanent")
      return false;

    return true;
  });

  const getCategoryIcon = (category: string) => {
    const categoryData = categories.find((cat) => cat.value === category);
    return categoryData?.icon || Megaphone;
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Buy/Sell":
        return "bg-green-100 text-green-700 border-green-200";
      case "Job Postings":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "Matrimony":
        return "bg-pink-100 text-pink-700 border-pink-200";
      case "Offers":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "Permanent Local Posts":
        return "bg-purple-100 text-purple-700 border-purple-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  return (
    <FullScreenLayout title="Notices" onClose={() => navigate(ROUTES.HOME)}>
      <div
        className="min-h-screen relative"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Subtle Community Board Background */}
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1920&h=1080&fit=crop"
            alt="Community notices background"
            className="w-full h-full object-cover opacity-[0.03]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/97 via-white/99 to-white/97" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 bg-transparent">
          {/* Fixed Business Growth Card - Mobile Optimized */}
          <div className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
            <Card className="rounded-none border-0 group relative overflow-hidden">
              {/* Background wealth/growth image with overlay */}
              <div className="absolute inset-0">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&h=400&fit=crop"
                  alt="Business growth and success"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/85 via-slate-800/70 to-blue-800/80" />
              </div>

              <CardContent className="relative px-4 py-5">
                <div className="flex items-center justify-between space-x-3">
                  {/* Left side - Icon and text */}
                  <div className="flex items-center space-x-3 flex-1 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-yellow-500 via-orange-500 to-yellow-600 flex items-center justify-center shadow-lg flex-shrink-0">
                      <span className="text-white font-bold text-lg">₹</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-white text-lg leading-tight">
                        Grow Your Business
                      </h3>
                      <p className="text-blue-100 text-sm font-medium mt-0.5 leading-tight">
                        Post ads • Reach local customers
                      </p>
                    </div>
                  </div>

                  {/* Right side - CTA */}
                  <div className="flex-shrink-0">
                    <Button
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white transition-all duration-300 text-sm px-4 py-2.5 font-semibold shadow-lg rounded-xl"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTES.CREATE_ADVERTISEMENT);
                      }}
                    >
                      <span>Create Ad</span>
                      <ArrowRight className="h-4 w-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>

                {/* Bottom info for mobile */}
                <div className="mt-3 pt-3 border-t border-white/20">
                  <div className="flex items-center justify-center space-x-6 text-blue-100">
                    <div className="flex items-center space-x-1.5">
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm font-medium">₹150/day</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Instant Reach</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm font-medium">Local Focus</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Full Screen Feed - No Padding */}
          <div className="space-y-0">
            {/* Header Controls - Minimal, no categories dropdown */}
            <div className="p-3 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                {/* Simple filter indicator */}
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-lg font-bold text-gray-800">
                    Live Notices
                  </span>
                </div>

                {/* Right side controls */}
                <div className="flex items-center space-x-2">
                  {/* Enhanced Filters Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="default"
                        className="text-sm px-4 py-2"
                      >
                        <Filter className="h-4 w-4 mr-2" />
                        Filter Posts
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-80 bg-white/95"
                    >
                      <div className="p-4 space-y-4">
                        {/* Categories Filter with Icons */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Categories
                          </label>
                          <Select
                            value={filters.category}
                            onValueChange={(value: string) =>
                              setFilters((prev) => ({
                                ...prev,
                                category: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All Categories" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95">
                              <SelectItem value="all">
                                All Categories
                              </SelectItem>
                              {categories.map((cat) => {
                                const IconComponent = getCategoryIcon(
                                  cat.value
                                );
                                return (
                                  <SelectItem key={cat.value} value={cat.value}>
                                    <div className="flex items-center space-x-2">
                                      <IconComponent className="h-4 w-4" />
                                      <span>{cat.label}</span>
                                    </div>
                                  </SelectItem>
                                );
                              })}
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Time Filter */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Time
                          </label>
                          <Select
                            value={filters.duration}
                            onValueChange={(value: string) =>
                              setFilters((prev) => ({
                                ...prev,
                                duration: value,
                              }))
                            }
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="All Time" />
                            </SelectTrigger>
                            <SelectContent className="bg-white/95">
                              <SelectItem value="all">All Time</SelectItem>
                              <SelectItem value="hour">Last Hour</SelectItem>
                              <SelectItem value="day">Last Day</SelectItem>
                              <SelectItem value="week">Last Week</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        {/* Location and Radius Slider */}
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Location & Radius
                          </label>
                          <div className="space-y-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full justify-start"
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              Set Location
                            </Button>

                            <div>
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-xs text-gray-600">
                                  Radius:{" "}
                                  {filters.radius === "all"
                                    ? "Any Distance"
                                    : `${filters.radius} km`}
                                </span>
                              </div>
                              <div className="px-2">
                                <input
                                  type="range"
                                  min="1"
                                  max="50"
                                  value={
                                    filters.radius === "all"
                                      ? 50
                                      : filters.radius
                                  }
                                  onChange={(e) =>
                                    setFilters((prev) => ({
                                      ...prev,
                                      radius: e.target.value,
                                    }))
                                  }
                                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, #3B82F6 0%, #3B82F6 ${
                                      ((filters.radius === "all"
                                        ? 50
                                        : parseInt(filters.radius)) /
                                        50) *
                                      100
                                    }%, #E5E7EB ${
                                      ((filters.radius === "all"
                                        ? 50
                                        : parseInt(filters.radius)) /
                                        50) *
                                      100
                                    }%, #E5E7EB 100%)`,
                                  }}
                                />
                                <div className="flex justify-between text-xs text-gray-400 mt-1">
                                  <span>1km</span>
                                  <span>25km</span>
                                  <span>50km+</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  {/* Create Notice Button - Compact */}
                  <Button
                    onClick={() => navigate(ROUTES.CREATE_NOTICE)}
                    size="sm"
                    className="text-xs px-3 py-1"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Post
                  </Button>
                </div>
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading notices...</span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="text-red-500 mb-4">{error}</div>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            )}

            {/* Instagram-Style Feed - Full Screen */}
            {!isLoading && !error && (
              <div className="divide-y divide-gray-200">
                {filteredNotices.map((notice, index) => {
                  const CategoryIcon = getCategoryIcon(notice.category);
                  return (
                    <article
                      key={notice._id}
                      className="bg-white transition-all duration-300 animate-fade-in"
                      style={{ animationDelay: `${(index + 1) * 0.05}s` }}
                    >
                      {/* Post Header - User Info */}
                      <div className="p-4 pb-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1 min-w-0">
                            {/* User Avatar */}
                            <div className="relative flex-shrink-0">
                              <ImageWithFallback
                                src={
                                  notice.createdBy.avatar ||
                                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
                                }
                                alt={notice.createdBy.name}
                                className="w-11 h-11 rounded-full object-cover border-2 border-gray-200"
                              />
                              {false && (
                                <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center border-2 border-white">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                </div>
                              )}
                            </div>

                            {/* User Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2">
                                <h4 className="font-semibold text-gray-900 text-sm truncate">
                                  {notice.createdBy.name}
                                </h4>
                                {false && (
                                  <div className="w-4 h-4 text-blue-500 flex-shrink-0">
                                    <svg
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path
                                        fillRule="evenodd"
                                        d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.238.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clipRule="evenodd"
                                      />
                                    </svg>
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center flex-wrap text-xs text-gray-500 mt-0.5 gap-1">
                                <span className="truncate max-w-24 sm:max-w-none">
                                  @{notice.createdBy.email.split("@")[0]}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="truncate max-w-20 sm:max-w-none">
                                  {new Date(
                                    notice.createdAt
                                  ).toLocaleDateString()}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <div className="flex items-center space-x-1 min-w-0">
                                  <MapPin className="h-3 w-3 flex-shrink-0" />
                                  <span className="truncate max-w-24 sm:max-w-32">
                                    {notice.location}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Action buttons */}
                          <div className="flex items-center space-x-1">
                            <ShareButton
                              title={notice.title}
                              description={notice.description}
                              url={`${window.location.origin}/notices/${notice._id}`}
                              type="notice"
                              size="sm"
                              variant="ghost"
                              className="text-gray-400 hover:text-gray-600 p-2"
                            />

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-gray-400 hover:text-gray-600 p-2 rounded-lg"
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-48 bg-white/95 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl"
                              >
                                <DropdownMenuItem className="cursor-pointer">
                                  Save Post
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Report Post
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Hide Post
                                </DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer">
                                  Copy Link
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>

                      {/* Post Title and Category */}
                      <div className="px-4 pb-3">
                        <div className="flex items-start justify-between space-x-3">
                          <h3 className="font-semibold text-gray-900 text-base leading-tight flex-1">
                            {notice.title}
                          </h3>
                          <div className="flex items-center space-x-2 flex-shrink-0">
                            {notice.urgent && (
                              <Badge
                                variant="destructive"
                                className="flex items-center space-x-1 text-xs px-2 py-1"
                              >
                                <AlertTriangle className="h-3 w-3" />
                                <span>Urgent</span>
                              </Badge>
                            )}
                            {notice.duration === "Permanent" && (
                              <Badge
                                variant="outline"
                                className="bg-purple-50 text-purple-700 border-purple-200 text-xs px-2 py-1"
                              >
                                Permanent
                              </Badge>
                            )}
                            <Badge
                              variant="secondary"
                              className={`${getCategoryColor(
                                notice.category
                              )} flex items-center space-x-1 text-xs px-2 py-1`}
                            >
                              <CategoryIcon className="h-3 w-3" />
                              <span>{notice.category}</span>
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Post Image (if exists) - Not available in API */}

                      {/* Post Actions Bar */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-6">
                            <button className="flex items-center space-x-2 text-gray-700 hover:text-red-500 transition-colors duration-200">
                              <Heart className="h-6 w-6" />
                              <span className="font-medium text-sm">0</span>
                            </button>

                            <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 transition-colors duration-200">
                              <MessageSquare className="h-6 w-6" />
                              <span className="font-medium text-sm">0</span>
                            </button>
                          </div>

                          <div className="text-xs text-gray-400 font-medium">
                            ID: {notice._id}
                          </div>
                        </div>
                      </div>

                      {/* Post Content */}
                      <div className="px-4 py-3">
                        <p className="text-gray-800 leading-relaxed text-sm mb-3">
                          {notice.description}
                        </p>

                        {notice.contact && (
                          <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                            <p className="text-sm font-medium text-blue-700 flex items-center">
                              <MessageSquare className="h-4 w-4 mr-2 flex-shrink-0" />
                              <span>{notice.contact}</span>
                            </p>
                          </div>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {!isLoading && !error && filteredNotices.length === 0 && (
              <div className="text-center py-20 px-6">
                <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center mx-auto mb-6">
                  <Megaphone className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  No notices found
                </h3>
                <p className="text-gray-500 text-center max-w-sm mx-auto mb-6">
                  Try adjusting your filters or be the first to post a notice in
                  your community.
                </p>
                <Button
                  onClick={() => navigate(ROUTES.CREATE_NOTICE)}
                  className="btn-gradient px-6 py-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Notice
                </Button>
              </div>
            )}

            {/* Pagination */}
            {!isLoading && !error && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-2 py-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FullScreenLayout>
  );
}
