import mongoose from 'mongoose';

const CitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'City name is required'],
      trim: true,
      index: true
    },
    state: {
      type: String,
      required: [true, 'State name is required'],
      trim: true
    },
    country: {
      type: String,
      default: 'India',
      trim: true
    },
    slug: {
      type: String,
      required: [true, 'City slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true
    },
    coordinates: {
      latitude: {
        type: Number,
        required: [true, 'Latitude is required'],
        min: [-90, 'Latitude must be between -90 and 90'],
        max: [90, 'Latitude must be between -90 and 90']
      },
      longitude: {
        type: Number,
        required: [true, 'Longitude is required'],
        min: [-180, 'Longitude must be between -180 and 180'],
        max: [180, 'Longitude must be between -180 and 180']
      }
    },
    station: {
      type: String,
      trim: true,
      default: 'Continuous Ambient Air Quality Monitoring Station (CAAQMS)'
    },
    image: {
      url: { type: String, required: true },
      alt: { type: String, required: true }
    },
    description: {
      type: String,
      trim: true
    },
    population: {
      type: Number,
      min: [0, 'Population cannot be negative']
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound text index for fuzzy city search
CitySchema.index({ name: 'text', state: 'text' });

export default mongoose.model('City', CitySchema);
