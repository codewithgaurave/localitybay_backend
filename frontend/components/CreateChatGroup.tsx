import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import {
  ArrowLeft,
  Users,
  Lock,
  Globe,
  Camera,
  Music,
  Dumbbell,
  Coffee,
  Book,
  Gamepad2,
  Palette,
  Briefcase,
  Heart,
  Smartphone,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
  MoreHorizontal,
  Plus,
  X,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { FullScreenLayout } from "./FullScreenLayout";

export function CreateChatGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationAddress, setLocationAddress] = useState("");
  const [radius, setRadius] = useState("5");
  const [groupImage, setGroupImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  // Hierarchical location selection (Country → State → City → Locality)
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedLocality, setSelectedLocality] = useState<string>("");
  const [addedLocations, setAddedLocations] = useState<
    Array<{
      country: string;
      state: string | undefined;
      city: string | undefined;
      locality: string | undefined;
    }>
  >([]);

  // Mock hierarchical data; replace with API-backed data later
  const countries = ["India", "United States"];
  const statesByCountry: Record<string, string[]> = {
    India: ["Karnataka", "Maharashtra", "Delhi"],
    "United States": ["California", "New York", "Texas"],
  };
  const citiesByState: Record<string, string[]> = {
    Karnataka: ["Bengaluru", "Mysuru"],
    Maharashtra: ["Mumbai", "Pune"],
    Delhi: ["New Delhi"],
    California: ["San Francisco", "Los Angeles"],
    "New York": ["New York City", "Buffalo"],
    Texas: ["Austin", "Houston"],
  };
  const localitiesByCity: Record<string, string[]> = {
    Bengaluru: ["Indiranagar", "Koramangala", "Whitefield"],
    Mumbai: ["Bandra", "Andheri"],
    Pune: ["Kothrud", "Viman Nagar"],
    "New Delhi": ["Connaught Place", "Hauz Khas"],
    "San Francisco": ["SoMa", "Mission"],
    "Los Angeles": ["Hollywood", "Santa Monica"],
    "New York City": ["Manhattan", "Brooklyn"],
    Buffalo: ["Allentown"],
    Austin: ["Downtown", "Zilker"],
    Houston: ["Midtown", "Montrose"],
    Mysuru: ["VV Mohalla"],
  };

  useEffect(() => {
    // Reset lower levels when a higher level changes
    setSelectedState("");
    setSelectedCity("");
    setSelectedLocality("");
  }, [selectedCountry]);

  useEffect(() => {
    setSelectedCity("");
    setSelectedLocality("");
  }, [selectedState]);

  useEffect(() => {
    setSelectedLocality("");
  }, [selectedCity]);

  const addLocation = () => {
    if (!selectedCountry) return;
    const newLoc = {
      country: selectedCountry,
      state: selectedState || undefined,
      city: selectedCity || undefined,
      locality: selectedLocality || undefined,
    };
    const key = (l: typeof newLoc) =>
      [l.country, l.state || "", l.city || "", l.locality || ""].join("|");
    const exists = addedLocations.some((l) => key(l) === key(newLoc));
    if (!exists) {
      setAddedLocations((prev) => [...prev, newLoc]);
    }
  };

  const removeLocationAt = (index: number) => {
    setAddedLocations((prev) => prev.filter((_, i) => i !== index));
  };

  const categories = [
    {
      value: "photography",
      label: "Photography",
      icon: Camera,
      color: "bg-purple-100 text-purple-700",
    },
    {
      value: "fitness",
      label: "Fitness",
      icon: Dumbbell,
      color: "bg-red-100 text-red-700",
    },
    {
      value: "sports",
      label: "Sports",
      icon: Star,
      color: "bg-orange-100 text-orange-700",
    },
    {
      value: "music",
      label: "Music",
      icon: Music,
      color: "bg-pink-100 text-pink-700",
    },
    {
      value: "food",
      label: "Food & Drink",
      icon: Coffee,
      color: "bg-amber-100 text-amber-700",
    },
    {
      value: "learning",
      label: "Learning",
      icon: Book,
      color: "bg-blue-100 text-blue-700",
    },
    {
      value: "gaming",
      label: "Gaming",
      icon: Gamepad2,
      color: "bg-indigo-100 text-indigo-700",
    },
    {
      value: "arts",
      label: "Arts & Culture",
      icon: Palette,
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      value: "business",
      label: "Business",
      icon: Briefcase,
      color: "bg-gray-100 text-gray-700",
    },
    {
      value: "social",
      label: "Social",
      icon: Heart,
      color: "bg-rose-100 text-rose-700",
    },
    {
      value: "technology",
      label: "Technology",
      icon: Smartphone,
      color: "bg-cyan-100 text-cyan-700",
    },
    {
      value: "miscellaneous",
      label: "Miscellaneous",
      icon: MoreHorizontal,
      color: "bg-gray-100 text-gray-700",
    },
  ];

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setGroupImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRadiusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const numValue = parseInt(value);

    if (value === "" || (numValue >= 1 && numValue <= 100)) {
      setRadius(value);
    }
  };

  const handleCreateCommunity = () => {
    if (
      groupName.trim() &&
      selectedCategory &&
      description.trim() &&
      addedLocations.length > 0
    ) {
      // In a real app, this would make an API call to create the group
      console.log({
        name: groupName,
        description: description,
        category: selectedCategory,
        isPrivate: isPrivate,
        locations: addedLocations,
        image: groupImage,
      });

      // Navigate back to messages page
      navigate(ROUTES.COMMUNITIES);
    }
  };

  const getCategoryIcon = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.icon : Users;
  };

  const getCategoryColor = (categoryValue: string) => {
    const category = categories.find((cat) => cat.value === categoryValue);
    return category ? category.color : "bg-gray-100 text-gray-700";
  };

  return (
    <FullScreenLayout
      title="Create Community"
      className="px-0 py-0"
      onClose={() => navigate(ROUTES.COMMUNITIES)}
    >
      <div
        className="min-h-screen bg-white overflow-y-auto card-cream p-4 mb-10"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Header */}
        <div className="sticky top-0 z-50 border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3">
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Create a Community
                </h1>
                <p className="text-sm text-gray-500">
                  Build your local community
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form Content - Full Screen */}
        <div className="flex-1 p-4 space-y-6 pb-8">
          <Card className="card-cream border-0 shadow-none bg-transparent">
            <CardHeader className="px-0">
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Community Details</span>
              </CardTitle>
              <CardDescription>
                Set up your community with basic information and settings
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-6">
              {/* Community Image Upload */}
              <div>
                <Label
                  htmlFor="image-upload"
                  className="font-semibold text-gray-700"
                >
                  Community Image
                </Label>
                <div className="mt-2">
                  <div className="flex items-center space-x-4">
                    <div className="h-20 w-20 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                      {imagePreview ? (
                        <ImageWithFallback
                          src={imagePreview}
                          alt="Community preview"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Camera className="h-8 w-8 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <input
                        id="image-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          document.getElementById("image-upload")?.click()
                        }
                        className="rounded-xl"
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Upload Image
                      </Button>
                      <p className="text-xs text-gray-500 mt-1">
                        Max 5MB, JPG/PNG
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Name */}
              <div>
                <Label
                  htmlFor="group-name"
                  className="font-semibold text-gray-700"
                >
                  Community Name *
                </Label>
                <Input
                  id="group-name"
                  type="text"
                  placeholder="Enter community name..."
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="mt-2 rounded-xl border-gray-200 bg-white"
                  required
                />
              </div>

              {/* Community Description */}
              <div>
                <Label
                  htmlFor="description"
                  className="font-semibold text-gray-700"
                >
                  Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what your community is about, activities, goals, etc."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-2 rounded-xl border-gray-200 bg-white resize-none h-24"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  {description.length}/500 characters
                </p>
              </div>

              {/* Category Selection */}
              <div>
                <Label className="font-semibold text-gray-700">
                  Category *
                </Label>
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="mt-2 rounded-xl border-gray-200 bg-white">
                    <SelectValue placeholder="Choose a category" />
                  </SelectTrigger>
                  <SelectContent className="bg-white border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                    {categories.map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <SelectItem key={category.value} value={category.value}>
                          <div className="flex items-center space-x-3">
                            <div className={`p-1 rounded-md ${category.color}`}>
                              <IconComponent className="h-4 w-4" />
                            </div>
                            <span>{category.label}</span>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              {/* Privacy Selector */}
              <div>
                <Label className="font-semibold text-gray-700">
                  Privacy Settings
                </Label>
                <div className="grid grid-cols-2 gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsPrivate(false)}
                    className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all duration-200 ${
                      !isPrivate
                        ? "bg-white border-blue-300 ring-2 ring-blue-200 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Globe className="h-5 w-5 text-green-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Public Community
                      </p>
                      <p className="text-sm text-gray-600">
                        Anyone can discover and join
                      </p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsPrivate(true)}
                    className={`p-4 rounded-xl border text-left flex items-center space-x-3 transition-all duration-200 ${
                      isPrivate
                        ? "bg-white border-blue-300 ring-2 ring-blue-200 shadow-sm"
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <Lock className="h-5 w-5 text-orange-600" />
                    <div>
                      <p className="font-medium text-gray-900">
                        Private Community
                      </p>
                      <p className="text-sm text-gray-600">
                        Join by invite or admin approval
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Location and Coverage - Hierarchical Selection */}
              <div>
                <Label className="font-semibold text-gray-700">
                  Location & Coverage *
                </Label>

                {/* Country → State → City → Locality pickers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
                  <div>
                    <Label className="text-xs text-gray-600">Country</Label>
                    <Select
                      value={selectedCountry}
                      onValueChange={setSelectedCountry}
                    >
                      <SelectTrigger className="mt-1 rounded-xl border-gray-200 bg-white">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 rounded-xl">
                        {countries.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">State</Label>
                    <Select
                      value={selectedState}
                      onValueChange={setSelectedState}
                      disabled={!selectedCountry}
                    >
                      <SelectTrigger className="mt-1 rounded-xl border-gray-200 bg-white">
                        <SelectValue placeholder="Select state" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 rounded-xl">
                        {(statesByCountry[selectedCountry] || []).map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">City</Label>
                    <Select
                      value={selectedCity}
                      onValueChange={setSelectedCity}
                      disabled={!selectedState}
                    >
                      <SelectTrigger className="mt-1 rounded-xl border-gray-200 bg-white">
                        <SelectValue placeholder="Select city" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 rounded-xl">
                        {(citiesByState[selectedState] || []).map((ci) => (
                          <SelectItem key={ci} value={ci}>
                            {ci}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-600">Locality</Label>
                    <Select
                      value={selectedLocality}
                      onValueChange={setSelectedLocality}
                      disabled={!selectedCity}
                    >
                      <SelectTrigger className="mt-1 rounded-xl border-gray-200 bg-white">
                        <SelectValue placeholder="Select locality (optional)" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-200 rounded-xl">
                        {(localitiesByCity[selectedCity] || []).map((lo) => (
                          <SelectItem key={lo} value={lo}>
                            {lo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Add location action */}
                <div className="mt-3">
                  <Button
                    type="button"
                    onClick={addLocation}
                    disabled={!selectedCountry}
                    className="rounded-xl"
                  >
                    <Plus className="h-4 w-4 mr-2" /> Add location
                  </Button>
                </div>

                {/* Added locations list */}
                {addedLocations.length > 0 && (
                  <div className="mt-3 space-y-2">
                    <Label className="text-xs text-gray-600">
                      Selected locations
                    </Label>
                    <div className="flex flex-wrap gap-2">
                      {addedLocations.map((l, idx) => (
                        <span
                          key={`${l.country}-${l.state || ""}-${l.city || ""}-${
                            l.locality || ""
                          }-${idx}`}
                          className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs border border-blue-200"
                        >
                          {[l.country, l.state, l.city, l.locality]
                            .filter(Boolean)
                            .join(" • ")}
                          <button
                            type="button"
                            onClick={() => removeLocationAt(idx)}
                            className="ml-2 text-blue-500 hover:text-blue-700"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Updated Location Disclaimer */}
                <div className="flex items-start space-x-2 mt-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-1">
                      Important Location Notice
                    </p>
                    <p className="text-sm text-orange-700">
                      Your Community will be visible only in the locations you
                      add above (country/state/city/locality). If you choose a
                      broader scope (e.g., country without state), it will be
                      visible across that entire scope. Location selections may
                      not be editable later.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview Card */}
          {(groupName || selectedCategory) && (
            <Card className="card-cream border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-700">Preview</CardTitle>
                <CardDescription>
                  How your community will appear to others
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 p-4 bg-white rounded-xl border border-gray-100">
                  <div className="h-12 w-12 rounded-xl bg-gray-100 flex items-center justify-center overflow-hidden">
                    {imagePreview ? (
                      <ImageWithFallback
                        src={imagePreview}
                        alt="Preview"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <Users className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {groupName || "Community Name"}
                      </h3>
                      {isPrivate ? (
                        <Lock className="h-3 w-3 text-gray-400" />
                      ) : (
                        <Globe className="h-3 w-3 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      {selectedCategory && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getCategoryColor(
                            selectedCategory
                          )}`}
                        >
                          {
                            categories.find(
                              (cat) => cat.value === selectedCategory
                            )?.label
                          }
                        </Badge>
                      )}
                      <span className="text-xs text-gray-500">0 members</span>
                      {addedLocations.length > 0 && (
                        <span className="text-xs text-gray-500">
                          • {addedLocations.length} location
                          {addedLocations.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </div>
                    {description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {description}
                      </p>
                    )}
                    {addedLocations.length > 0 && (
                      <div className="flex items-center space-x-1 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500 truncate">
                          {[
                            addedLocations[0].country,
                            addedLocations[0].state,
                            addedLocations[0].city,
                            addedLocations[0].locality,
                          ]
                            .filter(Boolean)
                            .join(" • ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate(ROUTES.COMMUNITIES)}
              className="flex-1 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCommunity}
              disabled={
                !groupName.trim() ||
                !selectedCategory ||
                !description.trim() ||
                !locationAddress.trim()
              }
              className="flex-1 rounded-xl"
            >
              <Users className="h-4 w-4 mr-2" />
              Create Community
            </Button>
          </div>

          {/* Guidelines */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center mt-0.5">
                  <span className="text-xs text-blue-600">i</span>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-900">
                    Community Guidelines
                  </h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Keep discussions respectful and on-topic</li>
                    <li>• No spam, self-promotion, or inappropriate content</li>
                    <li>
                      • Communities with offensive content will be removed
                    </li>
                    <li>
                      • Help create a welcoming environment for all members
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </FullScreenLayout>
  );
}
