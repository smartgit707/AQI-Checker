import mongoose from 'mongoose';

const DataSourceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Source name is required'],
      trim: true
    },
    provider: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      enum: [
        'National Regulatory Network',
        'State Regulatory Observatory',
        'Synoptic Meteorological Ingestion',
        'Hyperlocal Ambient Mesh Network',
        'Satellite Radiometry'
      ]
    },
    url: {
      type: String,
      trim: true
    },
    standard: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    active: {
      type: Boolean,
      default: true
    },
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model('DataSource', DataSourceSchema);
