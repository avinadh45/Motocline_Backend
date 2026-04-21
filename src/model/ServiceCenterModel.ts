import mongoose, { Schema, HydratedDocument } from "mongoose";
import { IServiceCenter } from "../interface/ServiceCenter/IServiceCenter";

export type ServiceCenterDocument = HydratedDocument<IServiceCenter>;


const serviceCenterSchema = new Schema<IServiceCenter>(
{
  email: {
    type: String,
    required: true,
    unique: true
  },

  password: {
    type: String,
    required: true
  },

  isBlocked: {
    type: Boolean,
    default: false
  },

  providerProfile: {
    garageName: {
      type: String,
      required: true
    },

    ownerName: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    garageProfileImage: String,

    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point"
      },

      coordinates: {
        type: [Number]
      }
    },

    formattedAddress: String
  },

  availability: {
    workingDays: [String],

    workingHours: {
      start: String,
      end: String
    },

    slotDuration: Number,

    maxBookingsPerSlot: Number
  },

  servicesOffered: [
    {
      serviceId: {
        type: Schema.Types.ObjectId,
        ref: "Service"
      },

      advanceFee: Number,

      status: {
        type: String,
        default: "active"
      },

      vehicleTypes: [String],

      serviceModes: [String]
    }
  ],

  subscription: {
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription"
    },

    startDate: Date,

    endDate: Date,

    status: {
      type: String,
      enum: ["active","expired"]
    }
  }

},
{ timestamps: true }
);

serviceCenterSchema.index({ "providerProfile.location": "2dsphere" });

export default mongoose.model<IServiceCenter>("ServiceCenter", serviceCenterSchema);