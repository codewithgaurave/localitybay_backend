export const MEETUP_CATEGORIES = [
  "Photography",
  "Technology",
  "Health & Fitness",
  "Business",
  "Arts & Culture",
  "Sports",
  "Food & Drink",
  "Travel",
  "Learning",
  "Social",
  "Music",
  "Gaming",
] as const;

export const MEETUP_TYPES = ["free", "paid", "invite-only"] as const;

export const MEETUP_FORMATS = ["physical", "virtual"] as const;

export const MEETUP_STATUSES = [
  "upcoming",
  "ongoing",
  "completed",
  "cancelled",
] as const;

// Notice constants
export const NOTICE_CATEGORIES = [
  "Buy/Sell",
  "Job Postings",
  "Matrimony",
  "Offers",
  "Lost & Found",
  "Services",
  "Housing",
  "Events",
  "Miscellaneous",
] as const;

export const NOTICE_DURATIONS = [
  "Permanent",
  "1 hour",
  "3 hours",
  "6 hours",
  "12 hours",
  "1 day",
  "3 days",
  "1 week",
] as const;

export const NOTICE_STATUS = ["active", "expired", "removed"] as const;

export const NOTICE_RADIUS = {
  MIN: 1,
  MAX: 50,
  DEFAULT: 5,
} as const;

export const DURATION_HOURS_MAP = {
  "1 hour": 1,
  "3 hours": 3,
  "6 hours": 6,
  "12 hours": 12,
  "1 day": 24,
  "3 days": 72,
  "1 week": 168,
} as const;

// Advertisement constants
export const ADVERTISEMENT_STATUS = [
  "draft",
  "active",
  "expired",
  "removed",
] as const;

export const ADVERTISEMENT_CATEGORIES = [
  "services",
  "products",
  "events",
  "housing",
  "jobs",
  "other",
] as const;

export const ADVERTISEMENT_DURATION = {
  HOURS: {
    MIN: 0,
    MAX: 24,
  },
  DAYS: {
    MIN: 0,
    MAX: 30,
  },
} as const;

export const ADVERTISEMENT_PRICING = {
  BASE_PRICE_PER_LOCALITY_PER_HOUR: 2.5,
  DISCOUNT: {
    MIN: 0,
    MAX: 100,
  },
} as const;

export const ADVERTISEMENT_FIELD_LIMITS = {
  HEADING: 50,
  BRIEF_DESCRIPTION: 100,
  CONTACT_INFO: 30,
  LOCATION: 50,
  DETAILED_HEADING: 100,
  DETAILED_DESCRIPTION: 500,
  SPECIAL_OFFERS: 200,
  DETAILED_LOCATION: 100,
  ADDITIONAL_DETAILS: 300,
} as const;
