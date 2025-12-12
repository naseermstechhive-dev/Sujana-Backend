import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import mongoose from '../config/db.js';
import User from '../Models/user.js';

dotenv.config();

async function updateAdmin() {
  try {
    // Connect to database
    console.log('🔌 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    const adminEmail = 'sujanagoldcompany@gmail.com';
    const adminPassword = 'Sai@6303';
    const adminName = 'Sujana Gold Admin';

    // Check if admin user with this email exists
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      // Update existing admin - use save() to trigger pre-save hook for password hashing
      admin.name = adminName;
      admin.password = adminPassword; // Will be hashed by pre-save hook
      admin.role = 'admin'; // Ensure role is admin
      await admin.save(); // This will trigger the password hashing
      console.log('✅ Admin user updated successfully');
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
    } else {
      // Check if any admin exists (might have different email)
      const existingAdmin = await User.findOne({ role: 'admin' });
      
      if (existingAdmin) {
        // Update existing admin to new email - use save() to trigger password hashing
        existingAdmin.email = adminEmail;
        existingAdmin.name = adminName;
        existingAdmin.password = adminPassword; // Will be hashed by pre-save hook
        existingAdmin.role = 'admin';
        await existingAdmin.save(); // This will trigger the password hashing
        console.log('✅ Existing admin user updated with new credentials');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
      } else {
        // Create new admin user
        admin = await User.create({
          name: adminName,
          email: adminEmail,
          password: adminPassword,
          role: 'admin',
        });
        console.log('✅ Admin user created successfully');
        console.log(`   Email: ${adminEmail}`);
        console.log(`   Password: ${adminPassword}`);
      }
    }

    // Verify the update
    const verifyAdmin = await User.findOne({ email: adminEmail });
    if (verifyAdmin && verifyAdmin.role === 'admin') {
      console.log('✅ Verification: Admin user is correctly configured');
      console.log(`   User ID: ${verifyAdmin._id}`);
      console.log(`   Name: ${verifyAdmin.name}`);
    } else {
      console.error('❌ Verification failed');
      process.exit(1);
    }

    // Close database connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error updating admin:', error.message);
    console.error('Full error:', error);
    await mongoose.connection.close().catch(() => {});
    process.exit(1);
  }
}

// Run the update
updateAdmin();

