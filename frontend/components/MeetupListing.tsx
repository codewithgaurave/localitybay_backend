import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import { getMeetups, Meetup, MeetupFilters } from "../services/meetupService";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Slider } from "./ui/slider";
import {
  Plus,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  CreditCard,
  Lock,
  Search,
  MoreVertical,
  Navigation,
  Filter,
  Check,
  Crown,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShareButton } from "./ShareButton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function MeetupListing() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [searchParams] = useSearchParams();

  // Initialize filters from URL parameters
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "all",
    date: "all",
    price: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [location, setLocation] = useState(searchParams.get("location") || ""); // From URL or default
  const [radius, setRadius] = useState([30]); // Default from homepage
  const [showLocationPicker, setShowLocationPicker] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [userHasChangedFilters, setUserHasChangedFilters] = useState(false);

  // API state
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
  });

  // Fetch meetups from API
  const fetchMeetups = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const apiFilters: MeetupFilters = {
        page,
        limit: pagination.limit,
        search: searchQuery || undefined,
        category: filters.category !== "all" ? filters.category : undefined,
        type: filters.price !== "all" ? (filters.price as any) : undefined,
        visibilityLocation: location || undefined,
        visibilityRadius: radius[0] || undefined,
      };

      const response = await getMeetups(apiFilters);
      setMeetups(response.data);
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
        limit: response.limit,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch meetups");
      console.error("Error fetching meetups:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle URL parameter changes only if user hasn't manually changed filters
  useEffect(() => {
    if (!userHasChangedFilters) {
      const categoryParam = searchParams.get("category");
      const locationParam = searchParams.get("location");

      if (categoryParam && categoryParam !== filters.category) {
        setFilters((prev) => ({ ...prev, category: categoryParam }));
      }

      if (locationParam && locationParam !== location) {
        setLocation(locationParam);
      }
    }
  }, [searchParams, userHasChangedFilters, filters.category, location]);

  // Load meetups on component mount and when filters change
  useEffect(() => {
    fetchMeetups(1);
  }, [searchQuery, filters, location, radius]);

  const categories = [
    "Photography",
    "Business",
    "Technology",
    "Health",
    "Sports",
    "Arts",
    "Food",
    "Travel",
  ];

  const getTypeColor = (type: string) => {
    switch (type) {
      case "free":
        return "bg-green-100 text-green-700 border-green-200";
      case "paid":
        return "bg-gradient-to-r from-purple-100 via-indigo-100 to-purple-100 text-purple-700 border-purple-200";
      case "invite-only":
        return "bg-gradient-to-r from-black via-gray-900 to-black text-yellow-400 border-yellow-400/30";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "free":
        return <Star className="h-3 w-3" />;
      case "paid":
        return <CreditCard className="h-3 w-3" />;
      case "invite-only":
        return <Crown className="h-3 w-3 text-yellow-400" />;
      default:
        return null;
    }
  };

  // Since filtering is now handled by the API, we can use the meetups directly
  const filteredMeetups = meetups;

  const handleLocationSave = () => {
    setShowLocationPicker(false);
    setUserHasChangedFilters(true);
    console.log("Location updated:", location, "Radius:", radius[0]);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    setUserHasChangedFilters(true);
  };

  const handleLocationChange = (newLocation: string) => {
    setLocation(newLocation);
    setUserHasChangedFilters(true);
  };

  const clearAllFilters = () => {
    setFilters({ category: "all", date: "all", price: "all" });
    setUserHasChangedFilters(true);
    setShowFilters(false);
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.category !== "all") count++;
    if (filters.date !== "all") count++;
    if (filters.price !== "all") count++;
    return count;
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Urbanist', sans-serif" }}>
      <div className="mx-auto text-center space-x-1 text-gray-600">
        <h1 className="text-2xl font-bold text-gray-900 animate-slide-down">
          Discover Amazing{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
            Meetups
          </span>
        </h1>
        <span>Connect with like-minded people in your area</span>
      </div>

      {/* Search and Create Bar */}
      <Card className="card-enhanced card-cream animate-slide-up">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetups..."
                className="pl-10 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
              />
            </div>

            {/* Create Meetup Button - Just Plus Icon */}
            <Button
              onClick={() => navigate(ROUTES.CREATE_MEETUP)}
              className="rounded-xl p-3"
              size="default"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Consolidated Filters Card */}
      <Card className="card-enhanced card-cream animate-slide-up">
        <CardContent className="p-4 space-y-4">
          {/* Filter Controls */}
          <div className="flex items-center space-x-4">
            {/* Consolidated Filters Button */}
            <Popover open={showFilters} onOpenChange={setShowFilters}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl relative"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  <span>Filters & Options</span>
                  {getActiveFiltersCount() > 0 && (
                    <Badge
                      variant="secondary"
                      className="ml-2 bg-blue-500 text-white text-xs h-5 w-5 rounded-full p-0 flex items-center justify-center"
                    >
                      {getActiveFiltersCount()}
                    </Badge>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-80 p-4 bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl"
                align="start"
              >
                <div className=" space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-gray-800">
                      Filter Options
                    </h4>
                    {getActiveFiltersCount() > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearAllFilters}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  {/* Category Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Category
                    </label>
                    <Select
                      value={filters.category}
                      onValueChange={(value: string) =>
                        handleFilterChange({ ...filters, category: value })
                      }
                    >
                      <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Date Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Date
                    </label>
                    <Select
                      value={filters.date}
                      onValueChange={(value: string) =>
                        handleFilterChange({ ...filters, date: value })
                      }
                    >
                      <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl">
                        <SelectValue placeholder="Select date range" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                        <SelectItem value="all">Any Date</SelectItem>
                        <SelectItem value="today">Today</SelectItem>
                        <SelectItem value="tomorrow">Tomorrow</SelectItem>
                        <SelectItem value="weekend">This Weekend</SelectItem>
                        <SelectItem value="week">This Week</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Type
                    </label>
                    <Select
                      value={filters.price}
                      onValueChange={(value: string) =>
                        handleFilterChange({ ...filters, price: value })
                      }
                    >
                      <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                        <SelectItem value="all">Any Type</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="invite-only">Invite Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-2 border-t border-gray-200">
                    <Button
                      onClick={() => setShowFilters(false)}
                      className="w-full rounded-xl"
                      size="sm"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Apply Filters
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            {/* Location Picker */}
            <Dialog
              open={showLocationPicker}
              onOpenChange={setShowLocationPicker}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl justify-start text-left flex-1"
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  <span className="truncate">{location}</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Navigation className="h-5 w-5 text-blue-600" />
                    <span>Choose Location & Radius</span>
                  </DialogTitle>
                  <DialogDescription>
                    Select your preferred location and search radius for finding
                    meetups in your area.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Location
                    </label>
                    <Input
                      value={location}
                      onChange={(e) => handleLocationChange(e.target.value)}
                      placeholder="Enter location"
                      className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-gray-700">
                      Search Radius: {radius[0]}km
                    </label>
                    <Slider
                      value={radius}
                      onValueChange={setRadius}
                      max={50}
                      min={1}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>1km</span>
                      <span>50km</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowLocationPicker(false)}
                      className="flex-1 rounded-xl"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleLocationSave}
                      className="flex-1 rounded-xl"
                    >
                      <MapPin className="h-4 w-4 mr-2" />
                      Update Location
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Active Filters Display */}
          {getActiveFiltersCount() > 0 && (
            <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-600">
                Active filters:
              </span>
              {filters.category !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700 border-blue-200"
                >
                  {filters.category}
                </Badge>
              )}
              {filters.date !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700 border-green-200"
                >
                  {filters.date}
                </Badge>
              )}
              {filters.price !== "all" && (
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700 border-purple-200"
                >
                  {filters.price}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="card-enhanced card-cream animate-fade-in">
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center mx-auto mb-4 animate-pulse">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Loading meetups...
            </h3>
            <p className="text-muted-foreground">
              Please wait while we fetch the latest meetups for you.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="card-enhanced card-cream animate-fade-in">
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-red-600 via-red-700 to-red-800 flex items-center justify-center mx-auto mb-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              Error loading meetups
            </h3>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={() => fetchMeetups(1)} className="rounded-xl">
              Try Again
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Meetups Grid */}
      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredMeetups.map((meetup, index) => (
            <Card
              key={meetup._id}
              className="card-enhanced card-cream animate-slide-up group cursor-pointer relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Share and More Options */}
              <div className="absolute top-4 right-4 z-10 flex items-center space-x-2">
                <ShareButton
                  title={meetup.title}
                  description={meetup.description}
                  url={`${window.location.origin}/meetups/${meetup._id}`}
                  type="meetup"
                  size="sm"
                  variant="ghost"
                  className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="bg-white/90 backdrop-blur-sm border-white/50 hover:bg-white text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-lg"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 bg-white/95 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl"
                  >
                    <DropdownMenuItem
                      onClick={() => navigate(ROUTES.MEETUP_DETAIL(meetup._id))}
                    >
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem>Report Event</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <div
                className="aspect-video relative overflow-hidden rounded-t-xl"
                onClick={() => navigate(ROUTES.MEETUP_DETAIL(meetup._id))}
              >
                <ImageWithFallback
                  src={
                    meetup.image ||
                    "https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop&crop=center&q=80"
                  }
                  alt={meetup.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute top-4 left-4">
                  <Badge
                    variant="secondary"
                    className={`${getTypeColor(
                      meetup.type
                    )} backdrop-blur-sm flex items-center space-x-1 shadow-lg ${
                      meetup.type === "invite-only"
                        ? "shadow-yellow-400/20"
                        : ""
                    }`}
                  >
                    {getTypeIcon(meetup.type)}
                    <span
                      className={
                        meetup.type === "invite-only" ? "font-bold" : ""
                      }
                    >
                      {meetup.type === "free"
                        ? "Free"
                        : meetup.type === "paid"
                        ? meetup.price || "Paid"
                        : "Invite Only"}
                    </span>
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-lg p-3 border border-blue-100">
                    <h3 className="font-semibold text-gray-800 mb-1">
                      {meetup.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Calendar className="h-3 w-3" />
                        <span>
                          {new Date(meetup.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Users className="h-3 w-3" />
                        <span>
                          {meetup.currentAttendees}/{meetup.maxAttendees || "∞"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <CardContent
                className="p-4 space-y-3"
                onClick={() => navigate(ROUTES.MEETUP_DETAIL(meetup._id))}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {meetup.meetupLocation}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">
                      {meetup.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {meetup.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-blue-100">
                      <AvatarImage
                        src={
                          typeof meetup.creator === "object"
                            ? meetup.creator.avatar
                            : undefined
                        }
                        alt={
                          typeof meetup.creator === "object"
                            ? meetup.creator.name
                            : "Host"
                        }
                      />
                      <AvatarFallback>
                        {typeof meetup.creator === "object"
                          ? meetup.creator.name[0]
                          : "H"}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium text-gray-800">
                        {typeof meetup.creator === "object"
                          ? meetup.creator.name
                          : "Host"}
                      </p>
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs text-gray-600">4.8</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200 hover:border-blue-300"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(ROUTES.MEETUP_DETAIL(meetup._id));
                      }}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className={`flex-1 rounded-lg ${
                        meetup.type === "invite-only"
                          ? "bg-gradient-to-r from-yellow-50 to-amber-50 hover:from-yellow-100 hover:to-amber-100 text-amber-800 border-amber-200 hover:border-amber-300"
                          : meetup.type === "paid"
                          ? "bg-gradient-to-r from-purple-50 to-indigo-50 hover:from-purple-100 hover:to-indigo-100 text-purple-800 border-purple-200 hover:border-purple-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-300"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (!isAuthenticated) {
                          navigate(ROUTES.LOGIN);
                          return;
                        }
                        navigate(ROUTES.MEETUP_DETAIL(meetup._id));
                      }}
                    >
                      {meetup.type === "invite-only"
                        ? "Request to Join"
                        : meetup.type === "paid"
                        ? "Join Meetup"
                        : "Join Free"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && !error && pagination.totalPages > 1 && (
        <Card className="card-enhanced card-cream animate-slide-up">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                {Math.min(
                  pagination.currentPage * pagination.limit,
                  pagination.total
                )}{" "}
                of {pagination.total} meetups
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchMeetups(pagination.currentPage - 1)}
                  disabled={pagination.currentPage === 1}
                  className="rounded-xl"
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchMeetups(pagination.currentPage + 1)}
                  disabled={pagination.currentPage === pagination.totalPages}
                  className="rounded-xl"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && !error && filteredMeetups.length === 0 && (
        <Card className="card-enhanced card-cream animate-fade-in">
          <CardContent className="text-center py-12">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300 shadow-lg">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              No meetups found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms to find more meetups.
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button
                onClick={() => {
                  setSearchQuery("");
                  setFilters({ category: "all", date: "all", price: "all" });
                }}
                variant="outline"
                className="rounded-xl"
              >
                Clear Filters
              </Button>
              <Button
                onClick={() => navigate(ROUTES.CREATE_MEETUP)}
                className="rounded-xl"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Meetup
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
