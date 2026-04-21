export const mapAdminToDTO = (admin: any) => {
  return {
    id: admin._id,
    email: admin.email,
    role: admin.role
  }
}