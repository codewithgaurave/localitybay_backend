import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar } from "./ui/avatar";
import {
  Search,
  Plus,
  MapPin,
  Users,
  Lock,
  Globe,
  CheckCircle,
  Crown,
  Camera,
  Music,
  Dumbbell,
  Coffee,
  Book,
  Gamepad2,
  Palette,
  Briefcase,
  Heart,
  Star,
  MessageCircle,
  Clock,
  Calendar,
  Navigation,
  ArrowLeft,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FullScreenLayout } from "./FullScreenLayout";

interface ChatGroup {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  lastMessageSender?: string;
  unreadCount: number;
  memberCount: number;
  isPrivate: boolean;
  isVerified: boolean;
  category: string;
  location: string;
  distance: string;
  isOnline: boolean;
  isPinned: boolean;
  isTyping?: boolean;
  typingMembers?: string[];
  isMeetupCommunity?: boolean;
  meetupTitle?: string;
  meetupDate?: string;
}

export function ChatGroupListing() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [locationSearch, setLocationSearch] = useState("");
  const [radius, setRadius] = useState("5");
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
  const locationInputRef = useRef<HTMLInputElement>(null);

  // Mock location suggestions (in a real app, this would come from Google Places API)
  const locationSuggestions = [
    "Current Location",
    "Downtown Toronto",
    "Midtown Manhattan",
    "Central London",
    "Downtown Vancouver",
    "Brooklyn Heights",
    "Queen Street West",
    "Financial District",
    "Liberty Village",
    "King Street West",
  ].filter(
    (location) =>
      location.toLowerCase().includes(locationSearch.toLowerCase()) &&
      location.toLowerCase() !== locationSearch.toLowerCase()
  );

  // Mock chat groups data with meetup communities
  const mockGroups: ChatGroup[] = [
    {
      id: "1",
      name: "Downtown Photography Club",
      avatar:
        "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=150&h=150&fit=crop&crop=center",
      lastMessage:
        "Sarah: Let's discuss our upcoming downtown photo walk this weekend.",
      lastMessageTime: "10:30 AM",
      lastMessageSender: "Sarah Chen",
      unreadCount: 3,
      memberCount: 127,
      isPrivate: false,
      isVerified: true,
      category: "photography",
      location: "Downtown",
      distance: "0.8 km",
      isOnline: true,
      isPinned: true,
    },
    {
      id: "2",
      name: "Morning Yoga Session",
      avatar:
        "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Reminder: Session starts at 7 AM tomorrow. See you there!",
      lastMessageTime: "11:15 AM",
      lastMessageSender: "System",
      unreadCount: 1,
      memberCount: 12,
      isPrivate: false,
      isVerified: false,
      category: "fitness",
      location: "Central Park",
      distance: "1.2 km",
      isOnline: true,
      isPinned: false,
      isMeetupCommunity: true,
      meetupTitle: "Morning Yoga Session",
      meetupDate: "Tomorrow, 7:00 AM",
    },
    {
      id: "3",
      name: "Fitness Enthusiasts",
      avatar:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Mike: Anyone up for a morning run tomorrow?",
      lastMessageTime: "9:45 AM",
      lastMessageSender: "Mike Rodriguez",
      unreadCount: 1,
      memberCount: 89,
      isPrivate: false,
      isVerified: false,
      category: "fitness",
      location: "Central Park",
      distance: "1.2 km",
      isOnline: true,
      isPinned: false,
      isTyping: true,
      typingMembers: ["Emma Wilson"],
    },
    {
      id: "4",
      name: "Tech Startup Networking",
      avatar:
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=150&h=150&fit=crop&crop=center",
      lastMessage:
        "Thanks everyone for joining! Next meetup details coming soon.",
      lastMessageTime: "2 hours ago",
      lastMessageSender: "System",
      unreadCount: 0,
      memberCount: 45,
      isPrivate: false,
      isVerified: true,
      category: "business",
      location: "Business District",
      distance: "3.4 km",
      isOnline: false,
      isPinned: false,
      isMeetupCommunity: true,
      meetupTitle: "Tech Startup Networking",
      meetupDate: "Ended 2 hours ago",
    },
    {
      id: "5",
      name: "Jazz Lovers Society",
      avatar:
        "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Tonight's jazz session was incredible! Thanks everyone.",
      lastMessageTime: "Yesterday",
      unreadCount: 0,
      memberCount: 45,
      isPrivate: true,
      isVerified: true,
      category: "music",
      location: "Jazz Quarter",
      distance: "2.1 km",
      isOnline: false,
      isPinned: false,
    },
    {
      id: "6",
      name: "Coffee Connoisseurs",
      avatar:
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Lisa: Found an amazing new café! You all have to try it.",
      lastMessageTime: "3 days ago",
      lastMessageSender: "Lisa Park",
      unreadCount: 0,
      memberCount: 67,
      isPrivate: false,
      isVerified: false,
      category: "food",
      location: "Café District",
      distance: "1.8 km",
      isOnline: false,
      isPinned: false,
    },
    {
      id: "7",
      name: "Digital Artists Unite",
      avatar:
        "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=150&h=150&fit=crop&crop=center",
      lastMessage: "Maria: Check out this new digital art technique I learned!",
      lastMessageTime: "1 week ago",
      lastMessageSender: "Maria Garcia",
      unreadCount: 0,
      memberCount: 156,
      isPrivate: false,
      isVerified: true,
      category: "arts",
      location: "Art District",
      distance: "4.2 km",
      isOnline: true,
      isPinned: false,
    },
  ];

  // Filter groups based on search term and location only (no category filter)
  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation =
      !locationSearch ||
      group.location.toLowerCase().includes(locationSearch.toLowerCase());

    return matchesSearch && matchesLocation;
  });

  // Sort groups: pinned first, then by last message time
  const sortedGroups = [...filteredGroups].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1;
    }
    return 0; // Keep original order for non-pinned items
  });

  const formatTime = (timeStr: string) => {
    if (timeStr.includes("AM") || timeStr.includes("PM")) {
      return timeStr;
    }
    return timeStr;
  };

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, any> = {
      photography: Camera,
      music: Music,
      fitness: Dumbbell,
      food: Coffee,
      learning: Book,
      gaming: Gamepad2,
      arts: Palette,
      business: Briefcase,
      social: Heart,
    };
    return icons[category] || Star;
  };

  const handleGroupClick = (groupId: string) => {
    navigate("/chat-detail");
  };

  const handleLocationSelect = (location: string) => {
    setLocationSearch(location);
    setShowLocationSuggestions(false);
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);

    if (value === "" || (numValue >= 1 && numValue <= 100)) {
      setRadius(value);
    }
  };

  // Handle clicking outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        locationInputRef.current &&
        !locationInputRef.current.contains(event.target as Node)
      ) {
        setShowLocationSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <FullScreenLayout
      title="Communities"
      onClose={() => navigate(ROUTES.COMMUNITIES)}
    >
      <div
        className="h-full flex flex-col bg-white mb-20"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Header with Back Button, Search and Create Plus Icon */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center space-x-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search communities or users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 rounded-full border-gray-200 bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </div>

          {/* Location Search and Radius Controls - Side by Side */}
          <div className="flex space-x-3">
            {/* Location Search with Autocomplete */}
            <div className="flex-1 relative" ref={locationInputRef}>
              <div className="relative">
                <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search location..."
                  value={locationSearch}
                  onChange={(e) => {
                    setLocationSearch(e.target.value);
                    setShowLocationSuggestions(true);
                  }}
                  onFocus={() => setShowLocationSuggestions(true)}
                  className="pl-10 rounded-xl border-gray-200"
                />
              </div>

              {/* Location Suggestions Dropdown */}
              {showLocationSuggestions && locationSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-white border border-gray-200 rounded-xl shadow-lg mt-1 max-h-48 overflow-y-auto">
                  {locationSuggestions.map((location, index) => (
                    <button
                      key={index}
                      onClick={() => handleLocationSelect(location)}
                      className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors flex items-center space-x-3 border-b border-gray-100 last:border-b-0"
                    >
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{location}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Radius Input */}
            <div className="w-32">
              <div className="relative">
                <Input
                  type="number"
                  placeholder="Radius"
                  value={radius}
                  onChange={handleRadiusChange}
                  min="1"
                  max="100"
                  className="rounded-xl border-gray-200 pr-10"
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-gray-500">
                  km
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {sortedGroups.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <MessageCircle className="h-12 w-12 mb-4 text-gray-300" />
              <p className="text-lg font-medium">No communities found</p>
              <p className="text-sm">
                Try adjusting your search filters or location
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {sortedGroups.map((group) => {
                const CategoryIcon = getCategoryIcon(group.category);

                return (
                  <button
                    key={group.id}
                    onClick={() => handleGroupClick(group.id)}
                    className="w-full p-4 hover:bg-gray-50 transition-colors text-left flex items-center space-x-3"
                  >
                    {/* Group Avatar */}
                    <div className="relative flex-shrink-0">
                      <Avatar className="h-12 w-12">
                        <ImageWithFallback
                          src={group.avatar}
                          alt={group.name}
                          className="h-full w-full object-cover"
                        />
                      </Avatar>

                      {/* Online Indicator */}
                      {group.isOnline && (
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 border-2 border-white rounded-full" />
                      )}

                      {/* Verification Badge */}
                      {group.isVerified && (
                        <CheckCircle className="absolute -top-1 -right-1 h-4 w-4 bg-white text-blue-500 rounded-full" />
                      )}
                    </div>

                    {/* Group Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center space-x-2 min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">
                            {group.name}
                          </h3>

                          {/* Meetup Community Badge */}
                          {group.isMeetupCommunity && (
                            <Badge
                              variant="outline"
                              className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                            >
                              <Calendar className="h-3 w-3 mr-1" />
                              Meetup Community
                            </Badge>
                          )}

                          {/* Pinned Indicator */}
                          {group.isPinned && (
                            <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0" />
                          )}

                          {/* Privacy Indicator */}
                          {group.isPrivate ? (
                            <Lock className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          ) : (
                            <Globe className="h-3 w-3 text-gray-400 flex-shrink-0" />
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-gray-500">
                            {formatTime(group.lastMessageTime)}
                          </span>
                          {group.unreadCount > 0 && (
                            <div className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                              {group.unreadCount > 9 ? "9+" : group.unreadCount}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Meetup Details */}
                      {group.isMeetupCommunity && group.meetupDate && (
                        <div className="flex items-center space-x-1 mb-1">
                          <Clock className="h-3 w-3 text-blue-500" />
                          <span className="text-xs text-blue-600 font-medium">
                            {group.meetupDate}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-600 truncate flex-1">
                          {group.isTyping && group.typingMembers ? (
                            <span className="text-blue-600 italic">
                              {group.typingMembers[0]} is typing...
                            </span>
                          ) : (
                            group.lastMessage
                          )}
                        </p>
                      </div>

                      {/* Category and Location Info */}
                      <div className="flex items-center space-x-3 mt-2">
                        <div className="flex items-center space-x-1">
                          <CategoryIcon className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500 capitalize">
                            {group.category}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Users className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {group.memberCount}
                          </span>
                        </div>

                        <div className="flex items-center space-x-1">
                          <MapPin className="h-3 w-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {group.distance}
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </FullScreenLayout>
  );
}
