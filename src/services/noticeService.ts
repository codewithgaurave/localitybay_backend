import { Notice, INotice } from "../models/Notice";
import { User } from "../models/User";

export class NoticeService {
  // Create a new notice
  static async createNotice(noticeData: Partial<INotice>): Promise<INotice> {
    const notice = new Notice(noticeData);
    return await notice.save();
  }

  // Get all notices with pagination and filtering
  static async getNotices(
    page: number = 1,
    limit: number = 10,
    filters: {
      category?: string;
      location?: string;
      status?: string;
      urgent?: boolean;
    } = {}
  ): Promise<{ notices: INotice[]; total: number; pages: number }> {
    const query: any = {};

    if (filters.category) {
      query.category = filters.category;
    }
    if (filters.location) {
      query.location = { $regex: filters.location, $options: "i" };
    }
    if (filters.status) {
      query.status = filters.status;
    }
    if (filters.urgent !== undefined) {
      query.urgent = filters.urgent;
    }

    const skip = (page - 1) * limit;
    const notices = await Notice.find(query)
      .populate("createdBy", "name email avatar")
      .sort({ urgent: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notice.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { notices, total, pages };
  }

  // Get notice by ID
  static async getNoticeById(id: string): Promise<INotice | null> {
    return await Notice.findById(id).populate("createdBy", "name email avatar");
  }

  // Get notices by user
  static async getNoticesByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ notices: INotice[]; total: number; pages: number }> {
    const skip = (page - 1) * limit;
    const notices = await Notice.find({ createdBy: userId })
      .populate("createdBy", "name email avatar")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notice.countDocuments({ createdBy: userId });
    const pages = Math.ceil(total / limit);

    return { notices, total, pages };
  }

  // Update notice
  static async updateNotice(
    id: string,
    updateData: Partial<INotice>,
    userId: string
  ): Promise<INotice | null> {
    const notice = await Notice.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      { new: true }
    ).populate("createdBy", "name email avatar");

    return notice;
  }

  // Delete notice
  static async deleteNotice(id: string, userId: string): Promise<boolean> {
    const result = await Notice.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    return !!result;
  }

  // Get urgent notices count for user this month
  static async getUrgentNoticesCountThisMonth(userId: string): Promise<number> {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return await Notice.countDocuments({
      createdBy: userId,
      urgent: true,
      createdAt: { $gte: startOfMonth },
    });
  }

  // Check if user can create urgent notice
  static async canCreateUrgentNotice(userId: string): Promise<boolean> {
    const urgentCount = await this.getUrgentNoticesCountThisMonth(userId);
    return urgentCount < 3; // Max 3 urgent notices per month
  }

  // Get notices by location and radius
  static async getNoticesByLocation(
    location: string,
    radius: number = 5,
    page: number = 1,
    limit: number = 10
  ): Promise<{ notices: INotice[]; total: number; pages: number }> {
    const query = {
      location: { $regex: location, $options: "i" },
      status: "active",
    };

    const skip = (page - 1) * limit;
    const notices = await Notice.find(query)
      .populate("createdBy", "name email avatar")
      .sort({ urgent: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Notice.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { notices, total, pages };
  }

  // Mark expired notices
  static async markExpiredNotices(): Promise<number> {
    const now = new Date();
    const result = await Notice.updateMany(
      {
        status: "active",
        expiresAt: { $lt: now },
      },
      { status: "expired" }
    );
    return result.modifiedCount;
  }

  // Get notice statistics
  static async getNoticeStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    urgent: number;
  }> {
    const [total, active, expired, urgent] = await Promise.all([
      Notice.countDocuments(),
      Notice.countDocuments({ status: "active" }),
      Notice.countDocuments({ status: "expired" }),
      Notice.countDocuments({ urgent: true, status: "active" }),
    ]);

    return { total, active, expired, urgent };
  }
}
