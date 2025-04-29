/**
 * Script to promote an existing user to admin
 * 
 * Usage:
 * 1. Make sure MongoDB connection string is in your .env file
 * 2. Run with: node promote-to-admin.js <email>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { Schema } = mongoose;

// Get email from command line
const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address');
  console.error('Usage: node promote-to-admin.js <email>');
  process.exit(1);
}

// Create user schema
const UserSchema = new Schema({
  email: String,
  name: String,
  passwordHash: String,
  role: String,
  age: Number,
  gender: String,
  country: String,
  createdAt: Date,
  updatedAt: Date
});

async function main() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    // Get User model
    const User = mongoose.model('User', UserSchema);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`User with email ${email} not found`);
      process.exit(1);
    }
    
    console.log(`Found user: ${user.name} (${user.email})`);
    console.log(`Current role: ${user.role}`);
    
    // Update user role to admin
    user.role = 'admin';
    user.updatedAt = new Date();
    
    await user.save();
    
    console.log(`User ${user.name} (${user.email}) has been promoted to admin!`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Close MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
}

main(); 