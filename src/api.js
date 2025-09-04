export const API_BASE_URL = "http://localhost/skycamp/skycamp-backend/";

// API Endpoints - Organized structure
export const API_ENDPOINTS = {
  // Authentication & Session
  LOGIN: `${API_BASE_URL}api/auth/login.php`,
  LOGOUT: `${API_BASE_URL}api/auth/logout.php`,
  CHECK_SESSION: `${API_BASE_URL}api/auth/check-session.php`,

  // Registration (kept at root level for consistency)
  REGISTER: `${API_BASE_URL}register.php`,

  // Customer Profile Management
  PROFILE: `${API_BASE_URL}api/customer/profile.php`,
  UPDATE_PROFILE: `${API_BASE_URL}api/customer/update-profile.php`,

  // Password Management
  FORGOT_PASSWORD: `${API_BASE_URL}api/auth/password/forgot.php`,
  VERIFY_OTP: `${API_BASE_URL}api/auth/password/verify-otp.php`,
  RESET_PASSWORD: `${API_BASE_URL}api/auth/password/reset.php`,
};
