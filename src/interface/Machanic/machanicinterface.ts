export interface IMechanic {
  _id: string
  email: string
  password?: string
  role: "mechanic"
  garageId: string
  isBlocked: boolean
}