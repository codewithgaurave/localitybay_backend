import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  _id: string;
  name: string;
  email: string;
  password: string;
  userId: string; // @username format
  avatar?: string;
  bio?: string;
  photos: string[]; // Array of photo URLs
  badges: string[]; // User badges like "Explorer", "Local Guide"
  location: {
    address: string;
    coordinates: [number, number]; // [longitude, latitude]
    city: string;
    state: string;
    country: string;
  };
  interests: string[];
  isVerified: boolean;
  isPremium: boolean;
  verificationDocument?: string;
  phone?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  privacy: {
    showLocation: boolean;
    showPhone: boolean;
    showEmail: boolean;
    profileVisibility: 'public' | 'friends' | 'private';
  };
  settings: {
    notifications: {
      email: boolean;
      push: boolean;
      meetups: boolean;
      messages: boolean;
    };
    radius: number; // in kilometers
  };
  stats: {
    meetupsJoined: number;
    meetupsCreated: number;
    communitiesJoined: number;
  };
  lastActive: Date;
  role: 'user' | 'admin' | 'moderator';
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    select: false
  },
  userId: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String
  },
  photos: [{
    type: String
  }],
  badges: [{
    type: String
  }],
  location: {
    address: { type: String, required: true },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true, default: 'India' }
  },
  interests: [{
    type: String,
    trim: true
  }],
  isVerified: {
    type: Boolean,
    default: false
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  verificationDocument: String,
  phone: {
    type: String
  },
  dateOfBirth: Date,
  gender: {
    type: String,
    enum: ['male', 'female', 'other', 'prefer-not-to-say']
  },
  privacy: {
    showLocation: { type: Boolean, default: true },
    showPhone: { type: Boolean, default: false },
    showEmail: { type: Boolean, default: false },
    profileVisibility: { 
      type: String, 
      enum: ['public', 'friends', 'private'],
      default: 'public'
    }
  },
  settings: {
    notifications: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      meetups: { type: Boolean, default: true },
      messages: { type: Boolean, default: true }
    },
    radius: { type: Number, default: 5, min: 1, max: 50 }
  },
  stats: {
    meetupsJoined: { type: Number, default: 0 },
    meetupsCreated: { type: Number, default: 0 },
    communitiesJoined: { type: Number, default: 0 }
  },
  lastActive: {
    type: Date,
    default: Date.now
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index for location-based queries
UserSchema.index({ 'location.coordinates': '2dsphere' });
UserSchema.index({ email: 1 });
UserSchema.index({ userId: 1 });
UserSchema.index({ isActive: 1 });
UserSchema.index({ lastActive: 1 });

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update lastActive on update operations
UserSchema.pre(/^update/, function(next) {
  const update = (this as any).getUpdate();
  if (update && typeof update === 'object') {
    update.lastActive = new Date();
  }
  next();
});

export const User = mongoose.model<IUser>('User', UserSchema); 