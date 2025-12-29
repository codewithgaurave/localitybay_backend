import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Slider } from "./ui/slider";
import { Textarea } from "./ui/textarea";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";
import { Separator } from "./ui/separator";
import {
  MapPin,
  Users,
  MessageSquare,
  Filter,
  Plus,
  Calendar,
  Clock,
  Star,
  Shield,
  Crown,
  Search,
  EyeOff,
  ChevronLeft,
  ChevronRight,
  Dumbbell,
  Heart,
  Coffee,
  Plane,
  UserCheck,
  TrendingUp,
  Navigation,
  Phone,
  Mail,
  Camera,
  Award,
  Zap,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Loading, CardSkeleton, MapSkeleton } from "./ui/loading";
import { FullScreenMap } from "./FullScreenMap";
import { SimpleMap } from "./SimpleMap";
// Using a Google Maps-style image for the interactive map section
const mapImage =
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop&crop=center&q=80";

interface User {
  id: number;
  userId: string;
  name: string;
  age: number;
  distance: string;
  status: "online" | "offline";
  photo: string;
  interests: string[];
  verified: boolean;
  premium: boolean;
  bio?: string;
  profession?: string;
  location?: string;
  joinDate?: string;
  mutualFriends?: number;
  rating?: number;
  badges?: string[];
}

export function HomePage() {
  const navigate = useNavigate();
  const [location, setLocation] = useState("Connaught Place, New Delhi");
  const [interestSearch, setInterestSearch] = useState("");
  const [message, setMessage] = useState("");
  const [filters, setFilters] = useState({
    onlineOnly: false,
    hideProfile: false,
  });
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isUserCardOpen, setIsUserCardOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFullScreenMapOpen, setIsFullScreenMapOpen] = useState(false);

  const carouselRef = useRef<HTMLDivElement>(null);

  const mockUsers: User[] = [
    {
      id: 1,
      name: "Arjun",
      userId: "@arjun",
      age: 28,
      distance: "0.8km",
      status: "online",
      photo:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      interests: ["Photography", "Hiking"],
      verified: true,
      premium: false,
      bio: "Travel photographer & adventure enthusiast. Love exploring new places and meeting like-minded people!",
      profession: "Photographer",
      location: "Connaught Place",
      joinDate: "March 2023",
      mutualFriends: 5,
      rating: 4.8,
      badges: ["Explorer", "Local Guide"],
    },
    {
      id: 2,
      name: "Priya",
      userId: "@priya",
      age: 34,
      distance: "1.2km",
      status: "offline",
      photo:
        "https://images.unsplash.com/photo-1494790108755-2616b5b65b75?w=100&h=100&fit=crop&crop=face",
      interests: ["Tech", "Gaming"],
      verified: false,
      premium: true,
      bio: "Software engineer by day, gamer by night. Always up for tech discussions and multiplayer sessions.",
      profession: "Software Engineer",
      location: "Karol Bagh",
      joinDate: "January 2023",
      mutualFriends: 12,
      rating: 4.6,
      badges: ["Tech Expert", "Gaming Pro"],
    },
    {
      id: 3,
      name: "Rahul",
      userId: "@rahul",
      age: 26,
      distance: "2.1km",
      status: "online",
      photo:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      interests: ["Art", "Music"],
      verified: true,
      premium: true,
      bio: "Artist and musician creating vibes that connect souls. Let's jam and create something beautiful together!",
      profession: "Artist & Musician",
      location: "Paharganj",
      joinDate: "June 2022",
      mutualFriends: 8,
      rating: 4.9,
      badges: ["Creative Soul", "Music Lover", "Community Star"],
    },
  ];

  const meetupCategories = [
    {
      id: 1,
      name: "Sports",
      icon: Dumbbell,
      image:
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&h=300&fit=crop",
      count: 24,
    },
    {
      id: 2,
      name: "Health",
      icon: Heart,
      image:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=300&fit=crop",
      count: 18,
    },
    {
      id: 3,
      name: "Casual",
      icon: Coffee,
      image:
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=300&fit=crop",
      count: 31,
    },
    {
      id: 4,
      name: "Travel",
      icon: Plane,
      image:
        "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
      count: 12,
    },
    {
      id: 5,
      name: "Learning",
      icon: UserCheck,
      image:
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop",
      count: 16,
    },
    {
      id: 6,
      name: "Business",
      icon: Users,
      image:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
      count: 9,
    },
  ];

  const localCommunities = [
    {
      id: 1,
      name: "Delhi Photographers",
      members: 1247,
      avatar:
        "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=100&h=100&fit=crop",
      category: "Photography",
      active: true,
    },
    {
      id: 2,
      name: "CP Foodies",
      members: 892,
      avatar:
        "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=100&h=100&fit=crop",
      category: "Food & Dining",
      active: true,
    },
    {
      id: 3,
      name: "Tech Innovators Delhi",
      members: 634,
      avatar:
        "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=100&h=100&fit=crop",
      category: "Technology",
      active: false,
    },
    {
      id: 4,
      name: "Fitness Enthusiasts",
      members: 521,
      avatar:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=100&h=100&fit=crop",
      category: "Health & Fitness",
      active: true,
    },
  ];

  // Mock data for most active area
  const mostActiveArea = {
    name: "Connaught Place",
    userCount: 847,
    location: "Connaught Place, New Delhi",
  };

  const filteredUsers = mockUsers.filter((user) => {
    if (filters.onlineOnly && user.status !== "online") return false;
    if (
      interestSearch &&
      !user.interests.some((interest) =>
        interest.toLowerCase().includes(interestSearch.toLowerCase())
      )
    )
      return false;
    return true;
  });

  const handleUserClick = (user: User) => {
    setSelectedUser(user);
    setIsUserCardOpen(true);
  };

  const handleSendMessage = (user: User) => {
    console.log("Send message to:", user);
    setIsUserCardOpen(false);
    // This would open message modal
  };

  const handleViewProfile = (user: User) => {
    console.log("View profile:", user);
    setIsUserCardOpen(false);
    navigate(ROUTES.PROFILE);
  };

  const handlePostMessage = () => {
    console.log("Posting message:", message);
    setMessage("");
  };

  const handleCategoryClick = (category: any) => {
    console.log("Category clicked:", category);
    // Navigate to meetups page with category filter applied
    navigate(
      `${ROUTES.MEETUPS}?category=${encodeURIComponent(
        category.name
      )}&location=${encodeURIComponent(location)}`
    );
  };

  const handleGoToActiveArea = () => {
    setLocation(mostActiveArea.location);
    // Show confirmation alert
    alert(
      `Navigated to most active area: ${mostActiveArea.name} with ${mostActiveArea.userCount} active users!`
    );
  };

  const scrollCarousel = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = 300;
      const currentScroll = carouselRef.current.scrollLeft;
      const newScroll =
        direction === "left"
          ? currentScroll - scrollAmount
          : currentScroll + scrollAmount;

      carouselRef.current.scrollTo({
        left: newScroll,
        behavior: "smooth",
      });
    }
  };

  const getUserOutlineClasses = (user: User) => {
    if (user.verified && user.premium) {
      return "ring-1 ring-gradient-to-r ring-from-blue-400 ring-to-yellow-400 border-2 border-white shadow-lg shadow-blue-300/20";
    } else if (user.verified) {
      return "ring-1 ring-blue-400 border-2 border-white shadow-lg shadow-blue-300/20";
    } else if (user.premium) {
      return "ring-1 ring-yellow-400 border-2 border-white shadow-lg shadow-yellow-300/20";
    }
    return "border-2 border-white shadow-lg ring-1 ring-blue-200";
  };

  const renderUserCard = () => {
    if (!selectedUser) return null;

    return (
      <Sheet open={isUserCardOpen} onOpenChange={setIsUserCardOpen}>
        <SheetContent
          side="bottom"
          className="h-[66vh] sm:h-[66vh] rounded-t-3xl border-none"
        >
          <div className="card-enhanced card-cream h-full flex flex-col p-4">
            <SheetHeader className="pb-4">
              <div className="flex items-start space-x-4">
                <div className="relative">
                  <Avatar
                    className={`h-16 w-16 sm:h-20 sm:w-20 transition-all duration-300 ${getUserOutlineClasses(
                      selectedUser
                    )}`}
                  >
                    <AvatarImage
                      src={selectedUser.photo}
                      alt={selectedUser.name}
                    />
                    <AvatarFallback>{selectedUser.name[0]}</AvatarFallback>
                  </Avatar>
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 rounded-full border-3 border-white shadow-md ${
                      selectedUser.status === "online"
                        ? "bg-green-500"
                        : "bg-gray-400"
                    }`}
                  />
                  {(selectedUser.verified || selectedUser.premium) && (
                    <div className="absolute -top-1 -right-1 flex space-x-1">
                      {selectedUser.verified && (
                        <Shield className="h-4 w-4 text-blue-500 bg-white rounded-full p-0.5 shadow-sm" />
                      )}
                      {selectedUser.premium && (
                        <Crown className="h-4 w-4 text-yellow-500 bg-white rounded-full p-0.5 shadow-sm" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <SheetTitle className="text-lg font-semibold text-gray-800">
                      {selectedUser.name}, {selectedUser.age}
                    </SheetTitle>

                    {selectedUser.rating && (
                      <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-full border border-yellow-200">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="text-xs font-semibold text-yellow-700">
                          {selectedUser.rating}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600 ">
                    <span className="text-sm font-medium">
                      {selectedUser.userId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{selectedUser.distance}</span>
                    </div>
                    {selectedUser.mutualFriends && (
                      <div className="flex items-center space-x-1">
                        <Users className="h-3 w-3" />
                        <span>{selectedUser.mutualFriends} mutual</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span
                        className={
                          selectedUser.status === "online"
                            ? "text-green-600"
                            : "text-gray-500"
                        }
                      >
                        {selectedUser.status === "online"
                          ? "Online now"
                          : "Last seen recently"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 mt-2">
                    <span className="text-sm text-gray-600">
                      {selectedUser.profession}
                    </span>
                    {selectedUser.location && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="text-sm text-gray-600">
                          {selectedUser.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto space-y-4 px-4">
              {/* Bio Section */}
              {selectedUser.bio && (
                <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    About
                  </h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {selectedUser.bio}
                  </p>
                </div>
              )}

              {/* Interests */}
              <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Interests
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.interests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="bg-blue-100 text-blue-700 border-blue-200 text-sm px-3 py-1"
                    >
                      {interest}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Badges */}
              {selectedUser.badges && selectedUser.badges.length > 0 && (
                <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Badges
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.badges.map((badge) => (
                      <Badge
                        key={badge}
                        variant="outline"
                        className="bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 border-purple-200 text-sm px-3 py-1"
                      >
                        <Zap className="h-3 w-3 mr-1" />
                        {badge}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Member Info */}
              <div className="bg-white/60 rounded-xl p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Member Info
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Joined</span>
                    <p className="font-semibold text-gray-800">
                      {selectedUser.joinDate}
                    </p>
                  </div>
                  {selectedUser.mutualFriends && (
                    <div>
                      <span className="text-gray-600">Mutual Friends</span>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.mutualFriends}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3 px-4">
              <Button
                onClick={() => handleSendMessage(selectedUser)}
                className="h-12 rounded-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button
                variant="outline"
                onClick={() => handleViewProfile(selectedUser)}
                className="h-12 rounded-xl font-semibold bg-white/80 border-blue-200 hover:bg-blue-50 text-blue-700"
              >
                <Camera className="h-4 w-4 mr-2" />
                View Profile
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    );
  };

  return (
    <div
      className="space-y-6 sm:space-y-6"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Location Input - Mobile Responsive */}
      <Card className="card-enhanced card-cream animate-slide-up">
        <CardContent className="p-3 sm:p-4">
          {/* Mobile Layout - Stacked */}
          <div className="flex flex-col space-y-3 sm:hidden">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center shadow-md">
                <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
              </div>
              <Input
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter your location in India"
                className="flex-1 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl text-sm"
                style={{ fontFamily: "'Urbanist', sans-serif" }}
              />
            </div>
            <Badge
              variant="secondary"
              className="animate-bounce-gentle bg-blue-100 text-blue-700 border-blue-200 text-xs self-start"
            >
              {filteredUsers.length} nearby
            </Badge>
          </div>

          {/* Desktop Layout */}
          <div className="hidden sm:flex items-center space-x-4">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center shadow-md">
              <MapPin className="h-5 w-5 text-white" />
            </div>

            <div className="flex-1 flex items-center space-x-4">
              <div className="flex-1 flex space-x-3">
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter your location in India"
                  className="flex-1 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                  style={{ fontFamily: "'Urbanist', sans-serif" }}
                />
                <Button variant="outline" className="rounded-xl px-3">
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>

              <Badge
                variant="secondary"
                className="animate-bounce-gentle bg-blue-100 text-blue-700 border-blue-200"
              >
                {filteredUsers.length} nearby
              </Badge>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="mt-3 p-2 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <p className="text-xs text-blue-700 leading-relaxed">
                <span className="font-semibold">Profile Visibility:</span> This
                is the location where your profile will be visible to other
                users. You can navigate the map freely, but your profile will
                always appear at the selected location.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Map with Clickable User Cards */}
      <Card
        className="card-enhanced card-cream animate-slide-up"
        style={{ animationDelay: "0.1s" }}
      >
        <CardContent className="p-0">
          {isLoading ? (
            <MapSkeleton className="h-64 sm:h-80 lg:h-96" />
          ) : (
            <div className="rounded-xl h-64 sm:h-80 lg:h-96 relative overflow-hidden">
              <SimpleMap
                users={filteredUsers}
                onUserClick={handleUserClick}
                location={location}
                isFullScreen={false}
              />

              {/* Full-screen button */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white/90 backdrop-blur-sm border-blue-200 hover:bg-white shadow-lg"
                  onClick={() => setIsFullScreenMapOpen(true)}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Full Screen
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filter and Controls sections remain unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Compact Filters Card */}
        <Card
          className="lg:col-span-3 card-enhanced card-cream animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            {/* Search by interests - Top */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={interestSearch}
                onChange={(e) => setInterestSearch(e.target.value)}
                placeholder="Search by interests..."
                className="pl-10 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl text-sm sm:text-base"
              />
            </div>

            {/* Popular interests - Mobile Responsive */}
            <div className="flex flex-wrap gap-1">
              {["Football", "Music", "Travel", "Food"].map((interest) => (
                <Badge
                  key={interest}
                  variant="outline"
                  className="cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-colors duration-200 text-xs px-2 py-1"
                  onClick={() => setInterestSearch(interest)}
                >
                  {interest}
                </Badge>
              ))}
            </div>

            {/* Filter options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              <div className="flex items-center space-x-2 p-2 bg-white/60 rounded-lg border border-blue-100">
                <input
                  type="checkbox"
                  id="online-only"
                  checked={filters.onlineOnly}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      onlineOnly: e.target.checked,
                    }))
                  }
                  className="rounded transition-all duration-300 accent-blue-500 scale-75"
                />
                <label
                  htmlFor="online-only"
                  className="text-xs font-semibold flex items-center space-x-1"
                >
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Online users</span>
                </label>
              </div>

              <div className="flex items-center space-x-2 p-2 bg-white/60 rounded-lg border border-blue-100 relative">
                <input
                  type="checkbox"
                  id="hide-profile"
                  checked={filters.hideProfile}
                  onChange={(e) =>
                    setFilters((prev) => ({
                      ...prev,
                      hideProfile: e.target.checked,
                    }))
                  }
                  className="rounded transition-all duration-300 accent-blue-500 scale-75"
                />
                <label
                  htmlFor="hide-profile"
                  className="text-xs font-semibold flex items-center space-x-1"
                >
                  <EyeOff className="h-3 w-3" />
                  <span>Hide my profile</span>
                </label>
                <Badge
                  variant="secondary"
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-1 py-0.5 rounded-full scale-75"
                >
                  Pro
                </Badge>
              </div>

              {/* Go to Active Area button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleGoToActiveArea}
                className="p-2 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 hover:from-green-100 hover:to-blue-100 hover:border-green-300 transition-all duration-300 rounded-lg"
              >
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-3 w-3 text-green-600" />
                  <Navigation className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-semibold text-gray-700">
                    Active Area
                  </span>
                </div>
              </Button>
            </div>

            {/* Active Area Info Tooltip */}
            <div className="p-2 bg-green-50 rounded-lg border border-green-200 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-3 w-3 text-green-600" />
                <span className="font-semibold">Most Active:</span>{" "}
                {mostActiveArea.name} | {mostActiveArea.userCount} users
              </div>
              <p className="mt-1 text-xs">
                Click "Active Area" to navigate to the busiest location near
                you!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Compact Message Box Card */}
        <Card
          className="lg:col-span-2 card-enhanced card-cream animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <CardContent className="p-3 sm:p-4 space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2 mb-2">
              <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              <span className="font-semibold text-gray-800 text-sm sm:text-base">
                Post Message
              </span>
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message to display on the map for others to see"
              maxLength={80}
              className="min-h-12 sm:min-h-16 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none text-sm"
              style={{ fontFamily: "'Urbanist', sans-serif" }}
            />
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Message will appear above your profile on the map</span>
              <span
                className={
                  message.length > 70
                    ? "text-orange-500"
                    : message.length > 60
                    ? "text-yellow-500"
                    : "text-gray-500"
                }
              >
                {message.length}/80
              </span>
            </div>
            <Button
              onClick={handlePostMessage}
              disabled={!message.trim()}
              className="w-full rounded-xl text-sm"
              size="sm"
            >
              <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Post
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rest of the component remains the same - Meetup Categories */}
      <Card
        className="card-enhanced card-cream animate-slide-up"
        style={{ animationDelay: "0.4s" }}
      >
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="text-base sm:text-lg">Nearby Meetups</span>
            </CardTitle>
            <div className="flex items-center space-x-1 sm:space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollCarousel("left")}
                className="rounded-full p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
              >
                <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => scrollCarousel("right")}
                className="rounded-full p-1 sm:p-2 h-8 w-8 sm:h-auto sm:w-auto"
              >
                <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
              </Button>
              <Button
                onClick={() => navigate(ROUTES.MEETUPS)}
                variant="outline"
                size="sm"
                className="rounded-lg ml-1 sm:ml-2 text-xs sm:text-sm px-2 sm:px-3"
              >
                View All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="relative">
            <div
              ref={carouselRef}
              className="flex space-x-3 sm:space-x-4 overflow-x-auto scrollbar-hide scroll-smooth"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {meetupCategories.map((category, index) => (
                <Card
                  key={category.id}
                  className="card-enhanced card-cream overflow-hidden cursor-pointer group hover:scale-105 transition-all duration-300 flex-shrink-0 w-48 sm:w-56 lg:w-64"
                  onClick={() => handleCategoryClick(category)}
                  style={{ "--stagger-delay": index } as React.CSSProperties}
                >
                  <div className="aspect-video relative overflow-hidden">
                    <ImageWithFallback
                      src={category.image}
                      alt={category.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute top-2 right-2 sm:top-3 sm:right-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-800 backdrop-blur-sm text-xs"
                      >
                        {category.count} events
                      </Badge>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 sm:bottom-4 sm:left-4 sm:right-4">
                      <div className="flex items-center space-x-2 text-white">
                        <category.icon className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="font-semibold text-sm sm:text-lg">
                          {category.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Local Communities */}
      <Card
        className="card-enhanced card-cream animate-slide-up"
        style={{ animationDelay: "0.5s" }}
      >
        <CardHeader className="pb-2 sm:pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2 sm:space-x-3">
              <div className="h-6 w-6 sm:h-8 sm:w-8 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
              </div>
              <span className="text-base sm:text-lg">Local Communities</span>
            </CardTitle>
            <Button
              onClick={() => navigate(ROUTES.CHAT_GROUPS)}
              variant="outline"
              size="sm"
              className="rounded-lg text-xs sm:text-sm px-2 sm:px-3"
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-2 sm:space-y-3">
            {localCommunities.map((community, index) => (
              <div
                key={community.id}
                className="flex items-center space-x-3 sm:space-x-4 p-2 sm:p-3 bg-white/60 rounded-xl border border-blue-100 hover:bg-white/80 transition-all duration-300 cursor-pointer group"
                onClick={() => {
                  // Navigate to specific community or search communities
                  if (community.active) {
                    // Navigate to specific community
                    navigate(
                      `${ROUTES.CHAT_GROUPS}?community=${encodeURIComponent(
                        community.name
                      )}`
                    );
                  } else {
                    // Navigate to communities search with location filter
                    navigate(
                      `${ROUTES.CHAT_GROUPS}?location=${encodeURIComponent(
                        location
                      )}`
                    );
                  }
                }}
                style={{ "--stagger-delay": index } as React.CSSProperties}
              >
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-blue-100 group-hover:scale-105 transition-transform duration-300">
                  <AvatarImage src={community.avatar} alt={community.name} />
                  <AvatarFallback>{community.name[0]}</AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-semibold text-gray-800 truncate text-sm sm:text-base">
                      {community.name}
                    </h4>
                    {community.active && (
                      <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full animate-pulse" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {community.category}
                  </p>
                </div>

                <div className="text-right">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-700 border-blue-200 text-xs"
                  >
                    {community.members.toLocaleString()} members
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {filteredUsers.length === 0 && (
        <Card className="card-enhanced card-cream animate-fade-in">
          <CardContent className="text-center py-6 sm:py-8">
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center mx-auto mb-4 hover:scale-105 transition-transform duration-300 shadow-lg">
              <Users className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-semibold mb-2 text-gray-800">
              No users found
            </h3>
            <p className="text-muted-foreground text-sm sm:text-base">
              Try adjusting your filters or expanding your search radius.
            </p>
          </CardContent>
        </Card>
      )}

      {/* User Card Pull-up Modal */}
      {renderUserCard()}

      {/* Full Screen Map Modal */}
      <FullScreenMap
        isOpen={isFullScreenMapOpen}
        onClose={() => setIsFullScreenMapOpen(false)}
        users={filteredUsers}
        onUserClick={handleUserClick}
        location={location}
      />
    </div>
  );
}
