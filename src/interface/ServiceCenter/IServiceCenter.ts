import { Types } from "mongoose"


export interface IServiceCenter {

_id: Types.ObjectId
  email: string
  password: string
  isBlocked?: boolean

  providerProfile: {
    garageName: string
    ownerName: string
    phone: string
    garageProfileImage?: string

    location?: {
      type: "Point"
      coordinates: number[]
    }

    formattedAddress?: string
  }

  availability?: {
    workingDays: string[]

    workingHours: {
      start: string
      end: string
    }

    slotDuration: number

    maxBookingsPerSlot: number
  }

  servicesOffered?: {
    serviceId: string
    advanceFee: number
    status?: string
    vehicleTypes: string[]
    serviceModes: string[]
  }[]

  subscription?: {
    planId: string
    startDate: Date
    endDate: Date
    status: "active" | "expired"
  }

}