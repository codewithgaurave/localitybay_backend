import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Separator } from "./ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Shield,
  Crown,
  Edit,
  MessageCircle,
  Users,
  Calendar,
  Heart,
  UserPlus,
  Copy,
  Check,
  ArrowLeft,
  Award,
  Star,
  X,
  Zap,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function UserProfile() {
  const navigate = useNavigate();
  const isOwnProfile = true;
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string>("");
  const [showCommunitiesModal, setShowCommunitiesModal] = useState(false);
  const [showMeetupsModal, setShowMeetupsModal] = useState(false);
  const [copiedUserId, setCopiedUserId] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);

  const user = {
    id: "U001",
    name: "Sarah Chen",
    userId: "@sarahchen_92",
    dateOfBirth: "1992-06-15",
    photo:
      "https://images.unsplash.com/photo-1494790108755-2616b5b65b75?w=200&h=200&fit=crop&crop=face",
    verified: false,
    premium: false,
    badges: ["Explorer", "Local Guide"],
    bio: "Photographer & adventurer 📸 Love exploring new places and meeting amazing people ✨",
    interests: [
      "Photography",
      "Travel",
      "Coding",
      "Hiking",
      "Coffee",
      "Art",
      "Music",
      "Reading",
    ],
    photos: [
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1493246507139-91e8fad9978e?w=400&h=400&fit=crop",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w-400&h=400&fit=crop",
    ],
    joinedCommunities: [
      { name: "Photography Enthusiasts", members: 1247, type: "permanent" },
      { name: "Local Hikers", members: 856, type: "permanent" },
      { name: "Tech Meetup Group", members: 342, type: "temporary" },
    ],
    hostedMeetups: [
      {
        name: "Weekend Photography Walk",
        date: "2024-07-20",
        attendees: 15,
        status: "completed",
      },
      {
        name: "Sunset Hike",
        date: "2024-07-15",
        attendees: 8,
        status: "completed",
      },
      {
        name: "Coffee & Code",
        date: "2024-07-10",
        attendees: 12,
        status: "completed",
      },
    ],
  };

  const handlePhotoClick = (photo: string) => {
    setSelectedPhoto(photo);
    setShowPhotoModal(true);
  };

  const copyUserId = () => {
    navigator.clipboard.writeText(user.userId);
    setCopiedUserId(true);
    setTimeout(() => setCopiedUserId(false), 2000);
  };

  return (
    <>
      {/* Import Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&family=Poppins:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <div
        className="min-h-screen bg-gradient-to-br from-blue-500/5 via-white to-indigo-500/5"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Header with Back Button */}
        <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-blue-100/50 px-4 py-3 shadow-sm">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/home")}
              className="p-2 hover:bg-blue-50 rounded-full"
            >
              <ArrowLeft className="h-5 w-5 text-blue-600" />
            </Button>
            <h1
              className="text-lg"
              style={{
                fontFamily: "'Inter', sans-serif",
                fontWeight: 700,
                color: "#1f2937",
              }}
            >
              Profile
            </h1>
            <div className="w-9"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Main Profile Content */}
        <div className="pb-32">
          {/* Profile Header Section - Mobile Optimized */}
          <div className="bg-white p-4 mb-2">
            <div className="flex items-start space-x-4">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <Avatar className="h-20 w-20 border-3 border-white shadow-lg ring-4 ring-blue-100">
                  <AvatarImage src={user.photo} alt={user.name} />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                {user.verified && (
                  <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full p-1.5 shadow-lg">
                    <Shield className="h-3 w-3 text-white" />
                  </div>
                )}
                {user.premium && (
                  <div className="absolute -top-1 -right-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-1.5 shadow-lg">
                    <Crown className="h-3 w-3 text-white" />
                  </div>
                )}
              </div>

              {/* Name and User ID */}
              <div className="flex-1 pt-1">
                <h1 className="text-xl font-bold text-gray-900 mb-1">
                  {user.name}
                </h1>
                <div className="flex items-center space-x-2 text-blue-600 mb-3">
                  <span className="text-sm font-medium">{user.userId}</span>
                  <button
                    onClick={copyUserId}
                    className="p-1 hover:bg-blue-50 rounded transition-colors"
                  >
                    {copiedUserId ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-gray-700 text-sm leading-relaxed mb-4 mt-2">
              {user.bio}
            </p>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {isOwnProfile ? (
                <div className="flex gap-2 w-full">
                  <Button
                    onClick={() => navigate(ROUTES.EDIT_PROFILE)}
                    className="px-6 rounded-lg flex-1"
                    style={{ backgroundColor: "#D3D3D3" }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    onClick={() => navigate(ROUTES.VERIFICATION)}
                    className="px-6 rounded-lg flex-1"
                    style={{ backgroundColor: "#87CEFA" }}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Get Verified
                  </Button>
                </div>
              ) : (
                <>
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg flex-1">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Follow
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg px-4"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Badges */}
          <div className="bg-white p-4 mb-2">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Award className="h-4 w-4" />
              Badges
            </h3>
            <div className="flex flex-wrap gap-2">
              {user.badges.map((badge) => (
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

          {/* Interests Section */}
          <div className="bg-white p-4 mb-2">
            <h3 className="font-semibold text-gray-900 mb-3">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {user.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                  style={{ fontFamily: "'Quicksand', sans-serif" }}
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          {/* Photos Grid Section */}
          <div className="bg-white p-4 mb-2">
            <div className="grid grid-cols-3 gap-1">
              {user.photos.map((photo, index) => (
                <div
                  key={index}
                  className="aspect-square relative group cursor-pointer overflow-hidden rounded-lg"
                  onClick={() => handlePhotoClick(photo)}
                >
                  <ImageWithFallback
                    src={photo}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Communities and Meetups Section */}
          <div className="bg-white p-4 mb-2">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowCommunitiesModal(true)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-500 rounded-full p-2">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      Joined Communities
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.joinedCommunities.length} joined
                    </div>
                  </div>
                </div>
              </button>

              <button
                onClick={() => setShowMeetupsModal(true)}
                className="p-4 border border-gray-200 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-all duration-200 text-left"
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-indigo-500 rounded-full p-2">
                    <Calendar className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-sm">
                      Hosted Meetups
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.hostedMeetups.length} hosted
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Premium Upgrade Card - Separate Card */}
          {isOwnProfile && !user.premium && (
            <div className="bg-white p-4 mb-2">
              <button
                onClick={() => setShowPremiumModal(true)}
                className="w-full p-4 bg-gradient-to-r from-black to-gray-800 rounded-xl hover:from-gray-900 hover:to-black transition-all duration-500 text-left shadow-lg hover:shadow-2xl transform hover:scale-[1.02] relative overflow-hidden"
              >
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/20 to-transparent transform -translate-x-full animate-pulse"></div>

                <div className="flex items-center justify-between relative z-10">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-2 animate-bounce">
                      <Crown className="h-4 w-4 text-black" />
                    </div>
                    <div>
                      <span className="font-semibold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent block">
                        Upgrade to Premium
                      </span>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-red-400 text-sm line-through">
                          ₹500/month
                        </span>
                        <span className="text-green-400 font-bold text-sm">
                          ₹200/month
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold animate-pulse">
                    60% OFF
                  </div>
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Photo Modal */}
        <Dialog open={showPhotoModal} onOpenChange={setShowPhotoModal}>
          <DialogContent className="max-w-[95vw] max-h-[90vh] p-0 border-0 bg-black/95">
            <DialogHeader className="sr-only">
              <DialogTitle>Photo View</DialogTitle>
              <DialogDescription>
                Full size view of the selected photo
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <ImageWithFallback
                src={selectedPhoto}
                alt="Full size photo"
                className="w-full h-auto max-h-[90vh] object-contain"
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Communities Modal */}
        <Dialog
          open={showCommunitiesModal}
          onOpenChange={setShowCommunitiesModal}
        >
          <DialogContent className="max-w-md bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                Joined Communities
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                View all communities that {user.name} has joined
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {user.joinedCommunities.map((community, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-100"
                >
                  <div>
                    <p className="font-semibold text-blue-900">
                      {community.name}
                    </p>
                    <p className="text-sm text-blue-600">
                      {community.members} members
                    </p>
                  </div>
                  <Badge
                    variant={
                      community.type === "permanent" ? "default" : "secondary"
                    }
                    className={
                      community.type === "permanent"
                        ? "bg-blue-500"
                        : "bg-blue-200 text-blue-800"
                    }
                  >
                    {community.type}
                  </Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Meetups Modal */}
        <Dialog open={showMeetupsModal} onOpenChange={setShowMeetupsModal}>
          <DialogContent className="max-w-md bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-gray-900">
                Hosted Meetups
              </DialogTitle>
              <DialogDescription className="text-gray-600">
                View all meetups that {user.name} has hosted
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {user.hostedMeetups.map((meetup, index) => (
                <div
                  key={index}
                  className="p-4 bg-indigo-50 rounded-lg border border-indigo-100"
                >
                  <p className="font-semibold text-indigo-900">{meetup.name}</p>
                  <p className="text-sm text-indigo-600">
                    {new Date(meetup.date).toLocaleDateString()} •{" "}
                    {meetup.attendees} attendees
                  </p>
                  <Badge className="mt-2 bg-indigo-500">{meetup.status}</Badge>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>

        {/* Premium Upgrade Modal */}
        <Dialog open={showPremiumModal} onOpenChange={setShowPremiumModal}>
          <DialogContent className="max-w-md p-0 border-0 bg-transparent">
            <DialogHeader className="sr-only">
              <DialogTitle>Premium Upgrade</DialogTitle>
              <DialogDescription>Upgrade to premium features</DialogDescription>
            </DialogHeader>
            <div className="relative overflow-hidden bg-gradient-to-r from-black via-gray-900 to-black rounded-2xl p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={() => setShowPremiumModal(false)}
                className="absolute top-4 right-4 text-white/70 hover:text-white z-20"
              >
                <X className="h-6 w-6" />
              </button>

              {/* Animated background effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-orange-500/20 to-yellow-400/20 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-45deg from-transparent via-yellow-400/10 to-transparent animate-bounce opacity-50"></div>

              <div className="relative z-10">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full p-3 animate-pulse">
                    <Crown className="h-5 w-5 text-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                      Upgrade to Premium
                    </h3>
                    <p className="text-yellow-400/90 text-sm">
                      Just ₹200/month
                    </p>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-black font-bold py-3 mb-3 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 rounded-xl">
                  <Crown className="h-4 w-4 mr-2" />
                  Upgrade Now
                </Button>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[
                    "Hide from map",
                    "Priority search",
                    "Advanced filters",
                    "Unlimited photos",
                    "Premium badge",
                    "Exclusive events",
                  ].map((benefit) => (
                    <div key={benefit} className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
                      <span className="text-yellow-100">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
