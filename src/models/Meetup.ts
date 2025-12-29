import mongoose, { Document, Schema } from 'mongoose';

export interface IMeetup extends Document {
  _id: string;
  title: string;
  description: string;
  category: string;
  creator: mongoose.Types.ObjectId;
  type: 'free' | 'paid' | 'invite-only';
  meetupFormat: 'physical' | 'virtual';
  meetupLocation: string; // Where the meetup will be held (café, house, ground, etc.)
  visibilityLocation: string; // Where the meetup will be visible for people to join
  visibilityRadius: number; // Radius in km for visibility
  location?: {
    address: string;
    coordinates: [number, number];
    venue?: string;
  };
  virtualLink?: string; // For virtual meetups
  meetingCode?: string; // Meeting code for virtual meetups
  meetingPassword?: string; // Meeting password for virtual meetups
  date: Date;
  startTime: string; // HH:MM format
  endTime?: string; // HH:MM format
  maxAttendees?: number; // Can be null for unlimited
  hasNoLimit: boolean;
  genderSpecific: boolean;
  maxMale?: number;
  maxFemale?: number;
  maxTransgender?: number; // New field for transgender attendees
  currentAttendees: number;
  attendees: mongoose.Types.ObjectId[];
  waitingList: mongoose.Types.ObjectId[];
  tags: string[];
  image?: string; // Single event image
  price?: string; // For paid events
  paymentMethod?: string; // For paid events
  allowChatContinuation: boolean;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const MeetupSchema = new Schema<IMeetup>({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'free'
  },
  meetupFormat: {
    type: String,
    required: true,
    default: 'physical'
  },
  meetupLocation: {
    type: String,
    required: true,
    trim: true
  },
  visibilityLocation: {
    type: String,
    required: true,
    trim: true
  },
  visibilityRadius: {
    type: Number,
    required: true,
    min: 1,
    max: 50
  },
  location: {
    address: { type: String },
    coordinates: {
      type: [Number],
      index: '2dsphere'
    },
    venue: String
  },
  virtualLink: {
    type: String
  },
  meetingCode: {
    type: String
  },
  meetingPassword: {
    type: String
  },
  date: {
    type: Date,
    required: true
  },
  startTime: {
    type: String,
    required: true
  },
  endTime: {
    type: String
  },
  maxAttendees: {
    type: Number
  },
  hasNoLimit: {
    type: Boolean,
    default: false
  },
  genderSpecific: {
    type: Boolean,
    default: false
  },
  maxMale: {
    type: Number
  },
  maxFemale: {
    type: Number
  },
  maxTransgender: {
    type: Number
  },
  currentAttendees: {
    type: Number,
    default: 0
  },
  attendees: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  waitingList: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String
  }],
  image: {
    type: String
  },
  price: {
    type: String
  },
  paymentMethod: {
    type: String
  },
  allowChatContinuation: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
MeetupSchema.index({ 'location.coordinates': '2dsphere' });
MeetupSchema.index({ date: 1 });
MeetupSchema.index({ category: 1 });
MeetupSchema.index({ status: 1 });
MeetupSchema.index({ creator: 1 });
MeetupSchema.index({ type: 1 });
MeetupSchema.index({ meetupFormat: 1 });

// Virtual for checking if meetup is full
MeetupSchema.virtual('isFull').get(function() {
  if (this.hasNoLimit) return false;
  return this.currentAttendees >= (this.maxAttendees || 0);
});

// Auto-update attendee count
MeetupSchema.pre('save', function(next) {
  this.currentAttendees = this.attendees.length;
  next();
});

export const Meetup = mongoose.model<IMeetup>('Meetup', MeetupSchema); 