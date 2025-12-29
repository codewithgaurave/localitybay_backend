import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { ROUTES } from "../constants/routes";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useAuth } from "../contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  Users,
  Star,
  CreditCard,
  Lock,
  Globe,
  Video,
  Crown,
  Share2,
  MessageCircle,
  UserPlus,
  Navigation,
  Phone,
  Mail,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Loader2,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ShareButton } from "./ShareButton";
import {
  getMeetupById,
  joinMeetup,
  leaveMeetup,
  Meetup,
} from "../services/meetupService";

export function MeetupDetails() {
  const { id: meetupId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [showJoinConfirm, setShowJoinConfirm] = useState(false);
  const [showRequestConfirm, setShowRequestConfirm] = useState(false);

  // API state management
  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch meetup data from API
  useEffect(() => {
    const fetchMeetup = async () => {
      if (!meetupId) {
        setError("No meetup ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const meetupData = await getMeetupById(meetupId);

        // Add fallbacks for missing fields
        const parsedMeetup = {
          ...meetupData,
          image: meetupData.image || "",
          price: meetupData.price || "0",
          virtualLink: meetupData.virtualLink || "",
          meetingCode: meetupData.meetingCode || "",
          meetingPassword: meetupData.meetingPassword || "",
          endTime: meetupData.endTime || "",
          maxMale: meetupData.maxMale || 0,
          maxFemale: meetupData.maxFemale || 0,
          maxTransgender: meetupData.maxTransgender || 0,
        };

        setMeetup(parsedMeetup);
      } catch (err) {
        console.error("Failed to fetch meetup:", err);
        setError(err instanceof Error ? err.message : "Failed to load meetup");
      } finally {
        setLoading(false);
      }
    };

    fetchMeetup();
  }, [meetupId]);

  // Check if user has joined this meetup
  const isUserJoined =
    meetup &&
    user &&
    meetup.attendees.some((attendee: any) => attendee._id === user._id);
  const isUserOnWaitingList =
    meetup &&
    user &&
    meetup.waitingList.some((waitingUser: any) => waitingUser._id === user._id);

  const handleJoinMeetup = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    setShowJoinConfirm(true);
  };

  const handleRequestToJoin = () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
      return;
    }
    setShowRequestConfirm(true);
  };

  const handleJoinConfirm = async () => {
    if (!meetup || !user) return;

    try {
      setActionLoading(true);
      const updatedMeetup = await joinMeetup(meetup._id);
      setMeetup(updatedMeetup);
      setShowJoinConfirm(false);
      // Navigate to chat group
      navigate(ROUTES.COMMUNITIES);
    } catch (error) {
      console.error("Failed to join meetup:", error);
      // Handle error (show toast notification)
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestConfirm = async () => {
    if (!meetup || !user) return;

    try {
      setActionLoading(true);
      // For invite-only meetups, this would send a request to the organizer
      // The API might have a different endpoint for this
      console.log("Requesting to join meetup:", meetup._id);
      setShowRequestConfirm(false);
      // Show success message
    } catch (error) {
      console.error("Failed to request join:", error);
      // Handle error
    } finally {
      setActionLoading(false);
    }
  };

  const handleLeaveMeetup = async () => {
    if (!meetup || !user) return;

    try {
      setActionLoading(true);
      const updatedMeetup = await leaveMeetup(meetup._id);
      setMeetup(updatedMeetup);
    } catch (error) {
      console.error("Failed to leave meetup:", error);
      // Handle error
    } finally {
      setActionLoading(false);
    }
  };

  const handleOpenMap = () => {
    if (!meetup) return;
    // Open map with meetup location
    const mapUrl = `https://maps.google.com/?q=${encodeURIComponent(
      meetup.meetupLocation
    )}`;
    window.open(mapUrl, "_blank");
  };

  const handleContactHost = () => {
    if (!meetup) return;
    // Navigate to host profile or open contact modal
    console.log("Contact host:", meetup.creator.name);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "free":
        return "bg-green-100 text-green-800 border-green-200";
      case "paid":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "invite-only":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "free":
        return <Users className="h-4 w-4" />;
      case "paid":
        return <CreditCard className="h-4 w-4" />;
      case "invite-only":
        return <Lock className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading meetup details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !meetup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Meetup
          </h2>
          <p className="text-gray-600 mb-4">{error || "Meetup not found"}</p>
          <Button onClick={() => navigate(ROUTES.MEETUPS)} className="mr-2">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Meetups
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Mobile-First Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-gray-200/50 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.MEETUPS)}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900 truncate px-2">
            Meetup Details
          </h1>
          <div className="flex items-center space-x-2">
            <ShareButton
              title={meetup.title}
              description={meetup.description}
              url={`${window.location.origin}/meetup/${meetup._id}`}
              type="meetup"
            />
          </div>
        </div>
      </div>

      <div className="px-4 py-4 max-w-4xl mx-auto">
        {/* Mobile-First Layout */}
        <div className="space-y-4">
          {/* Meetup Image */}
          <Card className="overflow-hidden shadow-lg">
            <div className="aspect-video relative">
              <ImageWithFallback
                src={
                  meetup.image ||
                  "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&h=600&fit=crop"
                }
                alt={meetup.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute top-4 left-4 flex flex-col space-y-2">
                <Badge
                  className={`${getTypeColor(meetup.type)} border shadow-lg`}
                >
                  {getTypeIcon(meetup.type)}
                  <span className="ml-1 capitalize">
                    {meetup.type.replace("-", " ")}
                  </span>
                </Badge>
                <Badge className="bg-white/90 text-gray-700 border-gray-200 shadow-lg">
                  {meetup.category}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Meetup Title and Basic Info */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-3">
                {meetup.title}
              </h1>

              {/* Date and Time */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">{formatDate(meetup.date)}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-green-600" />
                  <span className="font-medium">
                    {formatTime(meetup.startTime)}
                    {meetup.endTime && ` - ${formatTime(meetup.endTime)}`}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-purple-600" />
                  <span className="font-medium">
                    {meetup.currentAttendees}
                    {!meetup.hasNoLimit && `/${meetup.maxAttendees}`} attendees
                  </span>
                </div>
              </div>

              {/* Price */}
              {meetup.price && parseFloat(meetup.price) > 0 && (
                <div className="flex items-center space-x-2 mb-4">
                  <CreditCard className="h-4 w-4 text-green-600" />
                  <span className="text-lg font-bold text-green-600">
                    ${meetup.price}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Description */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Info className="h-5 w-5 mr-2 text-blue-600" />
                About this meetup
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">
                {meetup.description}
              </p>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-red-600" />
                Location Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Meetup Location
                </h4>
                <p className="text-gray-700 mb-3">{meetup.meetupLocation}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenMap}
                  className="flex items-center space-x-2"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Open in Maps</span>
                </Button>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Visibility Area
                </h4>
                <p className="text-gray-700">
                  {meetup.visibilityLocation} ({meetup.visibilityRadius}km
                  radius)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Virtual Meeting Details */}
          {meetup.meetupFormat === "virtual" && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                  <Video className="h-5 w-5 mr-2 text-blue-600" />
                  Virtual Meeting Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      Meeting Link:
                    </p>
                    <a
                      href={meetup.virtualLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 text-sm flex items-center space-x-1"
                    >
                      <span>Join Meeting</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  {meetup.meetingCode && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Meeting Code:
                      </p>
                      <p className="text-sm text-gray-700 font-mono">
                        {meetup.meetingCode}
                      </p>
                    </div>
                  )}
                  {meetup.meetingPassword && (
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Password:
                      </p>
                      <p className="text-sm text-gray-700 font-mono">
                        {meetup.meetingPassword}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Attendee Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center justify-between">
                <div className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-purple-600" />
                  Attendees ({meetup.currentAttendees}
                  {!meetup.hasNoLimit && `/${meetup.maxAttendees}`})
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {meetup.attendees && meetup.attendees.length > 0 && (
                <div className="space-y-4">
                  {/* Attendee Count Display */}
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-700">
                      {meetup.currentAttendees} people have joined this meetup
                    </p>
                    {meetup.waitingList && meetup.waitingList.length > 0 && (
                      <p className="text-xs text-purple-600 mt-1">
                        {meetup.waitingList.length} on waiting list
                      </p>
                    )}
                  </div>

                  {/* Attendee List */}
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Attendees:
                    </p>
                    <div className="space-y-1">
                      {meetup.attendees.map((attendee: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg"
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={attendee.avatar}
                              alt={attendee.name}
                            />
                            <AvatarFallback className="text-xs bg-blue-100 text-blue-800">
                              {attendee.name
                                ? attendee.name.slice(0, 2).toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium text-gray-900">
                            {attendee.name || "Unknown User"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {meetup.genderSpecific && (
                <div className="mt-4 p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm font-medium text-orange-900 mb-2">
                    Gender-specific limits:
                  </p>
                  <div className="space-y-1 text-sm text-orange-800">
                    {meetup.maxMale && meetup.maxMale > 0 && (
                      <p>• Max Male: {meetup.maxMale}</p>
                    )}
                    {meetup.maxFemale && meetup.maxFemale > 0 && (
                      <p>• Max Female: {meetup.maxFemale}</p>
                    )}
                    {meetup.maxTransgender && meetup.maxTransgender > 0 && (
                      <p>• Max Transgender: {meetup.maxTransgender}</p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags */}
          {meetup.tags.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Tags
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {meetup.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                    >
                      #{tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Host Information */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <Crown className="h-5 w-5 mr-2 text-yellow-600" />
                Hosted by
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16 border-2 border-yellow-200">
                  <AvatarImage
                    src={meetup.creator.avatar || ""}
                    alt={meetup.creator.name}
                  />
                  <AvatarFallback className="text-lg bg-gradient-to-br from-yellow-400 to-orange-500 text-white">
                    {meetup.creator.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <p className="font-semibold text-gray-900 text-lg">
                      {meetup.creator.name}
                    </p>
                    <Badge className="bg-blue-100 text-blue-800 text-xs">
                      Organizer
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-1 mb-2">
                    <span className="text-sm text-gray-500">
                      @{meetup.creator.userId || meetup.creator._id}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleContactHost}
                      className="flex items-center space-x-1"
                    >
                      <MessageCircle className="h-3 w-3" />
                      <span>Message</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(ROUTES.PROFILE)}
                      className="flex items-center space-x-1"
                    >
                      <UserPlus className="h-3 w-3" />
                      <span>Profile</span>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <Card className="shadow-lg">
            <CardContent className="p-6">
              {isUserJoined ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">You're joined!</span>
                  </div>
                  <div className="space-y-2">
                    <Button
                      onClick={() => navigate(ROUTES.COMMUNITIES)}
                      className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white"
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Open Chat Group
                    </Button>
                    <Button
                      onClick={handleLeaveMeetup}
                      disabled={actionLoading}
                      variant="outline"
                      className="w-full rounded-xl border-red-200 text-red-600 hover:bg-red-50"
                    >
                      {actionLoading ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <ArrowLeft className="h-4 w-4 mr-2" />
                      )}
                      Leave Meetup
                    </Button>
                  </div>
                </div>
              ) : isUserOnWaitingList ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-center space-x-2 text-yellow-600">
                    <Clock className="h-5 w-5" />
                    <span className="font-medium">On waiting list</span>
                  </div>
                  <p className="text-sm text-gray-600 text-center">
                    You're on the waiting list. You'll be notified if a spot
                    opens up.
                  </p>
                </div>
              ) : meetup.type === "invite-only" ? (
                <Button
                  onClick={handleRequestToJoin}
                  disabled={actionLoading}
                  className="w-full rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white py-3"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <UserPlus className="h-4 w-4 mr-2" />
                  )}
                  Request to Join
                </Button>
              ) : (
                <Button
                  onClick={handleJoinMeetup}
                  disabled={
                    actionLoading ||
                    (meetup.maxAttendees &&
                      meetup.currentAttendees >= meetup.maxAttendees) ||
                    false
                  }
                  className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-3 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <MessageCircle className="h-4 w-4 mr-2" />
                  )}
                  {meetup.maxAttendees &&
                  meetup.currentAttendees >= meetup.maxAttendees
                    ? "Meetup Full"
                    : "Join Meetup"}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Chat Group Info */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
                <MessageCircle className="h-5 w-5 mr-2 text-blue-600" />
                Chat Group
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-900 mb-1">
                    Group Name:
                  </p>
                  <p className="text-sm text-blue-800">
                    {meetup.title} @ {formatDate(meetup.date)}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
                    Type:
                  </span>
                  <Badge
                    className={
                      meetup.allowChatContinuation
                        ? "bg-green-100 text-green-800"
                        : "bg-orange-100 text-orange-800"
                    }
                  >
                    {meetup.allowChatContinuation
                      ? "Permanent"
                      : "Temporary (3 days)"}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600">
                  {meetup.allowChatContinuation
                    ? "This is a permanent chat group for meetup participants."
                    : "This chat group will expire 3 days after the meetup ends."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Join Confirmation Dialog */}
      <Dialog open={showJoinConfirm} onOpenChange={setShowJoinConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5 text-blue-600" />
              <span>Join Meetup</span>
            </DialogTitle>
            <DialogDescription>
              By joining this meetup, you will be automatically added to the
              meetup chat group where you can connect with other participants
              and the organizer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowJoinConfirm(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleJoinConfirm}
              disabled={actionLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Join Meetup
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request to Join Confirmation Dialog */}
      <Dialog open={showRequestConfirm} onOpenChange={setShowRequestConfirm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <UserPlus className="h-5 w-5 text-yellow-600" />
              <span>Request to Join</span>
            </DialogTitle>
            <DialogDescription>
              Your request will be sent to the meetup organizer. If approved,
              you'll be added to the meetup and its chat group.
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowRequestConfirm(false)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleRequestConfirm}
              disabled={actionLoading}
              className="flex-1 rounded-xl bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-white"
            >
              {actionLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : null}
              Send Request
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
