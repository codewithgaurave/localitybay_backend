import express from "express";
import { NoticeController } from "../controllers/noticeController";
import { auth } from "../middleware/auth";
import validate from "../middleware/validation";
import {
  createNotice,
  updateNotice,
  getNotice,
  getNotices,
  getNoticesByLocation,
  deleteNotice,
} from "../validations/noticeValidation";

const router = express.Router();

// Create notice (authenticated)
router.post("/", auth, validate(createNotice), NoticeController.createNotice);

// Get all notices with filtering and pagination
router.get("/", validate(getNotices), NoticeController.getNotices);

// Get notice by ID
router.get("/:id", validate(getNotice), NoticeController.getNoticeById);

// Get notices by user (authenticated)
router.get("/user/my-notices", auth, NoticeController.getNoticesByUser);

// Get notices by location
router.get(
  "/location/search",
  validate(getNoticesByLocation),
  NoticeController.getNoticesByLocation
);

// Get urgent notices count for user (authenticated)
router.get("/user/urgent-count", auth, NoticeController.getUrgentNoticesCount);

// Get notice statistics
router.get("/stats/overview", NoticeController.getNoticeStats);

// Update notice (authenticated)
router.put("/:id", auth, validate(updateNotice), NoticeController.updateNotice);

// Delete notice (authenticated)
router.delete(
  "/:id",
  auth,
  validate(deleteNotice),
  NoticeController.deleteNotice
);

export default router;
