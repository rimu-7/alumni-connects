import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    bloodGroup: {
      type: String,
      required: [true, 'Blood group is required for emergencies'],
      trim: true,
      index: true,
    },
    currentCity: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    passingYear: {
      type: mongoose.Schema.Types.Mixed, // allows String or Number without casting errors
      required: true,
      index: true,
    },
    jobTitle: {
      type: String,
      required: true,
      trim: true,
    },
    organization: {
      type: String,
      required: true,
      trim: true,
    },
    quote: {
      type: String,
      default: '',
      trim: true,
    },
    // Supports both direct string URL or object { url, public_id }
    photo: {
      type: mongoose.Schema.Types.Mixed,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: false,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Compound index for common query combinations
AlumniSchema.index({ bloodGroup: 1, passingYear: -1 });
AlumniSchema.index({ createdAt: -1 });

export default mongoose.models.Alumni || mongoose.model('Alumni', AlumniSchema);