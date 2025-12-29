import { Advertisement, IAdvertisement } from "../models/Advertisement";
import { ADVERTISEMENT_PRICING } from "../constants/categories";

export class AdvertisementService {
  // Create a new advertisement
  static async createAdvertisement(
    adData: Partial<IAdvertisement>
  ): Promise<IAdvertisement> {
    const advertisement = new Advertisement(adData);
    return await advertisement.save();
  }

  // Get all advertisements with pagination and filtering
  static async getAdvertisements(
    page: number = 1,
    limit: number = 10,
    filters: {
      category?: string;
      state?: string;
      city?: string;
      status?: string;
    } = {}
  ): Promise<{
    advertisements: IAdvertisement[];
    total: number;
    pages: number;
  }> {
    const query: any = {};

    if (filters.state) {
      query.state = filters.state;
    }
    if (filters.city) {
      query.city = filters.city;
    }
    if (filters.status) {
      query.status = filters.status;
    }

    const skip = (page - 1) * limit;
    const advertisements = await Advertisement.find(query)
      .populate("createdBy", "name email avatar")
      .populate("template", "name image description")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Advertisement.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { advertisements, total, pages };
  }

  // Get advertisement by ID
  static async getAdvertisementById(
    id: string
  ): Promise<IAdvertisement | null> {
    return await Advertisement.findById(id).populate(
      "createdBy",
      "name email avatar"
    );
  }

  // Get advertisements by user
  static async getAdvertisementsByUser(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{
    advertisements: IAdvertisement[];
    total: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const advertisements = await Advertisement.find({ createdBy: userId })
      .populate("createdBy", "name email avatar")
      .populate("template", "name image description")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Advertisement.countDocuments({ createdBy: userId });
    const pages = Math.ceil(total / limit);

    return { advertisements, total, pages };
  }

  // Update advertisement
  static async updateAdvertisement(
    id: string,
    updateData: Partial<IAdvertisement>,
    userId: string
  ): Promise<IAdvertisement | null> {
    const advertisement = await Advertisement.findOneAndUpdate(
      { _id: id, createdBy: userId },
      updateData,
      { new: true }
    ).populate("createdBy", "name email avatar");

    return advertisement;
  }

  // Delete advertisement
  static async deleteAdvertisement(
    id: string,
    userId: string
  ): Promise<boolean> {
    const result = await Advertisement.findOneAndDelete({
      _id: id,
      createdBy: userId,
    });
    return !!result;
  }

  // Calculate pricing for advertisement
  static calculatePricing(
    localities: string[],
    hours: number,
    days: number
  ): {
    basePrice: number;
    discount: number;
    finalPrice: number;
    discountReason?: string;
  } {
    const totalHours = hours + days * 24;
    const basePrice =
      localities.length *
      totalHours *
      ADVERTISEMENT_PRICING.BASE_PRICE_PER_LOCALITY_PER_HOUR;

    let discount = 0;
    let discountReason = "";

    // Apply discounts based on conditions
    if (localities.length >= 5) {
      discount = 20;
      discountReason = "20% off on selecting 5 or more locations";
    } else if (days >= 2) {
      discount = 30;
      discountReason = "30% off on advertisements for 2 or more days";
    }

    const discountAmount = (basePrice * discount) / 100;
    const finalPrice = basePrice - discountAmount;

    return {
      basePrice,
      discount,
      finalPrice,
      discountReason,
    };
  }

  // Get advertisements by location
  static async getAdvertisementsByLocation(
    state: string,
    city: string,
    localities: string[] = [],
    page: number = 1,
    limit: number = 10
  ): Promise<{
    advertisements: IAdvertisement[];
    total: number;
    pages: number;
  }> {
    let query: any = {
      state,
      city,
      status: "active",
    };

    if (localities.length > 0) {
      query.localities = { $in: localities };
    }

    const skip = (page - 1) * limit;
    const advertisements = await Advertisement.find(query)
      .populate("createdBy", "name email avatar")
      .populate("template", "name image description")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Advertisement.countDocuments(query);
    const pages = Math.ceil(total / limit);

    return { advertisements, total, pages };
  }

  // Mark expired advertisements
  static async markExpiredAdvertisements(): Promise<number> {
    const now = new Date();
    const result = await Advertisement.updateMany(
      {
        status: "active",
        expiresAt: { $lt: now },
      },
      { status: "expired" }
    );
    return result.modifiedCount;
  }

  // Get advertisement statistics
  static async getAdvertisementStats(): Promise<{
    total: number;
    active: number;
    expired: number;
    draft: number;
    totalRevenue: number;
  }> {
    const [total, active, expired, draft, revenueResult] = await Promise.all([
      Advertisement.countDocuments(),
      Advertisement.countDocuments({ status: "active" }),
      Advertisement.countDocuments({ status: "expired" }),
      Advertisement.countDocuments({ status: "draft" }),
      Advertisement.aggregate([
        { $match: { status: { $in: ["active", "expired"] } } },
        {
          $group: { _id: null, totalRevenue: { $sum: "$pricing.finalPrice" } },
        },
      ]),
    ]);

    const totalRevenue =
      revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

    return { total, active, expired, draft, totalRevenue };
  }

  // Get available templates (mock data for now)
  static getTemplates(): Array<{
    id: string;
    name: string;
    category: string;
    image: string;
  }> {
    return [
      {
        id: "1",
        name: "Business Professional",
        category: "services",
        image:
          "https://images.unsplash.com/photo-1560472355-536de3962603?w=400&h=300&fit=crop",
      },
      {
        id: "2",
        name: "Product Showcase",
        category: "products",
        image:
          "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
      },
      {
        id: "3",
        name: "Event Promotion",
        category: "events",
        image:
          "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
      },
      {
        id: "4",
        name: "Real Estate",
        category: "housing",
        image:
          "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
      },
      {
        id: "5",
        name: "Job Opportunity",
        category: "jobs",
        image:
          "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=400&h=300&fit=crop",
      },
    ];
  }

  // Get location data (mock data for now)
  static getStates(): string[] {
    return [
      "Delhi",
      "Mumbai",
      "Bangalore",
      "Chennai",
      "Kolkata",
      "Hyderabad",
      "Pune",
      "Ahmedabad",
    ];
  }

  static getCitiesByState(state: string): string[] {
    const cityMap: { [key: string]: string[] } = {
      Delhi: [
        "New Delhi",
        "Central Delhi",
        "East Delhi",
        "West Delhi",
        "North Delhi",
        "South Delhi",
      ],
      Mumbai: ["Mumbai", "Thane", "Navi Mumbai", "Kalyan", "Vasai-Virar"],
      Bangalore: [
        "Bangalore",
        "Electronic City",
        "Whitefield",
        "Marathahalli",
        "Koramangala",
      ],
      Chennai: ["Chennai", "Tambaram", "Anna Nagar", "T. Nagar", "Adyar"],
      Kolkata: ["Kolkata", "Salt Lake", "Howrah", "Dum Dum", "Park Street"],
      Hyderabad: [
        "Hyderabad",
        "Secunderabad",
        "Cyberabad",
        "Gachibowli",
        "HITEC City",
      ],
      Pune: ["Pune", "Pimpri-Chinchwad", "Hinjewadi", "Baner", "Koregaon Park"],
      Ahmedabad: [
        "Ahmedabad",
        "Gandhinagar",
        "Vastrapur",
        "Bodakdev",
        "Satellite",
      ],
    };
    return cityMap[state] || [];
  }

  static getLocalitiesByCity(city: string): string[] {
    const localityMap: { [key: string]: string[] } = {
      "New Delhi": [
        "Connaught Place",
        "Karol Bagh",
        "Lajpat Nagar",
        "Defence Colony",
        "Greater Kailash",
      ],
      Mumbai: ["Bandra", "Andheri", "Powai", "Malad", "Goregaon"],
      Bangalore: [
        "Koramangala",
        "Indiranagar",
        "Jayanagar",
        "Malleshwaram",
        "Rajajinagar",
      ],
      Chennai: ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "Tambaram"],
      Kolkata: ["Park Street", "Salt Lake", "Dum Dum", "Howrah", "Ballygunge"],
      Hyderabad: [
        "Gachibowli",
        "HITEC City",
        "Banjara Hills",
        "Jubilee Hills",
        "Secunderabad",
      ],
      Pune: [
        "Koregaon Park",
        "Baner",
        "Hinjewadi",
        "Viman Nagar",
        "Kalyani Nagar",
      ],
      Ahmedabad: [
        "Vastrapur",
        "Bodakdev",
        "Satellite",
        "Maninagar",
        "Naranpura",
      ],
    };
    return localityMap[city] || [];
  }
}
