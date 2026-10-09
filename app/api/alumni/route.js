import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { v2 as cloudinary } from 'cloudinary';
import connectToDatabase from '@/lib/mongodb';
import Alumni from '@/models/Alumni';
import { getAlumniList } from '@/lib/alumni';

// Configure Cloudinary once
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const bloodGroup = searchParams.get('bloodGroup') || '';
    const passingYear = searchParams.get('passingYear') || '';
    const limit = parseInt(searchParams.get('limit') || '500', 10);

    const { alumni, error } = await getAlumniList({
      search,
      bloodGroup,
      passingYear,
      limit,
    });

    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: alumni,
        count: alumni.length,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=120',
        },
      }
    );
  } catch (error) {
    console.error('Fetch error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch alumni data',
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await connectToDatabase();

    const formData = await request.formData();

    // Extract form data
    const alumniData = {
      fullName: (formData.get('fullName') || '').toString().trim(),
      email: (formData.get('email') || '').toString().trim().toLowerCase(),
      phone: (formData.get('phone') || '').toString().trim(),
      bloodGroup: (formData.get('bloodGroup') || '').toString().trim(),
      currentCity: (formData.get('currentCity') || '').toString().trim(),
      passingYear: (formData.get('passingYear') || '').toString().trim(),
      jobTitle: (formData.get('jobTitle') || '').toString().trim(),
      organization: (formData.get('organization') || '').toString().trim(),
      quote: (formData.get('quote') || '').toString().trim(),
    };

    // Validate required fields
    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'bloodGroup',
      'currentCity',
      'passingYear',
      'jobTitle',
      'organization',
    ];
    const missingFields = requiredFields.filter((field) => !alumniData[field]);

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `প্রয়োজনীয় ফিল্ডগুলো পূরণ করুন: ${missingFields.join(', ')}`,
        },
        { status: 400 }
      );
    }

    // Check if alumni already exists with this email (fast index query)
    const existing = await Alumni.findOne({ email: alumniData.email })
      .select('_id')
      .lean();

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'এই ইমেইল দিয়ে ইতিমধ্যে একজন অ্যালামনাই নিবন্ধিত আছেন।',
        },
        { status: 409 }
      );
    }

    // Handle photo upload if Cloudinary is configured and file exists
    const photoFile = formData.get('photo');
    let photoUrl = '';

    if (photoFile && typeof photoFile === 'object' && photoFile.size > 0) {
      if (
        process.env.CLOUDINARY_CLOUD_NAME &&
        process.env.CLOUDINARY_API_KEY &&
        process.env.CLOUDINARY_API_SECRET
      ) {
        try {
          const bytes = await photoFile.arrayBuffer();
          const buffer = Buffer.from(bytes);

          const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader
              .upload_stream(
                {
                  resource_type: 'image',
                  folder: 'alumni-connects',
                  transformation: [
                    { width: 400, height: 400, crop: 'fill', gravity: 'face' },
                    { quality: 'auto', fetch_format: 'auto' },
                  ],
                },
                (err, result) => {
                  if (err) reject(err);
                  else resolve(result);
                }
              )
              .end(buffer);
          });

          photoUrl = uploadResult.secure_url || uploadResult.url || '';
        } catch (uploadErr) {
          console.error('Photo upload error:', uploadErr);
          // If upload fails, still allow registration or notify cleanly
          photoUrl = '';
        }
      }
    }

    // Save to database
    const newAlumni = await Alumni.create({
      ...alumniData,
      photo: photoUrl,
    });

    // Invalidate cached directory page so new member appears immediately
    try {
      revalidatePath('/directory');
    } catch (e) {
      // ignore in non-request contexts
    }

    return NextResponse.json({
      success: true,
      message: 'অভিনন্দন! অ্যালামনাই রেজিস্ট্রেশন সফল হয়েছে।',
      data: {
        id: newAlumni._id.toString(),
        fullName: newAlumni.fullName,
        email: newAlumni.email,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          error: 'এই ইমেইল দিয়ে ইতিমধ্যে একজন অ্যালামনাই নিবন্ধিত আছেন।',
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'রেজিস্ট্রেশন প্রক্রিয়া সম্পন্ন করা যায়নি।',
      },
      { status: 500 }
    );
  }
}