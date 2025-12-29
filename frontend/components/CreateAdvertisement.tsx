import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";
import { FullScreenLayout } from "./FullScreenLayout";
import {
  advertisementService,
  CreateAdvertisementData,
} from "../services/advertisementService";
import { templateService } from "../services/templateService";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
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
  X,
  Plus,
  MapPin,
  Phone,
  Mail,
  Globe,
  Clock,
  DollarSign,
  Image,
  Video,
  FileText,
  Star,
  Check,
  AlertCircle,
  Info,
  Palette,
  Target,
  Calendar,
  CreditCard,
} from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

// Icons for advertisements
const AD_ICONS = [
  { name: "Phone", icon: Phone, color: "text-blue-600" },
  { name: "Email", icon: Mail, color: "text-green-600" },
  { name: "Location", icon: MapPin, color: "text-red-600" },
  { name: "Website", icon: Globe, color: "text-purple-600" },
  { name: "Clock", icon: Clock, color: "text-orange-600" },
  { name: "Star", icon: Star, color: "text-yellow-600" },
];

// Location data
const STATES = [
  "Delhi",
  "Maharashtra",
  "Karnataka",
  "Tamil Nadu",
  "West Bengal",
  "Gujarat",
  "Rajasthan",
  "Uttar Pradesh",
  "Punjab",
  "Haryana",
];

const CITIES = {
  Delhi: [
    "New Delhi",
    "Central Delhi",
    "East Delhi",
    "West Delhi",
    "North Delhi",
    "South Delhi",
  ],
  Maharashtra: ["Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur"],
  Karnataka: [
    "Bangalore",
    "Mysore",
    "Hubli",
    "Mangalore",
    "Belgaum",
    "Gulbarga",
  ],
  "Tamil Nadu": [
    "Chennai",
    "Coimbatore",
    "Madurai",
    "Tiruchirappalli",
    "Salem",
    "Tirunelveli",
  ],
  "West Bengal": [
    "Kolkata",
    "Howrah",
    "Durgapur",
    "Asansol",
    "Siliguri",
    "Bardhaman",
  ],
};

const LOCALITIES = {
  "New Delhi": [
    "Connaught Place",
    "Karol Bagh",
    "Lajpat Nagar",
    "Rajouri Garden",
    "Paharganj",
    "Chandni Chowk",
  ],
  Mumbai: ["Andheri", "Bandra", "Powai", "Malad", "Borivali", "Thane"],
  Bangalore: [
    "Koramangala",
    "Indiranagar",
    "Whitefield",
    "Electronic City",
    "Marathahalli",
    "HSR Layout",
  ],
  Chennai: [
    "T. Nagar",
    "Anna Nagar",
    "Velachery",
    "Adyar",
    "Mylapore",
    "Tambaram",
  ],
  Kolkata: [
    "Park Street",
    "Salt Lake",
    "New Town",
    "Ballygunge",
    "Garia",
    "Behala",
  ],
};

export function CreateAdvertisement() {
  const navigate = useNavigate();

  // Template selection
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [localities, setLocalities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Advertisement details
  const [adDetails, setAdDetails] = useState({
    heading: "",
    briefDescription: "",
    contactInfo: "",
    website: "",
    location: "",
    icon: "Phone",
    category: "",
  });

  // Detailed content
  const [detailedContent, setDetailedContent] = useState({
    heading: "",
    description: "",
    specialOffers: "",
    website: "",
    contactInfo: "",
    additionalDetails: "",
    location: "",
  });

  // Location selection
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);
  const [duration, setDuration] = useState({ hours: 1, days: 0 });

  // Pricing
  const [pricing, setPricing] = useState({
    basePrice: 0,
    discount: 0,
    finalPrice: 0,
    discountReason: "",
  });

  // File uploads
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [templatesData, statesData] = await Promise.all([
          templateService.getActiveTemplates(),
          advertisementService.getStates(),
        ]);
        setTemplates(templatesData);
        setStates(statesData);
      } catch (error) {
        console.error("Error loading initial data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Load cities when state changes
  useEffect(() => {
    if (selectedState) {
      advertisementService
        .getCitiesByState(selectedState)
        .then(setCities)
        .catch(console.error);
    }
  }, [selectedState]);

  // Load localities when city changes
  useEffect(() => {
    if (selectedCity) {
      advertisementService
        .getLocalitiesByCity(selectedCity)
        .then(setLocalities)
        .catch(console.error);
    }
  }, [selectedCity]);

  // Calculate pricing
  useEffect(() => {
    const basePrice = selectedLocalities.length * duration.hours * 2.5;
    let discount = 0;

    if (selectedLocalities.length >= 5) discount += 20;
    if (duration.days >= 2) discount += 30;

    const discountAmount = (basePrice * discount) / 100;
    const finalPrice = basePrice - discountAmount;

    let discountReason = "";
    if (selectedLocalities.length >= 5) {
      discountReason = "20% off for 5+ localities";
    } else if (duration.days >= 2) {
      discountReason = "30% off for 2+ days";
    }

    setPricing({
      basePrice,
      discount,
      finalPrice,
      discountReason,
    });
  }, [selectedLocalities, duration]);

  const handleTemplateSelect = (template: any) => {
    setSelectedTemplate(template);
    setShowTemplateModal(false);
  };

  const handleLocalityToggle = (locality: string) => {
    setSelectedLocalities((prev) =>
      prev.includes(locality)
        ? prev.filter((l) => l !== locality)
        : [...prev, locality]
    );
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setUploadedFiles((prev) => [...prev, ...files].slice(0, 5));
  };

  const handleSubmit = async () => {
    if (!selectedTemplate) {
      alert("Please select a template");
      return;
    }

    try {
      setIsLoading(true);

      const advertisementData: CreateAdvertisementData = {
        template: selectedTemplate._id,
        heading: adDetails.heading,
        briefDescription: adDetails.briefDescription,
        contactInfo: adDetails.contactInfo,
        location: adDetails.location,
        website: adDetails.website,
        icon: adDetails.icon,
        detailedHeading: detailedContent.heading,
        detailedDescription: detailedContent.description,
        uploadedFiles: uploadedFiles.map((file) => URL.createObjectURL(file)),
        specialOffers: detailedContent.specialOffers,
        detailedLocation: detailedContent.location,
        detailedWebsite: detailedContent.website,
        detailedContactInfo: detailedContent.contactInfo,
        additionalDetails: detailedContent.additionalDetails,
        state: selectedState,
        city: selectedCity,
        localities: selectedLocalities,
        duration,
      };

      await advertisementService.createAdvertisement(advertisementData);
      navigate(ROUTES.NOTICES);
    } catch (error) {
      console.error("Error creating advertisement:", error);
      alert("Failed to create advertisement. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FullScreenLayout
      title="Create Advertisement"
      onClose={() => navigate(ROUTES.NOTICES)}
    >
      <div
        className="relative min-h-screen"
        style={{ fontFamily: "'Urbanist', sans-serif" }}
      >
        {/* Subtle Business/Marketing Background */}
        <div className="fixed inset-0 z-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1560472355-536de3962603?w=1920&h=1080&fit=crop"
            alt="Business marketing background"
            className="w-full h-full object-cover opacity-[0.025]"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/98 via-white/99 to-white/98" />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 space-y-6 mb-20">
          <Card className="card-enhanced card-cream animate-slide-up">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center space-x-3 animate-slide-down">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 via-slate-700 to-gray-800 flex items-center justify-center">
                    <span className="text-white text-lg font-bold">₹</span>
                  </div>
                  <span>
                    Create{" "}
                    <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                      Advertisement
                    </span>
                  </span>
                  <Badge
                    variant="secondary"
                    className="bg-green-100 text-green-700 border-green-200"
                  >
                    Post Your Ad
                  </Badge>
                </CardTitle>

                {/* Close Button */}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(ROUTES.NOTICES)}
                  className="h-8 w-8 p-0 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selection */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700">
                  Choose Template
                </label>
                <p className="text-xs text-gray-500">
                  This will be visible on the notice page
                </p>
                {!selectedTemplate ? (
                  <Button
                    onClick={() => setShowTemplateModal(true)}
                    className="w-full h-32 border-2 border-dashed border-gray-300 hover:border-blue-500"
                    variant="outline"
                  >
                    <div className="text-center">
                      <Palette className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                      <p className="text-gray-600">Select a Template</p>
                    </div>
                  </Button>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <img
                          src={selectedTemplate.image}
                          alt={selectedTemplate.name}
                          className="w-16 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <h3 className="font-semibold">
                            {selectedTemplate.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {selectedTemplate.description || "Template"}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowTemplateModal(true)}
                      >
                        Change Template
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {/* Advertisement Details */}
              {selectedTemplate && (
                <>
                  {/* Title and Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Ad Title <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={adDetails.heading}
                        onChange={(e) =>
                          setAdDetails((prev) => ({
                            ...prev,
                            heading: e.target.value,
                          }))
                        }
                        placeholder="Ad title..."
                        maxLength={50}
                        className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {adDetails.heading.length}/50
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <Select
                        value={adDetails.category}
                        onValueChange={(value: string) =>
                          setAdDetails((prev) => ({ ...prev, category: value }))
                        }
                      >
                        <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                          <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                          <SelectItem
                            value="services"
                            className="cursor-pointer"
                          >
                            Services
                          </SelectItem>
                          <SelectItem
                            value="products"
                            className="cursor-pointer"
                          >
                            Products
                          </SelectItem>
                          <SelectItem value="events" className="cursor-pointer">
                            Events
                          </SelectItem>
                          <SelectItem
                            value="housing"
                            className="cursor-pointer"
                          >
                            Housing
                          </SelectItem>
                          <SelectItem value="jobs" className="cursor-pointer">
                            Jobs
                          </SelectItem>
                          <SelectItem value="other" className="cursor-pointer">
                            Other
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Brief Description <span className="text-red-500">*</span>
                    </label>
                    <Textarea
                      value={adDetails.briefDescription}
                      onChange={(e) =>
                        setAdDetails((prev) => ({
                          ...prev,
                          briefDescription: e.target.value,
                        }))
                      }
                      placeholder="Describe your ad..."
                      maxLength={100}
                      rows={2}
                      className="min-h-16 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {adDetails.briefDescription.length}/100
                    </p>
                  </div>

                  {/* Contact and Location */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Contact Info <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={adDetails.contactInfo}
                        onChange={(e) =>
                          setAdDetails((prev) => ({
                            ...prev,
                            contactInfo: e.target.value,
                          }))
                        }
                        placeholder="Phone/Email"
                        maxLength={30}
                        className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {adDetails.contactInfo.length}/30
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={adDetails.location}
                        onChange={(e) =>
                          setAdDetails((prev) => ({
                            ...prev,
                            location: e.target.value,
                          }))
                        }
                        placeholder="Location"
                        maxLength={50}
                        className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {adDetails.location.length}/50
                      </p>
                    </div>
                  </div>

                  {/* Website */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Website (Optional)
                    </label>
                    <Input
                      value={adDetails.website}
                      onChange={(e) =>
                        setAdDetails((prev) => ({
                          ...prev,
                          website: e.target.value,
                        }))
                      }
                      placeholder="https://example.com"
                      type="url"
                      className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                    />
                  </div>

                  {/* Icon Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-700">
                      Choose Icon
                    </label>
                    <div className="flex space-x-2">
                      {AD_ICONS.map((iconData) => (
                        <button
                          key={iconData.name}
                          onClick={() =>
                            setAdDetails((prev) => ({
                              ...prev,
                              icon: iconData.name,
                            }))
                          }
                          className={`p-2 rounded-lg border-2 ${
                            adDetails.icon === iconData.name
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <iconData.icon
                            className={`h-5 w-5 ${iconData.color}`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Detailed Content Section */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                      These details will be visible when users open your
                      advertisement
                    </h3>

                    {/* Detailed Heading */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Detailed Heading <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={detailedContent.heading}
                        onChange={(e) =>
                          setDetailedContent((prev) => ({
                            ...prev,
                            heading: e.target.value,
                          }))
                        }
                        placeholder="Detailed heading (max 100 chars)"
                        maxLength={100}
                        className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {detailedContent.heading.length}/100
                      </p>
                    </div>

                    {/* Detailed Description */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Detailed Description{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <Textarea
                        value={detailedContent.description}
                        onChange={(e) =>
                          setDetailedContent((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                        placeholder="Detailed description (max 500 chars)"
                        maxLength={500}
                        rows={4}
                        className="min-h-16 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {detailedContent.description.length}/500
                      </p>
                    </div>

                    {/* File Upload */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Upload Photos/Videos/Catalogue
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                        <input
                          type="file"
                          multiple
                          accept="image/*,video/*,.pdf"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          <div className="text-center">
                            <Image className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                            <p className="text-gray-600">
                              Click to upload files (max 5)
                            </p>
                            <p className="text-xs text-gray-500">
                              Images, Videos, PDFs supported
                            </p>
                          </div>
                        </label>
                        {uploadedFiles.length > 0 && (
                          <div className="mt-4 space-y-2">
                            {uploadedFiles.map((file, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between bg-gray-50 p-2 rounded"
                              >
                                <span className="text-sm">{file.name}</span>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() =>
                                    setUploadedFiles((prev) =>
                                      prev.filter((_, i) => i !== index)
                                    )
                                  }
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Special Offers */}
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Special Offers
                      </label>
                      <Textarea
                        value={detailedContent.specialOffers}
                        onChange={(e) =>
                          setDetailedContent((prev) => ({
                            ...prev,
                            specialOffers: e.target.value,
                          }))
                        }
                        placeholder="Any special offers or discounts (max 200 chars)"
                        maxLength={200}
                        rows={2}
                        className="min-h-16 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {detailedContent.specialOffers.length}/200
                      </p>
                    </div>

                    {/* Location and Website */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Location
                        </label>
                        <Input
                          value={detailedContent.location}
                          onChange={(e) =>
                            setDetailedContent((prev) => ({
                              ...prev,
                              location: e.target.value,
                            }))
                          }
                          placeholder="Business address"
                          maxLength={100}
                          className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Website
                        </label>
                        <Input
                          value={detailedContent.website}
                          onChange={(e) =>
                            setDetailedContent((prev) => ({
                              ...prev,
                              website: e.target.value,
                            }))
                          }
                          placeholder="https://example.com"
                          type="url"
                          className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                    </div>

                    {/* Contact Info and Additional Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Contact Info
                        </label>
                        <Input
                          value={detailedContent.contactInfo}
                          onChange={(e) =>
                            setDetailedContent((prev) => ({
                              ...prev,
                              contactInfo: e.target.value,
                            }))
                          }
                          placeholder="Phone, Email, etc."
                          className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Additional Details
                        </label>
                        <Textarea
                          value={detailedContent.additionalDetails}
                          onChange={(e) =>
                            setDetailedContent((prev) => ({
                              ...prev,
                              additionalDetails: e.target.value,
                            }))
                          }
                          placeholder="Any other important details (max 300 chars)"
                          maxLength={300}
                          rows={2}
                          className="min-h-16 bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl resize-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          {detailedContent.additionalDetails.length}/300
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Location Selection */}
                  <div className="space-y-4 pt-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Choose location of your Advertisement
                      </h3>
                      <p className="text-xs text-gray-500">
                        Advertisement will be visible to users in the selected
                        location
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          State
                        </label>
                        <Select
                          value={selectedState}
                          onValueChange={setSelectedState}
                        >
                          <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                            <SelectValue placeholder="Select State" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                            {STATES.map((state) => (
                              <SelectItem
                                key={state}
                                value={state}
                                className="cursor-pointer"
                              >
                                {state}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          City
                        </label>
                        <Select
                          value={selectedCity}
                          onValueChange={setSelectedCity}
                          disabled={!selectedState}
                        >
                          <SelectTrigger className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                            <SelectValue placeholder="Select City" />
                          </SelectTrigger>
                          <SelectContent className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 rounded-xl">
                            {selectedState &&
                              CITIES[selectedState as keyof typeof CITIES]?.map(
                                (city) => (
                                  <SelectItem
                                    key={city}
                                    value={city}
                                    className="cursor-pointer"
                                  >
                                    {city}
                                  </SelectItem>
                                )
                              )}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Duration <span className="text-red-500">*</span>
                        </label>
                        <div className="flex space-x-2">
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                              Hours
                            </label>
                            <Input
                              type="number"
                              value={duration.hours}
                              onChange={(e) =>
                                setDuration((prev) => ({
                                  ...prev,
                                  hours: parseInt(e.target.value) || 0,
                                }))
                              }
                              placeholder="Hours"
                              min="1"
                              max="24"
                              className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="block text-xs text-gray-600 mb-1">
                              Days
                            </label>
                            <Input
                              type="number"
                              value={duration.days}
                              onChange={(e) =>
                                setDuration((prev) => ({
                                  ...prev,
                                  days: parseInt(e.target.value) || 0,
                                }))
                              }
                              placeholder="Days"
                              min="0"
                              max="30"
                              className="bg-white/80 border-gray-200 transition-all duration-300 hover:border-gray-300 focus:border-blue-500 rounded-xl"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {selectedCity && (
                      <div>
                        <label className="block text-sm font-medium mb-1">
                          Select Localities
                        </label>
                        <p className="text-xs text-gray-500 mb-2">
                          Choose multiple localities where your ad will be
                          visible
                        </p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-40 overflow-y-auto">
                          {LOCALITIES[
                            selectedCity as keyof typeof LOCALITIES
                          ]?.map((locality) => (
                            <button
                              key={locality}
                              onClick={() => handleLocalityToggle(locality)}
                              className={`p-2 text-sm rounded-lg border-2 transition-colors ${
                                selectedLocalities.includes(locality)
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              {locality}
                            </button>
                          ))}
                        </div>
                        {selectedLocalities.length > 0 && (
                          <div className="mt-2">
                            <p className="text-sm font-medium text-gray-700">
                              Selected: {selectedLocalities.length} localities
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Pricing Section */}
                  {selectedLocalities.length > 0 && (
                    <div className="space-y-4 pt-4 border-t border-gray-200">
                      <h3 className="text-lg font-semibold text-gray-800">
                        Pricing
                      </h3>

                      {/* Discount Graphics */}
                      {pricing.discount > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4 animate-pulse">
                          <div className="flex items-center space-x-2">
                            <Check className="h-5 w-5 text-green-600" />
                            <span className="text-sm font-semibold text-green-700">
                              🎉 {pricing.discount}% OFF -{" "}
                              {pricing.discountReason}!
                            </span>
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>
                              Base Price (₹2.5 per locality per hour):
                            </span>
                            <span>₹{pricing.basePrice.toFixed(2)}</span>
                          </div>
                          {pricing.discount > 0 && (
                            <div className="flex justify-between text-green-600">
                              <span>Discount ({pricing.discount}%):</span>
                              <span>
                                -₹
                                {(
                                  (pricing.basePrice * pricing.discount) /
                                  100
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                          <div className="flex justify-between font-semibold text-lg border-t pt-2">
                            <span>Total:</span>
                            <span>₹{pricing.finalPrice.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-4 pt-4 border-t border-gray-200">
                    <Button
                      onClick={() => setShowPreview(true)}
                      variant="outline"
                      className="flex-1"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Preview Advertisement
                    </Button>

                    <Button
                      onClick={handleSubmit}
                      disabled={
                        !selectedTemplate || selectedLocalities.length === 0
                      }
                      className="flex-1"
                    >
                      <CreditCard className="h-4 w-4 mr-2" />
                      Create Advertisement (₹{pricing.finalPrice.toFixed(2)})
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Template Selection Modal */}
          <Dialog open={showTemplateModal} onOpenChange={setShowTemplateModal}>
            <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Choose a Template</DialogTitle>
                <DialogDescription>
                  Select a template for your advertisement. This will be visible
                  on the notice page.
                </DialogDescription>
              </DialogHeader>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {isLoading ? (
                  <div className="col-span-full text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-sm text-gray-600 mt-2">
                      Loading templates...
                    </p>
                  </div>
                ) : templates.length === 0 ? (
                  <div className="col-span-full text-center py-8">
                    <p className="text-gray-600">No templates available</p>
                  </div>
                ) : (
                  templates.map((template) => (
                    <button
                      key={template._id}
                      onClick={() => handleTemplateSelect(template)}
                      className="p-4 border-2 border-gray-200 rounded-lg hover:border-blue-500 transition-colors"
                    >
                      <img
                        src={template.image}
                        alt={template.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <p className="text-xs text-gray-600">
                        {template.description || "Template"}
                      </p>
                    </button>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* Advertisement Preview Modal */}
          <Dialog open={showPreview} onOpenChange={setShowPreview}>
            <DialogContent className="bg-white max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Advertisement Preview</DialogTitle>
                <DialogDescription>
                  This is how your advertisement will appear to users
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6">
                {/* Header Card Preview */}
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">
                    Header Card (Notice Page)
                  </h3>
                  <div className="bg-white border rounded-lg p-4">
                    <img
                      src={selectedTemplate?.image}
                      alt="Template preview"
                      className="w-full h-24 object-cover rounded mb-2"
                    />
                    <h4 className="font-semibold text-lg">
                      {adDetails.heading}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {adDetails.briefDescription}
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        {adDetails.contactInfo}
                      </span>
                      {adDetails.website && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          Website
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Full Advertisement Preview */}
                <div className="border-2 border-gray-200 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Full Advertisement</h3>
                  <div className="bg-white border rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      {detailedContent.heading}
                    </h2>
                    <p className="text-gray-700 mb-4">
                      {detailedContent.description}
                    </p>

                    {uploadedFiles.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Attachments:</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {uploadedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="bg-gray-50 p-2 rounded text-sm"
                            >
                              {file.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {detailedContent.specialOffers && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                        <h4 className="font-semibold text-yellow-800">
                          Special Offers
                        </h4>
                        <p className="text-yellow-700">
                          {detailedContent.specialOffers}
                        </p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {detailedContent.location && (
                        <div>
                          <h4 className="font-semibold">Location</h4>
                          <p className="text-gray-600">
                            {detailedContent.location}
                          </p>
                        </div>
                      )}
                      {detailedContent.website && (
                        <div>
                          <h4 className="font-semibold">Website</h4>
                          <a
                            href={detailedContent.website}
                            className="text-blue-600 hover:underline"
                          >
                            {detailedContent.website}
                          </a>
                        </div>
                      )}
                    </div>

                    {detailedContent.contactInfo && (
                      <div className="mb-4">
                        <h4 className="font-semibold">Contact Info</h4>
                        <p className="text-gray-600">
                          {detailedContent.contactInfo}
                        </p>
                      </div>
                    )}

                    {detailedContent.additionalDetails && (
                      <div>
                        <h4 className="font-semibold">Additional Details</h4>
                        <p className="text-gray-600">
                          {detailedContent.additionalDetails}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </FullScreenLayout>
  );
}
