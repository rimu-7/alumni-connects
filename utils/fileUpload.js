import cloudinary from '@/lib/cloudinary';

export async function uploadToCloudinary(fileBuffer, originalName) {
  try {
    console.log('Starting Cloudinary upload...');
    
    // Validate input
    if (!fileBuffer || fileBuffer.length === 0) {
      throw new Error('No file buffer provided');
    }

    // Convert buffer to base64
    const b64 = fileBuffer.toString('base64');
    const dataURI = `data:image/jpeg;base64,${b64}`; // Use jpeg as default

    console.log('Uploading to Cloudinary...');

    // Upload to Cloudinary with simpler options
    const uploadResult = await cloudinary.uploader.upload(dataURI, {
      folder: 'alumni-photos',
      resource_type: 'image',
      allowed_formats: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'faces' },
        { quality: 'auto' },
        { format: 'auto' }
      ]
    });

    console.log('Cloudinary upload successful:', {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

    return {
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    };
  } catch (error) {
    console.error('Cloudinary upload error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    throw new Error(`Image upload failed: ${error.message}`);
  }
}

export async function deleteFromCloudinary(publicId) {
  try {
    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Cloudinary delete error:', error);
  }
}