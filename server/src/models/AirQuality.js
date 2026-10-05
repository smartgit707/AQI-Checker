import mongoose from 'mongoose';

const PollutantValueSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: true,
      enum: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NH3']
    },
    name: {
      type: String,
      required: true
    },
    value: {
      type: Number,
      required: true,
      min: [0, 'Pollutant concentration cannot be negative']
    },
    unit: {
      type: String,
      required: true,
      default: 'µg/m³'
    },
    limit: {
      type: Number,
      required: true
    },
    status: {
      type: String,
      enum: ['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous'],
      required: true
    },
    trend: {
      type: String,
      enum: ['up', 'down', 'stable'],
      default: 'stable'
    },
    desc: {
      type: String,
      trim: true
    }
  },
  { _id: false }
);

const AirQualitySchema = new mongoose.Schema(
  {
    cityId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'City',
      required: true,
      index: true
    },
    citySlug: {
      type: String,
      required: true,
      index: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true
    },
    aqi: {
      type: Number,
      required: [true, 'AQI value is required'],
      min: [0, 'AQI cannot be negative'],
      max: [500, 'AQI cannot exceed 500 on NAQI scale'],
      index: true
    },
    category: {
      type: String,
      required: true,
      enum: ['Good', 'Moderate', 'Poor', 'Unhealthy', 'Severe', 'Hazardous']
    },
    dominantPollutant: {
      type: String,
      required: true,
      enum: ['PM2.5', 'PM10', 'NO2', 'SO2', 'CO', 'O3', 'NH3']
    },
    trend24h: {
      type: String,
      default: '0%'
    },
    pollutants: [PollutantValueSchema],
    weather: {
      temperature: { type: String, default: '28°C' },
      humidity: { type: String, default: '60%' },
      wind: { type: String, default: '10 km/h NW' },
      pressure: { type: String, default: '1013 hPa' },
      visibility: { type: String, default: '6.0 km' }
    },
    hourlyForecast: [
      {
        time: { type: String, required: true },
        aqi: { type: Number, required: true }
      }
    ],
    source: {
      type: String,
      default: 'Continuous Ambient Air Quality Monitoring Station (CPCB/CAAQMS)'
    },
    isDemoData: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

// Compound index for querying a city's historical records ordered by timestamp
AirQualitySchema.index({ cityId: 1, timestamp: -1 });
AirQualitySchema.index({ citySlug: 1, timestamp: -1 });

export default mongoose.model('AirQuality', AirQualitySchema);
