import express from "express";
import authRoutes from "./auth";
import userRoutes from "./users";
import meetupRoutes from "./meetups";
import noticeRoutes from "./notices";
import advertisementRoutes from "./advertisements";
import templateRoutes from "./templates";

// API Routes
const router = express.Router();
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/meetups", meetupRoutes);
router.use("/notices", noticeRoutes);
router.use("/advertisements", advertisementRoutes);
router.use("/templates", templateRoutes);

export default router;
