export interface AdminAuthResponseDTO {
  admin: {
    id: string
    email: string
    role: string
  }
  accessToken: string
  refreshToken: string
}
