import AdminJS from "adminjs";
import AdminJSExpress from "@adminjs/express";
import AdminJSMongoose from "@adminjs/mongoose";
import { User } from "../models/User";
import { Meetup } from "../models/Meetup";
import { Notice } from "../models/Notice";
import { Advertisement } from "../models/Advertisement";
import { Template } from "../models/Template";
import bcrypt from "bcryptjs";
import config from "../config/index";
import {
  MEETUP_CATEGORIES,
  MEETUP_TYPES,
  MEETUP_FORMATS,
  MEETUP_STATUSES,
  NOTICE_CATEGORIES,
  NOTICE_DURATIONS,
  NOTICE_STATUS,
  ADVERTISEMENT_STATUS,
  ADVERTISEMENT_CATEGORIES,
} from "../constants";

import { ComponentLoader } from "adminjs";

const componentLoader = new ComponentLoader();

const Components = {
  Dashboard: componentLoader.add("Dashboard", "./components/Dashboard"),
  // other custom components
};
// Register the adapter
AdminJS.registerAdapter({
  Resource: AdminJSMongoose.Resource,
  Database: AdminJSMongoose.Database,
});

// AdminJS configuration
const adminJs = new AdminJS({
  dashboard: {
    component: Components.Dashboard,
  },
  componentLoader,
  resources: [
    {
      resource: User,
      options: {
        navigation: { name: "User Management", icon: "User" },
        properties: {
          name: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          email: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          userId: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          password: {
            isVisible: {
              list: false,
              filter: false,
              show: false,
              edit: true,
              new: true,
            },
            type: "password",
            isRequired: true,
          },
          avatar: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          bio: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          photos: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "mixed",
          },
          badges: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "mixed",
          },
          "location.coordinates": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "mixed",
          },
          "location.address": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          "location.city": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          "location.state": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          "location.country": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          interests: {
            isVisible: {
              list: false,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "mixed",
          },
          phone: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          dateOfBirth: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "date",
          },
          gender: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: [
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
              { value: "other", label: "Other" },
              { value: "prefer-not-to-say", label: "Prefer Not to Say" },
            ],
          },
          isVerified: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          isPremium: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          role: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: [
              { value: "user", label: "User" },
              { value: "admin", label: "Admin" },
              { value: "moderator", label: "Moderator" },
            ],
          },
          isActive: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          "privacy.profileVisibility": {
            isVisible: {
              list: false,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: [
              { value: "public", label: "Public" },
              { value: "friends", label: "Friends" },
              { value: "private", label: "Private" },
            ],
          },
          "stats.meetupsJoined": {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: false,
              new: false,
            },
          },
          "stats.meetupsCreated": {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: false,
              new: false,
            },
          },
          "stats.communitiesJoined": {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: false,
              new: false,
            },
          },
          lastActive: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          createdAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          updatedAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
        },
        actions: {
          new: {
            before: async (request: any) => {
              // Ensure password is provided for new users
              if (
                !request.payload.password ||
                request.payload.password.trim() === ""
              ) {
                throw new Error("Password is required for new users");
              }

              if (request.payload.password) {
                const salt = await bcrypt.genSalt(12);
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  salt
                );
              }
              return request;
            },
          },
          edit: {
            before: async (request: any) => {
              // Only hash password if it's provided (not empty)
              if (
                request.payload.password &&
                request.payload.password.trim() !== ""
              ) {
                const salt = await bcrypt.genSalt(12);
                request.payload.password = await bcrypt.hash(
                  request.payload.password,
                  salt
                );
              } else {
                // Remove password field if it's empty to avoid overwriting existing password
                delete request.payload.password;
              }
              return request;
            },
          },
        },
      },
    },
    {
      resource: Meetup,
      options: {
        navigation: { name: "Meetup Management", icon: "Calendar" },
        properties: {
          title: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          description: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          category: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: MEETUP_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            })),
          },
          creator: {
            reference: "User",
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          type: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: MEETUP_TYPES.map((type) => ({
              value: type,
              label:
                type === "invite-only"
                  ? "Invite Only"
                  : type.charAt(0).toUpperCase() + type.slice(1),
            })),
          },
          meetupFormat: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: MEETUP_FORMATS.map((format) => ({
              value: format,
              label: format.charAt(0).toUpperCase() + format.slice(1),
            })),
          },
          meetupLocation: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          visibilityLocation: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          visibilityRadius: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          "location.coordinates": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "mixed",
          },
          "location.address": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          "location.venue": {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          virtualLink: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          meetingCode: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          meetingPassword: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          date: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "date",
          },
          startTime: {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          endTime: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          maxAttendees: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          hasNoLimit: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          genderSpecific: {
            isVisible: {
              list: false,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          maxMale: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          maxFemale: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          maxTransgender: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          currentAttendees: {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: false,
              new: false,
            },
            type: "number",
          },
          attendees: {
            reference: "User",
            isVisible: { list: false, filter: false, show: true, edit: true },
          },
          waitingList: {
            reference: "User",
            isVisible: { list: false, filter: false, show: true, edit: true },
          },
          tags: {
            isVisible: {
              list: false,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
            isArray: true,
          },
          image: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          price: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          paymentMethod: {
            isVisible: {
              list: false,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          allowChatContinuation: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          status: {
            isVisible: { list: true, filter: true, show: true, edit: true },
            availableValues: MEETUP_STATUSES.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            })),
          },
          createdAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            type: "datetime",
          },
          updatedAt: {
            isVisible: { list: true, filter: true, show: true, edit: false },
            type: "datetime",
          },
        },
      },
    },
    {
      resource: Notice,
      options: {
        navigation: { name: "Notice Management", icon: "Megaphone" },
        properties: {
          title: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          description: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          category: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: NOTICE_CATEGORIES.map((category) => ({
              value: category,
              label: category,
            })),
          },
          location: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          radius: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          contact: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          urgent: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          duration: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: NOTICE_DURATIONS.map((duration) => ({
              value: duration,
              label: duration,
            })),
          },
          status: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: NOTICE_STATUS.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            })),
          },
          createdBy: {
            reference: "User",
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          expiresAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          createdAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          updatedAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
        },
        actions: {
          list: {
            before: async (request: any) => {
              // Sort by urgent first, then by creation date
              request.query.sort = { urgent: -1, createdAt: -1 };
              return request;
            },
          },
        },
      },
    },
    {
      resource: Advertisement,
      options: {
        navigation: { name: "Advertisement Management", icon: "DollarSign" },
        properties: {
          template: {
            reference: "Template",
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          heading: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          briefDescription: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          contactInfo: {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          location: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          website: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          detailedHeading: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          detailedDescription: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          specialOffers: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          state: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          city: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          localities: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
            isArray: true,
          },
          "duration.hours": {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          "duration.days": {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          "pricing.basePrice": {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          "pricing.discount": {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          "pricing.finalPrice": {
            isVisible: {
              list: true,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "number",
          },
          "pricing.discountReason": {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
          },
          status: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
            availableValues: ADVERTISEMENT_STATUS.map((status) => ({
              value: status,
              label: status.charAt(0).toUpperCase() + status.slice(1),
            })),
          },
          createdBy: {
            reference: "User",
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          expiresAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          uploadedFiles: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
            isArray: true,
          },
          createdAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          updatedAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
        },
        actions: {
          list: {
            before: async (request: any) => {
              // Sort by creation date (newest first)
              request.query.sort = { createdAt: -1 };
              return request;
            },
          },
        },
      },
    },
    {
      resource: Template,
      options: {
        navigation: {
          name: "Advertisement Management",
          icon: "Image",
        },
        properties: {
          name: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },

          image: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "string",
          },
          description: {
            isVisible: {
              list: false,
              filter: false,
              show: true,
              edit: true,
              new: true,
            },
            type: "textarea",
          },
          isActive: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: true,
              new: true,
            },
          },
          createdBy: {
            reference: "User",
            isVisible: { list: true, filter: true, show: true, edit: true },
          },
          createdAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
          updatedAt: {
            isVisible: {
              list: true,
              filter: true,
              show: true,
              edit: false,
              new: false,
            },
            type: "datetime",
          },
        },
        actions: {
          list: {
            before: async (request: any) => {
              // Sort by active status first, then by creation date
              request.query.sort = { isActive: -1, createdAt: -1 };
              return request;
            },
          },
          toggleActive: {
            actionType: "record",
            component: false,
            handler: async (request: any, response: any, data: any) => {
              const { record } = data;
              record.params.isActive = !record.params.isActive;
              await record.save();
              return {
                record: record.toJSON(),
                notice: {
                  message: `Template ${
                    record.params.isActive ? "activated" : "deactivated"
                  } successfully`,
                  type: "success",
                },
              };
            },
          },
        },
      },
    },
  ],
  branding: {
    companyName: "LocalityBay",
    logo: false,
  },
  locale: {
    language: "en",
    translations: {
      en: {
        messages: {
          welcomeOnBoard: "Welcome to LocalityBay Admin Panel",
        },
        labels: {
          User: "Users",
          Meetup: "Meetups",
          Notice: "Notices",
          Advertisement: "Advertisements",
        },
      },
    } as any,
  },
});

// Build admin router
const buildAdminRouter = (auth: any) => {
  return AdminJSExpress.buildAuthenticatedRouter(
    adminJs,
    {
      authenticate: async (email: string, password: string) => {
        try {
          console.log("🔐 Admin login attempt for:", email);

          const user = await User.findOne({ email }).select("+password");
          if (!user) {
            console.log("❌ User not found");
            return false;
          }

          if (!user.password) {
            console.log("❌ User has no password");
            return false;
          }

          console.log("👤 User found:", user.email, "Role:", user.role);

          const isMatch = await bcrypt.compare(password, user.password);
          console.log("🔑 Password match:", isMatch);

          if (isMatch && user.role === "admin") {
            console.log("✅ Admin authentication successful");
            return user;
          }

          console.log(
            "❌ Authentication failed - Role:",
            user.role,
            "Password match:",
            isMatch
          );
          return false;
        } catch (error) {
          console.error("❌ Admin authentication error:", error);
          return false;
        }
      },
      cookiePassword: config.admin.cookiePassword,
    },
    null,
    config.admin.session
  );
};

export { adminJs, buildAdminRouter };
