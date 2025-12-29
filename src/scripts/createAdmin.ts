import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/User';

dotenv.config();

async function createAdminUser() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI  as string;
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    

    // Check if admin user already exists
    const existingAdmin = await User.findOne({
      email: 'admin@localitybay.com',
    });
    
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists');
      console.log(`Email: ${existingAdmin.email}`);
      console.log(`Role: ${existingAdmin.role}`);
      process.exit(0);
    }

    // Create admin user with enhanced model structure
    // Note: Password will be automatically hashed by the User model's pre-save hook
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@localitybay.com',
      userId: '@admin',
      password: 'admin123',
      location: {
        address: 'Admin Address',
        coordinates: [0, 0], // Default coordinates [longitude, latitude]
        city: 'Admin City',
        state: 'Admin State',
        country: 'India'
      },
      interests: ['Admin', 'System Management'],
      photos: [],
      badges: ['System Admin', 'Verified'],
      isVerified: true,
      role: 'admin',
      bio: 'System Administrator for LocalityBay',
      isActive: true,
      isPremium: true,
      privacy: {
        showLocation: false,
        showPhone: false,
        showEmail: false,
        profileVisibility: 'private'
      },
      settings: {
        notifications: {
          email: true,
          push: true,
          meetups: true,
          messages: true
        },
        radius: 5
      },
      stats: {
        meetupsJoined: 0,
        meetupsCreated: 0,
        communitiesJoined: 0
      },
      lastActive: new Date()
    });

    await adminUser.save();
    console.log('✅ Admin user created successfully!');
    console.log('📧 Email: admin@localitybay.com');
    
    
  } catch (error) {
    console.error('❌ Error creating admin user:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
createAdminUser(); 