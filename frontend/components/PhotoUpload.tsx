import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Camera,
  Image as ImageIcon,
  X,
  Plus,
  Check,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export function PhotoUpload() {
  const navigate = useNavigate();
  const [profilePhoto, setProfilePhoto] = useState<string>("");
  const [galleryPhotos, setGalleryPhotos] = useState<string[]>([]);

  // Mock photos for demonstration
  const samplePhotos = [
    "https://images.unsplash.com/photo-1494790108755-2616b5b65b75?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=300&h=300&fit=crop&crop=face",
  ];

  const sampleGalleryPhotos = [
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1501436513145-30f24e19fcc4?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=400&h=400&fit=crop",
  ];

  const handleProfilePhotoSelect = (photo: string) => {
    setProfilePhoto(photo);
  };

  const handleGalleryPhotoToggle = (photo: string) => {
    setGalleryPhotos((prev) =>
      prev.includes(photo) ? prev.filter((p) => p !== photo) : [...prev, photo]
    );
  };

  const handleContinue = () => {
    // Save photos to user data (would be API call in real app)
    console.log("Profile photo:", profilePhoto);
    console.log("Gallery photos:", galleryPhotos);
    navigate(ROUTES.HOME);
  };

  const handleSkip = () => {
    navigate(ROUTES.HOME);
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur-lg border-b border-blue-100/50 px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(ROUTES.INTERESTS_SELECTION)}
            className="p-2 hover:bg-blue-50 rounded-full"
          >
            <ArrowLeft className="h-5 w-5 text-blue-600" />
          </Button>
          <h1 className="text-lg font-bold text-gray-900">Add Your Photos</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="text-blue-600 hover:bg-blue-50"
          >
            Skip
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <div className="mb-6">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1516796181074-bf453fbfa3e6?w=500&h=300&fit=crop"
              alt="Profile photos showcase"
              className="w-full max-w-md mx-auto rounded-2xl shadow-lg"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            Show Your Best Self
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Add a profile photo and some gallery images to help others get to
            know you better. Great photos make great first impressions in Social
            City!
          </p>
        </div>

        {/* Profile Photo Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Camera className="h-5 w-5 mr-2 text-blue-500" />
            Choose Your Profile Photo
          </h3>

          {/* Current Profile Photo */}
          <div className="flex items-center space-x-4 mb-6">
            <Avatar className="h-20 w-20 border-4 border-white shadow-lg ring-4 ring-blue-100">
              {profilePhoto ? (
                <AvatarImage src={profilePhoto} alt="Profile" />
              ) : (
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <Camera className="h-8 w-8" />
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <p className="font-medium text-gray-900">
                {profilePhoto ? "Profile Photo Selected" : "No Profile Photo"}
              </p>
              <p className="text-sm text-gray-500">
                This will be your main photo visible to others
              </p>
            </div>
          </div>

          {/* Photo Selection Grid */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {samplePhotos.map((photo, index) => (
              <button
                key={index}
                onClick={() => handleProfilePhotoSelect(photo)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                  profilePhoto === photo
                    ? "border-blue-500 ring-2 ring-blue-200"
                    : "border-gray-200 hover:border-blue-300"
                }`}
              >
                <ImageWithFallback
                  src={photo}
                  alt={`Profile option ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                {profilePhoto === photo && (
                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                    <Check className="h-6 w-6 text-blue-600" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Upload Button */}
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your Own Photo
            </Button>
          </div>
        </div>

        {/* Gallery Photos Section */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-100 mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <ImageIcon className="h-5 w-5 mr-2 text-blue-500" />
            Add Gallery Photos
            <span className="ml-2 text-sm font-normal text-gray-500">
              ({galleryPhotos.length} selected)
            </span>
          </h3>

          <p className="text-sm text-gray-600 mb-4">
            Add photos that showcase your interests, travels, and personality.
            Select multiple photos for your gallery.
          </p>

          {/* Gallery Selection Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {sampleGalleryPhotos.map((photo, index) => {
              const isSelected = galleryPhotos.includes(photo);
              return (
                <button
                  key={index}
                  onClick={() => handleGalleryPhotoToggle(photo)}
                  className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-105 relative ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-200"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                >
                  <ImageWithFallback
                    src={photo}
                    alt={`Gallery option ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  {isSelected && (
                    <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                      <Check className="h-6 w-6 text-blue-600" />
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                      <Check className="h-3 w-3 text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Upload Button */}
          <div className="mt-4">
            <Button variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Upload Your Own Photos
            </Button>
          </div>
        </div>

        {/* Preview Section */}
        {(profilePhoto || galleryPhotos.length > 0) && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100 mb-8">
            <h4 className="text-lg font-semibold text-blue-900 mb-4">
              Preview Your Profile
            </h4>
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16 border-4 border-white shadow-lg">
                {profilePhoto ? (
                  <AvatarImage src={profilePhoto} alt="Profile preview" />
                ) : (
                  <AvatarFallback className="bg-gray-300">
                    <Camera className="h-6 w-6 text-gray-600" />
                  </AvatarFallback>
                )}
              </Avatar>
              <div className="flex-1">
                <p className="font-semibold text-gray-900">Your Name</p>
                <p className="text-sm text-gray-600 mb-2">@your_username</p>
                {galleryPhotos.length > 0 && (
                  <div className="flex space-x-1">
                    {galleryPhotos.slice(0, 4).map((photo, index) => (
                      <div
                        key={index}
                        className="w-8 h-8 rounded overflow-hidden border border-gray-200"
                      >
                        <ImageWithFallback
                          src={photo}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    {galleryPhotos.length > 4 && (
                      <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-600">
                        +{galleryPhotos.length - 4}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="outline"
            onClick={handleSkip}
            className="flex-1 sm:flex-none px-8 py-3 border-gray-300"
          >
            Skip for Now
          </Button>
          <Button
            onClick={handleContinue}
            className="flex-1 sm:flex-none px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Complete Setup
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 border border-green-100">
          <h4 className="font-semibold text-green-900 mb-2">📸 Photo Tips:</h4>
          <ul className="text-sm text-green-800 space-y-1">
            <li>• Use clear, well-lit photos for the best impression</li>
            <li>• Show your personality through diverse gallery images</li>
            <li>• Include photos of your hobbies and interests</li>
            <li>• You can always change or add more photos later</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
