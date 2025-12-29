import mongoose, { Document, Schema } from "mongoose";
import {
  NOTICE_CATEGORIES,
  NOTICE_DURATIONS,
  NOTICE_STATUS,
  NOTICE_RADIUS,
  DURATION_HOURS_MAP,
} from "../constants";

export interface INotice extends Document {
  title: string;
  description: string;
  category: string;
  location: string;
  radius: number;
  contact?: string;
  urgent: boolean;
  duration: string;
  status: "active" | "expired" | "removed";
  createdBy: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  expiresAt?: Date;
}

const NoticeSchema = new Schema<INotice>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: NOTICE_CATEGORIES,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    radius: {
      type: Number,
      required: true,
      min: NOTICE_RADIUS.MIN,
      max: NOTICE_RADIUS.MAX,
      default: NOTICE_RADIUS.DEFAULT,
    },
    contact: {
      type: String,
      trim: true,
    },
    urgent: {
      type: Boolean,
      default: false,
    },
    duration: {
      type: String,
      required: true,
      enum: NOTICE_DURATIONS,
    },
    status: {
      type: String,
      enum: NOTICE_STATUS,
      default: "active",
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Calculate expiresAt based on duration
NoticeSchema.pre("save", function (next) {
  if (this.duration === "Permanent") {
    this.expiresAt = undefined;
  } else {
    const now = new Date();
    const hours =
      DURATION_HOURS_MAP[this.duration as keyof typeof DURATION_HOURS_MAP] || 0;
    this.expiresAt = new Date(now.getTime() + hours * 60 * 60 * 1000);
  }
  next();
});

export const Notice = mongoose.model<INotice>("Notice", NoticeSchema);
