import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false // Do not include in queries by default for security
    },
    avatar: {
      type: String,
      default: ''
    },
    favoriteCities: {
      type: [String],
      default: [],
      validate: [
        (val) => val.length <= 10,
        'Cannot exceed maximum of 10 favorite cities'
      ]
    },
    recentCities: [
      {
        slug: {
          type: String,
          required: true
        },
        visitedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],
    settings: {
      temperatureUnit: {
        type: String,
        enum: ['C', 'F'],
        default: 'C'
      },
      defaultDashboardView: {
        type: String,
        enum: ['compact', 'detailed'],
        default: 'detailed'
      }
    },
    lastLoginAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// Transform JSON to never leak passwordHash or internal fields
UserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.__v;
  return obj;
};

export default mongoose.model('User', UserSchema);
