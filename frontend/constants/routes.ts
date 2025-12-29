// Route constants for the application
export const ROUTES = {
  // Public routes
  LOGIN: "/login",
  SIGNUP: "/signup",

  // Protected routes
  HOME: "/",
  PROFILE: "/profile",
  EDIT_PROFILE: "/edit-profile",

  // Meetup routes
  MEETUPS: "/meetups",
  MEETUP_DETAIL: (id: string) => `/meetups/${id}`,
  CREATE_MEETUP: "/create-meetup",

  // Communities routes (formerly Messages)
  COMMUNITIES: "/communities",
  CHAT_GROUPS: "/chat-groups",
  CHAT_GROUP_DETAIL: (id: string) => `/chat-groups/${id}`,
  CREATE_CHAT_GROUP: "/create-chat-group",

  // Notices routes
  NOTICES: "/notices",
  CREATE_NOTICE: "/create-notice",
  CREATE_ADVERTISEMENT: "/create-advertisement",

  // Services routes
  SERVICES: "/services",
  SERVICE_MESSAGES: "/service-messages",
  REGISTER_SERVICE: "/register-service",

  // Admin routes
  ADMIN: "/admin",

  // Settings
  SETTINGS: "/settings",

  // Other routes
  LOCAL_AD: "/local-ad",
  WALKTHROUGH: "/walkthrough",
  VERIFICATION: "/verification",
  INTERESTS_SELECTION: "/interests-selection",
  PHOTO_UPLOAD: "/photo-upload",
} as const;

// Type for route keys
export type RouteKey = keyof typeof ROUTES;
