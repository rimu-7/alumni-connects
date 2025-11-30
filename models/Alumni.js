import mongoose from 'mongoose';

const AlumniSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, 'Please provide a full name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  phone: {
    type: String,
    required: [true, 'Please provide a phone number'],
  },
  bloodGroup: {
    type: String,
    required: [true, 'Blood group is required for emergencies'],
  },
  currentCity: {
    type: String,
    required: true,
  },
  passingYear: {
    type: Number,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  organization: {
    type: String,
    required: true,
  },
  quote: {
    type: String,
  },
  // New field for photo
  photo: {
    url: {
      type: String,
      default: ''
    },
    public_id: {
      type: String,
      default: ''
    }
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Alumni || mongoose.model('Alumni', AlumniSchema);