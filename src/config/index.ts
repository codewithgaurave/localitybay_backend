import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const config = {
  // Environment
  env: process.env.NODE_ENV || "development",

  // Server
  port: parseInt(process.env.PORT || "5000", 10),

  // Database
  mongoUri: process.env.MONGODB_URI || "mongodb://localhost:27017/localitybay",

  // Authentication
  jwtSecret: process.env.JWT_SECRET || "your-secret-key",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  // Frontend
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",

  // Admin Panel
  adminCookieSecret: process.env.ADMIN_COOKIE_SECRET || "admin-secret-key",

  // Session Configuration
  session: {
    secret: process.env.ADMIN_COOKIE_SECRET || "admin-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: {
      secure:
        process.env.NODE_ENV === "production" &&
        process.env.FORCE_HTTPS !== "false",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  },

  // AdminJS Configuration
  admin: {
    cookiePassword: process.env.ADMIN_COOKIE_SECRET || "admin-secret-key",
    session: {
      resave: false,
      saveUninitialized: true,
      secret: process.env.ADMIN_COOKIE_SECRET || "admin-secret-key",
      cookie: {
        secure:
          process.env.NODE_ENV === "production" &&
          process.env.FORCE_HTTPS !== "false",
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
      },
    },
  },

  // CORS Configuration
  cors: {
    origin: process.env.NODE_ENV === 'production' 
      ? process.env.FRONTEND_URL?.split(',').map(url => url.trim()) || []
      : ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
  },

  // Security
  helmet: {
    contentSecurityPolicy: false, // Disable CSP for AdminJS
  },
};

export default config;
