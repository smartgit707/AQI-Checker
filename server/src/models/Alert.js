import mongoose from 'mongoose';

const AlertSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      index: true
    },
    citySlug: {
      type: String,
      required: [true, 'City slug is required'],
      lowercase: true,
      trim: true,
      index: true
    },
    cityName: {
      type: String,
      trim: true,
      default: ''
    },
    type: {
      type: String,
      enum: ['threshold', 'category'],
      default: 'threshold'
    },
    threshold: {
      type: Number,
      required: [true, 'Threshold value is required'],
      min: [0, 'AQI threshold cannot be negative'],
      max: [500, 'AQI threshold cannot exceed standard max 500']
    },
    operator: {
      type: String,
      enum: ['gt', 'gte', 'above', 'below', 'lt', 'lte'],
      default: 'above'
    },
    enabled: {
      type: Boolean,
      default: true,
      index: true
    },
    cooldownHours: {
      type: Number,
      default: 6,
      min: 1,
      max: 48
    },
    lastTriggeredAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

// Compound index to avoid duplicate duplicate identical threshold alerts per user
AlertSchema.index({ userId: 1, citySlug: 1, threshold: 1 });

export default mongoose.model('Alert', AlertSchema);
