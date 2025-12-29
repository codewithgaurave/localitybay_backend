import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { MEETUP_CATEGORIES } from "../constants/categories";
import { meetupService, CreateMeetupData } from "../services/meetupService";
import { AuthGuard } from "./AuthGuard";
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
} from "./ui/dialog";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Upload,
  Star,
  CreditCard,
  AlertCircle,
  Monitor,
  Link2,
  Infinity,
  UserCheck,
  X,
  Info,
  Crown,
  Plus,
} from "lucide-react";
import { Alert, AlertDescription } from "./ui/alert";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Checkbox } from "./ui/checkbox";



export function CreateMeetup() {
  const navigate = useNavigate();
  const [meetupData, setMeetupData] = useState({
    title: "",
    description: "",
    category: "",
    type: "free", // free, paid, invite-only
    price: "",
    paymentMethod: "", // New field for payment method
    maxAttendees: "",
    hasNoLimit: false,
    genderSpecific: false,
    maxMale: "",
    maxFemale: "",
    maxTransgender: "",
    meetupFormat: "physical", // physical, virtual (removed hybrid)
    virtualLink: "",
    meetingCode: "",
    meetingPassword: "",
    meetupLocation: "", // Where the meetup will be held
    visibilityLocation: "", // Where the meetup will be visible
    visibilityRadius: 5, // Radius for visibility
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    image: null as File | null,
    tags: [] as string[],
    customTag: "",
    showCustomTagInput: false,
    allowChatContinuation: false,
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [showVirtualInfo, setShowVirtualInfo] = useState(false);
  const [showPaidPopup, setShowPaidPopup] = useState(false);
  const [showCreateConfirm, setShowCreateConfirm] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState(false);

  const categories = MEETUP_CATEGORIES;

  const popularTags = [
    "Beginner Friendly",
    "Advanced",
    "Networking",
    "Educational",
    "Fun",
    "Outdoor",
    "Indoor",
    "Workshop",
    "Discussion",
    "Hands-on",
  ];

  const paymentMethods = [
    "UPI (GPay, PhonePe, Paytm)",
    "Bank Transfer",
    "Cash at Venue",
    "Credit/Debit Card",
    "Digital Wallet",
    "Cryptocurrency",
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setMeetupData((prev) => ({ ...prev, image: file }));

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateDate = (dateStr: string) => {
    if (!dateStr) return "";

    const selectedDate = new Date(dateStr);
    const today = new Date();
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(today.getMonth() + 6);

    today.setHours(0, 0, 0, 0);
    selectedDate.setHours(0, 0, 0, 0);
    sixMonthsFromNow.setHours(23, 59, 59, 999);

    if (selectedDate < today) {
      return "Date cannot be in the past";
    }

    if (selectedDate > sixMonthsFromNow) {
      return "Date cannot be more than 6 months in the future";
    }

    return "";
  };

  const handleDateChange = (date: string) => {
    const dateError = validateDate(date);
    setErrors((prev) => ({ ...prev, date: dateError }));
    setMeetupData((prev) => ({ ...prev, date }));
  };

  const handleTagToggle = (tag: string) => {
    if (tag === "Others") {
      setMeetupData((prev) => ({
        ...prev,
        showCustomTagInput: !prev.showCustomTagInput,
      }));
      return;
    }

    setMeetupData((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  const handleCustomTagAdd = () => {
    if (
      meetupData.customTag.trim() &&
      !meetupData.tags.includes(meetupData.customTag.trim())
    ) {
      setMeetupData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.customTag.trim()],
        customTag: "",
        showCustomTagInput: false,
      }));
    }
  };

  const handleNoLimitChange = (checked: boolean) => {
    setMeetupData((prev) => ({
      ...prev,
      hasNoLimit: checked,
      maxAttendees: checked ? "" : prev.maxAttendees,
      genderSpecific: checked ? false : prev.genderSpecific,
      maxMale: checked ? "" : prev.maxMale,
      maxFemale: checked ? "" : prev.maxFemale,
    }));

    // Clear related errors
    if (checked) {
      setErrors((prev) => ({
        ...prev,
        maxAttendees: "",
        maxMale: "",
        maxFemale: "",
        genderLimit: "",
      }));
    }
  };

  const handleGenderSpecificChange = (checked: boolean) => {
    setMeetupData((prev) => ({
      ...prev,
      genderSpecific: checked,
      maxMale: checked ? prev.maxMale : "",
      maxFemale: checked ? prev.maxFemale : "",
      maxTransgender: checked ? prev.maxTransgender : "",
    }));

    if (!checked) {
      setErrors((prev) => ({
        ...prev,
        maxMale: "",
        maxFemale: "",
        maxTransgender: "",
        genderLimit: "",
      }));
    }
  };

  const handleVirtualSelection = () => {
    setMeetupData((prev) => ({ ...prev, meetupFormat: "virtual" }));
    setShowVirtualInfo(true);
  };

  const handlePaidSelection = () => {
    setShowPaidPopup(true);
  };

  const handleCreateConfirm = async () => {
    try {
      setIsCreating(true);
      setCreateError(null);

      const {
        location,
        image,
        customTag,
        showCustomTagInput,
        ...restMeetupData
      } = meetupData;

      const meetupDataToSend: CreateMeetupData = {
        ...restMeetupData,
        type: meetupData.type as "free" | "paid" | "invite-only",
        meetupFormat: meetupData.meetupFormat as "physical" | "virtual",
        date: new Date(meetupData.date).toISOString(),
        maxAttendees: meetupData.hasNoLimit
          ? undefined
          : parseInt(meetupData.maxAttendees) || undefined,
        maxMale: meetupData.genderSpecific
          ? parseInt(meetupData.maxMale) || undefined
          : undefined,
        maxFemale: meetupData.genderSpecific
          ? parseInt(meetupData.maxFemale) || undefined
          : undefined,
        maxTransgender: meetupData.genderSpecific
          ? parseInt(meetupData.maxTransgender) || undefined
          : undefined,
        // Handle virtual fields - only include if virtual meetup
        virtualLink:
          meetupData.meetupFormat === "virtual" && meetupData.virtualLink
            ? meetupData.virtualLink
            : undefined,
        meetingCode:
          meetupData.meetupFormat === "virtual" && meetupData.meetingCode
            ? meetupData.meetingCode
            : undefined,
        meetingPassword:
          meetupData.meetupFormat === "virtual" && meetupData.meetingPassword
            ? meetupData.meetingPassword
            : undefined,
        // Handle payment fields - only include if paid meetup
        price:
          meetupData.type === "paid" && meetupData.price
            ? meetupData.price
            : undefined,
        paymentMethod:
          meetupData.type === "paid" && meetupData.paymentMethod
            ? meetupData.paymentMethod
            : undefined,
        // Handle endTime - only include if provided
        endTime:
          meetupData.endTime && meetupData.endTime.trim() !== ""
            ? meetupData.endTime
            : undefined,
        // Handle location separately if needed
        location: meetupData.location
          ? {
              address: meetupData.location,
              coordinates: [0, 0] as [number, number], // Default coordinates
            }
          : undefined,
      };

      const createdMeetup = await meetupService.createMeetup(meetupDataToSend);
      console.log("Meetup created successfully:", createdMeetup);

      setCreateSuccess(true);
      setShowCreateConfirm(false);

      // Navigate to meetups page after a short delay to show success
      setTimeout(() => {
        navigate(ROUTES.MEETUPS);
      }, 1500);
    } catch (error) {
      console.error("Failed to create meetup:", error);
      setCreateError(
        error instanceof Error
          ? error.message
          : "Failed to create meetup. Please try again."
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCancelConfirm = () => {
    setShowCancelConfirm(false);
    navigate(ROUTES.MEETUPS);
  };

  const validateGenderLimits = () => {
    let genderError = "";

    if (meetupData.genderSpecific && !meetupData.hasNoLimit) {
      const maxTotal = parseInt(meetupData.maxAttendees) || 0;
      const maxMale = parseInt(meetupData.maxMale) || 0;
      const maxFemale = parseInt(meetupData.maxFemale) || 0;
      const maxTransgender = parseInt(meetupData.maxTransgender) || 0;

      if (maxTotal > 0 && maxMale + maxFemale + maxTransgender > maxTotal) {
        genderError =
          "Combined gender limits cannot exceed total max attendees";
      }

      if (
        meetupData.genderSpecific &&
        maxMale === 0 &&
        maxFemale === 0 &&
        maxTransgender === 0
      ) {
        genderError =
          "Please specify at least one gender limit when using gender-specific attendance";
      }
    }

    return genderError;
  };

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    if (!meetupData.title) newErrors.title = "Title is required";
    if (!meetupData.description)
      newErrors.description = "Description is required";
    if (!meetupData.category) newErrors.category = "Category is required";
    if (!meetupData.date) newErrors.date = "Date is required";
    if (!meetupData.startTime) newErrors.startTime = "Start time is required";

    if (!meetupData.hasNoLimit && !meetupData.maxAttendees) {
      newErrors.maxAttendees =
        'Max attendees is required (or enable "No Limit")';
    }

    if (meetupData.meetupFormat === "physical") {
      if (!meetupData.meetupLocation)
        newErrors.meetupLocation =
          "Meetup location is required for physical events";
    }

    if (!meetupData.visibilityLocation)
      newErrors.visibilityLocation = "Visibility location is required";

    if (meetupData.meetupFormat === "virtual") {
      if (!meetupData.virtualLink)
        newErrors.virtualLink = "Virtual link is required for virtual events";
    }

    if (meetupData.date) {
      const dateError = validateDate(meetupData.date);
      if (dateError) newErrors.date = dateError;
    }

    if (meetupData.type === "paid") {
      if (!meetupData.price)
        newErrors.price = "Price is required for paid events";
      if (!meetupData.paymentMethod)
        newErrors.paymentMethod = "Payment method is required for paid events";
    }

    if (meetupData.endTime && meetupData.startTime) {
      if (meetupData.endTime <= meetupData.startTime) {
        newErrors.endTime = "End time must be after start time";
      }
    }

    // Validate gender limits
    const genderError = validateGenderLimits();
    if (genderError) {
      newErrors.genderLimit = genderError;
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setShowCreateConfirm(true);
    }
  };

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

  const getFormatColor = (format: string) => {
    switch (format) {
      case "physical":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "virtual":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "physical":
        return <MapPin className="h-3 w-3" />;
      case "virtual":
        return <Monitor className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <AuthGuard
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="text-center">
            <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6">
              You need to be logged in to create a meetup.
            </p>
            <Button
              onClick={() => navigate(ROUTES.LOGIN)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              Go to Login
            </Button>
          </div>
        </div>
      }
    >
      <div
        className="max-w-4xl mx-auto space-y-6"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        <Card className="card-enhanced card-cream animate-slide-up relative">
          <CardHeader>
            <CardTitle className="flex items-start justify-between space-x-3">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-white" />
                </div>
                <span>Create New Meetup</span>
              </div>
              {/* Close Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(ROUTES.MEETUPS)}
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
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Basic Information</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Event Title *
                  </label>
                  <Input
                    placeholder="e.g. Downtown Photography Walk"
                    value={meetupData.title}
                    onChange={(e) =>
                      setMeetupData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                      errors.title ? "border-red-300" : ""
                    }`}
                  />
                  {errors.title && (
                    <p className="text-xs text-red-600">{errors.title}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Category *
                  </label>
                  <Select
                    value={meetupData.category}
                    onValueChange={(value) =>
                      setMeetupData((prev) => ({ ...prev, category: value }))
                    }
                  >
                    <SelectTrigger
                      className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl ${
                        errors.category ? "border-red-300" : ""
                      }`}
                    >
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-xs text-red-600">{errors.category}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Description *
                </label>
                <Textarea
                  placeholder="Describe what your meetup is about, what attendees can expect..."
                  value={meetupData.description}
                  onChange={(e) =>
                    setMeetupData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  className={`min-h-24 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none ${
                    errors.description ? "border-red-300" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-600">{errors.description}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Meetup Location (Place where the meetup will be held) *
                </label>
                <Input
                  placeholder="e.g. Central Park, Downtown Toronto, My House, Local Café"
                  value={meetupData.meetupLocation}
                  onChange={(e) =>
                    setMeetupData((prev) => ({
                      ...prev,
                      meetupLocation: e.target.value,
                    }))
                  }
                  className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                    errors.meetupLocation ? "border-red-300" : ""
                  }`}
                />
                {errors.meetupLocation && (
                  <p className="text-xs text-red-600">
                    {errors.meetupLocation}
                  </p>
                )}
              </div>
            </div>

            {/* Event Type - Compact */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Event Type</span>
              </h3>

              <div className="grid grid-cols-3 gap-3">
                {["free", "paid", "invite-only"].map((type) => (
                  <div
                    key={type}
                    className={`p-2 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                      meetupData.type === type
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 bg-white/60 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      type === "paid"
                        ? handlePaidSelection()
                        : setMeetupData((prev) => ({ ...prev, type }))
                    }
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`h-6 w-6 rounded-md flex items-center justify-center ${getTypeColor(
                          type
                        )}`}
                      >
                        {getTypeIcon(type)}
                      </div>
                      <h4 className="font-semibold text-gray-800 text-sm capitalize">
                        {type === "invite-only" ? "Invite Only" : type}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {meetupData.type === "paid" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-purple-50 rounded-xl border border-purple-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Entry Fee *
                    </label>
                    <Input
                      placeholder="e.g. ₹500"
                      value={meetupData.price}
                      onChange={(e) =>
                        setMeetupData((prev) => ({
                          ...prev,
                          price: e.target.value,
                        }))
                      }
                      className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                        errors.price ? "border-red-300" : ""
                      }`}
                    />
                    {errors.price && (
                      <p className="text-xs text-red-600">{errors.price}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Payment Method *
                    </label>
                    <Select
                      value={meetupData.paymentMethod}
                      onValueChange={(value) =>
                        setMeetupData((prev) => ({
                          ...prev,
                          paymentMethod: value,
                        }))
                      }
                    >
                      <SelectTrigger
                        className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl ${
                          errors.paymentMethod ? "border-red-300" : ""
                        }`}
                      >
                        <SelectValue placeholder="Select payment method" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.paymentMethod && (
                      <p className="text-xs text-red-600">
                        {errors.paymentMethod}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Meetup Format - Single Line */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Meetup Format</span>
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {["physical", "virtual"].map((format) => (
                  <div
                    key={format}
                    className={`p-3 border-2 rounded-xl cursor-pointer transition-all duration-300 ${
                      meetupData.meetupFormat === format
                        ? "border-blue-300 bg-blue-50"
                        : "border-gray-200 bg-white/60 hover:border-gray-300"
                    }`}
                    onClick={() =>
                      format === "virtual"
                        ? handleVirtualSelection()
                        : setMeetupData((prev) => ({
                            ...prev,
                            meetupFormat: format,
                          }))
                    }
                  >
                    <div className="flex items-center justify-center space-x-3">
                      <div
                        className={`h-6 w-6 rounded-md flex items-center justify-center ${getFormatColor(
                          format
                        )}`}
                      >
                        {getFormatIcon(format)}
                      </div>
                      <h4 className="font-semibold text-gray-800 capitalize">
                        {format}
                      </h4>
                    </div>
                  </div>
                ))}
              </div>

              {/* Virtual Link Input */}
              {meetupData.meetupFormat === "virtual" && (
                <div className="space-y-4 p-4 bg-green-50 rounded-xl border border-green-200">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                      <Link2 className="h-4 w-4" />
                      <span>Virtual Meetup Link *</span>
                    </label>
                    <Input
                      placeholder="e.g. https://zoom.us/j/123456789 or https://meet.google.com/abc-def-ghi"
                      value={meetupData.virtualLink}
                      onChange={(e) =>
                        setMeetupData((prev) => ({
                          ...prev,
                          virtualLink: e.target.value,
                        }))
                      }
                      className={`bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                        errors.virtualLink ? "border-red-300" : ""
                      }`}
                    />
                    {errors.virtualLink && (
                      <p className="text-xs text-red-600">
                        {errors.virtualLink}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Meeting Code (optional)
                      </label>
                      <Input
                        placeholder="e.g. 123 456 789"
                        value={meetupData.meetingCode}
                        onChange={(e) =>
                          setMeetupData((prev) => ({
                            ...prev,
                            meetingCode: e.target.value,
                          }))
                        }
                        className="bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Meeting Password (optional)
                      </label>
                      <Input
                        placeholder="e.g. meetup123"
                        value={meetupData.meetingPassword}
                        onChange={(e) =>
                          setMeetupData((prev) => ({
                            ...prev,
                            meetingPassword: e.target.value,
                          }))
                        }
                        className="bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-1">
                    Provide a Zoom, Google Meet, Teams, or other video
                    conferencing link for virtual attendees.
                  </p>
                </div>
              )}
            </div>

            {/* Virtual Meeting Info Dialog */}
            <Dialog open={showVirtualInfo} onOpenChange={setShowVirtualInfo}>
              <DialogContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center space-x-2">
                    <Monitor className="h-5 w-5 text-gray-600" />
                    <span>Virtual Meetup Setup</span>
                  </DialogTitle>
                  <DialogDescription>
                    For virtual meetups, you'll need to provide a video
                    conferencing link such as Google Meet, Zoom, Microsoft
                    Teams, or similar platform.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start space-x-3">
                      <Info className="h-5 w-5 text-green-600 mt-0.5" />
                      <div className="space-y-2">
                        <h4 className="font-semibold text-black">
                          Popular platforms:
                        </h4>
                        <ul className="text-sm text-black space-y-1">
                          <li>• Google Meet (meet.google.com)</li>
                          <li>• Zoom (zoom.us)</li>
                          <li>• Microsoft Teams</li>
                          <li>• Discord</li>
                          <li>• WebEx</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setShowVirtualInfo(false)}
                      className="rounded-xl"
                    >
                      Got it!
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Date, Time & Location - Fixed Layout */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Date, Time & Location</span>
              </h3>

              {/* Date - Full Width */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Date *
                </label>
                <Input
                  type="date"
                  value={meetupData.date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                    errors.date ? "border-red-300" : ""
                  }`}
                />
                {errors.date && (
                  <Alert className="p-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-xs">
                      {errors.date}
                    </AlertDescription>
                  </Alert>
                )}
              </div>

              {/* Start and End Time - Side by Side on All Screens */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Start Time *
                  </label>
                  <Input
                    type="time"
                    value={meetupData.startTime}
                    onChange={(e) =>
                      setMeetupData((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                    className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                      errors.startTime ? "border-red-300" : ""
                    }`}
                  />
                  {errors.startTime && (
                    <p className="text-xs text-red-600">{errors.startTime}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    End Time <span className="text-gray-500">(optional)</span>
                  </label>
                  <Input
                    type="time"
                    value={meetupData.endTime}
                    onChange={(e) =>
                      setMeetupData((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                    className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                      errors.endTime ? "border-red-300" : ""
                    }`}
                  />
                  {errors.endTime && (
                    <p className="text-xs text-red-600">{errors.endTime}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700">
                    Select Location where you want your meetup to be visible for
                    people to join *
                  </label>
                  <Input
                    placeholder="e.g. Connaught Place, Delhi"
                    value={meetupData.visibilityLocation}
                    onChange={(e) =>
                      setMeetupData((prev) => ({
                        ...prev,
                        visibilityLocation: e.target.value,
                      }))
                    }
                    className={`bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                      errors.visibilityLocation ? "border-red-300" : ""
                    }`}
                  />
                  {errors.visibilityLocation && (
                    <p className="text-xs text-red-600">
                      {errors.visibilityLocation}
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700">
                    Search Radius: {meetupData.visibilityRadius}km
                  </label>
                  <div className="px-4">
                    <input
                      type="range"
                      min="1"
                      max="50"
                      value={meetupData.visibilityRadius}
                      onChange={(e) =>
                        setMeetupData((prev) => ({
                          ...prev,
                          visibilityRadius: parseInt(e.target.value),
                        }))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>1km</span>
                      <span>50km</span>
                    </div>
                  </div>
                  {meetupData.visibilityRadius > 50 && (
                    <p className="text-xs text-blue-600">
                      <Crown className="h-3 w-3 inline mr-1" />
                      Premium option for radius above 50km
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Attendee Limits Section */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Attendee Limits</span>
              </h3>

              <div className="p-4 bg-blue-50 rounded-xl border border-blue-200 space-y-4">
                {/* No Limit Option */}
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id="no-limit"
                    checked={meetupData.hasNoLimit}
                    onCheckedChange={handleNoLimitChange}
                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                  />
                  <label
                    htmlFor="no-limit"
                    className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
                  >
                    <Infinity className="h-4 w-4" />
                    <span>No attendee limit</span>
                  </label>
                </div>

                {!meetupData.hasNoLimit && (
                  <>
                    {/* Max Attendees */}
                    <div className="space-y-2">
                      <label className="text-sm font-semibold text-gray-700">
                        Max Attendees *
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g. 25"
                        value={meetupData.maxAttendees}
                        onChange={(e) =>
                          setMeetupData((prev) => ({
                            ...prev,
                            maxAttendees: e.target.value,
                          }))
                        }
                        className={`bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                          errors.maxAttendees ? "border-red-300" : ""
                        }`}
                      />
                      {errors.maxAttendees && (
                        <p className="text-xs text-red-600">
                          {errors.maxAttendees}
                        </p>
                      )}
                    </div>

                    {/* Gender-Specific Limits */}
                    <div className="space-y-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          id="gender-specific"
                          checked={meetupData.genderSpecific}
                          onCheckedChange={handleGenderSpecificChange}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor="gender-specific"
                          className="text-sm font-semibold text-gray-700 flex items-center space-x-2"
                        >
                          <UserCheck className="h-4 w-4" />
                          <span>
                            Set separate limits for male and female attendees
                          </span>
                        </label>
                      </div>

                      {meetupData.genderSpecific && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-6">
                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                              Max Male Attendees
                            </label>
                            <Input
                              type="number"
                              placeholder="e.g. 12"
                              value={meetupData.maxMale}
                              onChange={(e) =>
                                setMeetupData((prev) => ({
                                  ...prev,
                                  maxMale: e.target.value,
                                }))
                              }
                              className={`bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                                errors.maxMale ? "border-red-300" : ""
                              }`}
                            />
                            {errors.maxMale && (
                              <p className="text-xs text-red-600">
                                {errors.maxMale}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                              Max Female Attendees
                            </label>
                            <Input
                              type="number"
                              placeholder="e.g. 13"
                              value={meetupData.maxFemale}
                              onChange={(e) =>
                                setMeetupData((prev) => ({
                                  ...prev,
                                  maxFemale: e.target.value,
                                }))
                              }
                              className={`bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                                errors.maxFemale ? "border-red-300" : ""
                              }`}
                            />
                            {errors.maxFemale && (
                              <p className="text-xs text-red-600">
                                {errors.maxFemale}
                              </p>
                            )}
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">
                              Max Transgender Attendees
                            </label>
                            <Input
                              type="number"
                              placeholder="e.g. 5"
                              value={meetupData.maxTransgender}
                              onChange={(e) =>
                                setMeetupData((prev) => ({
                                  ...prev,
                                  maxTransgender: e.target.value,
                                }))
                              }
                              className={`bg-white/90 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl ${
                                errors.maxTransgender ? "border-red-300" : ""
                              }`}
                            />
                            {errors.maxTransgender && (
                              <p className="text-xs text-red-600">
                                {errors.maxTransgender}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {errors.genderLimit && (
                        <Alert className="p-3 ml-6">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription className="text-xs">
                            {errors.genderLimit}
                          </AlertDescription>
                        </Alert>
                      )}

                      {meetupData.genderSpecific && (
                        <p className="text-xs text-gray-600 ml-6">
                          Leave a field empty if you don't want to set a limit
                          for that gender. The combined limits should not exceed
                          your total max attendees.
                        </p>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Event Image - Moved after Attendee Limits */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Event Image</span>
              </h3>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Upload Image
                </label>
                <div className="flex items-center space-x-4">
                  <label className="flex-1 flex items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-400 transition-colors duration-300 cursor-pointer bg-white/60">
                    <div className="text-center">
                      {imagePreview ? (
                        <div className="relative w-full h-28">
                          <ImageWithFallback
                            src={imagePreview}
                            alt="Event preview"
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="flex flex-col items-center space-y-2">
                          <Upload className="h-8 w-8 text-gray-400" />
                          <span className="text-sm text-gray-500">
                            Upload event image
                          </span>
                          <span className="text-xs text-gray-400">
                            JPG, PNG up to 5MB
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

            {/* Popular Tags - With Others Option */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800 flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-600 rounded-full"></div>
                <span>Popular Tags</span>
              </h3>

              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className={`cursor-pointer transition-colors duration-200 ${
                        meetupData.tags.includes(tag)
                          ? "bg-blue-100 border-blue-300 text-blue-700"
                          : "hover:bg-blue-50 hover:border-blue-300"
                      }`}
                      onClick={() => handleTagToggle(tag)}
                    >
                      {tag}
                    </Badge>
                  ))}

                  {/* Others Option */}
                  <Badge
                    variant="outline"
                    className={`cursor-pointer transition-colors duration-200 ${
                      meetupData.showCustomTagInput
                        ? "bg-purple-100 border-purple-300 text-purple-700"
                        : "hover:bg-purple-50 hover:border-purple-300 border-purple-200 text-purple-600"
                    }`}
                    onClick={() => handleTagToggle("Others")}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Others
                  </Badge>
                </div>

                {/* Custom Tag Input */}
                {meetupData.showCustomTagInput && (
                  <div className="flex space-x-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <Input
                      placeholder="Enter custom tag..."
                      value={meetupData.customTag}
                      onChange={(e) =>
                        setMeetupData((prev) => ({
                          ...prev,
                          customTag: e.target.value,
                        }))
                      }
                      className="flex-1 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-purple-500 rounded-lg"
                      onKeyPress={(e) =>
                        e.key === "Enter" && handleCustomTagAdd()
                      }
                    />
                    <Button
                      size="sm"
                      onClick={handleCustomTagAdd}
                      disabled={!meetupData.customTag.trim()}
                      className="rounded-lg"
                    >
                      Add
                    </Button>
                  </div>
                )}

                {/* Display Custom Tags */}
                {meetupData.tags.filter((tag) => !popularTags.includes(tag))
                  .length > 0 && (
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                    <span className="text-sm font-semibold text-gray-600">
                      Custom tags:
                    </span>
                    {meetupData.tags
                      .filter((tag) => !popularTags.includes(tag))
                      .map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="bg-purple-100 text-purple-700 border-purple-200 cursor-pointer"
                          onClick={() =>
                            setMeetupData((prev) => ({
                              ...prev,
                              tags: prev.tags.filter((t) => t !== tag),
                            }))
                          }
                        >
                          {tag}
                          <X className="h-3 w-3 ml-1" />
                        </Badge>
                      ))}
                  </div>
                )}
              </div>
            </div>

            {/* Chat Group - Light Green Background with Black Text */}
            <div className="p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-start space-x-3">
                <Info className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-sm text-black">
                    A temporary chat group will be automatically created for all
                    attendees to coordinate and communicate. The group will be
                    deleted 3 days after the event ends to maintain privacy.
                  </p>

                  <div className="flex items-center space-x-3">
                    <Checkbox
                      id="allow-chat-continuation"
                      checked={meetupData.allowChatContinuation}
                      onCheckedChange={(checked: boolean) =>
                        setMeetupData((prev) => ({
                          ...prev,
                          allowChatContinuation: checked,
                        }))
                      }
                      className="data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                    />
                    <label
                      htmlFor="allow-chat-continuation"
                      className="text-sm text-black"
                    >
                      Instead create a permanent chatgroup for people joining
                      the meetup
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(true)}
                className="rounded-xl"
              >
                Cancel
              </Button>

              <Button
                onClick={handleSubmit}
                className="rounded-xl px-6"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Calendar className="h-4 w-4 mr-2" />
                    Create Meetup
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Paid Meetup Popup */}
        <Dialog open={showPaidPopup} onOpenChange={setShowPaidPopup}>
          <DialogContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5 text-purple-600" />
                <span>Paid Meetups Coming Soon</span>
              </DialogTitle>
              <DialogDescription>
                We're working on integrating payment functionality for paid
                meetups. This feature will be available soon!
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end pt-4">
              <Button
                onClick={() => setShowPaidPopup(false)}
                className="rounded-xl"
              >
                Got it!
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Create Confirmation Dialog */}
        <Dialog open={showCreateConfirm} onOpenChange={setShowCreateConfirm}>
          <DialogContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Create Meetup</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to create this meetup? This action cannot
                be undone.
              </DialogDescription>
            </DialogHeader>

            {/* Error Display */}
            {createError && (
              <Alert className="p-3 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-sm text-red-700">
                  {createError}
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCreateConfirm(false)}
                className="flex-1 rounded-xl"
                disabled={isCreating}
              >
                No, Cancel
              </Button>
              <Button
                onClick={handleCreateConfirm}
                className="flex-1 rounded-xl"
                disabled={isCreating}
              >
                {isCreating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  "Yes, Create"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Success Dialog */}
        <Dialog open={createSuccess} onOpenChange={setCreateSuccess}>
          <DialogContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-green-600" />
                </div>
                <span>Meetup Created Successfully!</span>
              </DialogTitle>
              <DialogDescription>
                Your meetup has been created and is now visible to other users.
                You'll be redirected to the meetups page shortly.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-center pt-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Cancel Confirmation Dialog */}
        <Dialog open={showCancelConfirm} onOpenChange={setShowCancelConfirm}>
          <DialogContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <X className="h-5 w-5 text-red-600" />
                <span>Cancel Meetup Creation</span>
              </DialogTitle>
              <DialogDescription>
                Are you sure you want to cancel? All your progress will be lost.
              </DialogDescription>
            </DialogHeader>
            <div className="flex items-center space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-xl"
              >
                No, Continue
              </Button>
              <Button
                onClick={handleCancelConfirm}
                className="flex-1 rounded-xl"
              >
                Yes, Cancel
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AuthGuard>
  );
}
