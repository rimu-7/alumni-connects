import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';
import mongoose from 'mongoose';

// Configure Cloudinary with error handling
if (process.env.CLOUDINARY_CLOUD_NAME && 
    process.env.CLOUDINARY_API_KEY && 
    process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

// Alumni Schema
const alumniSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  currentCity: { type: String, required: true },
  passingYear: { type: String, required: true },
  jobTitle: { type: String, required: true },
  organization: { type: String, required: true },
  quote: { type: String, default: '' },
  photo: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now }
});

// Check if model already exists to prevent OverwriteModelError
const Alumni = mongoose.models.Alumni || mongoose.model('Alumni', alumniSchema);

export async function POST(request) {
  try {
    // Check MongoDB connection
    if (!MONGODB_URI) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Database configuration missing. Please check MONGODB_URI." 
        },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
    }

    const formData = await request.formData();
    
    // Extract form data
    const alumniData = {
      fullName: formData.get('fullName'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      bloodGroup: formData.get('bloodGroup'),
      currentCity: formData.get('currentCity'),
      passingYear: formData.get('passingYear'),
      jobTitle: formData.get('jobTitle'),
      organization: formData.get('organization'),
      quote: formData.get('quote') || '',
    };

    // Validate required fields
    const requiredFields = ['fullName', 'email', 'phone', 'bloodGroup', 'currentCity', 'passingYear', 'jobTitle', 'organization'];
    const missingFields = requiredFields.filter(field => !alumniData[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    // Handle photo upload if Cloudinary is configured and file exists
    const photoFile = formData.get('photo');
    let photoUrl = '';

    if (photoFile && photoFile.size > 0) {
      if (!process.env.CLOUDINARY_CLOUD_NAME) {
        return NextResponse.json(
          { 
            success: false, 
            error: "Image upload service is currently unavailable. Please try without photo." 
          },
          { status: 500 }
        );
      }

      try {
        // Convert file to buffer
        const bytes = await photoFile.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Upload to Cloudinary
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { 
              resource_type: 'image',
              folder: 'alumni-connects',
              transformation: [
                { width: 400, height: 400, crop: 'fill' },
                { quality: 'auto' },
                { format: 'webp' }
              ]
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          ).end(buffer);
        });

        photoUrl = uploadResult.secure_url;
      } catch (uploadError) {
        console.error('Photo upload error:', uploadError);
        return NextResponse.json(
          { 
            success: false, 
            error: "Failed to upload photo. Please try with a different image." 
          },
          { status: 500 }
        );
      }
    }

    // Check if alumni already exists
    const existingAlumni = await Alumni.findOne({ email: alumniData.email });
    if (existingAlumni) {
      return NextResponse.json(
        { 
          success: false, 
          error: "An alumni with this email already exists." 
        },
        { status: 409 }
      );
    }

    // Save to database
    const newAlumni = new Alumni({
      ...alumniData,
      photo: photoUrl
    });

    await newAlumni.save();

    return NextResponse.json({
      success: true,
      message: "Alumni registration successful!",
      data: {
        id: newAlumni._id,
        fullName: newAlumni.fullName,
        email: newAlumni.email
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "An alumni with this email already exists." 
        },
        { status: 409 }
      );
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return NextResponse.json(
        { 
          success: false, 
          error: `Validation failed: ${errors.join(', ')}` 
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { 
        success: false, 
        error: "Registration failed. Please try again later." 
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    // Check MongoDB connection
    if (!MONGODB_URI) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Database configuration missing" 
        },
        { status: 500 }
      );
    }

    // Connect to MongoDB
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(MONGODB_URI);
    }

    const alumni = await Alumni.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: alumni
    });

  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: "Failed to fetch alumni data" 
      },
      { status: 500 }
    );
  }
}