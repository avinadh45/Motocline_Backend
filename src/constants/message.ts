export const MESSAGES = {

  COMMON: {
    INTERNAL_ERROR: "Something went wrong",
    UNAUTHORIZED: "Unauthorized access",
    NOT_FOUND: "Resource not found",
    ACCOUNT_BLOCKED:"Your account is blocked ",
     
  },

  USER: {
    CREATED: "User created successfully",
    LOGIN_SUCCESS: "Login successful",
    EMAIL_EXISTS: "User already exists",
    NOT_FOUND: "User not found",
    FETCH_SUCCESS: "User details fetched successfully",
    BLOCK:"User blocked successfully"
  },

  SERVICE_CENTER: {
    CREATED: "Service center created successfully",
    ALREADY_EXISTS: "Service center already exists",
    NOT_FOUND: "Service center not found",
    FETCH_SUCCESS: "ServiceCenter details fetched successfully",
    BLOCK:"ServiceCenter blocked successfully",
    FORGOT_PASSWORD:  "Reset link sent to email",
    PASSWORD_CHANGE: "Password reset successful",
  },

  MECHANIC: {
    CREATED: "Mechanic created successfully",
    ALREADY_EXISTS: "Mechanic already exists",
    NOT_FOUND: "Mechanic not found",
    BLOCKED: "Mechanic blocked successfully",
    UNBLOCKED: "Mechanic unblocked successfully"
  },

  ADMIN: {
    LOGIN_SUCCESS: "Admin login successful",
    BLOCKED_USER: "User blocked successfully",
    UNBLOCKED_USER: "User unblocked successfully",
    DELETE_CATEGORY:"Category deleted successfully"
  }

}