import mongoose, { Document, Schema } from "mongoose";
import { ADVERTISEMENT_STATUS } from "../constants/";

export interface IAdvertisement extends Document {
  // Template reference
  template: mongoose.Types.ObjectId;

  // Advertisement details
  heading: string;
  briefDescription: string;
  contactInfo: string;
  location: string;
  website?: string;
  icon: string;

  // Detailed content
  detailedHeading: string;
  detailedDescription: string;
  specialOffers?: string;
  detailedLocation?: string;
  detailedWebsite?: string;
  detailedContactInfo?: string;
  additionalDetails?: string;

  // Location and pricing
  state: string;
  city: string;
  localities: string[];
  duration?: {
    hours?: number;
    days?: number;
  };
  pricing?: {
    basePrice?: number;
    discount?: number;
    finalPrice?: number;
    discountReason?: string;
  };

  // Status and metadata
  status: "draft" | "active" | "expired" | "removed";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  expiresAt: Date;

  // Media files
  uploadedFiles?: string[];
}

const AdvertisementSchema = new Schema<IAdvertisement>(
  {
    template: {
      type: Schema.Types.ObjectId,
      ref: "Template",
      required: true,
    },
    heading: {
      type: String,
      required: true,
      trim: true,
    },
    briefDescription: {
      type: String,
      required: true,
      trim: true,
    },
    contactInfo: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    website: {
      type: String,
      trim: true,
    },
    icon: {
      type: String,
      required: true,
    },
    detailedHeading: {
      type: String,
      required: true,
      trim: true,
    },
    detailedDescription: {
      type: String,
      required: true,
      trim: true,
    },
    specialOffers: {
      type: String,
      trim: true,
    },
    detailedLocation: {
      type: String,
      trim: true,
    },
    detailedWebsite: {
      type: String,
      trim: true,
    },
    detailedContactInfo: {
      type: String,
      trim: true,
    },
    additionalDetails: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    localities: [
      {
        type: String,
        required: false,
      },
    ],
    duration: {
      hours: {
        type: Number,
        required: false,
      },
      days: {
        type: Number,
        required: false,
      },
    },
    pricing: {
      basePrice: {
        type: Number,
        required: false,
        min: 0,
      },
      discount: {
        type: Number,
        default: 0,
      },
      finalPrice: {
        type: Number,
        required: false,
        min: 0,
      },
      discountReason: {
        type: String,
        trim: false,
      },
    },
    status: {
      type: String,
      enum: ADVERTISEMENT_STATUS,
      default: "draft",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
      required: false,
    },
    uploadedFiles: [String],
  },
  {
    timestamps: true,
  }
);

// Calculate expiresAt based on duration
AdvertisementSchema.pre("save", function (next) {
  const now = new Date();
  const totalHours =
    (this.duration?.hours ?? 0) + (this.duration?.days ?? 0) * 24;
  this.expiresAt = new Date(now.getTime() + totalHours * 60 * 60 * 1000);
  next();
});

export const Advertisement = mongoose.model<IAdvertisement>(
  "Advertisement",
  AdvertisementSchema
);
